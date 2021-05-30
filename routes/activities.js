const { search } = require('../controller/activities');

const router = require('express').Router();


// ************ activity routes ******************

router.get('/search', search);

module.exports = router;
