const router = require('express').Router();
let WordCloudData = require('../models/wordcloud_data.model');



router.route('/').get(async (req, res) => {
    await WordCloudData.find()
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/overall_wordcloud_by_tag/').get(async (req, res) => {
    try {
      const tag = req.query.tag
      const doc = await WordCloudData.find({"tag": tag}, {"overall_terms_frequencies": 1})
      const result = []
      const overall_terms_frequencies_dict = doc[0]["overall_terms_frequencies"][0]
      for (var i = 0; i < Object.keys(overall_terms_frequencies_dict).length; i++) {
          const key = Object.keys(overall_terms_frequencies_dict)[i]
          result.push({
              "text": key,
              "value": overall_terms_frequencies_dict[key]
          })
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

  router.route('/wordcloud_by_tags/').get(async (req, res) => {
    try {
      const tags = req.query.tags;
      var result = []
      for (var i = 0; i < tags.length; i++) {
        const tag = tags[i]
        var tag_data = {
          "tag": tag,
          "overall_data": [],
          "monthly_data": []
        }
        const doc = await WordCloudData.find({"tag": tag}, {"_id": 0})
        const overall_terms_frequencies_dict = doc[0]["overall_terms_frequencies"][0]
        for (var j = 0; j < Object.keys(overall_terms_frequencies_dict).length; j++) {
            const key = Object.keys(overall_terms_frequencies_dict)[j]
            tag_data["overall_data"].push({
                "text": key,
                "value": overall_terms_frequencies_dict[key]
            })
        }

        const months = doc[0]["months"]
        for (var j = 0; j < months.length; j++) {
          const month = months[j]["month"]
          var month_dict = {
            "month": month,
            "data": []
          }
          const month_terms_frequencies_dict = months[j]["terms_frequencies"];
          for (var k = 0; k < Object.keys(month_terms_frequencies_dict).length; k++) {
            const key = Object.keys(month_terms_frequencies_dict)[k]
            month_dict["data"].push({
                "text": key,
                "value": month_terms_frequencies_dict[key]
            })
          }
          tag_data["monthly_data"].push(month_dict)
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



  router.route('/wordcloud_by_tag_and_month').get(async (req, res) => {
    try {
      const tag = req.query.tag;
      const month = req.query.month;
      const doc = await WordCloudData.find({"tag": tag}, {"months": 1})
      const result = []
      const months = doc[0]["months"]
      for (var i = 0; i < months.length; i++) {
          if (month == months[i]["month"]) {
            const terms_frequencies_dict = months[i]["terms_frequencies"];
            for (var j = 0; j < Object.keys(terms_frequencies_dict).length; j++) {
              const key = Object.keys(terms_frequencies_dict)[j]
              result.push({
                  "text": key,
                  "value": terms_frequencies_dict[key]
              })
            }
          }
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


  router.route('/months').get(async (req, res) => {
    try {
        const doc = await TagsAndDates.find({}, {"_id": 0, "tags": 0})
        res.json(doc[0])
      } catch (err) {
        console.log(err)
        res.status(400).json({
          errors: {
            global: "An error occurred."
          }
        })
      }
  });

  router.route('/start_and_end_dates_day').get(async (req, res) => {
    try {
        const doc = await TagsAndDates.find({}, {"_id": 0, "start_date_day": 1, "end_date_day": 1})
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



module.exports = router;