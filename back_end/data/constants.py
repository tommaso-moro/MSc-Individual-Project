from dotenv import load_dotenv
from enum import Enum
import os
load_dotenv('.env')


BEARER_TOKEN = os.getenv('BEARER_TOKEN')
MONGO_DB_USERNAME = os.getenv('MONGO_DB_USERNAME')
MONGO_DB_PASSWORD = os.getenv('MONGO_DB_PASSWORD')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')
MONGO_DB_ADDRESS = os.getenv('MONGO_DB_ADDRESS')
PROD_MONGO_COL_NAME = "raw_data"
PROD_MONGO_BATCHES_COL_NAME = "batches_prod"

TWEETS_SEARCH_API_ENDPOINT = "https://api.twitter.com/2/tweets/search/all?query="
TWEET_GEO_DATA_API_ENDPOINT = "https://api.twitter.com/1.1/geo/id/"
TWEETS_SEARCH_SLEEP_TIME = 3.01
GEO_DATA_BY_PLACE_ID_SLEEP_TIME = 12.01
GEO_DATA_BY_COORDINATES_SLEEP_TIME = 60.01
HASHTAG_SYMBOL = '#'
MENTION_SYMBOL = '@'
TWEETS_STRINGS_TO_IGNORE = ['RT', 'via', "https", "http", "https", "…", '’', "co", "..."]
 

TAGS_STOPWORDS = {
    "Regenerative Agriculture": ["Regenerative", "Agriculture", "regenerative", "agriculture", "REGENERATIVE", "AGRICULTURE"],
    "Food Waste": ["Food", "food", "FOOD", "Waste", "waste", "WASTE"],
    "Reforestation": ["reforestation", "Reforestation", "REFORESTATION"],
    "Deforestation": ["deforestation", "Deforestation", "DEFORESTATION"],
    "Afforestation": ["afforestation", "Afforestation", "AFFORESTATION"],
    "Supply Chain Sustainability": ["supply", "Supply", "SUPPLY", "chain", "Chain", "CHAIN", "sustainability", "Sustainability", "SUSTAINABILITY"],
    "Sustainable Finance": ["sustainable", "Sustainable", "SUSTAINABLE", "finance", "Finance", "FINANCE"]
}


class BatchesTimespan(Enum):
    DAILY = 1
    MONTHLY = 2 