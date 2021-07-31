import helper
import tweets_text_processor
from collections import Counter
import math

class VizDataFormatter:
    def __init__(self, tags_and_dates_mongo_col, tweets_data_mongo_col):
        self.tags_and_dates_mongo_col = tags_and_dates_mongo_col
        self.tweets_data_mongo_col = tweets_data_mongo_col

    def get_distinct_months(self):
        return helper.get_months_from_tags_and_dates_col(self.tags_and_dates_mongo_col)

    def get_distinct_tags(self):
        return helper.get_tags_from_tags_and_dates_col(self.tags_and_dates_mongo_col)




class LineChartDataFormatter:
    def __init__(self, monthly_batches_col, line_chart_data_col):
        self.monthly_batches_col = monthly_batches_col
        self.line_chart_data_col = line_chart_data_col
        self.months = []
        self.tags = []
        self.tag_dicts = []


    def get_distinct_months(self):
        cursor = self.monthly_batches_col.distinct("date")
        for month in cursor:
            self.months.append(month)

    def get_tags(self):
        cursor = self.monthly_batches_col.find({})
        for doc in cursor:
            tags = doc["tags"].keys()
            for tag in tags:
                if not tag in self.tags:
                    self.tags.append(tag)



    def get_months_from_tweets_collection(self, tweets_data_collection):
        cursor = tweets_data_collection.find({}, {"created_at": 1, "_id": 0}, no_cursor_timeout=True)
        dates = []
        for tweet in cursor:
            tweetDateAsStr = tweet["created_at"][0:4] + "-" + tweet["created_at"][5:7]
            if not (tweetDateAsStr in dates):
                dates.append(tweetDateAsStr)
        return dates

        

    def get_tweets_tags_from_tweets_collection(self, tweets_data_collection):
        cursor = tweets_data_collection.aggregate( [ { "$group" : { "_id" : "$query_meta_data.tag" } }, { "$project" : { "_id" : 0, "tag" : "$_id" } }, { "$sort": { "query_meta_data.tag": 1 } } ] )
        tags = []
        for doc in cursor:
            tag = doc["tag"]
            tags.append(tag)
        return tags

    
    def generate_collection_from_tweets_data_collection(self, tweets_data_collection):
        months = self.get_months_from_tweets_collection(tweets_data_collection)
        print("Fetched months.", flush=True)
        tags = self.get_tweets_tags_from_tweets_collection(tweets_data_collection)
        print("Fetched tags.", flush=True)

        formatted_data = {
            "dates": months,
            "num_tweets": {}
        }

        for tag in tags:
            print("Handling tag: " + tag, flush=True)
            formatted_data["num_tweets"][tag] = {
                "num_tweets": []
            }
            for month in months:
                num_tweets = tweets_data_collection.count_documents({"created_at": {"$regex": month}, "query_meta_data.tag": tag})
                formatted_data["num_tweets"][tag]["num_tweets"].append(num_tweets)
        
        self.line_chart_data_col.insert_one(formatted_data)


    def generate_collection(self):
        self.get_distinct_months()
        self.get_tags()

        formatted_data = {
            "dates": self.months,
            "num_tweets": {}
        }

        for tag in self.tags:
            formatted_data["num_tweets"][tag] = {
                "num_tweets": []
            }
            for month in self.months:
                doc = self.monthly_batches_col.find_one({"date": month})
                num_tweets = doc["tags"][tag]["num_tweets"]
                formatted_data["num_tweets"][tag]["num_tweets"].append(num_tweets)        
        
        self.line_chart_data_col.insert_one(formatted_data)


class MapDataFormatter:
    def __init__(self, tweets_data_col, map_data_by_tag_col):
        self.tweets_data_col = tweets_data_col
        self.map_data_by_tag_col = map_data_by_tag_col
        self.tags = []

    def get_tweets_tags_from_tweets_collection(self):
        cursor = self.tweets_data_col.aggregate( [ { "$group" : { "_id" : "$query_meta_data.tag" } }, { "$project" : { "_id" : 0, "tag" : "$_id" } }, { "$sort": { "query_meta_data.tag": 1 } } ] )
        for doc in cursor:
            tag = doc["tag"]
            self.tags.append(tag)

    

    def generate_collection(self):
        self.get_tweets_tags_from_tweets_collection()
        for tag in self.tags:
            dict = {}
            print("Handling tag: " + tag, flush=True)
            dict[tag] = []
            cursor = self.tweets_data_col.find({"query_meta_data.tag": tag, "geo.geo_data": {"$exists": 1}, "geo.geo_data.errors": {"$exists": 0}})
            inserted_ids = []
            for doc in cursor:
                doc_geo_data_id = doc["geo"]["geo_data"]["id"]
                if not doc_geo_data_id in inserted_ids:
                    doc_geo_data = doc["geo"]["geo_data"]
                    doc_geo_data["num_tweets"] = 1
                    dict[tag].append(doc_geo_data)
                    inserted_ids.append(doc_geo_data_id)
                else:
                    for place in dict[tag]:
                        if (place["id"] == doc_geo_data_id):
                            place["num_tweets"] += 1
            self.map_data_by_tag_col.insert_one(dict)



