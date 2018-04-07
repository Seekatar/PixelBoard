const express = require('express');
const router = express.Router();
const ctrlInstruments = require('../controllers/instrument');
const ctrlInstType = require('../controllers/instrumentType');
const ctrlScenes = require("../controllers/scene")
const ctrlShows = require("../controllers/show")

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
  .put(ctrlScenes.setLiveScene)
  .delete(ctrlScenes.deleteScene)

router
  .route('/scenes')
  .get(ctrlScenes.getScenes)
  .post(ctrlScenes.addScene)

  router
  .route('/shows/:id')
  .get(ctrlShows.getShow)
  .put(ctrlShows.setShow)

  router
  .route('/shows')
  .post(ctrlShows.addShow)
  .get(ctrlShows.getShows)
  .delete(ctrlShows.deleteShow)

module.exports = router;