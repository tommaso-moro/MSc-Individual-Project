from nltk.tag import mapping
from constants import HASHTAG_SYMBOL, MENTION_SYMBOL, TWEETS_STRINGS_TO_IGNORE, TAGS_STOPWORDS
import pandas as pd
import matplotlib.pyplot as plt
import wordcloud
import re
from collections import Counter
import string

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


    def clean_text(self, text):
        # Convert everything to lowercase
        cleaned_text = text.lower() 
        
        # Remove mentions   
        cleaned_text = re.sub('@[\w]*','',cleaned_text)  
        
        # Remove urls
        cleaned_text = re.sub(r'https?:\/\/.*\/\w*', '', cleaned_text)   
        
        # Remove numbers
        cleaned_text = re.sub(r'\d+', '', cleaned_text)  
        
        # Remove punctuation
        cleaned_text = re.sub(r"[,.;':@#?!\&/$]+\ *", ' ', cleaned_text)                     
        
        return cleaned_text


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
        most_common_hashtags_dict = {}
        for hashtag_frequency_tuple in most_common_hashtags_tuples:
            most_common_hashtags_dict[hashtag_frequency_tuple[0]] = hashtag_frequency_tuple[1]
        return most_common_hashtags_dict



    def get_most_common_terms_from_text(self, text, num_most_common=50):
        preprocessed_text = self.preprocess_text(text)
        terms = [term for term in preprocessed_text if term not in self.strings_to_ignore and not (term.startswith((HASHTAG_SYMBOL, MENTION_SYMBOL)) or (len(term)<3))]  #no mentions, no hashtags
        self.terms_counter.update(terms)
        most_common_terms_tuples = self.terms_counter.most_common(num_most_common)
        most_common_terms_dict = {}
        for term_frequency_tuple in most_common_terms_tuples:
            most_common_terms_dict[term_frequency_tuple[0]] = term_frequency_tuple[1]
        return most_common_terms_dict

    



    