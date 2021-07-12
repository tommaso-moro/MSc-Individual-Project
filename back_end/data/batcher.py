import json 
import tweets_text_processor
from constants import BatchesTimespan

class BatchesCacher:
    def __init__(self, batches_mongo_collection, tweets_data_mongo_collection, batches_timespan):
        self.batches_mongo_collection = batches_mongo_collection
        self.tweets_data_mongo_collection = tweets_data_mongo_collection
        self.batches_timespan = batches_timespan


    '''
        METHODS TO GET DATA FROM TWEETS COLLECTION
    '''
    def get_tweets_dates_from_tweets_collection(self):
        cursor = self.tweets_data_mongo_collection.find({}, {"created_at": 1, "_id": 0}, no_cursor_timeout=True)
        dates = []
        for tweet in cursor:
            tweetDateAsStr = tweet["created_at"][0:4] + "-" + tweet["created_at"][5:7]
            tweetDateAsStr = (tweetDateAsStr + "-" + tweet["created_at"][8:10]) if (self.batches_timespan == BatchesTimespan.DAILY) else tweetDateAsStr
            if not (tweetDateAsStr in dates):
                dates.append(tweetDateAsStr)
        return dates

    def get_tweets_tags_from_tweets_collection(self):
        cursor = self.tweets_data_mongo_collection.aggregate( [ { "$group" : { "_id" : "$query_meta_data.tag" } }, { "$project" : { "_id" : 0, "tag" : "$_id" } }, { "$sort": { "query_meta_data.tag": 1 } } ] )
        tags = []
        for doc in list(cursor):
            tag = doc["tag"]
            tags.append(tag)
        return tags

    def get_num_tweets_by_date_from_tweets_collection(self, date):
        return self.tweets_data_mongo_collection.find({"created_at": {'$regex': date}}, no_cursor_timeout=True).count()

    def get_num_tweets_by_date_and_tag_from_tweets_collection(self, date, tag):
        return self.tweets_data_mongo_collection.find({"created_at": {'$regex': date}, "query_meta_data.tag": tag}).count()

    def get_num_tweets_with_geo_data_by_date_from_tweets_collection(self, date):
        return self.tweets_data_mongo_collection.count_documents({"geo": { "$exists": 1 }, "created_at": {'$regex': date}})

    def get_num_tweets_with_geo_data_by_date_and_tag_from_tweets_collection(self, date, tag):
        return self.tweets_data_mongo_collection.count_documents({"geo": { "$exists": 1 }, "created_at": {'$regex': date}, "query_meta_data.tag": tag})

    def get_num_users_by_date_from_tweets_collection(self, date):
        return len(self.tweets_data_mongo_collection.distinct('author_data.id', {"created_at" : {'$regex': date}}))
    
    def get_num_verified_users_by_date_from_tweets_collection(self, date):
        return len(self.tweets_data_mongo_collection.distinct('author_data.id', {"author_data.verified": True, "created_at" : {'$regex': date}}))

    def get_num_users_by_date_and_tag_from_tweets_collection(self, date, tag):
        return len(self.tweets_data_mongo_collection.distinct('author_data.id', {"created_at" : {'$regex': date}, "query_meta_data.tag": tag}))

    def get_num_verified_users_by_date_and_tag_from_tweets_collection(self, date, tag):
        return len(self.tweets_data_mongo_collection.distinct('author_data.id', {"author_data.verified": True, "created_at" : {'$regex': date}, "query_meta_data.tag": tag}))

    def get_tweets_text_by_date_and_tag_from_tweets_collection(self, date, tag):
        cursor = self.tweets_data_mongo_collection.find({"query_meta_data.tag": tag, "created_at": {'$regex': date}}, no_cursor_timeout = True)
        tweets_text = ""
        for doc in list(cursor):
            tweets_text = tweets_text + " " + doc["text"]
        return tweets_text



    '''
        METHODS TO INSERT DATA TO BATCHES COLLECTION
    '''
    def insert_tweets_dates_to_batches_collection(self):
        dates = self.get_tweets_dates_from_tweets_collection()
        for date in dates:
            self.batches_mongo_collection.update_one({"date": date}, {"$set": {"date": date}}, upsert=True)


    def insert_tweets_tags_to_batches_collection(self):
        tags = self.get_tweets_tags_from_tweets_collection()
        for tag in tags:
            tag_field = "tags" + "." + tag
            self.batches_mongo_collection.update_many({tag_field: {"$exists": 0}}, {"$set": {tag_field: {}}}, upsert=True)


    def insert_tot_num_tweets_by_date_to_batches_collection(self, date):
        num_tweets_by_date = self.get_num_tweets_by_date_from_tweets_collection(date)
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {"num_tweets": num_tweets_by_date}}, upsert=True)


    def insert_tot_num_tweets_by_date_and_tag_to_batches_collection(self, date, tag):
        num_tweets_by_date_and_tag = self.get_num_tweets_by_date_and_tag_from_tweets_collection(date, tag)
        tag_num_tweets_field = "tags." + tag + ".num_tweets"
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {tag_num_tweets_field: num_tweets_by_date_and_tag}}, upsert=True)


    def insert_num_and_perc_tweets_with_geo_data_by_date_to_batches_collection(self, date):
        num_tweets_with_geo_data = self.get_num_tweets_with_geo_data_by_date_from_tweets_collection(date)
        num_tweets = self.batches_mongo_collection.find_one({"date": date}, {"num_tweets": 1, "_id": 0})["num_tweets"]
        percentage_tweets_with_geo_data = round(((num_tweets_with_geo_data*100)/num_tweets),3) if (num_tweets != 0) else "n/a"
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {"num_tweets_with_geo_data": num_tweets_with_geo_data, "percentage_tweets_with_geo_data": percentage_tweets_with_geo_data}}, upsert=True)


    def insert_num_and_perc_tweets_with_geo_data_by_date_and_tag_to_batches_collection(self, date, tag):
        #construct strings to query the mongo document
        tag_num_tweets_with_geo_data_field = "tags." + tag + ".num_tweets_with_geo_data"
        tag_perc_tweets_with_geo_data_field = "tags." + tag + ".percentage_tweets_with_geo_data"

        #get data
        num_tweets_with_geo_data = self.get_num_tweets_with_geo_data_by_date_and_tag_from_tweets_collection(date, tag)
        num_tweets = self.get_num_tweets_by_date_and_tag_from_tweets_collection(date, tag)
        
        #compute percentage
        percentage_tweets_with_geo_data = round(((num_tweets_with_geo_data*100)/num_tweets),3) if (num_tweets != 0) else "n/a"

        #update document
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {tag_num_tweets_with_geo_data_field: num_tweets_with_geo_data, tag_perc_tweets_with_geo_data_field: percentage_tweets_with_geo_data}}, upsert=True)


    def insert_num_users_by_date_to_batches_collection(self, date):
        num_users = self.get_num_users_by_date_from_tweets_collection(date)
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {"num_users": num_users}}, upsert=True) 

    def insert_perc_verified_users_by_date_to_batches_collection(self, date):
        num_verified_users = self.get_num_verified_users_by_date_from_tweets_collection(date)
        num_users = self.get_num_users_by_date_from_tweets_collection(date)
        perc_verified_users = round(((num_verified_users*100)/num_users),3) if (num_users != 0) else "n/a"
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {"percentage_verified_users": perc_verified_users}}, upsert=True)

    
    def insert_perc_verified_users_by_date_and_tag_to_batches_collection(self, date, tag):
        num_users = self.get_num_users_by_date_and_tag_from_tweets_collection(date, tag)
        num_verified_users = self.get_num_verified_users_by_date_and_tag_from_tweets_collection(date, tag)
       
        perc_verified_users = round(((num_verified_users*100)/num_users),3) if (num_users != 0) else "n/a"
        tag_perc_verified_users_field = "tags." + tag + ".percentage_verified_users"
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {tag_perc_verified_users_field: perc_verified_users}}, upsert=True)


    def insert_geo_data_by_date_and_tag_to_batches_collection(self, date, tag):
        cursor = self.tweets_data_mongo_collection.find({"geo.geo_data": { "$exists": 1 }, "geo.geo_data.errors": {"$exists": 0}, "created_at": {'$regex': date}, "query_meta_data.tag": tag}, {"geo": 1})
        for doc in list(cursor):
            place_id = doc["geo"]["geo_data"]["id"]
            tag_geo_data_place_ids_field = "tags." + tag + ".geo_data.place_ids." + place_id

            #if the place_id data is not already present for this date and tag, add it
            if (self.batches_mongo_collection.find_one({"date": date, tag_geo_data_place_ids_field: {"$exists": 1}}) == None):
                data = {
                    "place_id": place_id,
                    "place_name": doc["geo"]["geo_data"]["name"],
                    "place_full_name": doc["geo"]["geo_data"]["full_name"],
                    "place_country": doc["geo"]["geo_data"]["country"],
                    "place_country_code": doc["geo"]["geo_data"]["country_code"],
                    "place_type": doc["geo"]["geo_data"]["place_type"],
                    "num_tweets": 1
                }
                self.batches_mongo_collection.update_one({"date": date}, {"$set": {tag_geo_data_place_ids_field: {"data": data}}})
            
            #if for this date and tag that place_id has already been stored, simply increase the counter by one
            else:
                tag_geo_data_place_id_data_num_tweets_field = tag_geo_data_place_ids_field + ".data.num_tweets"
                self.batches_mongo_collection.update_one({"date": date}, {"$inc": {tag_geo_data_place_id_data_num_tweets_field: 1}}) 


    def insert_text_analytics_by_date_and_tag_to_batches_collection(self, date, tag):
        tag_text_analytics_field = "tags." + tag + ".tweets_text_data"
        text_data_doc = self.get_tweets_text_analytics_by_date_and_tag(date, tag)
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {tag_text_analytics_field: text_data_doc}})



    '''
        HELPER METHODS
    '''
    def populate_json_file_with_collection_dates(self, json_filepath="dates.json"):
        dates_json = {"dates" : self.get_tweets_dates_from_tweets_collection()}
        json.dump(dates_json, open(json_filepath, 'w'))

    def populate_json_file_with_collection_tags(self, json_filepath="tags.json"):
        tagsJson = {"tags": self.get_tweets_tags_from_tweets_collection()}
        json.dump(tagsJson, open(json_filepath, 'w'))
    
    def get_tweets_text_analytics_by_date_and_tag(self, date, tag):
        tweets_text = self.get_tweets_text_by_date_and_tag_from_tweets_collection(date, tag)
        text_processor = tweets_text_processor.TweetsTextProcessor()
        hashtags_frequencies = text_processor.get_most_common_hashtags_from_text(tweets_text)
        terms_frequencies = text_processor.get_most_common_terms_from_text(tweets_text)
        return {"terms_frequencies": terms_frequencies, "hashtags_frequencies": hashtags_frequencies}

    def generate_batches_collection(self):
        dates = self.get_tweets_dates_from_tweets_collection()
        tags = self.get_tweets_tags_from_tweets_collection()
        self.insert_tweets_dates_to_batches_collection()
        self.insert_tweets_tags_to_batches_collection()

        for date in dates:
            self.insert_tot_num_tweets_by_date_to_batches_collection(date)
            self.insert_num_and_perc_tweets_with_geo_data_by_date_to_batches_collection(date)
            self.insert_num_users_by_date_to_batches_collection(date)
            self.insert_perc_verified_users_by_date_to_batches_collection(date)
            for tag in tags:
                self.insert_tot_num_tweets_by_date_and_tag_to_batches_collection(date, tag)
                self.insert_num_and_perc_tweets_with_geo_data_by_date_and_tag_to_batches_collection(date, tag)
                self.insert_perc_verified_users_by_date_and_tag_to_batches_collection(date, tag)
                self.insert_geo_data_by_date_and_tag_to_batches_collection(date, tag)
                self.insert_text_analytics_by_date_and_tag_to_batches_collection(date, tag)
        
        
        


            




