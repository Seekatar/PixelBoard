const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations'); 
const ctrlOthers = require('../controllers/others');         

/* GET home page. */
router.get('/', homepageController);

module.exports = router;
