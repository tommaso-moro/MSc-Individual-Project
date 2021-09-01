import pandas as pd
import json
from bson.json_util import dumps, loads
from datetime import datetime
import matplotlib.pyplot as plt
import tweets_text_processor




'''
Helper functions 
'''

def get_pd_dataframe_from_csv(filepath, sep='\t'):
    df = pd.read_csv(filepath, sep=sep)
    return df


def get_tweets_text_from_dataframe(df):
    return df.text


def get_dict_from_tuples_list(tuples_list):
    result = {}
    for tuple_item in tuples_list:
        result[tuple_item[0]] = tuple_item[1]
    return result


def get_tweets_text(tweets):
    text = ""
    for doc in list(tweets):
        text = text + " " + doc["text"]
    return text


def get_average(numbers_list, digits=2):
    sum = 0
    for number in numbers_list:
        sum += number
    return round(sum/len(numbers_list), digits)



def write_dict_to_json_file(json_filepath, dict):
    json.dump(dict, open(json_filepath, 'w'), indent=4)



def write_cursor_to_json_file(json_filepath, cursor):
    json_data = dumps(list(cursor), indent=2)
    with open(json_filepath, 'w') as file:
        file.write(json_data)


def get_sample_collection_from_collection(mongo_collection, sample_size):
    try:
        sample_collection = mongo_collection.aggregate([ { "$sample": { "size": sample_size } } ])
        return sample_collection
    except Exception as e:
        print("The following error occurred when trying to get a sample collection: " + str(e))


def get_current_datetime_as_str():
    now = datetime.now()
    datetime_string = now.strftime("%d/%m/%Y %H:%M:%S")
    return datetime_string


def get_tags_from_tags_and_dates_col(tags_and_dates_col):
    return tags_and_dates_col.find({}, {"tags": 1, "_id": 0})[0]["tags"]

def get_months_from_tags_and_dates_col(tags_and_dates_col):
    return tags_and_dates_col.find({}, {"months": 1, "_id": 0})[0]["months"]


def get_tags_from_tweets_data_col(tweets_data_col):
    pass

def get_months_from_tweets_data_col(tweets_data_col):
    pass


def create_tags_and_dates_col(tweets_data_col, tags_and_dates_col):
    cursor = tweets_data_col.find({}, {"created_at": 1, "_id": 0}, no_cursor_timeout=True)
    dates = []
    for tweet in cursor:
        tweetDateAsStr = tweet["created_at"][0:4] + "-" + tweet["created_at"][5:7]
        if not (tweetDateAsStr in dates):
            dates.append(tweetDateAsStr)
    cursor = tweets_data_col.aggregate( [ { "$group" : { "_id" : "$query_meta_data.tag" } }, { "$project" : { "_id" : 0, "tag" : "$_id" } }, { "$sort": { "query_meta_data.tag": 1 } } ] )
    tags = []
    for doc in cursor:
        tag = doc["tag"]
        tags.append(tag)
    dict = {
        "dates": dates,
        "start_date": dates[-1],
        "end_date": dates[0],
        "tags": tags
    }
    tags_and_dates_col.insert_one(dict)

def plot_barchart(labels, values, x_label, y_label, title, logarithmic=True):
    plt.style.use('ggplot')
    x = labels
    y = values

    x_pos = [i for i, _ in enumerate(x)]
    plt.barh(x_pos, y, color='green')
    plt.xlabel(x_label)
    plt.ylabel(y_label)
    plt.title(title)

    plt.yticks(x_pos, x)
    plt.tight_layout() #adjust graph size to fit page
    if (logarithmic == True):
        plt.xscale('log')
    plt.show()

def plot_topics_popularity_barchart(tags_popularity_col, logarithmic=True):
    cursor = tags_popularity_col.find({})
    tags = []
    num_tweets_list = []
    for tag in cursor:
        label = tag["tag"]
        if (label != "Nanopollution"):
            num_tweets = 0
            for month_dict in tag["months"]:
                num_tweets += month_dict["num_tweets"]
            num_tweets_list.append(num_tweets)
            tags.append(label)
    
    plot_barchart(tags, num_tweets_list, "Number of tweets", "Topic", "Number of tweets", logarithmic)

def print_months_with_zero_tweets_by_topic(tags_popularity_col):
    cursor = tags_popularity_col.find({})
    for doc in cursor:
        tag = doc["tag"]
        print(tag, flush=True)
        print("0 tweets found for months: ", flush=True)
        for month_dict in doc["months"]:
            if (month_dict["num_tweets"] == 0):
                print(month_dict["month"], flush="True")
        print("\n")

def get_highest_tweets_day_by_topic(daily_batches_col):
    cursor = daily_batches_col.find({})
    dict = {

    }
    for tag in cursor[0]["tags"]:
        dict[tag] = {
            "max_date": "",
            "max_amount": 0
        }
    for doc in cursor:
        date = doc["date"]
        for tag_name in list(doc["tags"]):
            if (doc["tags"][tag_name]["num_tweets"] > dict[tag_name]["max_amount"]):
                dict[tag_name]["max_amount"] = doc["tags"][tag_name]["num_tweets"]
                dict[tag_name]["max_date"] = date
    return dict

    def get_stats_about_tweets_geo_data(tags_and_dates_col, tweets_data_col):
        result = []
        tags = tags_and_dates_col.find({})[0]["tags"]
        for tag in tags:
            num_tweets = prod_col.count_documents({"query_meta_data.tag":tag})
            num_tweets_with_geo = prod_col.count_documents({"query_meta_data.tag":tag, "geo":{"$exists": 1}})
            dict = {}
            dict[tag] = tag
            dict["num_tweets"] = num_tweets
            dict["num_tweets_with_geo"] = num_tweets_with_geo
            dict["perc_tweets_with_geo"] = round(num_tweets_with_geo*100/num_tweets, 3)
            result.push(dict)
        return result

    def get_stats_about_tweets_by_verified_users(tags_and_dates_col, tweets_data_col):
        result = []
        tags = tags_and_dates_col.find({})[0]["tags"]
        for tag in tags:
            num_tweets = prod_col.count_documents({"query_meta_data.tag":tag})
            num_tweets_by_verified = prod_col.count_documents({"query_meta_data.tag":tag, "author_data.verified": True})
            dict[tag] = tag
            dict["num_tweets"] = num_tweets
            dict["num_tweets_by_verified"] = num_tweets_by_verified
            dict["perc_tweets_by_verified"] = round(num_tweets_by_verified*100/num_tweets, 3)
            result.push(dict)
        return result

def get_percentage_english_tweets_by_topic(tags_and_dates_col, tweets_data_col):
    tags = get_tags_from_tags_and_dates_col(tags_and_dates_col)
    tt = tweets_text_processor.TweetsTextProcessor()
    result = []
    for tag in tags:
        tag_result = {}
        print(tag, flush=True)
        num_tweets = tweets_data_col.count_documents({"query_meta_data.tag": tag})
        num_english_tweets = 0
        cursor = tweets_data_col.find({"query_meta_data.tag": tag})
        for doc in cursor:
            text = doc["text"]
            clean_text = tt.clean_text(text, remove_punctuation=False, lower=False)
            if (tt.text_is_in_english(clean_text)):
                num_english_tweets += 1

        tag_result["tag"] = tag
        tag_result["num_tweets"] = num_tweets
        tag_result["num_english_tweets"] = num_english_tweets
        tag_result["perc_english_tweets"] = round(num_english_tweets*100/num_tweets, 3)
        result.append(tag_result)
    return result