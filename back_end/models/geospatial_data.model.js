const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const geoSpatialDataSchema = new mongoose.Schema({

})

const GeoSpatialData = mongoose.model('GeoSpatialData', geoSpatialDataSchema, 'map_data_by_tag')

module.exports = GeoSpatialData