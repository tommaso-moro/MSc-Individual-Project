const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lineChartMonthlyDataSchema = new mongoose.Schema({
    dates: {
        type: Array,
        required: true,
        unique: true
    },
    num_tweets: {
        type: Schema.Types.Mixed, 
        required: true,
        unique: true
    }
})

const LineChartMonthlyData = mongoose.model('LineChartMonthlyData', lineChartMonthlyDataSchema, 'line_chart_dev')

module.exports = LineChartMonthlyData