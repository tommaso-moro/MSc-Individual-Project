import constants
import json
from re import T
import requests
from urllib.parse import quote
import datetime
import time


'''
Class that handles full archive search using the academic level of access to the Twitter API v2
To handle requests see: https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all
For authentication see: https://developer.twitter.com/en/docs/authentication/oauth-2-0; 

- Takes in a BEARER TOKEN
- Takes in a mongo collection
- Contains the method setQuery() to set a query to perform a search using the Twitter API
'''
class TwitterSearch:
    def __init__(self, bearer_token, mongoCollection):
        self.tweets_search_url = constants.TWEETS_SEARCH_API_ENDPOINT  # API endpoint
        self.tweet_geo_data_url = constants.TWEET_GEO_DATA_API_ENDPOINT
        self.bearer_token = bearer_token  # bearer_token for authentication
        self.query = ""  # query needs to be set using the setQuery() method
        self.queryMetaData = {} # queryMetaData is an obj which describes the query and is automatically constructed when the query is given
        self.queryTag = "" #a human-readable tag for queries (e.g. "regenerative agriculture"). Optionally set in setQuery()
        self.data = {"data":[]}  # dict to store the data
        self.tweets_search_sleep_time = 3.01 # minimum sleep time between requests to avoid hitting the Twitter API's rate limits
        self.geo_data_search_sleep_time = 12.01
        self.mongoCollection = mongoCollection




    '''
	Takes in the 'query' to be sent in the get request and returns a JSON response.
	For the case of Twitter v2.0 academic API, query stands for the request to be sent.
	'''
    def request(self, query: str):
        headers = {
            'authorization': "Bearer {}".format(self.bearer_token),
            'content-type': 'application/json'
        }
        r = requests.get(query, headers=headers)
        return json.loads(r.text)


    ''' 
    By default, the API response attaches data related to the list of authors of the tweets that have been fetched
    to the field "users" within the field "includes" in the API response. This method finds the user data for each tweet
    and attaches it to the tweet itself. 
    '''
    def addUserDataToTweets(self, data):
        tweetsData = data["data"]
        usersData = data["includes"]["users"]
        for userData in usersData:
            userId = userData["id"]
            for tweetData in tweetsData:
                tweetAuthorId = tweetData["author_id"]
                if (tweetAuthorId == userId):
                    tweetData["author_data"] = userData




    ''' 
    This method gets rid of the "includes" field in the data (which includes data about tweets' authors) and it also
    gets rid of the "author_id" field in each tweet's data
    '''
    def getCleanData(self, data):
        # get rid of "includes" field, which contains users data
        cleanedData = {k: v for k, v in data.items() if k != 'includes'}

        # get rid of "autor_id" field from each tweet's data
        for i in range(len(data["data"])):
            cleanedData["data"][i] = {
                k: v for k, v in data["data"][i].items() if k != "author_id"}
        return cleanedData



    '''
    Add to the tweets data about the query that was used to fetch the tweets. 
    '''
    def addQryMetaDataToTweets(self, data):
        tweetsData = data["data"]
        for tweetData in tweetsData:
            tweetData["query_meta_data"] = self.queryMetaData


    '''
	Handles requests involving pagination. While the API response contains a next_token and hence a next page, a new 
    request is made to get the next page, and so on until all tweets have been searched and saved.
	'''
    def search_and_save(self):
        if (self.query == ""):
            raise Exception(
                "Cannot perform a search with an empty query. Please construct a query using the 'setQuery()' method before performing a search.")
        next = True
        query = self.query
        pageNumber = 0
        numTweets = 0

        while next == True:
            #get data
            response = self.request(query)
            #add user data to the tweets data
            self.addUserDataToTweets(response)
            if (self.queryMetaData != {}):
                self.addQryMetaDataToTweets(response)
            #once the user data has been added, clean the tweets by removing the "includes" field as it's no longer needed
            response = self.getCleanData(response)
            try:
                next_token = response['meta']['next_token']
                query = self.query + '&next_token=' + next_token
            except:
                next = False

            #save data
            self.saveTweetsToMongoCollection(tweetsData=response["data"])
            numTweets += len(response["data"])
            pageNumber += 1
            #sleep to avoid hitting the Twitter API's rate limits
            time.sleep(self.tweets_search_sleep_time)
            print(f'Page number: {pageNumber}\n')
        print('Done! ' + str(numTweets) + " tweets were saved!")




    '''
	Takes in:
        - the "query" as a string. e.g. : "(regenerative agriculture OR #regenerativeagriculture) -is:retweet lang:en" 
        - an optional dictionary containing other parameters. e.g. : {"max_results": 500, "tweet_fields":"geo, lang, author_id"}
        - an optional query tag, i.e. a high-level label of a the query. e.g. : "Regenerative Agriculture"
    and performs HTTP encoding of the query and the parameters to constructs a url endpoint for making the api request
    (e.g. of generated string : "https://api.twitter.com/2/tweets/search/all?query=biodiversity&tweet.fields=created_at&expansions=author_id&user.fields=created_at")
    
    Parameters that can be set include: [author_id,referenced_tweets.id,referenced_tweets.id.author_id,entities.mentions.username,attachments.poll_ids,attachments.media_keys,in_reply_to_user_id,geo.place_id]
    Both the query and the parameters dict are formatted as one string that can be used as endpoint to make the API call.
    The query is made up as documented here: https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-query
	and is automatically translated into a urllib parse. Other parameters detailed here https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all.
	'''
    def setQuery(self, query: str, other_parameters={}, queryTag=""):
        qryAsUrl = self.tweets_search_url + quote(query)

        #construct url-like string with params (e.g. "...max_results=500&start_time=20180806T00.00.00")
        if (other_parameters != {}):
            paramKeys = list(other_parameters.keys())
            paramValues = [other_parameters[key] for key in paramKeys]
            paramsAsUrl = ""
            for i in range(len(paramKeys)):
                paramsAsUrl = paramsAsUrl + "&" + paramKeys[i] + "=" + (
                    paramValues[i] if isinstance(paramValues[i], str) else str(paramValues[i]))
            qryAsUrl = qryAsUrl + paramsAsUrl

        self.query = qryAsUrl

        #set the query tag, if specified
        if (queryTag != ""):
            self.queryTag = queryTag
        
        #construct queryMetaData object
        self.constructQueryMetadataObj(query, other_parameters, queryTag)





    ''' 
    Construct a dictionary containing info about the query and other parameters utilized to fetch the data. (The
    fields that contain dots ('.') are handled by replacing the dots with underscores ('_') so that the object can
    later be pushed to mongo).

    example dict generated:
    {
        "query": "(biodiversity loss OR #biodiversityloss) -is:retweet -is:nullcast"
        "tag": "Biodiversity Loss"
        "parameters" : {
            "tweet_fields": "author_id, lang, geo",
            "expansions": "author_id",
            "max_results": 500,
            "user:fields": "name,public_metrics,verified",
            "start_time": "2021-03-01T00:00:00-05:00",
            "end_time": "2021-06-18T00:00:00-05:00"
        }
    }
    '''
    def constructQueryMetadataObj(self, query, other_parameters={}, queryTag=""):
        self.queryMetaData = {
            "query": query
        }
        if (other_parameters != {}):
            self.queryMetaData["parameters"] = {k: v for k, v in other_parameters.items(
            ) if (k != "tweet.fields" and k != "user.fields")}
            self.queryMetaData["parameters"]["tweet_fields"] = other_parameters["tweet.fields"]
            self.queryMetaData["parameters"]["user_fields"] = other_parameters["user.fields"]
        
        if (queryTag != ""):
                self.queryMetaData["tag"] = queryTag



    '''
    Add the current time to tweet data.
    '''
    def addCurrentDateAndTimeToTweetData(self, document):
        currentDateAndTime = str(datetime.datetime.utcnow())
        document["mongo_insertion_time"] = currentDateAndTime



    '''
	Saves the tweets in the mongo collection.
	'''
    def saveTweetsToMongoCollection(self, tweetsData):
        self.mongoCollection.insert_many(tweetsData)

        # optionally, for one-by-one storage:
        # for each tweet, format the tweet data into BSON (the format that Mongo) and insert the tweet into mongo
        """ for tweetData in tweetsData:
                self.addCurrentDateAndTimeToTweetData(tweetData)
                tweetDataBSON = bson.json_util.loads(json.dumps(tweetData))
                self.mongoCollection.insert_one(tweetDataBSON) """
        #however this approach is not recommended:
        #insert_one : approx 70s per page (1 page = 500 tweets)
        #insert_many : approx 1.6s per page !