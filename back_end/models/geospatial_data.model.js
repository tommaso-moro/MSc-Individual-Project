const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const geoSpatialDataSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true
    },
    geo_data: {
        type: Array, 
        required: true,
        unique: true
    }

})

const GeoSpatialData = mongoose.model('GeoSpatialData', geoSpatialDataSchema, 'map_data_by_tag')

module.exports = GeoSpatialData