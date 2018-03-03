const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');
const ctrlPixels = require('../controllers/pixels');

// locations
router
  .route('/locations')
  .get(ctrlLocations.locationsListByDistance)
  .post(ctrlLocations.locationsCreate);

router
  .route('/locations/:locationid')
  .get(ctrlLocations.locationsReadOne)
  .put(ctrlLocations.locationsUpdateOne)
  .delete(ctrlLocations.locationsDeleteOne);
  
// reviews
router
  .route('/locations/:locationid/reviews')
  .post(ctrlReviews.reviewsCreate);

router
  .route('/locations/:locationid/reviews/:reviewid')
  .get(ctrlReviews.reviewsReadOne)
  .put(ctrlReviews.reviewsUpdateOne)
  .delete(ctrlReviews.reviewsDeleteOne);

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
