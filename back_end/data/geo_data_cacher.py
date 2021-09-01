import constants
import time
import requests
import json
from datetime import datetime

'''
A class to fetch and cache tweets' geo data. The API calls to get geospatial data by place_id have a rate limit
of 75 requests / 15 minute time window. When dealing with fairly large, datasets, this is a very strict limit which makes 
fetching geo data potentially time consuming. 

This class optimizes the process of fetching geo data: as geo data is being collected, it is cached in a mongo collection ("geo_data_caching_mongo_collection"). 
For every place id whose data needs to be fetched using the Twitter API, a check is first made to see whether the relevant geospatial data
has already been cached. If not, a request is made to fetch it using the Twitter API. This approach saves significant time
because a large number of tweets are likely to share the same geospatial data.

Further information about the API endpoint: https://developer.twitter.com/en/docs/twitter-api/v1/geo/place-information/api-reference/get-geo-id-place_id
'''
class GeoDataCacher:
    def __init__(self, bearer_token, geo_data_caching_mongo_collection, batch_size=75):
        self.geo_data_caching_mongo_collection = geo_data_caching_mongo_collection #mongo collection where geospatial data is cached
        self.place_id_sleep_time = constants.GEO_DATA_BY_PLACE_ID_SLEEP_TIME
        self.coordinates_sleep_time = constants.GEO_DATA_BY_COORDINATES_SLEEP_TIME
        self.bearer_token = bearer_token
        self.batch_size = batch_size #e.g. 75 means that 75 geo data docs get inserted at a time to the caching collection
        self.tweets_with_coordinates = []



    def request(self, query: str):
        headers = {
            'authorization': "Bearer {}".format(self.bearer_token),
            'content-type': 'application/json'
        }
        r = requests.get(query, headers=headers)
        return json.loads(r.text)



    def getTweetGeoDataByPlaceId(self, place_id):
        query = "https://api.twitter.com/1.1/geo/id/" + place_id + ".json"
        geoData = self.request(query)
        return geoData




    def getTweetGeoDataByCoordinates(self, lat, long):
        query = "https://api.twitter.com/1.1/geo/reverse_geocode.json?lat=" + str(lat) + "&long=" + str(long) + "&granularity=neighborhood"
        geoData = self.request(query)
        return geoData


    def payload_contains_rate_limit_error(self, payload):
        if "errors" in payload:
            if (payload["errors"][0]["code"] == 88):
                return True
        return False


    def getAndCachePlaceIdsGeoData(self, tweets_data_mongo_collection):
        #get place ids that require geo_data from the mongo collection which stores the tweets
        places_ids_that_require_geo_data = self.getPlaceIdsThatRequireGeoData(tweets_data_mongo_collection)
        if (len(places_ids_that_require_geo_data) == 0):
            print("There are no tweets for which geo data needs to be fetched.")
            return

        #if the number of place ids that remain to be cached is less than the size of the batch, set batch_size to the number of place_ids left to cache
        if (len(places_ids_that_require_geo_data) < self.batch_size):
            previous_batch_size = self.batch_size
            self.batch_size = len(places_ids_that_require_geo_data)
            print("Setting batch_size equal to " + str(self.batch_size) + " by default. This happened because the batch_size was initially set to " + str (previous_batch_size) + " but there are only " + str(self.batch_size) + " place_ids left to cache.", flush=True)

        #perform caching
        batch_count = 0
        places_geo_data_docs = []
        for place_id in places_ids_that_require_geo_data:
            #get geo data
            place_geo_data = self.getTweetGeoDataByPlaceId(place_id) 
            date_time_str = self.get_current_date_time_string()
            if (self.payload_contains_rate_limit_error(place_geo_data)):
                print(date_time_str + " - Rate limit exceeded while attempting to retrieve geo data. Sleeping for 5 minutes", flush=True)
                time.sleep(300)
            else:
                places_geo_data_docs.append(place_geo_data)
                batch_count += 1

            #insert it in batches 
            if (batch_count == self.batch_size):
                self.geo_data_caching_mongo_collection.insert_many(places_geo_data_docs)
                places_geo_data_docs = []
                batch_count = 0
                print("Cached geo data batch (" + date_time_str + ")", flush=True)

            #wait before making another request to the Twitter API (in order not to hit the rate limits)
            time.sleep(self.place_id_sleep_time)
        

    '''
    For every tweet in tweets_data_mongo_collection which has a place_id, look up that place_id in the mongo collection 
    where place ids' geo_data is cached and - if you find it - attach it to the tweet.
    '''
    def attach_cached_geo_data_to_tweets(self, tweets_data_mongo_collection):
        #get all distinct place ids from tweets collection
        tweets_place_ids = tweets_data_mongo_collection.distinct('geo.place_id')
        place_ids_whose_geo_data_was_never_cached = []

        #for each place_id, if it is cached then get its cached geo_data and attach it to the tweet in the tweets collection
        for place_id in tweets_place_ids:
            place_id_cached_geo_data = self.geo_data_caching_mongo_collection.find_one({"id": place_id}, {"_id": 0})
            if (place_id_cached_geo_data != None):
                tweets_data_mongo_collection.update_many({"geo.place_id": place_id}, {"$set": {"geo.geo_data": place_id_cached_geo_data}}, upsert=True)
            else:
                print("Geo data for place id " + place_id + " was never cached.", flush=True)
                place_ids_whose_geo_data_was_never_cached.append(place_id)

        if (len(place_ids_whose_geo_data_was_never_cached) > 0):
            print(str(len(place_ids_whose_geo_data_was_never_cached)) + " tweets were found whose geo data has never been cached.")
            print("All the tweets with the following place_ids were not updated with geo data because the geo data associated to those place ids was never cached: ")
            print(place_ids_whose_geo_data_was_never_cached)
        


    def getPlaceIdsThatRequireGeoData(self, tweets_data_mongo_collection):
        #construct array of place_ids that require geo_data to be fetched and cached
        distinct_places_ids = self.getDistinctPlaceIds(tweets_data_mongo_collection)
        places_ids_that_require_geo_data = []
        for place_id in distinct_places_ids:
            if not (self.placeIdGeoDataAlreadyCached(place_id)): 
                places_ids_that_require_geo_data.append(place_id)
        return places_ids_that_require_geo_data




    def getDistinctPlaceIds(self, mongo_collection):
        distinct_place_ids = []
        place_ids_cursor = mongo_collection.aggregate( [ { "$group" : { "_id" : "$geo.place_id" } }, { "$project" : { "_id" : False, "geo.place_id" : "$_id" } }, { "$sort": { "geo.place_id": 1 } } ] )
        for place_id_doc in place_ids_cursor:
            place_id = place_id_doc["geo"]["place_id"]
            if (place_id != None):
                distinct_place_ids.append(place_id)
        return distinct_place_ids




    def placeIdGeoDataAlreadyCached(self, place_id):
        return (self.geo_data_caching_mongo_collection.find_one({"id": place_id}) != None) #returns true if a document is found which matches the given place_id


    def get_current_date_time_string(self):
        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        return dt_string


    '''
    This method is useful if one has a collection of tweets where some of them already have geo_data. For all such tweets,
    the geo_data is cached without having to make requests to the Twitter API.
    '''
    def populateGeoDataCachingCollectionWithKnownGeoData(self, tweets_data_mongo_collection):
        #cursor with documents for all distinct geo_data values
        cursor = tweets_data_mongo_collection.aggregate( [ { "$group" : { "_id" : "$geo.geo_data" } }, {"$match": {"geo.geo_data.errors": {"$exists": 0}}}, { "$project" : { "_id" : 0, "geo_data" : "$_id"} }, { "$sort": { "geo.geo_data": 1 } } ] )

        places_geo_data_docs = []
        for doc in list(cursor):
            if not ((doc["geo_data"] == None) or ("errors" in doc["geo_data"])):  #one document will have geo_data = None, and one could contain the "errors" field (this happens when rate limits are hit). 
                place_id = doc["geo_data"]["id"] 
                if not (self.placeIdGeoDataAlreadyCached(place_id)): #if the geo_data is not already in the caching collection, store it
                    places_geo_data_docs.append(doc["geo_data"])

        if (len(places_geo_data_docs) != 0):
            self.geo_data_caching_mongo_collection.insert_many(places_geo_data_docs)



            