import pandas as pd
import json
from bson.json_util import dumps, loads
from datetime import datetime



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
    return tags_and_dates_col.find({}, {"dates": 1, "_id": 0})[0]["dates"]


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