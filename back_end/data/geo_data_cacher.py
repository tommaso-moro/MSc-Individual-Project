import constants
import time
import requests
import json

class GeoDataCacher:
    def __init__(self, bearer_token, geo_data_caching_mongo_collection, batch_size=75):
        self.geo_data_caching_mongo_collection = geo_data_caching_mongo_collection
        self.url = constants.TWEET_GEO_DATA_API_ENDPOINT
        self.place_id_sleep_time = constants.GEO_DATA_BY_PLACE_ID_SLEEP_TIME
        self.coordinates_sleep_time = constants.GEO_DATA_BY_COORDINATES_SLEEP_TIME
        self.bearer_token = bearer_token
        self.batch_size = batch_size #e.g. 75 means that 75 geo data docs get inserted at a time to the caching collection
        #self.tweets_with_coordinates = []



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




    def getAndCachePlaceIdsGeoData(self, tweets_data_mongo_collection):
        places_ids_that_require_geo_data = self.getPlaceIdsThatRequireGeoData(tweets_data_mongo_collection)

        if (len(places_ids_that_require_geo_data) == 0):
            print("There are no tweets for which geo data needs to be fetched.")
            return

        #perform caching
        batch_count = 0
        places_geo_data_docs = []
        for place_id in places_ids_that_require_geo_data:
            #get geo data
            place_geo_data = self.getTweetGeoDataByPlaceId(place_id) 
            places_geo_data_docs.append(place_geo_data)
            batch_count += 1

            #insert it in batches 
            if (batch_count == self.batch_size):
                self.geo_data_caching_mongo_collection.insert_many(places_geo_data_docs)
                places_geo_data_docs = []
                batch_count = 0

            #wait before making another request to the Twitter API (in order not to hit the rate limits)
            time.sleep(self.place_id_sleep_time)
        



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
        return (self.geo_data_caching_mongo_collection.find_one({"geo_data.id": place_id}) != None) #returns true if a document is found which matches the given place_id



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



            