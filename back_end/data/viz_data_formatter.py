import helper
import tweets_text_processor
import math

'''
A set of classes that are useful to generate mongo collections that require little to no manipulation in order
to work with the chosen front-end data visualization libraries. 
'''

class VizDataFormatter:
    def __init__(self, tags_and_dates_mongo_col, tweets_data_mongo_col):
        self.tags_and_dates_mongo_col = tags_and_dates_mongo_col
        self.tweets_data_mongo_col = tweets_data_mongo_col

    def get_distinct_months(self):
        return helper.get_months_from_tags_and_dates_col(self.tags_and_dates_mongo_col)

    def get_distinct_tags(self):
        return helper.get_tags_from_tags_and_dates_col(self.tags_and_dates_mongo_col)




class TagsPopularityDataFormatter(VizDataFormatter):
    def __init__(self, tags_popularity_col, tweets_data_mongo_col, tags_and_dates_mongo_col):
        super().__init__(tags_and_dates_mongo_col, tweets_data_mongo_col)
        self.tags_popularity_col = tags_popularity_col

    def add_normalized_values_to_collection(self):
        tags = self.get_distinct_tags()

        for tag in tags:
            print("Handling tag: "+ tag, flush=True)
            doc = self.tags_popularity_col.find_one({"tag": tag})
            original_monthly_num_tweets = []

            for month_dict in doc["months"]:
                original_monthly_num_tweets.append(month_dict["num_tweets"])
            #find max and min monthly value
            max_value = max(original_monthly_num_tweets)
            min_value = min(original_monthly_num_tweets)


            normalized_monthly_data_dicts = []
            for month_dict in doc["months"]:
                num_tweets = month_dict["num_tweets"]
                normalized_num_tweets = (num_tweets-min_value)/(max_value-min_value)
                normalized_monthly_data_dict = {
                    "month": month_dict["month"],
                    "normalized_num_tweets": round(normalized_num_tweets, 3)
                }
                normalized_monthly_data_dicts.append(normalized_monthly_data_dict)
            
            self.tags_popularity_col.update_one({"tag": tag}, {"$set": {"months_normalized": normalized_monthly_data_dicts}}, upsert=True)
            

        
    def generate_collection(self):
        tags = self.get_distinct_tags()
        months = self.get_distinct_months()

        for tag in tags:
            print("Handling tag " + tag, flush=True)
            dict = {
                "tag": tag,
                "months": [],
                "num_tweets": 0
            }
            overall_num_tweets = 0
            for month in months:
                num_tweets = self.tweets_data_mongo_col.count_documents({"created_at": {"$regex": month}, "query_meta_data.tag": tag})
                dict["months"].append({
                    "month": month,
                    "num_tweets": num_tweets
                })
                overall_num_tweets += num_tweets
            dict["num_tweets"] = overall_num_tweets
            self.tags_popularity_col.insert_one(dict.copy())
            
    




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








class WordCloudDataFormatter(VizDataFormatter):
    def __init__(self, word_cloud_data_collection, tweets_data_mongo_col, tags_and_dates_mongo_col):
        super().__init__(tags_and_dates_mongo_col, tweets_data_mongo_col)
        self.word_cloud_data_collection = word_cloud_data_collection
        self.text_processor = tweets_text_processor.TweetsTextProcessor()

    def generate_collection(self):
        tags = self.get_distinct_tags()
        months = self.get_distinct_months()

        for tag in tags:
            print("\tHandling tag: " + tag, flush=True)
            dict = {
                    "tag" : tag,
                    "months" : [],
                    "overall_terms_frequencies": {}
                }
            for month in months:
                month_dict = {
                    "month": month,
                    "terms_frequencies": {}
                }
                docs = self.tweets_data_mongo_col.find({"created_at": {"$regex": month}, "query_meta_data.tag": tag}, {"text": 1})
                for doc in docs:
                    tweet_text = doc["text"]
                    tweet_text = self.text_processor.clean_text(tweet_text)
                    tweet_frequencies = self.text_processor.get_most_common_terms_from_text(tweet_text, -1)
                    for term in tweet_frequencies:
                        #add term to month counter dict
                        if term in month_dict["terms_frequencies"]:
                            month_dict["terms_frequencies"][term] += tweet_frequencies[term]
                        else:
                            month_dict["terms_frequencies"][term] = tweet_frequencies[term]
                        
                        #add term to overall counter dict
                        if term in dict["overall_terms_frequencies"]:
                            dict["overall_terms_frequencies"][term] += tweet_frequencies[term]
                        else:
                            dict["overall_terms_frequencies"][term] = tweet_frequencies[term]

                #sort frequencies for the month and put the top 150 in the dict
                sorted_frequencies_month = sorted(month_dict["terms_frequencies"].items(), key=lambda x: x[1], reverse=True)[0:150]
                month_dict["terms_frequencies"] = helper.get_dict_from_tuples_list(sorted_frequencies_month)
                
                #push the month dict in the main tag-level dict
                dict["months"].append(month_dict)

            #sort frequencies for the tag and put in the dict the top 150
            sorted_frequencies_overall = sorted(dict["overall_terms_frequencies"].items(), key=lambda x: x[1], reverse=True)[0:150]
            dict["overall_terms_frequencies"] = helper.get_dict_from_tuples_list(sorted_frequencies_overall)

            #insert tag dict
            self.word_cloud_data_collection.insert_one(dict)

        """ for month in months:
            print("Handling month: " + month, flush=True)
            for tag in tags:
                print("\tHandling tag: " + tag, flush=True)
                docs = self.tweets_data_mongo_col.find({"created_at": {"$regex": month}, "query_meta_data.tag": tag}, {"text": 1})
                dict = {
                    "tag" : tag,
                    "date" : month,
                    "terms_frequencies": {}
                }
                for doc in docs:
                    tweet_text = doc["text"]
                    tweet_text = self.text_processor.clean_text(tweet_text)
                    tweet_frequencies = self.text_processor.get_most_common_terms_from_text(tweet_text, -1)
                    for term in tweet_frequencies:
                        if term in dict["terms_frequencies"]:
                            dict["terms_frequencies"][term] += tweet_frequencies[term]
                        else:
                            dict["terms_frequencies"][term] = tweet_frequencies[term]
                #sort the terms frequencies and only keep the top 150 most frequent terms in the dict
                sorted_frequencies = sorted(dict["terms_frequencies"].items(), key=lambda x: x[1], reverse=True)
                dict["terms_frequencies"] = [sorted_frequencies[0:150]] #put in array for smoother compatibility with data viz in front-end
                self.word_cloud_data_collection.insert_one(dict) """







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





