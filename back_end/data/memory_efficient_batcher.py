import json

from requests.api import get 
import tweets_text_processor
from constants import BatchesTimespan
from helper import get_average
from datetime import datetime
import helper
from sys import getsizeof

class BatchesCacher:
    def __init__(self, batches_mongo_collection, tweets_data_mongo_collection, hashtags_cooccurrences_mongo_collection, batches_timespan):
        self.batches_mongo_collection = batches_mongo_collection
        self.tweets_data_mongo_collection = tweets_data_mongo_collection
        self.hashtags_cooccurrences_mongo_collection = hashtags_cooccurrences_mongo_collection
        self.batches_timespan = batches_timespan
        self.text_processor = tweets_text_processor.TweetsTextProcessor()


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
        for doc in cursor:
            tag = doc["tag"]
            tags.append(tag)
        return tags



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



    def tweet_has_geo_data(self, tweet):
        if "geo" in tweet:
                if "geo_data" in tweet["geo"]:
                    if not "errors" in tweet["geo"]["geo_data"]:
                        return True


    def get_n_most_liked_tweets_by_tag_and_date_from_tweets_collection(self, date, tag, num_tweets=10):
        cursor = self.tweets_data_mongo_collection.aggregate(
            [
                { "$match": {"query_meta_data.tag": tag, "created_at": {"$regex": date}}},
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


    def get_tweets_analytics(self, tweets, get_subjectivity_scores=False, get_hashtags_cooccurrences=False):
        num_tweets = len(tweets)
        print("\tNumber of tweets computed.", flush=True)
        num_tweets_with_geo_data = 0
        unique_user_ids = []
        unique_verified_user_ids = []
        subjectivity_scores = []
        hashtags_cooccurrences_dict = {}
        avg_subjectivity_score = 0

        
        for tweet in tweets:
            
            #compute num tweets with geo data
            if (self.tweet_has_geo_data(tweet)):
                num_tweets_with_geo_data += 1
            
            #compute num of unique users and verified users
            author_id = tweet["author_data"]["id"]
            author_is_verified = tweet["author_data"]["verified"]
            if not author_id in unique_user_ids:
                unique_user_ids.append(author_id)
                if author_is_verified:
                    unique_verified_user_ids.append(author_id)

            #subjectivity scores
            if get_subjectivity_scores:
                if (self.text_processor.text_is_in_english(tweet["text"])):
                    tweet_subjectivity_score = self.text_processor.get_text_subjectivity_score(tweet["text"])
                    subjectivity_scores.append(tweet_subjectivity_score)
        
        if get_subjectivity_scores:
            avg_subjectivity_score = get_average(subjectivity_scores) if (len(subjectivity_scores) != 0) else "n/a"
        
        if get_hashtags_cooccurrences:
            hashtags_cooccurrences_dict = self.text_processor.construct_hashtags_cooccurrences_dict(tweets)

        percentage_tweets_with_geo_data = round(((num_tweets_with_geo_data*100)/num_tweets),3) if (num_tweets != 0) else "n/a"
        num_unique_users = len(unique_user_ids)
        num_verified_users = len(unique_verified_user_ids)
        perc_verified_users = round(((num_verified_users*100)/num_unique_users),3) if (num_unique_users != 0) else "n/a"

        return {
            "num_tweets": num_tweets,
            "num_tweets_with_geo_data": num_tweets_with_geo_data,
            "percentage_tweets_with_geo_data": percentage_tweets_with_geo_data,
            "num_unique_users": num_unique_users,
            "perc_verified_users": perc_verified_users,
            "subjectivity_scores": subjectivity_scores if get_subjectivity_scores else None,
            "avg_subjectivity_score": avg_subjectivity_score if get_subjectivity_scores else None,
            "hashtags_cooccurrences": hashtags_cooccurrences_dict if get_hashtags_cooccurrences else None
        }



    '''
    Expects a tweet with geo data
    '''
    def construct_tweet_geo_data_doc(self, tweet): 
        return {
                    "place_id": tweet["geo"]["geo_data"]["id"],
                    "place_name": tweet["geo"]["geo_data"]["name"],
                    "place_full_name": tweet["geo"]["geo_data"]["full_name"],
                    "place_country": tweet["geo"]["geo_data"]["country"],
                    "place_country_code": tweet["geo"]["geo_data"]["country_code"],
                    "place_type": tweet["geo"]["geo_data"]["place_type"],
                    "num_tweets": 1
                }


    def get_text_analytics(self, tweets_text):
        hashtags_frequencies = self.text_processor.get_most_common_hashtags_from_text(tweets_text)
        terms_frequencies = self.text_processor.get_most_common_terms_from_text(tweets_text)
        return {"terms_frequencies": terms_frequencies, "hashtags_frequencies": hashtags_frequencies}


    def insert_geo_data(self, date, tag, tweets):
        for tweet in tweets:
            if (self.tweet_has_geo_data(tweet)):
                place_id = tweet["geo"]["geo_data"]["id"]
                tag_geo_data_place_ids_field = "tags." + tag + ".geo_data.place_ids." + place_id

                #if the place_id data is not already present for this date and tag, add it
                if (self.batches_mongo_collection.find_one({"date": date, tag_geo_data_place_ids_field: {"$exists": 1}}) == None):
                    tweet_geo_data_doc = self.construct_tweet_geo_data_doc(tweet)
                    self.batches_mongo_collection.update_one({"date": date}, {"$set": {tag_geo_data_place_ids_field: {"data": tweet_geo_data_doc}}})
                
                #if for this date and tag that place_id has already been stored, simply increase the counter by one
                else:
                    tag_geo_data_place_id_data_num_tweets_field = tag_geo_data_place_ids_field + ".data.num_tweets"
                    self.batches_mongo_collection.update_one({"date": date}, {"$inc": {tag_geo_data_place_id_data_num_tweets_field: 1}}) 


    def insert_date_specific_stats(self, date, date_tweets):
        tweets_analytics = self.get_tweets_analytics(date_tweets)

        num_tweets = tweets_analytics["num_tweets"]
        num_tweets_with_geo_data = tweets_analytics["num_tweets_with_geo_data"]
        percentage_tweets_with_geo_data = tweets_analytics["percentage_tweets_with_geo_data"]
        num_unique_users = tweets_analytics["num_unique_users"]
        perc_verified_users = tweets_analytics["perc_verified_users"]
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {
            "num_tweets": num_tweets, 
            "num_tweets_with_geo_data": num_tweets_with_geo_data, 
            "percentage_tweets_with_geo_data": percentage_tweets_with_geo_data, 
            "num_users": num_unique_users, 
            "percentage_verified_users": perc_verified_users
            }}, 
            upsert=True)


    def insert_tag_specific_stats(self, date, tag, tag_tweets):
        tweets_analytics = self.get_tweets_analytics(tag_tweets, get_subjectivity_scores=True, get_hashtags_cooccurrences=True)
        tweets_text = helper.get_tweets_text(tag_tweets)

        #data
        num_tweets = tweets_analytics["num_tweets"]
        num_tweets_with_geo_data = tweets_analytics["num_tweets_with_geo_data"]
        percentage_tweets_with_geo_data = tweets_analytics["percentage_tweets_with_geo_data"]
        num_unique_users = tweets_analytics["num_unique_users"]
        perc_verified_users = tweets_analytics["perc_verified_users"]
        subjectivity_scores = tweets_analytics["subjectivity_scores"]
        avg_subjectivity_score = tweets_analytics["avg_subjectivity_score"]
        hashtags_cooccurrences = tweets_analytics["hashtags_cooccurrences"]
        text_frequencies = self.get_text_analytics(tweets_text)
        terms_frequencies = text_frequencies["terms_frequencies"]
        hashtags_frequencies = text_frequencies["hashtags_frequencies"]
        most_mentioned_accounts = self.text_processor.get_most_mentioned_accounts(tweets_text)
        most_liked_tweets = self.get_n_most_liked_tweets_by_tag_and_date_from_tweets_collection(date, tag)
        most_retweeted_tweets = self.get_n_most_retweeted_tweets_by_tag_and_date_from_tweets_collection(date, tag)

        ### fields to construct mongo document ###
        tag_field = "tags." + tag
        tag_num_tweets_field = tag_field + ".num_tweets"
        tag_num_tweets_with_geo_data_field = tag_field + ".num_tweets_with_geo_data"
        tag_perc_tweets_with_geo_data_field = tag_field + ".percentage_tweets_with_geo_data"
        tag_num_users_field = tag_field + ".num_users"
        tag_perc_verified_users_field = tag_field + ".percentage_verified_users"
        tag_terms_frequencies_field = tag_field + ".terms_frequencies" 
        tag_hashtags_frequencies_field = tag_field + ".hashtags_frequencies"
        tag_most_mentioned_accounts_field = tag_field + ".most_mentioned_accounts"
        tag_subjectivity_scores_field = tag_field + ".subjectivity_analysis.subjectivity_scores"
        tag_avg_subjectivity_score_field = tag_field + ".subjectivity_analysis.avg_subjectivity_score"
        tag_most_liked_tweets_field = tag_field + ".most_liked_tweets"
        tag_most_retweeted_tweets_field = tag_field + ".most_retweeted_fields"
        tag_hashtags_cooccurrences_field = tag_field + ".hashtags_cooccurrences"

        self.batches_mongo_collection.update_one({"date": date}, {"$set": {
            tag_num_tweets_field: num_tweets, 
            tag_num_tweets_with_geo_data_field: num_tweets_with_geo_data, 
            tag_perc_tweets_with_geo_data_field: percentage_tweets_with_geo_data, 
            tag_num_users_field: num_unique_users, 
            tag_perc_verified_users_field: perc_verified_users,
            tag_terms_frequencies_field: terms_frequencies,
            tag_hashtags_frequencies_field: hashtags_frequencies,
            tag_most_mentioned_accounts_field: most_mentioned_accounts,
            tag_subjectivity_scores_field: subjectivity_scores,
            tag_avg_subjectivity_score_field: avg_subjectivity_score,
            tag_most_liked_tweets_field: most_liked_tweets,
            tag_most_retweeted_tweets_field: most_retweeted_tweets,
            tag_hashtags_cooccurrences_field: hashtags_cooccurrences
            }}, 
            upsert=True)

    
        
        

    '''
    Main function to perform batching
    '''
    def generate_batches_collection(self):
        print("Fetching dates and tags.", flush=True)
        dates = self.get_tweets_dates_from_tweets_collection()
        tags = self.get_tweets_tags_from_tweets_collection()

        print("Tags: ", flush=True)
        for tag in tags:
            print("\t -  '" + tag + "'", flush=True)
        print("\n", flush=True)

        self.insert_tweets_dates_to_batches_collection()
        print("Inserted dates.", flush=True)

        self.insert_tweets_tags_to_batches_collection()
        print("Inserted tags.", flush=True)
        print("\n", flush=True)

        for date in dates:
            current_datetime_as_str = helper.get_current_datetime_as_str()
            print(current_datetime_as_str, flush=True)
            print("Batching date: " + date, flush=True)

            date_tweets_data = list(self.tweets_data_mongo_collection.find({"created_at": {'$regex': date}}))
            self.insert_date_specific_stats(date, date_tweets_data)

            for tag in tags:
                print("\tHandling tag: '" + tag + "'.", flush=True)

                tag_tweets_data = [tweet for tweet in date_tweets_data if (tweet["query_meta_data"]["tag"] == tag)]

                self.insert_tag_specific_stats(date, tag, tag_tweets_data)
                print("\t\tInserted tag-specific stats. (" + helper.get_current_datetime_as_str() + ")", flush=True)
                self.insert_geo_data(date, tag, tag_tweets_data)
                print("\t\tInserted geo-data. (" + helper.get_current_datetime_as_str() + ")", flush=True)
            print("\n", flush=True)