const router = require('express').Router();
let MonthlyBatch = require('../models/tweets_monthly_batch.model');

router.route('/').get((req, res) => {
    MonthlyBatch.find()
        .then(batches => res.json(batches))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;