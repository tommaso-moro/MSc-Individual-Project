import json 

class BatchingHandler:
    def __init__(self, batches_mongo_collection):
        self.batches_mongo_collection = batches_mongo_collection


    '''
    populates a json file with all the unique dates that are present in a mongo collection of tweets.
    Result -> { "dates" : ["2021-06-17", "2021-06-18", "2021-06-19", ...] }
    '''
    def populateJsonFileWithCollectionDates(self, json_filepath, mongo_collection):
        cursor = mongo_collection.find({}, no_cursor_timeout=True)
        dates = []
        datesJson = {"dates" : []}
        for tweet in cursor:
            tweetDateAsStr = tweet["created_at"][0:4] + "-" + tweet["created_at"][5:7] + "-" + tweet["created_at"][8:10]
            if not (tweetDateAsStr in dates):
                dates.append(tweetDateAsStr)
        datesJson["dates"] = dates
        json.dump(datesJson, open(json_filepath, 'w'))




    '''
    populates a json file with all the unique tags that are present in a mongo collection of tweets.
    Result -> { "tags" : ["Regenerative Agriculture", "Biodiversity Loss", "Food Waste", ...] }
    '''
    def populateJsonFileWithCollectionTags(self, json_filepath, mongo_collection):
        cursor = mongo_collection.find({}, no_cursor_timeout=True)
        tags = []
        tagsJson = {"tags" : []}
        for tweet in cursor:
            tag = tweet["query_meta_data"]["tag"]
            if not (tag in tags):
                tags.append(tag)
        tagsJson["tags"] = tags
        json.dump(tagsJson, open(json_filepath, 'w'))


    '''
    Once the dates have been stored in the json file, this method can be used to get the list of dates
    '''
    def readDatesFromJson(self, json_filepath):
        jsonFile = open(json_filepath, "r")
        dates = json.load(jsonFile)["dates"]
        return dates
        


    '''
    Once the tags have been stored in the json file, this method can be used to get the list of tags
    '''
    def readTagsFromJson(self, json_filepath):
        jsonFile = open(json_filepath, "r")
        dates = json.load(jsonFile)["tags"]
        return dates


    '''
    Given a list of dates, for each of date add to the mongo collection a document which contains a "date" field with the date as the value of the field
    '''
    def addDatesToCollection(self, dates):
        for date in dates:
            self.batches_mongo_collection.update_one({"date": date}, {"$set": {"date": date}}, upsert=True)


    '''
    Get the number of tweets in a mongo collection by date and insert it into the batches_mongo_collection 
    '''
    def insertTotNumTweetsByDateToCollection(self, date, from_mongo_collection):
        numTweetsByDate = self.getNumOfTweetsInCollectionByDate(date, from_mongo_collection)
        self.batches_mongo_collection.update_one({"date": date}, {"$set": {"num_tweets": numTweetsByDate}}, upsert=True)


    '''
    Adds a "tags" field to every document in the batches_mongo_collection
    '''
    def addTagsFieldToCollection(self):
        cursor = self.batches_mongo_collection.find({}, no_cursor_timeout=True)
        for doc in cursor:
            self.batches_mongo_collection.update_one({"date": doc["date"]}, {"$set": {"tags": {}}}, upsert=True)


    '''
    Given a tag (e.g. "Biodiversity Loss") add a tag field with the name of the tag to the "tags" field of all the documents of the mongo collection,
    where it does not already exist.
    '''
    def addTagFieldToCollection(self, mongo_collection, tag):
        queryStr = "tags." + tag # construct query to access nested sub-document where tag data is stored
        cursor = mongo_collection.find({queryStr: {"$exists": False}}, no_cursor_timeout=True) # get all documents that do not have a field for the given tag
        for doc in cursor: # for each of such documents add a field for the given tag
            mongo_collection.update_one({"date": doc["date"]}, {"$set": {queryStr: {}}}, upsert=True)

                
    '''
    Given a date and a tag, get the number of tweets matching that date and tag and add it to the document 
    containing data about the tweets that were made on that date
    '''
    def insertTotNumTweetsByDateAndTagToCollection(self, date, tag, from_mongo_collection, to_mongo_collection):
        numTweetsByDateAndTag = self.getNumOfTweetsInCollectionByDateAndTag(date, tag, from_mongo_collection)
        queryStr = "tags." + tag + ".num_tweets"
        to_mongo_collection.update_one({"date": date}, {"$set": {queryStr: numTweetsByDateAndTag}}, upsert=True)


    '''
    Given a collection of tweets and a date, get the number of tweets that were created on that date
    '''
    def getNumOfTweetsInCollectionByDate(self, date, mongo_collection):
        return mongo_collection.find({"created_at": {'$regex': date}}).count()


    '''
    Given a collection of tweets, a date and a tag, get the number of tweets that were created on that date
    and match the given tag
    '''
    def getNumOfTweetsInCollectionByDateAndTag(self, date, tag, mongo_collection):
        return mongo_collection.find({"created_at": {'$regex': date}, "query_meta_data.tag": tag}).count()



    '''
    Given a date and a mongo collection containing tweets, get the number of tweets in the collection which were
    created on that date and whose data includes geo data
    '''
    def getTotNumOfTweetsWithGeoDataByDate(self, date, mongo_collection):
        numOfTweetsWithGeoDataByDate = mongo_collection.count_documents({"geo": { "$exists": 1 }, "created_at": {'$regex': date}})
        return numOfTweetsWithGeoDataByDate



    def insertTotNumOfTweetsWithGeoDataByDateToCollection(self, date, from_mongo_collection, to_mongo_collection):
        numOfTweetsWithGeoDataByDate = self.getTotNumOfTweetsWithGeoDataByDate(date, from_mongo_collection)
        to_mongo_collection.update_one({"date": date}, {"$set": {"num_tweets_with_geo_data": numOfTweetsWithGeoDataByDate}}, upsert=True)




    def insertPercentageOfTweetsWithGeoDataByDate(self, date, mongo_collection):
        numTweetsWithGeoData = mongo_collection.find_one({"date": date}, {"num_tweets_with_geo_data": 1, "_id": 0})["num_tweets_with_geo_data"]
        numTweets = mongo_collection.find_one({"date": date}, {"num_tweets": 1, "_id": 0})["num_tweets"]
        percentageOfTweetsWithGeoData = ((numTweetsWithGeoData*100)/numTweets) if (numTweets != 0) else 0
        mongo_collection.update_one({"date": date}, {"$set": {"percentage_tweets_with_geo_data": round(percentageOfTweetsWithGeoData, 3)}}, upsert=True) 




    
    def insertPercentageOfTweetsWithGeoDataByDateAndTag(self, date, tag, mongo_collection):
        tagNumTweetsWithGeoDataQueryStr = "tags." + tag + ".num_tweets_with_geo_data"
        tagNumTweetsQueryStr = "tags." + tag + ".num_tweets"
        percentageTweetsWithGeoDataQueryStr = "tags." + tag + ".percentage_tweets_with_geo_data"
        tagNumTweetsWithGeoData = mongo_collection.find_one({"date": date}, {tagNumTweetsWithGeoDataQueryStr: 1, "_id": 0})["tags"][tag]["num_tweets_with_geo_data"] #returns number of tweets with geo data for a given tag and date
        tagNumTweets = mongo_collection.find_one({"date": date}, {tagNumTweetsQueryStr: 1, "_id": 0})["tags"][tag]["num_tweets"] #returns number of tweets for a given tag and date
        percentageOfTweetsWithGeoData = ((tagNumTweetsWithGeoData*100)/tagNumTweets) if (tagNumTweets != 0) else 0
        mongo_collection.update_one({"date": date}, {"$set": {percentageTweetsWithGeoDataQueryStr: round(percentageOfTweetsWithGeoData, 3)}}, upsert=True) 




    def getTotNumOfTweetsWithGeoDataByDateAndTag(self, date, tag, mongo_collection):
        numOfTweetsWithGeoDataByDateAndTag = mongo_collection.count_documents({"geo": { "$exists": 1 }, "created_at": {'$regex': date}, "query_meta_data.tag": tag})
        return numOfTweetsWithGeoDataByDateAndTag




    def insertTotNumOfTweetsWithGeoDataByDateAndTagToCollection(self, date, tag, from_mongo_collection, to_mongo_collection):
        queryStr = "tags." + tag + ".num_tweets_with_geo_data"
        numOfTweetsWithGeoDataByDateAndTag = self.getTotNumOfTweetsWithGeoDataByDateAndTag(date, tag, from_mongo_collection)
        to_mongo_collection.update_one({"date": date}, {"$set": {queryStr: numOfTweetsWithGeoDataByDateAndTag}}, upsert=True)



    def insertNumUsersByDate(self, date, from_mongo_collection, to_mongo_collection):
        numUsersByDate = len(from_mongo_collection.distinct('author_data.id', {"created_at" : {'$regex': date}}))
        to_mongo_collection.update_one({"date": date}, {"$set": {"num_users": numUsersByDate}}, upsert=True) 


    
    def getNumOfVerifiedUsersByDate(self, date, mongo_collection):
        return len(mongo_collection.distinct('author_data.id', {"author_data.verified": True, "created_at" : {'$regex': date}}))



    def insertPercentageVerifiedUsersByDate(self, date, from_mongo_collection, to_mongo_collection):
        numVerifiedUsers = self.getNumOfVerifiedUsersByDate(date, from_mongo_collection)
        numUsers = to_mongo_collection.find_one({"date": date}, {"num_users": 1, "_id": 0})["num_users"]
        percentageVerifiedUsers = ((numVerifiedUsers*100)/numUsers) if (numUsers != 0) else 0
        to_mongo_collection.update_one({"date": date}, {"$set": {"percentage_verified_users": round(percentageVerifiedUsers, 3)}}, upsert=True)




    def getNumOfUsersByDateAndTag(self, date, tag, mongo_collection):
        return len(mongo_collection.distinct('author_data.id', {"created_at" : {'$regex': date}, "query_meta_data.tag": tag}))



    def getNumOfVerifiedUsersByDateAndTag(self, date, tag, mongo_collection):
        return len(mongo_collection.distinct('author_data.id', {"author_data.verified": True, "created_at" : {'$regex': date}, "query_meta_data.tag": tag}))



    def insertPercentageVerifiedUsersByDateAndTag(self, date, tag, from_mongo_collection, to_mongo_collection):
        numUsers = self.getNumOfUsersByDateAndTag(date, tag, from_mongo_collection)
        numVerifiedUsers = self.getNumOfVerifiedUsersByDateAndTag(date, tag, from_mongo_collection)
        percentageVerifiedUsers = ((numVerifiedUsers*100)/numUsers) if (numUsers != 0) else 0
        tagPercentageVerifiedUsersQueryStr = "tags." + tag + ".percentage_verified_users"
        to_mongo_collection.update_one({"date": date}, {"$set": {tagPercentageVerifiedUsersQueryStr: round(percentageVerifiedUsers, 3)}}, upsert=True)

    """ def getCountriesByDateAndTag(self, date, tag, mongo_collection):
        countries = mongo_collection.distinct('author_data.id', {"created_at" : {'$regex': date}, "query_meta_data.tag": tag}) """



