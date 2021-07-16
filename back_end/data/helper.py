import pandas as pd


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


def get_tweets_text_from_mongo_cursor(cursor):
    text = ""
    for doc in list(cursor):
        text = text + " " + doc["text"]
    return text

def get_average(numbers_list, digits=2):
    sum = 0
    for number in numbers_list:
        sum += number
    return round(sum/len(numbers_list), digits)

