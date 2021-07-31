const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dailyBatchSchema = new mongoose.Schema({
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
    }
})

const DailyBatch = mongoose.model('DailyBatch', dailyBatchSchema, 'daily_batches_prod')

module.exports = DailyBatch