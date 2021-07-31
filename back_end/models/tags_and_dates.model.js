const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagsAndDatesDataSchema = new mongoose.Schema({
    dates: {
        type: Array,
        required: true,
        unique: true
    },
    start_date: {
        type: String, 
        required: true
    },
    end_date: {
        type: String, 
        required: true
    },
    tags: {
        type: Array, 
        required: true
    }
})

const TagsAndDatesDataSchema = mongoose.model('TagsAndDatesDataSchema', tagsAndDatesDataSchema, 'tags_and_dates')

module.exports = TagsAndDatesDataSchema