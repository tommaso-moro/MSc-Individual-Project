const router = require('express').Router();
let MostInfluentialTweets = require('../models/most_influential_tweets.model');



router.route('/').get(async (req, res) => {
    await MostInfluentialTweets.find()
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/most_liked_tweets_by_tag').get(async (req, res) => {
    try {
        const tag = req.query.tag;
        const doc = await MostInfluentialTweets.findOne({"tag": tag})
        res.json(doc["most_liked_tweets"])
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
});


router.route('/most_retweeted_tweets_by_tag').get(async (req, res) => {
    try {
        const tag = req.query.tag;
        const doc = await MostInfluentialTweets.findOne({"tag": tag})
        res.json(doc["most_retweeted_tweets"])
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