import mongo_client, full_archive_search_v2, geo_data_cacher, tweets_text_processor, batcher, memory_efficient_batcher, viz_data_formatter
from constants import BEARER_TOKEN, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME, MONGO_DB_ADDRESS, PROD_MONGO_COL_NAME, PROD_MONGO_BATCHES_COL_NAME, BatchesTimespan
import helper
import time


def main():
    client_mongo = mongo_client.MongoClient(MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME, MONGO_DB_ADDRESS)
    prod_col = client_mongo.getMongoCollection(PROD_MONGO_COL_NAME)
    prod_col_new = client_mongo.getMongoCollection("data_prod")
    monthly_batches_prod_mongo_col = client_mongo.getMongoCollection("monthly_batches_prod")
    sample_prod_col = client_mongo.getMongoCollection("prod_sample")
    hashtags_cooccurrences_col = client_mongo.getMongoCollection("hashtags_cooccurrences")
    geo_data_caching_col = client_mongo.getMongoCollection("geo_data_caching")
    daily_batches_dev_mongo_col = client_mongo.getMongoCollection("daily_batches_dev")
    line_chart_data_col = client_mongo.getMongoCollection("line_chart_monthly_data")
    map_data_col = client_mongo.getMongoCollection("map_data_by_tag")
    line_chart_dev = client_mongo.getMongoCollection("line_chart_dev")
    tags_and_dates_col = client_mongo.getMongoCollection("tags_and_dates")
    most_influential_tweets_col = client_mongo.getMongoCollection("most_influential_tweets")
    subjectivity_scores_col = client_mongo.getMongoCollection("subjectivity_scores")


    value = 10
    from_range = [1, 50]
    to_range = [100, 5000]
    test = viz_data_formatter.SubjectivityScoresFormatter(tags_and_dates_col, prod_col, subjectivity_scores_col)
    print(test.scale_score_to_range(value, from_range, to_range))
    #map_data_formatter = viz_data_formatter.MapDataFormatter(prod_col, map_data_col)
    #map_data_formatter.generate_collection()
    #monthly_batches_prod_mongo_col.delete_many({})
    #efficient_batcher = memory_efficient_batcher.BatchesCacher(monthly_batches_prod_mongo_col, sample_prod_col, hashtags_cooccurrences_col, BatchesTimespan.MONTHLY)
    #efficient_batcher.generate_batches_collection()
    #batching_handler = batcher.BatchesCacher(batches_mongo_col, prod_col, hashtags_cooccurrences_col, BatchesTimespan.MONTHLY)
    #batching_handler.generate_batches_collection()
    #geoDataCacher = geo_data_cacher.GeoDataCacher(BEARER_TOKEN, geo_data_caching_col)
    #geoDataCacher.attach_cached_geo_data_to_tweets(prod_col)






    

    print("done")


if __name__ == "__main__":
    main()


    

    

#get most influential users per topic
#get common hashtags across different topics (i.e. tags)
#make chord where each label is a tag and the thickness of the strings connecting them is based on how many hashtags (or keywords?) they have in common

    



    

    