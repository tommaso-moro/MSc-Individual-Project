import pandas as pd
import matplotlib.pyplot as plt


class BatchesDataExplorer:
    def __init__(self, mongo_collection):
        self.mongo_collection = mongo_collection

    def getMongoCollectionAsPandasDataFrame(self):
        cursor_list = list(self.mongo_collection.find({}))
        return pd.json_normalize(cursor_list) #returns flattened data

    def histPlotNumTweetsByTweetTag(self, df):
        temp = df[[c for c in df if c.endswith(".num_tweets")]]
        df.plot(x='date', y=temp.columns)
        plt.show()

    def histPlotNumTweetsByDate(self, df):
        temp = df[[c for c in df if (c == "num_tweets")]]
        df.plot(x='date', y=temp.columns)
        plt.show()

    def histPlotPercentageOfVerifiedUsersByDate(self, df):
        temp = df[[c for c in df if (c == "percentage_verified_users")]]
        df.plot(x='date', y=temp.columns)
        plt.show()

    def histPlotPercentageOfVerifiedUsersByTag(self, df):
        temp = df[[c for c in df if (c.endswith(".percentage_verified_users") and c.startswith('tags.'))]]
        df.plot(x='date', y=temp.columns)
        plt.show()

    def histPlotPercentageOfTweetsWithGeoDataByTag(self, df):
        temp = df[[c for c in df if (c.endswith(".percentage_tweets_with_geo_data") and c.startswith('tags.'))]]
        df.plot(x='date', y=temp.columns)
        plt.show()

    def histPlotPercentageOfTweetsWithGeoDataByDate(self, df):
        temp = df[[c for c in df if (c == "percentage_tweets_with_geo_data")]]
        df.plot(x='date', y=temp.columns)
        plt.show()

