const router = require('express').Router();
let MonthlyBatch = require('../models/tweets_monthly_batch.model');

router.route('/').get((req, res) => {
    MonthlyBatch.find()
        .then(batches => res.json(batches))
        .catch(err => res.status(400).json('Error: ' + err));
});

/*
GET call to fetch num_tweets by tag (e.g. "Clean Tech") and date (e.g. "2021-05").

Requires the following JSON-style dict to be passed: 
{
  "tag": ...,
  "date": ...
}
where "tag" is a valid tag name and "date" is a valid date (passed as String)
*/
router.route('/num_tweets_by_tag_and_date').get(async (req, res) => {
    try {
      const tag = req.body.tag;
      const date = req.body.date;
      const tag_num_tweets_field = "tags." + tag + ".num_tweets"
      const num_tweets_data = await MonthlyBatch.findOne({"date": date}, {[tag_num_tweets_field]: 1, "_id": 0});
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


  router.route('/percentage_tweets_with_geo_data_by_tag_and_date').get(async (req, res) => {
    try {
      const tag = req.body.tag;
      const date = req.body.date;
      const tag_percentage_tweets_with_geo_data_field = "tags." + tag + ".percentage_tweets_with_geo_data"
      const percentage_tweets_with_geo_data_data = await MonthlyBatch.findOne({"date": date}, {[tag_percentage_tweets_with_geo_data_field]: 1, "_id": 0});
      res.json(percentage_tweets_with_geo_data_data)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  router.route('/percentage_verified_users_by_tag_and_date').get(async (req, res) => {
    try {
      const tag = req.body.tag;
      const date = req.body.date;
      const tag_percentage_verified_users_field = "tags." + tag + ".percentage_verified_users"
      const percentage_verified_users_data = await MonthlyBatch.findOne({"date": date}, {[tag_percentage_verified_users_field]: 1, "_id": 0});
      res.json(percentage_verified_users_data)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  router.route('/most_frequent_terms_by_tag_and_date').get(async (req, res) => {
    try {
      const tag = req.body.tag;
      const date = req.body.date;
      const tag_most_frequent_terms_field = "tags." + tag + ".tweets_text_data.terms_frequencies"
      const most_frequent_terms_data = await MonthlyBatch.findOne({"date": date}, {[tag_most_frequent_terms_field]: 1, "_id": 0});
      res.json(most_frequent_terms_data)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  router.route('/most_frequent_hashtags_by_tag_and_date').get(async (req, res) => {
    try {
      const tag = req.body.tag;
      const date = req.body.date;
      const tag_most_frequent_hashtags_field = "tags." + tag + ".tweets_text_data.hashtags_frequencies"
      const most_frequent_hashtags_data = await MonthlyBatch.findOne({"date": date}, {[tag_most_frequent_hashtags_field]: 1, "_id": 0});
      res.json(most_frequent_hashtags_data)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  router.route('/most_mentioned_accounts_by_tag_and_date').get(async (req, res) => {
    try {
      const tag = req.body.tag;
      const date = req.body.date;
      const tag_most_mentioned_accounts_field = "tags." + tag + ".most_mentioned_accounts"
      const most_mentioned_accounts_data = await MonthlyBatch.findOne({"date": date}, {[tag_most_mentioned_accounts_field]: 1, "_id": 0});
      res.json(most_mentioned_accounts_data)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  router.route('/subjectivity_data_by_tag_and_date').get(async (req, res) => {
    try {
      const tag = req.body.tag;
      const date = req.body.date;
      const subjectivity_data_field = "tags." + tag + ".subjectivity_analysis"
      const subjectivity_data_data = await MonthlyBatch.findOne({"date": date}, {[subjectivity_data_field]: 1, "_id": 0});
      res.json(subjectivity_data_data)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  router.route('/most_liked_tweets_by_tag_and_date').get(async (req, res) => {
    try {
      const tag = req.body.tag;
      const date = req.body.date;
      const most_liked_tweets_field = "tags." + tag + ".most_liked_tweets"
      const most_liked_tweets_data = await MonthlyBatch.findOne({"date": date}, {[most_liked_tweets_field]: 1, "_id": 0});
      res.json(most_liked_tweets_data)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });



  router.route('/most_retweeted_tweets_by_tag_and_date').get(async (req, res) => {
    try {
      const tag = req.body.tag;
      const date = req.body.date;
      const most_retweeted_tweets_field = "tags." + tag + ".most_retweeted_tweets"
      const most_retweeted_tweets_data = await MonthlyBatch.findOne({"date": date}, {[most_retweeted_tweets_field]: 1, "_id": 0});
      res.json(most_retweeted_tweets_data)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  router.route('/place_ids_data_by_tag_and_date').get(async (req, res) => {
    try {
      const tag = req.body.tag;
      const date = req.body.date;
      const place_ids_data_field = "tags." + tag + ".geo_data.place_ids"
      const place_ids_data_data = await MonthlyBatch.findOne({"date": date}, {[place_ids_data_field]: 1, "_id": 0});
      res.json(place_ids_data_data)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  router.route('/num_tweets_by_date').get(async (req, res) => {
    try {
      const date = req.body.date;
      const num_tweets_data = await MonthlyBatch.findOne({"date": date}, {"num_tweets": 1, "_id": 0});
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


  router.route('/num_users_by_date').get(async (req, res) => {
    try {
      const date = req.body.date;
      const num_users_data = await MonthlyBatch.findOne({"date": date}, {"num_users": 1, "_id": 0});
      res.json(num_users_data)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });

  router.route('/percentage_verified_users_by_date').get(async (req, res) => {
    try {
      const date = req.body.date;
      const percentage_verified_users_data = await MonthlyBatch.findOne({"date": date}, {"percentage_verified_users": 1, "_id": 0});
      res.json(percentage_verified_users_data)
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