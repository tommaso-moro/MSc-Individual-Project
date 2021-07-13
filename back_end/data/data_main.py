import mongo_client, full_archive_search_v2, geo_data_cacher, tweets_text_processor, batcher
from constants import BEARER_TOKEN, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME, MONGO_DB_ADDRESS, PROD_MONGO_COL_NAME, PROD_MONGO_BATCHES_COL_NAME, BatchesTimespan


def main():
    client_mongo = mongo_client.MongoClient(MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME, MONGO_DB_ADDRESS)
    


    print("done")


if __name__ == "__main__":
    main()


    

    