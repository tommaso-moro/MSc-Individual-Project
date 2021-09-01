const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const db_address = process.env.MONGO_DB_ADDRESS
const db_name = encodeURIComponent(process.env.MONGO_DB_NAME)
const db_username = encodeURIComponent(process.env.MONGO_DB_USERNAME)
const db_password = encodeURIComponent(process.env.MONGO_DB_PASSWORD)
const auth_mechanism = "SCRAM-SHA-1";


app.use(cors());
app.use(express.json());

const uri = 'mongodb://' + db_username + ':' + db_password + '@' + db_address + '/' + db_name 

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
})

const monthlyBatchesRouter = require('./routes/monthly_batches')
const dailyBatchesRouter = require('./routes/daily_batches')
const lineChartMonthlyDataRouter = require('./routes/line_chart_monthly_data')
const geoSpatialDataRouter = require('./routes/geo_spatial_data.js')
const tagsAndDatesRouter = require('./routes/tags_and_dates.js')
const mostInfluentialTweetsRouter = require('./routes/most_influential_tweets.js')
const subjectivityScoresDataRouter = require('./routes/subjectivity_scores.js')
const wordCloudDataRouter = require('./routes/wordcloud.js')
const mentionsAndHashtagsDataRouter = require('./routes/mentions_and_hashtags.js')
const tagsPopularityDataRouter = require('./routes/tags_popularity.js')



app.use('/api/monthly_batches', monthlyBatchesRouter);
app.use('/api/daily_batches', dailyBatchesRouter);
app.use('/api/line_chart_monthly_data', lineChartMonthlyDataRouter);
app.use('/api/geo_spatial_data', geoSpatialDataRouter);
app.use('/api/tags_and_dates', tagsAndDatesRouter);
app.use('/api/most_influential_tweets', mostInfluentialTweetsRouter);
app.use('/api/subjectivity_scores', subjectivityScoresDataRouter);
app.use('/api/wordcloud', wordCloudDataRouter);
app.use('/api/mentions_and_hashtags', mentionsAndHashtagsDataRouter);
app.use('/api/tags_popularity', tagsPopularityDataRouter);

app.use(express.static('public'));
app.get('*', (req,res) =>{    
    res.sendFile(__dirname+'/public/index.html');
});

app.listen(port, () => {
    console.log('Server is running on port', port);
});