class MostPopularHashtagsAndMentionsFormatter(VizDataFormatter):
    def __init__(self, tags_and_dates_mongo_col, tweets_data_mongo_col, popular_hashtags_and_mentions_col):
        super().__init__(tags_and_dates_mongo_col, tweets_data_mongo_col)
        self.popular_hashtags_and_mentions_col = popular_hashtags_and_mentions_col
        self.text_processor = tweets_text_processor.TweetsTextProcessor()

    def generate_collection(self):
        months = self.get_distinct_months()
        tags = self.get_distinct_tags
        for tag in tags:
            dict = {
                "hashtags" : [],
                "mentions" : [],
                "months" : []
            }
            for month in months:
                month_dict = {
                    "month": month,
                    "mentions": {},
                    "hashtags": {}
                }
                docs = self.tweets_data_mongo_col.find({"created_at": {"$regex": month}, "query_meta_data.tag": tag}, {"text": 1})
                for doc in docs:
                    tweet_text = doc["text"]
                    mention_frequencies = self.text_processor.get_most_mentioned_accounts(tweet_text, -1)
                    hashtag_frequencies = self.text_processor.get_most_common_hashtags_from_text(tweet_text, -1)
                    for mention in mention_frequencies:
                        #add mention to month counter dict
                        if mention in month_dict["mentions"]:
                            month_dict["mentions"][mention] += mention_frequencies[mention]
                        else:
                            month_dict["mention_frequencies"][mention] = mention_frequencies[mention]
                        
                        #add mention to overall counter dict
                        if mention in dict["mentions"]:
                            dict["mentions"][mention] += mention_frequencies[mention]
                        else:
                            dict["mentions"][mention] = mention_frequencies[mention]

                    for hashtag in hashtag_frequencies:
                        #add hashtag to month counter dict
                        if hashtag in month_dict["hashtags"]:
                            month_dict["hashtags"][hashtag] += hashtag_frequencies[hashtag]
                        else:
                            month_dict["hashtags"][hashtag] = hashtag_frequencies[hashtag]
                        
                        #add hashtag to overall counter dict
                        if hashtag in dict["hashtags"]:
                            dict["hashtags"][hashtag] += hashtag_frequencies[hashtag]
                        else:
                            dict["hashtags"][hashtag] = hashtag_frequencies[hashtag]

                #sort frequencies for the month and put the top 25 in the dict
                sorted_mention_frequencies_month = sorted(month_dict["mentions"].items(), key=lambda x: x[1], reverse=True)[0:25]
                month_dict["mentions"] = helper.get_dict_from_tuples_list(sorted_mention_frequencies_month)

                #sort frequencies for the month and put the top 25 in the dict
                sorted_hashtag_frequencies_month = sorted(month_dict["hashtags"].items(), key=lambda x: x[1], reverse=True)[0:25]
                month_dict["hashtags"] = helper.get_dict_from_tuples_list(sorted_hashtag_frequencies_month)


                
                #push the month dict in the main tag-level dict
                dict["months"].append(month_dict)

            #sort frequencies for the tag and put in the dict the top 150
            sorted_hashtag_frequencies_overall = sorted(dict["hashtags"].items(), key=lambda x: x[1], reverse=True)[0:25]
            sorted_mention_frequencies_overall = sorted(dict["mentions"].items(), key=lambda x: x[1], reverse=True)[0:25]
            dict["hashtags"] = helper.get_dict_from_tuples_list(sorted_hashtag_frequencies_overall)
            dict["mentions"] = helper.get_dict_from_tuples_list(sorted_mention_frequencies_overall)

            #insert tag dict
            self.popular_hashtags_and_mentions_col.insert_one(dict)