class WordCloudDataFormatter:
    def __init__(self, word_cloud_data_collection, tweets_data_collection, tags_and_dates_col=None):
        self.word_cloud_data_collection = word_cloud_data_collection
        self.tweets_data_collection = tweets_data_collection
        self.tags_and_dates_col = tags_and_dates_col
        self.text_processor = tweets_text_processor.TweetsTextProcessor()

    def generate_collection(self):
        tags = helper.get_tags_from_tags_and_dates_col(self.tags_and_dates_col)
        months = helper.get_months_from_tags_and_dates_col(self.tags_and_dates_col)
        for month in months:
            for tag in tags:
                docs = self.tweets_data_collection.find({"created_at": {"$regex": month}, "query_meta_data.tag": tag}, {"text": 1})
                dict = {
                    "tag" : tag,
                    "date" : month,
                    "terms_frequencies": []
                }
                for doc in docs:
                    tweet_text = doc["text"]
                    tweet_text = self.text_processor.clean_text(tweet_text)
                    ''' continue '''



class MostInfluentialTweetsFormatter:
    def __init__(self, tweets_data_collection, most_influential_tweets_collection, tags_and_dates_col):
        self.tweets_data_collection = tweets_data_collection
        self.most_influential_tweets_collection = most_influential_tweets_collection
        self.tags_and_dates_col = tags_and_dates_col


    def get_n_most_liked_tweets_by_tag_and_date_from_tweets_collection(self, date, tag, num_tweets=10):
        tweet_ids = []
        cursor = self.tweets_data_collection.aggregate(
            [
                { "$match": {"query_meta_data.tag": tag, "created_at": {"$regex": date}}},
                { "$sort" : { "public_metrics.like_count" : -1} },
                { "$limit": num_tweets}   
            ]
        )
        for doc in cursor:
            tweet_ids.append(doc["id"])
        return tweet_ids

    def get_n_most_liked_tweets_by_tag_from_tweets_collection(self, tag, num_tweets=10):
        tweet_ids = []
        cursor = self.tweets_data_collection.aggregate(
            [
                { "$match": {"query_meta_data.tag": tag }},
                { "$sort" : { "public_metrics.like_count" : -1} },
                { "$limit": num_tweets}   
            ]
        )
        for doc in cursor:
            tweet_ids.append(doc["id"])
        return tweet_ids

    def get_n_most_retweeted_tweets_by_tag_and_date_from_tweets_collection(self, date, tag, num_tweets=10):
        tweet_ids = []
        cursor = self.tweets_data_collection.aggregate(
            [
                { "$match": {"query_meta_data.tag": tag, "created_at": {"$regex": date}}},
                { "$sort" : { "public_metrics.retweet_count" : -1} },
                { "$limit": num_tweets}   
            ]
        )
        for doc in cursor:
            tweet_ids.append(doc["id"])
        return tweet_ids

    def get_n_most_retweeted_tweets_by_tag_from_tweets_collection(self, tag, num_tweets=10):
        tweet_ids = []
        cursor = self.tweets_data_collection.aggregate(
            [
                { "$match": {"query_meta_data.tag": tag }},
                { "$sort" : { "public_metrics.retweet_count" : -1} },
                { "$limit": num_tweets}   
            ]
        )
        for doc in cursor:
            tweet_ids.append(doc["id"])
        return tweet_ids

    def generate_collection(self):
        tags = helper.get_tags_from_tags_and_dates_col(self.tags_and_dates_col)
        months = helper.get_months_from_tags_and_dates_col(self.tags_and_dates_col)

        for tag in tags:
            doc = {
                "tag": tag,
                "most_liked_tweets": [],
                "most_retweeted_tweets": [],
                "months": []
            }
            overall_most_liked_tweets = self.get_n_most_liked_tweets_by_tag_from_tweets_collection(tag)
            overall_most_retweeted_tweets = self.get_n_most_retweeted_tweets_by_tag_from_tweets_collection(tag)
            doc["most_liked_tweets"] = overall_most_liked_tweets
            doc["most_retweeted_tweets"] = overall_most_retweeted_tweets
            for month in months:
                most_liked_by_month = self.get_n_most_liked_tweets_by_tag_and_date_from_tweets_collection(month, tag)
                most_retweeted_by_month = self.get_n_most_retweeted_tweets_by_tag_and_date_from_tweets_collection(month, tag)
                month_doc = {
                    "month": month,
                    "most_liked_tweets": most_liked_by_month,
                    "most_retweeted_tweets": most_retweeted_by_month
                }
                doc["months"].append(month_doc)
            self.most_influential_tweets_collection.insert_one(doc)
            print("Batched most influential tweets for tag " + tag, flush=True)


