const express = require('express');
const router = express.Router();
const ctrlPixels = require('../controllers/pixels');

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
