import pymongo

'''
A class created to simplify accessing mongo collections.
example usage:

import mongo_client

client_mongo = mongo_client.MongoClient(MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME, MONGO_DB_ADDRESS)
my_collection = client_mongo.getMongoCollection(my_collection_name)

'''
class MongoClient:
    def __init__(self, mongo_db_username, mongo_db_psw, mongo_db_name, mongo_db_address):
        self.mongo_db_username = mongo_db_username
        self.mongo_db_psw = mongo_db_psw
        self.mongo_db_name = mongo_db_name
        self.mongo_db_address = mongo_db_address

    def getMongoCollection(self, collection_name):
        mongo_client = pymongo.MongoClient(
                                    self.mongo_db_address,
                                    username = self.mongo_db_username,
                                    password = self.mongo_db_psw,
                                    authSource = self.mongo_db_name,
                                    authMechanism = 'SCRAM-SHA-1'
                                    )
        mongo_db = mongo_client.get_database(self.mongo_db_name)
        mongo_col = mongo_db[collection_name]
        return mongo_col
