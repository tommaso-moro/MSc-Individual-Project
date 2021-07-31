const router = require('express').Router();
let LineChartMonthlyData = require('../models/line_chart_monthly_data.model');


router.route('/').get((req, res) => {
    LineChartMonthlyData.find()
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Error: ' + err));
});

  
module.exports = router;