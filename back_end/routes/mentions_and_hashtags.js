const router = require('express').Router();
let MentionsAndHashtags = require('../models/mentions_and_hashtags.model');



router.route('/').get(async (req, res) => {
    await MentionsAndHashtags.find()
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/overall_mentions_by_tag').get(async (req, res) => {
    try {
      const tag = req.query.tag;
      var mention_labels = []
      var mention_data =[]
      const doc = await MentionsAndHashtags.findOne({"tag": tag}, {"mentions": 1})
      mention_labels = Object.keys(doc["mentions"][0])
      for (var i = 0; i < Object.keys(doc["mentions"][0]).length; i++) {
            mention_data.push(doc["mentions"][0][mention_labels[i]])
      }
      const mentions = {
          "mention_labels": mention_labels,
          "mention_data": mention_data
      }
      res.json(mentions)

    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  router.route('/overall_hashtags_by_tag').get(async (req, res) => {
    try {
      const tag = req.query.tag;
      var hashtag_labels = []
      var hashtag_data =[]
      const doc = await MentionsAndHashtags.findOne({"tag": tag}, {"hashtags": 1})
      hashtag_labels = Object.keys(doc["hashtags"][0])
      for (var i = 0; i < Object.keys(doc["hashtags"][0]).length; i++) {
            hashtag_data.push(doc["hashtags"][0][hashtag_labels[i]])
      }
      const hashtags = {
          "hashtag_labels": hashtag_labels,
          "hashtag_data": hashtag_data
      }
      res.json(hashtags)

    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


router.route('/mentions_by_tag_and_month').get(async (req, res) => {
    try {
      const tag = req.query.tag;
      const month = req.query.month;
      var mention_labels = []
      var mention_data =[]
      const doc = await MentionsAndHashtags.findOne({"tag": tag}, {"months": 1})
      for (var i = 0; i < doc["months"].length; i++) {
          if (doc["months"][i]["month"] == month) {
              const mentions = doc["months"][i]["mentions"]
              mention_labels = Object.keys(mentions)
              for (var j = 0; j < Object.keys(mentions).length; j++) {
                  mention_data.push(mentions[mention_labels[j]])
              }
           // mentions = doc["months"][i]["mentions"]
          }
      } 
      const mentions = {
          "mention_labels": mention_labels,
          "mention_data": mention_data
      }
      res.json(mentions)

    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });



  router.route('/hashtags_by_tag_and_month').get(async (req, res) => {
    try {
      const tag = req.query.tag;
      const month = req.query.month;
      var hashtag_labels = []
      var hashtag_data =[]
      const doc = await MentionsAndHashtags.findOne({"tag": tag}, {"months": 1})
      for (var i = 0; i < doc["months"].length; i++) {
          if (doc["months"][i]["month"] == month) {
              const hashtags = doc["months"][i]["hashtags"]
              hashtag_labels = Object.keys(hashtags)
              for (var j = 0; j < Object.keys(hashtags).length; j++) {
                  hashtag_data.push(hashtags[hashtag_labels[j]])
              }
           // mentions = doc["months"][i]["mentions"]
          }
      } 
      const hashtags = {
          "hashtag_labels": hashtag_labels,
          "hashtag_data": hashtag_data
      }
      res.json(hashtags)

    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });

  router.route('/mentions_data_by_tags').get(async (req, res) => {
    try {
      const tags = req.query.tags;
      const result = []
      for (var i = 0; i < tags.length; i++) {
        const tag = tags[i];
        var tag_data = {
          "tag": tag,
          "overall_data": {},
          "monthly_data": []
        }
        var mention_labels = []
        var mention_data =[]
        const doc = await MentionsAndHashtags.findOne({"tag": tag})

        //overall data
        mention_labels = Object.keys(doc["mentions"][0])
        for (var j = 0; j < Object.keys(doc["mentions"][0]).length; j++) {
          mention_data.push(doc["mentions"][0][mention_labels[j]])
        }
        tag_data.overall_data = {
            "mention_labels": mention_labels,
            "mention_data": mention_data
        }

        //monthly data
        for (var j = 0; j < doc["months"].length; j++) {
          mention_labels = []
          mention_data = []
          const month = doc["months"][j]["month"]
          const mentions = doc["months"][j]["mentions"]
              mention_labels = Object.keys(mentions)
              for (var k = 0; k < Object.keys(mentions).length; k++) {
                  mention_data.push(mentions[mention_labels[k]])
              }
          tag_data.monthly_data.push({
            "month": month,
            "mention_labels": mention_labels,
            "mention_data": mention_data
          })  
        } 
        result.push(tag_data)
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


  router.route('/hashtags_data_by_tags').get(async (req, res) => {
    try {
      const tags = req.query.tags;
      const result = []
      for (var i = 0; i < tags.length; i++) {
        const tag = tags[i];
        var tag_data = {
          "tag": tag,
          "overall_data": {},
          "monthly_data": []
        }
        var hashtag_labels = []
        var hashtag_data =[]
        const doc = await MentionsAndHashtags.findOne({"tag": tag})

        //overall data
        hashtag_labels = Object.keys(doc["hashtags"][0])
        for (var j = 0; j < Object.keys(doc["hashtags"][0]).length; j++) {
          hashtag_data.push(doc["hashtags"][0][hashtag_labels[j]])
        }
        tag_data.overall_data = {
            "hashtag_labels": hashtag_labels,
            "hashtag_data": hashtag_data
        }

        //monthly data
        for (var j = 0; j < doc["months"].length; j++) {
          hashtag_labels = []
          hashtag_data = []
          const month = doc["months"][j]["month"]
          const hashtags = doc["months"][j]["hashtags"]
              hashtag_labels = Object.keys(hashtags)
              for (var k = 0; k < Object.keys(hashtags).length; k++) {
                  hashtag_data.push(hashtags[hashtag_labels[k]])
              }
          tag_data.monthly_data.push({
            "month": month,
            "hashtag_labels": hashtag_labels,
            "hashtag_data": hashtag_data
          })  
        } 
        result.push(tag_data)
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