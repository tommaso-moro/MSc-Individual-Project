const router = require('express').Router();
let GeoSpatialData = require('../models/geospatial_data.model')


router.route('/').get((req, res) => {
    GeoSpatialData.find()
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
});
  
module.exports = router;