class SubjectivityScoresFormatter(VizDataFormatter):
    def __init__(self, tags_and_dates_mongo_col, tweets_data_mongo_col, subjectivity_scores_mongo_col):
        super().__init__(tags_and_dates_mongo_col, tweets_data_mongo_col)
        self.subjectivity_scores_mongo_col = subjectivity_scores_mongo_col
        self.text_processor = tweets_text_processor.TweetsTextProcessor()


    def create_subjectivity_data_dict(self, tag="", month=""):
        #set up mongo doc format
        dict = {
            "num_scores": 0,
            "avg_score": 0,
            "scores": [],
            "scaled_scores": []
        }
        if (tag != ""):
            dict["tag"] = tag
            dict["months"] = []
        if (month != ""):
            dict["month"] = month

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
            doc_copy = doc

            #compute dict of tag-level scaled scores
            print("Updating tag '" + doc["tag"] + "' with scaled scores", flush=True)
            scaled_scores_dicts = []
            num_scores = doc["num_scores"]
            scores_dicts = doc["scores"]
            for score_dict in scores_dicts:
                score = score_dict["score"]
                num_tweets = score_dict["num_tweets"]
                if (num_scores != 0):
                    scaled_num_tweets = self.scale_value_to_range(value=num_tweets, from_range=[0, num_scores], to_range=[0,1000])
                    scaled_scores_dicts.append({
                        "score": score,
                        "num_tweets": scaled_num_tweets
                    })
            doc_copy["scaled_scores"] = scaled_scores_dicts
            doc_copy["monthly_scaled_scores"] = []

            #compute dicts of mont-level scaled scores
            for month_dict in doc["months"]:
                num_scores = month_dict["num_scores"]
                month_scores_dicts = month_dict["scores"]
                month_scaled_scores_dict = {
                    "month": month_dict["month"],
                    "scaled_scores": []
                }
                for month_score_dict in month_scores_dicts:
                    score = month_score_dict["score"]
                    num_tweets = month_score_dict["num_tweets"]
                    if (num_scores != 0):
                        scaled_num_tweets = self.scale_value_to_range(value=num_tweets, from_range=[0, num_scores], to_range=[0,1000])
                        month_scaled_scores_dict["scaled_scores"].append({
                            "score": score,
                            "num_tweets": scaled_num_tweets
                        })
                doc_copy["monthly_scaled_scores"].append(month_scaled_scores_dict)

            #delete old doc
            self.subjectivity_scores_mongo_col.delete_one({"_id" : doc["_id"]})
            #insert new one
            self.subjectivity_scores_mongo_col.insert_one(doc_copy)

    def generate_collection(self):
        tags = self.get_distinct_tags()
        months = self.get_distinct_months()
        for tag in tags:
            print("Computing subjectivity scores document for tag: " + tag, flush=True)
            #set up mongo doc format
            dict = self.create_subjectivity_data_dict(tag=tag)
            for month in months:
                print(month, flush=True)
                #set up mongo doc format
                month_dict = self.create_subjectivity_data_dict(month=month)
                avg_score = 0

                #get all relevant tweets
                cursor = self.tweets_data_mongo_col.find({"query_meta_data.tag": {"$regex": tag}, "created_at": {"$regex": month}}, {"text": 1})
                for tweet in cursor:
                    tweet_text = tweet["text"]
                    tweet_text = self.text_processor.clean_text(tweet_text)
                    subj_score = self.text_processor.get_text_subjectivity_score(tweet_text)
                    if (subj_score != -1): #subj_score is -1 if the (clean) text length is less than 3 char
                        for item in month_dict["scores"]:
                            if (item["score"] == subj_score):
                                item["num_tweets"] += 1
                                month_dict["num_scores"] += 1
                                avg_score += subj_score
                month_dict["avg_score"] = round(avg_score/month_dict["num_scores"], 2)

                dict["months"].append(month_dict)
            
            avg_score = 0
            #get all relevant tweets
            cursor = self.tweets_data_mongo_col.find({"query_meta_data.tag": {"$regex": tag}}, {"text": 1})
            for tweet in cursor:
                tweet_text = tweet["text"]
                tweet_text = self.text_processor.clean_text(tweet_text)
                subj_score = self.text_processor.get_text_subjectivity_score(tweet_text)
                if (subj_score != -1): #subj_score is -1 if the (clean) text length is less than 3 char
                    for item in dict["scores"]:
                        if (item["score"] == subj_score):
                            item["num_tweets"] += 1
                            dict["num_scores"] += 1
                            avg_score += subj_score
            dict["avg_score"] = round(avg_score/dict["num_scores"], 2)
            self.subjectivity_scores_mongo_col.insert_one(dict)
        self.add_scaled_num_tweets_to_scores()

    #the following code is for a batch-based approach, in case it was preferred:
    """ def generate_collection(self, batch_size = 10000):
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

            self.add_scaled_num_tweets_to_scores() """








