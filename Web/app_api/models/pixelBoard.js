const mongoose = require('mongoose');

const instrumentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: false
  },
  max_voltage: {
    type: Number,
    required: false,
    'default': 5,
    min: 1
  },
  instrumentCount: {
    type: Number,
    required: false,
    'default': 1,
    min: 1
  }
});

const instrumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true }
  },
  socketOffset: {
    type: Number,
    'default': 0
  },
  socket: {
    type: Number,
    required: true,
    min: 0,
    max: 1000
  },
  instrumentType_id: String
});

function indexError(error) {
  if ( error )
  {
    console.log("Index error");
    console.log(error);
  }
}

const instModel = mongoose.model('Instruments', instrumentSchema);
const instTypeModel = mongoose.model('InstrumentTypes', instrumentTypeSchema);
instModel.on('index', indexError);
instTypeModel.on('index', indexError);