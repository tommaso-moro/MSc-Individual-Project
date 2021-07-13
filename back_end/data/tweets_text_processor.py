from nltk.tag import mapping
from constants import HASHTAG_SYMBOL, MENTION_SYMBOL, TWEETS_STRINGS_TO_IGNORE, TAGS_STOPWORDS
from helper import get_dict_from_tuples_list
import pandas as pd
import matplotlib.pyplot as plt
import wordcloud
import re
from collections import Counter
import string
import demoji

import spacy
nlp = spacy.load("en_core_web_sm")

from nltk.tokenize import TweetTokenizer
from nltk import pos_tag, wordnet
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer



class TweetsTextProcessor:
    def __init__(self):
        self.tokenizer = TweetTokenizer()
        self.strings_to_ignore = list(string.punctuation) + stopwords.words('english') + list(wordcloud.STOPWORDS) + TWEETS_STRINGS_TO_IGNORE
        self.hashtags_counter = Counter()
        self.terms_counter = Counter()



    def get_dataframe_from_csv(self, filepath, sep='\t'):
        df = pd.read_csv("../../../stuff/processedData.csv", sep=sep)
        return df


    def get_tweets_text_from_dataframe(self, df):
        return df.text

    
    def get_tweets_text_from_mongo_cursor(self, cursor):
        text = ""
        for doc in list(cursor):
            text = text + " " + doc["text"]
        return text


    def remove_punctuation(self, text):
        cleaned_text  = "".join([char for char in text if char not in string.punctuation])
        cleaned_text = re.sub('[0-9]+', '', cleaned_text)
        return cleaned_text

    def get_hashtags(self, text):
        tokenized_text = self.tokenize_text(text)
        hashtags = [term for term in tokenized_text if term.startswith(HASHTAG_SYMBOL)]
        return hashtags

    def remove_hashtags(self, text):
        tokenized_text = self.tokenize_text(text)
        hashtags = self.get_hashtags(text)
        return " ".join([word for word in tokenized_text if word not in hashtags])

    def get_mentions(self, text):
        tokenized_text = self.tokenize_text(text)
        mentions = [term for term in tokenized_text if term.startswith(MENTION_SYMBOL)]
        return mentions

    def remove_mentions(self, text):
        tokenized_text = self.tokenize_text(text)
        mentions = self.get_mentions(text)
        return " ".join([word for word in tokenized_text if word not in mentions])


    def remove_emojis(self, text):
        return demoji.replace(text,"")

    def compute_strings_to_ignore_by_tag(self, tag):
        return (self.strings_to_ignore + TAGS_STOPWORDS[tag]) if tag in TAGS_STOPWORDS else self.strings_to_ignore


    def save_wordcloud_to_file(self, filepath, word_cloud):
        word_cloud.to_file(filepath)

    
    def display_wordcloud_from_text(self, text, tag="", width=2400, height=1600, max_words=100, background_color="white"):
        stopwords = self.strings_to_ignore
        if (tag != "" and tag in TAGS_STOPWORDS.keys()):
            stopwords = stopwords + self.strings_to_ignore + TAGS_STOPWORDS[tag]
        word_cloud = wordcloud.WordCloud(width=width, height=height, stopwords=stopwords, max_words=max_words, background_color=background_color).generate(text)
        plt.imshow(word_cloud, interpolation='bilinear')
        plt.axis("off")
        plt.show()


    def nltk_tag_to_wordnet_tag(self, nltk_tag): 
        mapping = { #dictionary to map nltk_tags to wordnet_tag
            "J": wordnet.ADJ,
            "N": wordnet.NOUN,
            "V": wordnet.VERB,
            "R": wordnet.ADV
        }
        return mapping[nltk_tag[0]] if nltk_tag[0] in mapping.keys() else None #map nltk_tag to wordnet_tag 


    def lemmatize_text(self, text_words):
        lemmatized_text = []
        pos_tags = pos_tag(text_words) #get nltk tags for each word 
        wordnet_pos_tags = map(lambda x: (x[0], self.nltk_tag_to_wordnet_tag(x[1])), pos_tags) #convert nltk tags into wordnet tags
        for word, tag in wordnet_pos_tags:
            if tag is None:
                #if there is no available tag, append the token as is
                lemmatized_text.append(word)
            else:        
                #else use the tag to lemmatize the token
                lemmatized_text.append(WordNetLemmatizer().lemmatize(word, tag))
        #return " ".join(lemmatized_text) #return the lemmatized text as string
        return lemmatized_text


    #to call after hashtags and mentions have been removed, otherwise they'll also be replaced
    def remove_tag_related_terms(self, text, tag):
        new_text = text
        for term in TAGS_STOPWORDS[tag]:
            new_text = new_text.replace(term, '')
        return new_text
    

    def tokenize_text(self, text):
        return self.tokenizer.tokenize(text)


    def preprocess_text(self, text):
        tokenized_text = self.tokenize_text(text.lower()) #turn text into lowercase and tokenize it
        lemmatized_text = self.lemmatize_text(tokenized_text) #lemmatize text
        return lemmatized_text


    def get_most_common_hashtags_from_text(self, text, num_most_common=20):
        tokenized_text = self.tokenize_text(text) #.lower() is not called on the text because case sensitivity needs to be preserved for hashtag analysis
        hashtags = [term for term in tokenized_text if term.startswith(HASHTAG_SYMBOL)] 
        self.hashtags_counter.update(hashtags)
        most_common_hashtags_tuples = self.hashtags_counter.most_common(num_most_common)
        return get_dict_from_tuples_list(most_common_hashtags_tuples)



    def get_most_common_terms_from_text(self, text, num_most_common=50):
        preprocessed_text = self.preprocess_text(text)
        terms = [term for term in preprocessed_text if term not in self.strings_to_ignore and not (term.startswith((HASHTAG_SYMBOL, MENTION_SYMBOL)) or (len(term)<3))]  #no mentions, no hashtags
        self.terms_counter.update(terms)
        most_common_terms_tuples = self.terms_counter.most_common(num_most_common)
        return get_dict_from_tuples_list(most_common_terms_tuples)



    
    def extract_entities_frequencies_from_tweets(self, tweets):
        #get list of cleaned tweets
        cleaned_tweets = []
        for tweet in tweets:
            text = tweet["text"]
            cleaned_text = self.remove_emojis(text)
            cleaned_text = self.remove_punctuation(cleaned_text)
            cleaned_text = self.remove_hashtags(cleaned_text)
            cleaned_text = self.remove_mentions(cleaned_text)
            cleaned_tweets.append(cleaned_text)

        docs = list(nlp.pipe(cleaned_tweets))

        #entities can be: people. organizations, locations
        people = []
        organizations = []
        locations = []

        #set up counters for each entity
        people_counter = Counter()
        organizations_counter = Counter()
        locations_counter = Counter()

        for item in docs:
            for x in item.ents:
                if (x.label_== 'PERSON'):
                    people.append(x.text)
                elif (x.label_ == 'ORG'):
                    organizations.append(x.text)
                elif (x.label_ == 'GPE'):
                    locations.append(x.text)

        people_counter.update(people)
        organizations_counter.update(organizations)
        locations_counter.update(locations)

        entities_frequencies_doc = {
            "people": get_dict_from_tuples_list(people_counter.most_common(10)),
            "organizations": get_dict_from_tuples_list(organizations_counter.most_common(10)),
            "locations": get_dict_from_tuples_list(locations_counter.most_common(10))
        }
        return entities_frequencies_doc



    def get_most_mentioned_accounts(self, text, num_most_common = 10):
        mentions_counter = Counter()
        mentions = self.get_mentions(text)
        mentions_counter.update(mentions)
        most_common_mentioned_accounts_tuples = mentions_counter.most_common(num_most_common)
        return get_dict_from_tuples_list(most_common_mentioned_accounts_tuples)





    