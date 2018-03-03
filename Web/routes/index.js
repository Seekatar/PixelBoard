var express = require('express');
var router = express.Router();
const ctrlPixels = require('../controllers/pixels');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// pixel board
router
  .route('/pixels')
  .get(ctrlPixels.pixels)
  .post(ctrlPixels.pixelsCreate)
  
router
  .route('/pixels/:id')
  .get(ctrlPixels.pixelById)
  .put(ctrlPixels.pixelsSet)
  .delete(ctrlPixels.pixelsDelete)

module.exports = router;
