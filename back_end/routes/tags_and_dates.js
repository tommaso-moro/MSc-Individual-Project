const router = require('express').Router();
let TagsAndDates = require('../models/tags_and_dates.model');



router.route('/').get(async (req, res) => {
    await TagsAndDates.find()
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/tags').get(async (req, res) => {
    try {
      const doc = await TagsAndDates.find()
      res.json(doc[0]["tags"])
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

module.exports = router;