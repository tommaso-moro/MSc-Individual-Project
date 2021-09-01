const router = require('express').Router();
let GeoSpatialData = require('../models/geospatial_data.model')


router.route('/').get((req, res) => {
    GeoSpatialData.find()
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/by_tag/').get(async (req, res) => {
    try {
      const tag = req.query.tag; //replace query with params for it to work in insomnia?
      const doc = await GeoSpatialData.findOne({"tag": tag}, {"geo_data": 1, "_id": 0});
      var clean_doc = {
        "tag": tag,
        "geo_data": []
      }
      for (var i = 0; i < doc["geo_data"].length; i++) {
        if (("centroid" in doc["geo_data"][i]) && ("geometry" in doc["geo_data"][i])) { //these properties are needed by react-map-gl
          clean_doc["geo_data"].push(doc["geo_data"][i])
        }
      }
      res.json(clean_doc)
    } catch (err) {
      console.log(err)
      res.status(400).json({
        errors: {
          global: "An error occurred."
        }
      })
    }
  });


  router.route('/by_tags/').get(async (req, res) => {
    try {
      const tags = req.query.tags;
      var result = [];
      for (var i = 0; i < tags.length; i++) {
        const tag = tags[i];
        const doc = await GeoSpatialData.findOne({"tag": tag}, {"geo_data": 1, "_id": 0});
        var clean_doc = {
          "tag": tag,
          "geo_data": []
        }
        for (var j = 0; j < doc["geo_data"].length; j++) {
          if (("centroid" in doc["geo_data"][j]) && ("geometry" in doc["geo_data"][j])) { //these properties are needed by react-map-gl
            clean_doc["geo_data"].push(doc["geo_data"][j])
          }
        }
        result.push(clean_doc)
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