const router = require('express').Router();
let TagsPopularity = require('../models/tags_popularity.model');

router.route('/').get(async (req, res) => {
    await TagsPopularity.find()
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/num_tweets_by_tag').get(async (req, res) => {
    try {
        const tag = req.query.tag;
        const doc = await TagsPopularity.findOne({"tag": tag}, {"_id": 0})
        doc.months.reverse()
        res.json(doc)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
});

router.route('/num_tweets_by_tags').get(async (req, res) => {
  try {
      const tags = req.query.tags;
      var result = []
      for (var i = 0; i < tags.length; i++) {
        const tag = tags[i];
        var tag_dict = {
          "tag": tag,
          "num_tweets": 0
        }
        const doc = await TagsPopularity.findOne({"tag": tag}, {"_id": 0})
        var tag_num_tweets = 0
        for (var j = 0; j < doc.months.length; j++) {
          var num_tweets_month = doc.months[j].num_tweets;
          tag_num_tweets += num_tweets_month
        }
        tag_dict.num_tweets = tag_num_tweets
        result.push(tag_dict)
      }
      res.json(result)
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