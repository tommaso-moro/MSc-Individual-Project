const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mostInfluentialTweetsSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
        unique: true
    },
    most_liked_tweets: {
        type: Array, 
        required: true
    },
    most_retweeted_tweets: {
        type: Array, 
        required: true
    },
    months: {
        month: { 
            type: String, required: true 
        },
        most_liked_tweets: {
            type: Array, 
            required: true
        },
        most_retweeted_tweets: {
            type: Array, 
            required: true
        }
    }
})

const MostInfluentialTweetsSchema = mongoose.model('MostInfluentialTweetsSchema', mostInfluentialTweetsSchema, 'most_influential_tweets')

module.exports = MostInfluentialTweetsSchema