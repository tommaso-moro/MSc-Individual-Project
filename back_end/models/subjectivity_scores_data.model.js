const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subjectivityScoresDataSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
        unique: true
    },
    num_scores: {
        type: Number, 
        required: true
    },
    avg_score: {
        type: Number,
        required: true
    },
    scores: {
        type: Array, 
        required: true
    },
    scaled_scores: {
        type: Array, 
        required: true
    },
    monthly_scaled_scores: {
        type: Array,
        required: true
    }
})

const SubjectivityScoresDataSchema = mongoose.model('SubjectivityScoresDataSchema', subjectivityScoresDataSchema, 'subjectivity_scores_col_v2')

module.exports = SubjectivityScoresDataSchema