const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagsPopularityDataSchema = new mongoose.Schema({
    tag: {
        type: String, 
        required: true
    },
    months: {
        type: Array,
        required: true,
        unique: true
    },
    months_normalized: {
        type: Array,
        required: true,
        unique: true
    },
    num_tweets: {
        type: Number, 
        required: true,
        unique: true
    }
})

const TagsPopularityDataSchema = mongoose.model('TagsPopularityDataSchema', tagsPopularityDataSchema, 'tags_popularity_col')

module.exports = TagsPopularityDataSchema