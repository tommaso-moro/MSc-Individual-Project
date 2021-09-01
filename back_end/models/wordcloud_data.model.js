const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wordCloudDataSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
    },
    months: {
        type: Array, 
        required: true,
    },
    overall_terms_frequencies: {
        type: Array,
        required: true
    }

})

const WordCloudData = mongoose.model('WordCloudData', wordCloudDataSchema, 'wordcloud_data_collection')

module.exports = WordCloudData