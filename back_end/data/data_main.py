import mongo_client, full_archive_search_v2, batching, geo_data_cacher, batches_data_explorer
from constants import BEARER_TOKEN, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME, MONGO_DB_ADDRESS, PROD_MONGO_COL_NAME


def main():
    mongoClient = mongo_client.MongoClient(BEARER_TOKEN, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME, MONGO_DB_ADDRESS)
    prodMongoCol = mongoClient.getMongoCollection(PROD_MONGO_COL_NAME)


if __name__ == "__main__":
    main()


    

    