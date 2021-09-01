import mongo_client, full_archive_search_v2, geo_data_cacher, tweets_text_processor, viz_data_formatter
from constants import BEARER_TOKEN, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME, MONGO_DB_ADDRESS, PROD_MONGO_COL_NAME, BatchesTimespan
import helper


def main():
    client_mongo = mongo_client.MongoClient(MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME, MONGO_DB_ADDRESS)

    #code here

    print("done")


if __name__ == "__main__":
    main()