const express = require('express');
const router = express.Router();
const ctrlInstruments = require('../controllers/instrument');
const ctrlInstType = require('../controllers/instrumentType');
const ctrlScenes = require("../controllers/scene")

// instrument board
router
  .route('/instruments/:id')
  .get(ctrlInstruments.instrumentById)
  .patch(ctrlInstruments.instrumentsSet)
  .delete(ctrlInstruments.instrumentsDelete)

router
  .route('/instruments')
  .get(ctrlInstruments.getInstruments)
  .post(ctrlInstruments.instrumentsCreate)
  
// instrumentType
router
  .route('/instrumentTypes/:id')
  .get(ctrlInstType.instrumentTypeById)
  .delete(ctrlInstType.instrumentTypesDelete)

  router
  .route('/instrumentTypes')
  .get(ctrlInstType.instrumentTypes)
  .post(ctrlInstType.instrumentTypesCreate)

// scenes
router
  .route('/scenes/:id')
  .get(ctrlScenes.getScene)
  .put(ctrlScenes.setScene)
  .delete(ctrlScenes.deleteScene)

router
  .route('/scenes')
  .get(ctrlScenes.getScenes)
  .post(ctrlScenes.addScene)

module.exports = router;