class SubjectivityScoresFormatter(VizDataFormatter):
    def __init__(self, tags_and_dates_mongo_col, tweets_data_mongo_col, subjectivity_scores_mongo_col):
        super().__init__(tags_and_dates_mongo_col, tweets_data_mongo_col)
        self.subjectivity_scores_mongo_col = subjectivity_scores_mongo_col
        self.text_processor = tweets_text_processor.TweetsTextProcessor()


    def create_subjectivity_data_dict(self, tag):
        #set up mongo doc format
        dict = {
            "tag": tag,
            "num_scores": 0,
            "avg_score": 0,
            "scores": [],
        }

        #create a unique dict (to put in dict["scores"]) for each potential score (range: 0.00 to 1.00)
        i = 0
        for i in range(0, 101):
            sub_dict = {
                "score": 0,
                "num_tweets": 0
            }
            sub_dict["score"] = i/100
            dict["scores"].append(sub_dict)
            i = i + 1
        return dict

    def get_tweet_subj_score(self, tweet):
        tweet_text = tweet["text"]
        tweet_text = self.text_processor.clean_text(tweet_text)
        return self.text_processor.get_text_subjectivity_score(tweet_text)


    def scale_value_to_range(self, value, from_range, to_range=[0,1000]):
        scale = (to_range[1] - to_range[0]) / (from_range[1] - from_range[0])
        capped = min(from_range[1], max(from_range[0], value)) - from_range[0]
        return math.floor(capped*scale + to_range[0])

    

    def add_scaled_num_tweets_to_scores(self):
        cursor = self.subjectivity_scores_mongo_col.find({})
        for doc in cursor:
            print("Updating tag '" + doc["tag"] + "' with scaled scores", flush=True)
            scaled_scores_dicts = []
            num_scores = doc["num_scores"]
            scores_dicts = doc["scores"]
            for score_dict in scores_dicts:
                score = score_dict["score"]
                num_tweets = score_dict["num_tweets"]
                scaled_num_tweets = self.scale_value_to_range(value=num_tweets, from_range=[0, num_scores], to_range=[0,1000])
                scaled_scores_dicts.append({
                    "score": score,
                    "num_tweets": scaled_num_tweets
                })
            self.subjectivity_scores_mongo_col.update_one({"_id" : doc["_id"]}, {"$set" : {"scaled_scores": scaled_scores_dicts}}, upsert=True)





    def generate_collection(self, batch_size = 10000):
        tags = self.get_distinct_tags()
        for tag in tags:
            print("Computing subjectivity scores document for tag: " + tag, flush=True)

            counter = 0
            avg_score = 0

            #set up mongo doc format
            dict = self.create_subjectivity_data_dict(tag)
            #add it to mongo
            self.subjectivity_scores_mongo_col.insert_one(dict)

            #get all relevant tweets
            num_tweets_remaining = self.tweets_data_mongo_col.count_documents({"query_meta_data.tag": {"$regex": tag}})
            cursor = self.tweets_data_mongo_col.find({"query_meta_data.tag": {"$regex": tag}}, {"text": 1})
            for tweet in cursor:
                subj_score = self.get_tweet_subj_score(tweet)
                num_tweets_remaining = num_tweets_remaining - 1
                counter += 1

                if (subj_score != -1): #subj_score is -1 if the (clean) text length is less than 3 char
                    for item in dict["scores"]:
                        if (item["score"] == subj_score):
                            item["num_tweets"] += 1
                            dict["num_scores"] += 1
                            avg_score += subj_score

                if ((batch_size > num_tweets_remaining) or (counter == batch_size)):
                    mongo_doc = self.subjectivity_scores_mongo_col.find_one({"tag": tag})
                    new_doc = dict(Counter(mongo_doc)+Counter(dict)) 
                    self.subjectivity_scores_mongo_col.delete_one({"tag": tag})
                    self.subjectivity_scores_mongo_col.insert_one(new_doc)
                    dict = self.create_subjectivity_data_dict(tag)
                    if (counter == batch_size):
                        counter = 0
                        print("\tBatched subjectivity score data for 10'000 tweets.", flush=True)

            avg_score = round(avg_score/dict["num_scores"], 2)
            self.subjectivity_scores_mongo_col.update_one({"tag": tag}, {"$set": {"avg_score": avg_score}})

            self.add_scaled_num_tweets_to_scores()






