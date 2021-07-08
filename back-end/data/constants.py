from dotenv import load_dotenv
import os
load_dotenv('.env')


BEARER_TOKEN = os.getenv('BEARER_TOKEN')
MONGO_DB_USERNAME = os.getenv('MONGO_DB_USERNAME')
MONGO_DB_PASSWORD = os.getenv('MONGO_DB_PASSWORD')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
MONGO_DB_ADDRESS = os.getenv('MONGO_DB_ADDRESS')

TWEETS_SEARCH_API_ENDPOINT = "https://api.twitter.com/2/tweets/search/all?query="
TWEET_GEO_DATA_API_ENDPOINT = "https://api.twitter.com/1.1/geo/id/"
TWEETS_SEARCH_SLEEP_TIME = 3.01
GEO_DATA_BY_PLACE_ID_SLEEP_TIME = 12.01
GEO_DATA_BY_COORDINATES_SLEEP_TIME = 60.01
PROD_MONGO_COL_NAME = "raw_data"


