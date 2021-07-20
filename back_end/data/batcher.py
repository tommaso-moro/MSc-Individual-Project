import json 
import tweets_text_processor
from constants import BatchesTimespan
from helper import get_average

class BatchesCacher:
    def __init__(self, batches_mongo_collection, tweets_data_mongo_collection, hashtags_cooccurrences_mongo_collection, batches_timespan):
        self.batches_mongo_collection = batches_mongo_collection
        self.tweets_data_mongo_collection = tweets_data_mongo_collection
        self.hashtags_cooccurrences_mongo_collection = hashtags_cooccurrences_mongo_collection
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
        return self.tweets_data_mongo_collection.count_documents({"created_at": {'$regex': date}})

    def get_num_tweets_by_date_and_tag_from_tweets_collection(self, date, tag):
        return self.tweets_data_mongo_collection.count_documents({"created_at": {'$regex': date}, "query_meta_data.tag": tag})

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

    def get_tweets_text_by_tag_from_tweets_collection(self, tag):
        cursor = self.tweets_data_mongo_collection.find({"query_meta_data.tag": tag}, no_cursor_timeout = True)
        tweets_text = ""
        for doc in list(cursor):
            tweets_text = tweets_text + " " + doc["text"]
        return tweets_text

    def get_most_mentioned_accounts_by_tag_and_date(self, tag, date):
        text_processor = tweets_text_processor.TweetsTextProcessor()
        tweets_text = self.get_tweets_text_by_date_and_tag_from_tweets_collection(date, tag)
        most_mentioned_accounts_dict = text_processor.get_most_mentioned_accounts(tweets_text)
        return most_mentioned_accounts_dict

    def get_entities_frequencies_by_tag_and_date_from_tweets_collection(self, date, tag):
        cursor = self.tweets_data_mongo_collection.find({"query_meta_data.tag": tag, "created_at": {'$regex': date}}, no_cursor_timeout = True)
        text_processor = tweets_text_processor.TweetsTextProcessor()
        tag_entities_frequencies_doc = text_processor.extract_entities_frequencies_from_tweets(tweets=cursor)
        return tag_entities_frequencies_doc

    def get_n_most_liked_tweets_by_tag_and_date_from_tweets_collection(self, date, tag, num_tweets=10):
        cursor = self.tweets_data_mongo_collection.aggregate(
            [
                { "$match": {"query_meta_data.tag": tag, "created_at": {"$regex": date}}},
                { "$sort" : { "public_metrics.like_count" : -1} },
                { "$limit": num_tweets}   
            ]
        )
        return list(cursor)

    def get_n_most_liked_tweets_by_tag_from_tweets_collection(self, tag, num_tweets=10):
        cursor = self.tweets_data_mongo_collection.aggregate(
            [
                { "$match": {"query_meta_data.tag": tag }},
                { "$sort" : { "public_metrics.like_count" : -1} },
                { "$limit": num_tweets}   
            ]
        )
        return list(cursor)

    def get_n_most_retweeted_tweets_by_tag_and_date_from_tweets_collection(self, date, tag, num_tweets=10):
        cursor = self.tweets_data_mongo_collection.aggregate(
            [
                { "$match": {"query_meta_data.tag": tag, "created_at": {"$regex": date}}},
                { "$sort" : { "public_metrics.retweet_count" : -1} },
                { "$limit": num_tweets}   
            ]
        )
        return list(cursor)

    def get_n_most_retweeted_tweets_by_tag_from_tweets_collection(self, tag, num_tweets=10):
        cursor = self.tweets_data_mongo_collection.aggregate(
            [
                { "$match": {"query_meta_data.tag": tag }},
                { "$sort" : { "public_metrics.retweet_count" : -1} },
                { "$limit": num_tweets}   
            ]
        )
        return list(cursor)


    def get_subjectivity_scores_data_by_tag_and_date_from_tweets_collection(self, date, tag):
        text_processor = tweets_text_processor.TweetsTextProcessor()
        cursor = list(self.tweets_data_mongo_collection.find({"query_meta_data.tag": tag, "created_at": {'$regex': date}}, {"text": 1, "_id": 0}, no_cursor_timeout = True))
        subjectivity_scores = []
        for doc in cursor:
            tweet_text = doc["text"]
            tweet_text = text_processor.clean_text(tweet_text)
            if (text_processor.text_is_in_english(tweet_text)):
                tweet_subjectivity_score = text_processor.get_text_subjectivity_score(tweet_text)
                subjectivity_scores.append(tweet_subjectivity_score)
        avg_subjectivity_score = get_average(subjectivity_scores) if (len(subjectivity_scores) != 0) else "n/a"
        mongo_doc = {
            "subjectivity_scores" : subjectivity_scores,
            "avg_subjectivity_score" : avg_subjectivity_score
        }
        return mongo_doc


    def get_hashtags_cooccurrences_dict_by_tag_and_date_from_tweets_collection(self, date, tag):
        cursor = self.tweets_data_mongo_collection.find({"query_meta_data.tag": tag, "created_at": {'$regex': date}}, {"text": 1, "_id": 0}, no_cursor_timeout = True)
        text_processor = tweets_text_processor.TweetsTextProcessor()
        hashtags_cooccurrences_dict = text_processor.construct_hashtags_cooccurrences_dict(cursor)
        return hashtags_cooccurrences_dict





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
        
        #self.batches_mongo_collection.update_one({"date": date}, { '$unset': { query_str: 1 } } )

    def insert_most_mentioned_accounts_by_date_and_tag_to_batches_collection(self, date, tag):
        most_mentioned_accounts_doc = self.get_most_mentioned_accounts_by_tag_and_date(tag, date)
        tag_most_mentioned_accounts_field = "tags." + tag + ".most_mentioned_accounts"
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {tag_most_mentioned_accounts_field: most_mentioned_accounts_doc}}, upsert=True)


    def insert_entities_frequencies_by_tag_and_date_to_batches_collection(self, date, tag):
        tag_entities_frequencies_field = "tags." + tag + ".entities_and_their_frequency"
        tag_frequencies_doc = self.get_entities_frequencies_by_tag_and_date_from_tweets_collection(date, tag)
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {tag_entities_frequencies_field: tag_frequencies_doc}}, upsert=True)

    def insert_subjectivity_scores_data_by_tag_and_date_to_batches_collection(self, date, tag):
        tag_subjectivity_analysis_field = "tags." + tag + ".subjectivity_analysis"
        tag_subjectivity_analysis_doc = self.get_subjectivity_scores_data_by_tag_and_date_from_tweets_collection(date, tag)
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {tag_subjectivity_analysis_field: tag_subjectivity_analysis_doc}}, upsert=True)


    '''
    Get n most retweeted tweets by tag and date and construct a dict that looks like:
    {
        "1" : tweet,
        "2" : tweet,
        ...
        "n" : tweet,
    }
    Then insert the dict in the appropriate doc in the batches collection.
    
    PS. Given Mongo's 16MB / document limit, if num_tweets is too high it might exceed that limit.
    '''
    def insert_n_most_retweeted_tweets_by_tag_and_date_to_batches_collection(self, date, tag, num_tweets=10):
        most_retweeted_tweets = self.get_n_most_retweeted_tweets_by_tag_and_date_from_tweets_collection(date, tag)
        most_retweeted_tweets_field = "tags." + tag + ".most_retweeted_tweets"
        doc = {}
        for index, tweet in enumerate(most_retweeted_tweets):
            doc[str(index+1)] = tweet
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {most_retweeted_tweets_field: doc}}, upsert=True)


    '''
    Get n most liked tweets by tag and date and construct a dict that looks like:
    {
        "1" : tweet,
        "2" : tweet,
        ...
        "n" : tweet,
    }
    Then insert the dict in the appropriate doc in the batches collection.

    PS. Given Mongo's 16MB / document limit, if num_tweets is too high it might exceed that limit.
    '''            
    def insert_n_most_liked_tweets_by_tag_and_date_to_batches_collection(self, date, tag, num_tweets=10):
        most_retweeted_tweets = self.get_n_most_liked_tweets_by_tag_and_date_from_tweets_collection(date, tag)
        most_liked_tweets_field = "tags." + tag + ".most_liked_tweets"
        doc = {}
        for index, tweet in enumerate(most_retweeted_tweets):
            doc[str(index+1)] = tweet
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {most_liked_tweets_field: doc}}, upsert=True)


    def insert_hashtags_cooccurrences_dict_by_tag_and_date(self, date, tag):
        #dict containing many dicts, one for each hashtag
        hashtags_cooccurrences_dict = self.get_hashtags_cooccurrences_dict_by_tag_and_date_from_tweets_collection(date, tag)

        #list containing many dicts, one for each hashtag
        hashtags_cooccurrences_dicts = []
        for hashtag in hashtags_cooccurrences_dict:
            #dict for individual hashtag
            hashtag_cooccurrences_dict = {
                "tag": tag,
                "date": date,
                "hashtag": hashtag,
                "cooccurrences": hashtags_cooccurrences_dict[hashtag]
            }
            hashtags_cooccurrences_dicts.append(hashtag_cooccurrences_dict)
        if (len(hashtags_cooccurrences_dicts) > 0):
            self.hashtags_cooccurrences_mongo_collection.insert_many(hashtags_cooccurrences_dicts)
            print("Cached hashtags cooccurrences data for tag '" + tag + "' and date " + date, flush=True)

    '''
        HELPER METHODS
    '''
    def populate_json_file_with_collection_dates(self, json_filepath):
        dates_json = {"dates" : self.get_tweets_dates_from_tweets_collection()}
        json.dump(dates_json, open(json_filepath, 'w'))

    def populate_json_file_with_collection_tags(self, json_filepath):
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
    
        #self.insert_tweets_dates_to_batches_collection()
        #self.insert_tweets_tags_to_batches_collection()

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
                if (self.batches_timespan == BatchesTimespan.MONTHLY):
                    self.insert_most_mentioned_accounts_by_date_and_tag_to_batches_collection(date, tag)
                    self.insert_entities_frequencies_by_tag_and_date_to_batches_collection(date, tag)
                    self.insert_subjectivity_scores_data_by_tag_and_date_to_batches_collection(date, tag)
                    self.insert_hashtags_cooccurrences_dict_by_tag_and_date(date, tag)
                    self.insert_n_most_liked_tweets_by_tag_and_date_to_batches_collection(date, tag)
                    self.insert_n_most_retweeted_tweets_by_tag_and_date_to_batches_collection(date, tag)
        
        
        


            




