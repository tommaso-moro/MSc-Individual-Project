import mongo_client, full_archive_search_v2, geo_data_cacher, tweets_text_processor, batcher
from constants import BEARER_TOKEN, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME, MONGO_DB_ADDRESS, PROD_MONGO_COL_NAME, PROD_MONGO_BATCHES_COL_NAME, BatchesTimespan
import helper

def main():
    client_mongo = mongo_client.MongoClient(MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME, MONGO_DB_ADDRESS)
    prod_col = client_mongo.getMongoCollection(PROD_MONGO_COL_NAME)
    prod_col_new = client_mongo.getMongoCollection("data_prod")
    batches_mongo_col = client_mongo.getMongoCollection("monthly_batches_dev")
    sample_prod_col = client_mongo.getMongoCollection("prod_sample")
    hashtags_cooccurrences_col = client_mongo.getMongoCollection("hashtags_cooccurrences")
    geo_data_caching_col = client_mongo.getMongoCollection("geo_data_caching")
    
    #batching_handler = batcher.BatchesCacher(batches_mongo_col, sample_prod_col, hashtags_cooccurrences_col, BatchesTimespan.MONTHLY)
    #batching_handler.generate_batches_collection()
    #geoDataCacher = geo_data_cacher.GeoDataCacher(BEARER_TOKEN, geo_data_caching_col)
    #geoDataCacher.attach_cached_geo_data_to_tweets(sample_prod_col)

    

    
   

    
    


    print("done")


if __name__ == "__main__":
    main()


    

    

#get most influential users per topic
#get common hashtags across different topics (i.e. tags)
#make chord where each label is a tag and the thickness of the strings connecting them is based on how many hashtags (or keywords?) they have in common

    



    

    