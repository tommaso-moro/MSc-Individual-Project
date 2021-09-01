const router = require('express').Router();
let SubjectivityScores = require('../models/subjectivity_scores_data.model');

// create application/json parser
 
// create application/x-www-form-urlencoded parser

router.route('/').get((req, res) => {
    SubjectivityScores.find()
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/scaled_subjectivity_scores_data_by_tag/').get(async (req, res) => {
    try {
      const tag = req.query.tag; 
      const data = await SubjectivityScores.findOne({"tag": tag}, {"scaled_scores": 1, "_id": 0});
      const scaled_scores = data["scaled_scores"]
      const response = []
      for (var i = 0; i < scaled_scores.length; i++) {
          for (var j = 0; j < scaled_scores[i]["num_tweets"]; j++) {
              response.push({
                  "score": scaled_scores[i]["score"],
                  "tag": tag
              })
          }
      }
      //const data = cursor["tags"][tag]["num_tweets"]);
      res.json(response)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  /* router.route('/scaled_subjectivity_scores_data_by_tags_ordinal/').get(async (req, res) => {
    try {
      const tags = req.query.tags; 
      const response = []
      for (var k = 0; k < tags.length; k++) {
        const tag = tags[k]
        const data = await SubjectivityScores.findOne({"tag": tag}, {"_id": 0});
        const scaled_scores = data["scaled_scores"]
        for (var i = 0; i < scaled_scores.length; i++) {
            for (var j = 0; j < scaled_scores[i]["num_tweets"]; j++) {
                response.push({
                    "score": scaled_scores[i]["score"],
                    "tag": tag
                })
            }
        }
      }
      res.json(response)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  }); */

  router.route('/scaled_subjectivity_scores_data_by_tags_ordinal/').get(async (req, res) => {
    try {
      const tags = req.query.tags; 
      var response = []
      for (var k = 0; k < tags.length; k++) {
        const tag = tags[k]
        const data = await SubjectivityScores.findOne({"tag": tag}, {"_id": 0});
        console.log(tag)
        console.log(data)
        const scaled_scores = data["scaled_scores"]
        for (var i = 0; i < scaled_scores.length; i++) {
            for (var j = 0; j < scaled_scores[i]["num_tweets"]; j++) {
                response.push({
                    "score": scaled_scores[i]["score"],
                    "tag": tag,
                    "month": "n/a"
                })
            }
        }
        const monthly_scaled_scores = data["monthly_scaled_scores"]
        for (var i = 0; i < monthly_scaled_scores.length; i++) {
          const month = monthly_scaled_scores[i]["month"]
          const month_scaled_scores = monthly_scaled_scores[i]["scaled_scores"]
          for (var j = 0; j < month_scaled_scores.length; j++) {
            for (var t = 0; t < month_scaled_scores[j]["num_tweets"]; t++) {
                response.push({
                    "score": scaled_scores[j]["score"],
                    "tag": tag,
                    "month": month
                })
            }
          }
        }
      }
      res.json(response)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });

  router.route('/scaled_subjectivity_scores_data_by_tags_swarm/').get(async (req, res) => {
    try {
      const tags = req.query.tags; 
      var response = []
      for (var k = 0; k < tags.length; k++) {
        const tag = tags[k]
        const data = await SubjectivityScores.findOne({"tag": tag}, {"scaled_scores": 1, "_id": 0});
        const scaled_scores = data["scaled_scores"]
        for (var i = 0; i < scaled_scores.length; i++) {
          scaled_scores[i].group = tag
          scaled_scores[i].id = scaled_scores[i].score
          response.push(scaled_scores[i])
        }
      }
      
      res.json(response)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });

  
  
  router.route('/scaled_subjectivity_scores_data_for_all_tags/').get(async (req, res) => {
    try {
      const response = []
      const data = await SubjectivityScores.find({}, {"scaled_scores": 1, "tag": 1, "_id": 0});
      for (var i = 0; i < data.length; i++) {
        const tag = data[i]["tag"]
        const scaled_scores = data[i]["scaled_scores"]
        for (var k = 0; k < scaled_scores.length; k++) {
          for (var j = 0; j < scaled_scores[k]["num_tweets"]; j++) {
            response.push({
                "score": scaled_scores[k]["score"],
                "tag": tag
            })
        }
      }
      }
      /* const scaled_scores = data["scaled_scores"]
      const response = []
      for (var i = 0; i < scaled_scores.length; i++) {
          for (var j = 0; j < scaled_scores[i]["num_tweets"]; j++) {
              response.push({
                  "score": scaled_scores[i]["score"],
                  "tag": tag
              })
          }
      } */
      //const data = cursor["tags"][tag]["num_tweets"]);
      res.json(response)
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