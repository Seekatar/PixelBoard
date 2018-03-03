const mongoose = require('mongoose');

const instrumentType = new mongoose.Schema({
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
    required: true
  },
  max_voltage: {
    type: Number,
    required: true,
    min: 1
  },
  instrumentCount: {
    type: Number,
    required: true,
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

const instModel = mongoose.model('Instruments', instrumentSchema);
instModel.on('index', function(error) {
  if ( error )
  {
    console.log("Index error");
    console.log(error);
  }
});

