const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const monthlyBatchSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true
    },
    tags: {
        type: Schema.Types.Mixed, 
        required: true,
        unique: true
    },
    num_tweets: {
        type: Number,
        required: true
    },
    num_tweets_with_geo_data: {
        type: Number,
        required: true
    },
    percentage_tweets_with_geo_data: {
        type: Number,
        required: true
    },
    num_users: {
        type: Number,
        required: true
    },
    percentage_verified_users: {
        type: Number,
        required: true
    }

})

const MonthlyBatch = mongoose.model('MonthlyBatch', monthlyBatchSchema, 'monthly_batches_dev')

module.exports = MonthlyBatch