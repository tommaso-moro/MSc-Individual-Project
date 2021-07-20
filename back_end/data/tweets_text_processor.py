from nltk.tag import mapping
from constants import HASHTAG_SYMBOL, MENTION_SYMBOL, TWEETS_STRINGS_TO_IGNORE, TAGS_STOPWORDS
from helper import get_dict_from_tuples_list, get_average
from textblob import TextBlob
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
from nltk import pos_tag, wordnet, bigrams
from nltk.util import ngrams
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer

from langdetect import detect 

#from polyglot.detect import Detector
#from spacy import displacy
#from spacy_langdetect import LanguageDetector
#from spacy.language import Language


'''
A class to handle the processing and manipulation of tweets' textual data.
'''
class TweetsTextProcessor:
    def __init__(self):
        self.tokenizer = TweetTokenizer()
        self.strings_to_ignore = list(string.punctuation) + stopwords.words('english') + list(wordcloud.STOPWORDS) + TWEETS_STRINGS_TO_IGNORE
        self.hashtags_counter = Counter()
        self.terms_counter = Counter()



    '''
    Return type: str
    '''
    def remove_urls(self, text):
        return re.sub(r"http\S+", "", text)


    '''
    Individual text-cleaning operations can be disabled when calling the function by setting them to False.

    Return type: str
    '''
    def clean_text(self, text, remove_emojis=True, remove_punctuation=True, remove_hashtags=True, remove_mentions=True, lower=True, remove_urls=True):
        cleaned_text = self.remove_emojis(text) if remove_emojis else text
        cleaned_text = self.remove_punctuation(cleaned_text) if remove_punctuation else cleaned_text
        cleaned_text = self.remove_hashtags(cleaned_text) if remove_hashtags else cleaned_text
        cleaned_text = self.remove_mentions(cleaned_text) if remove_mentions else cleaned_text
        cleaned_text = self.remove_urls(cleaned_text) if remove_urls else cleaned_text
        cleaned_text = cleaned_text.lower() if lower else cleaned_text
        return cleaned_text


    '''
    Return type: str
    '''
    def remove_punctuation(self, text):
        cleaned_text  = "".join([char for char in text if char not in string.punctuation])
        cleaned_text = re.sub('[0-9]+', '', cleaned_text)
        return cleaned_text


    '''
    Return type: list
    '''
    def get_hashtags(self, text):
        tokenized_text = self.tokenize_text(text)
        hashtags = [term for term in tokenized_text if ((term.startswith(HASHTAG_SYMBOL)) and (term != HASHTAG_SYMBOL))]
        return hashtags


    '''
    Return type: str
    '''
    def remove_hashtags(self, text):
        tokenized_text = self.tokenize_text(text)
        hashtags = self.get_hashtags(text)
        return " ".join([word for word in tokenized_text if word not in hashtags])


    '''
    Return type: list
    '''
    def get_mentions(self, text):
        tokenized_text = self.tokenize_text(text)
        mentions = [term for term in tokenized_text if ((term.startswith(MENTION_SYMBOL)) and (term != MENTION_SYMBOL))]
        return mentions


    '''
    Return type: str
    '''
    def remove_mentions(self, text):
        tokenized_text = self.tokenize_text(text)
        mentions = self.get_mentions(text)
        return " ".join([word for word in tokenized_text if word not in mentions])


    '''
    Return type: str
    '''
    def remove_emojis(self, text):
        return demoji.replace(text,"")
        

    '''
    Return type: list
    '''
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


    '''
    Return type: wordnet tag (or None)
    '''
    def nltk_tag_to_wordnet_tag(self, nltk_tag): 
        mapping = { #dictionary to map nltk_tags to wordnet_tag
            "J": wordnet.ADJ,
            "N": wordnet.NOUN,
            "V": wordnet.VERB,
            "R": wordnet.ADV
        }
        return mapping[nltk_tag[0]] if nltk_tag[0] in mapping.keys() else None #return the wordnet tags


    '''
    Return type: list (a list of lemmatized words)
    '''
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


    '''
    Return type: str

    Note: if this method is not called on a text where hashtags and mentions have already been removed, they will
          also be removed/replaced.
    '''
    #to call after hashtags and mentions have been removed, otherwise they'll also be replaced
    def remove_tag_related_terms(self, text, tag):
        new_text = text
        for term in TAGS_STOPWORDS[tag]:
            new_text = new_text.replace(term, '')
        return new_text
    

    '''
    Return type: list (a list of words)
    '''
    def tokenize_text(self, text):
        return self.tokenizer.tokenize(text)


    '''
    Return type: list (a list of words)
    '''
    def preprocess_text(self, text):
        tokenized_text = self.tokenize_text(text.lower()) #turn text into lowercase and tokenize it
        lemmatized_text = self.lemmatize_text(tokenized_text) #lemmatize text
        return lemmatized_text


    '''
    Return type: dict 

    The keys are hashtags and the values are their frequencies. Keys are ordered in descending order (i.e. from most
    frequent to least frequent hashtag)
    e.g. : {
        "#electriccars": 12,
        "#circulareconomy": 8,
        "#solarpanels": 5
    }

    Returns frequencies fo all hashtags if -1 is passed as input for num_most_common
    '''
    def get_most_common_hashtags_from_text(self, text, num_most_common=20):
        tokenized_text = self.tokenize_text(text) #.lower() is not called on the text because case sensitivity needs to be preserved for hashtag analysis
        hashtags = [term for term in tokenized_text if term.startswith(HASHTAG_SYMBOL)] 
        self.hashtags_counter.update(hashtags)
        if (num_most_common == -1):
            most_common_hashtags_tuples = self.hashtags_counter.most_common()
        else:
            most_common_hashtags_tuples = self.hashtags_counter.most_common(num_most_common)
        return get_dict_from_tuples_list(most_common_hashtags_tuples)


    '''
    Return type: dict 

    The keys are terms and the values are their frequencies. Keys are ordered in descending order (i.e. from most
    frequent to least frequent term)
    e.g. : {
        "Forest": 12,
        "plants": 8,
        "pollution": 5
    }
    '''
    def get_most_common_terms_from_text(self, text, num_most_common=50):
        preprocessed_text = self.preprocess_text(text)
        terms = [term for term in preprocessed_text if term not in self.strings_to_ignore and not (term.startswith((HASHTAG_SYMBOL, MENTION_SYMBOL)) or (len(term)<3))]  #no mentions, no hashtags
        self.terms_counter.update(terms)
        most_common_terms_tuples = self.terms_counter.most_common(num_most_common)
        return get_dict_from_tuples_list(most_common_terms_tuples)


    
    '''
    Return type: dict 
    '''
    def extract_entities_frequencies_from_tweets(self, tweets):
        #get list of cleaned tweets
        cleaned_tweets = []
        for tweet in tweets:
            if self.text_is_in_english(tweet["text"]):
                cleaned_text = self.clean_text(tweet["text"], lower=False)
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


    '''
    Return type: dict

    e.g. : {
        "@elonmusk": 733,
        "@gretathunberg": 655,
        ...
    }
    '''
    def get_most_mentioned_accounts(self, text, num_most_common = 10):
        mentions_counter = Counter()
        mentions = self.get_mentions(text)
        mentions_counter.update(mentions)
        most_common_mentioned_accounts_tuples = mentions_counter.most_common(num_most_common)
        return get_dict_from_tuples_list(most_common_mentioned_accounts_tuples)

    
    '''
    Return type: float ranging from 0 (not subjective) to 1 (very subjective)

    Requires a string which - after cleaning - must be at least 3 characters long. Returns -1 if the string is less than 3 characters long.
    '''
    def get_text_subjectivity_score(self, text, num_digits = 2):
        cleaned_text = self.clean_text(text)
        if (len(cleaned_text) < 3):
            return -1
        subjectivity_score = TextBlob(cleaned_text).sentiment.subjectivity
        return round(subjectivity_score, num_digits)


    '''
    Return type: float
    '''
    def get_avg_subjectivity_score_from_tweets(self, tweet_texts, digits=2):
        subj_scores = []
        for tweet_text in tweet_texts:
            subj_score = self.get_text_subjectivity_score(tweet_text)
            subj_scores.append(subj_score)
        return get_average(subj_scores, digits)


    '''
    Return type: boolean
    '''
    def text_is_in_english(self, text):
        try:
            return (detect(text) == "en") #return True if language is detected as English, False otherwise
        except:
            return False #if there are errors trying to detect the language (e.g. the text is only a few characters long) return False


    def construct_hashtags_cooccurrences_dict(self, tweets):
        all_hashtags = []
        dict = {}
        for tweet in tweets:
            tweet_text = tweet["text"]
            hashtags = self.get_hashtags(tweet_text)
            for hashtag in hashtags:
                if hashtag not in all_hashtags:
                    all_hashtags.append(hashtag)
            for ht_one in hashtags: #for each hashtag
                for ht_two in hashtags: #loop through the other hashtags in the same tweet and add 1 to the ht_one-ht_two relationship in the dict
                    if (ht_two != ht_one):
                        if (ht_one in dict):
                            if ht_two in dict[ht_one]:
                                dict[ht_one][ht_two] += 1
                            else:
                                dict[ht_one][ht_two] = 1 
                        else:
                            dict[ht_one] = {}
                            dict[ht_one][ht_two] = 1
        return dict


    