const router = require('express').Router();
let DailyBatch = require('../models/tweets_daily_batch.model');

// create application/json parser
 
// create application/x-www-form-urlencoded parser

router.route('/').get((req, res) => {
    DailyBatch.find()
        .then(batches => res.json(batches))
        .catch(err => res.status(400).json('Error: ' + err));
});

/*
GET call to fetch num_tweets by tag (e.g. "Clean Tech") and date (e.g. "2021-05-07").

Requires the following JSON-style dict to be passed: 
{
  "tag": ...,
  "date": ...
}
where "tag" is a valid tag name and "date" is a valid date (passed as String)
*/
router.route('/num_tweets_by_tag_and_date/').get(async (req, res) => {
    try {
      const tag = req.query.tag; //replace query with params for it to work in insomnia?
      const date = req.query.date;
      const tag_num_tweets_field = "tags." + tag + ".num_tweets"
      const num_tweets_data = await DailyBatch.findOne({"date": date}, {[tag_num_tweets_field]: 1, "_id": 0});
      //const data = cursor["tags"][tag]["num_tweets"]);
      res.json(num_tweets_data)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  router.route('/daily_calendar_data_by_tag/').get(async (req, res) => {
      try {
        const calendar_data = {
          "start_date": "",
          "end_date": "",
          "data": []
        }
        const tag = req.query.tag; //replace query with params for it to work in insomnia?
        const days = await DailyBatch.distinct("date");
        const tag_num_tweets_field = "tags." + tag + ".num_tweets"
        const start_date = days[0];
        const end_date = days[days.length - 1];
        for (var i = 0; i < days.length; i++) {
            const num_tweets = await DailyBatch.findOne({"date": days[i]}, {[tag_num_tweets_field]: 1, "_id": 0});
            const day_dict = {
              "day": days[i],
              "value": num_tweets["tags"][tag]["num_tweets"]
          }
          calendar_data["data"].push(day_dict)
        }
        calendar_data["start_date"] = start_date;
        calendar_data["end_date"] = end_date;
        res.json(calendar_data)
      } catch (err) {
        console.log(err)
        res.status(400).json({
          errors: {
            global: "An error occurred."
          }
        })
      }
    });


  
module.exports = router;