const express = require('express');
const router = express.Router();
const ctrlInstruments = require('../controllers/instrument');
const ctrlInstType = require('../controllers/instrumentType');

// instrument board
router
  .route('/instruments')
  .get(ctrlInstruments.getInstruments)
  .post(ctrlInstruments.instrumentsCreate)
  
router
  .route('/instruments/:id')
  .get(ctrlInstruments.instrumentById)
  .patch(ctrlInstruments.instrumentsSet)
  .delete(ctrlInstruments.instrumentsDelete)

// instrumentType
router
  .route('/instrumentTypes')
  .get(ctrlInstType.instrumentTypes)
  .post(ctrlInstType.instrumentTypesCreate)
  
router
  .route('/instrumentTypes/:id')
  .get(ctrlInstType.instrumentTypeById)
  .delete(ctrlInstType.instrumentTypesDelete)

module.exports = router;