const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mentionsAndHashtagsSchema = new mongoose.Schema({
    tag: {
        type: String, 
        required: true,
        unique: true
    },
    hashtags: {
        type: Array,
        required: true,
        unique: true
    },
    mentions: {
        type: Array,
        required: true,
        unique: true
    },
    months: {
        type: Array,
        required: true,
        unique: true
    }
})

const MentionsAndHashgtagsData = mongoose.model('MentionsAndHashgtagsData', mentionsAndHashtagsSchema, 'popular_mentions_and_hashtags')

module.exports = MentionsAndHashgtagsData