const mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  },
  colorScheme: {
    type: String,
    'default': 'RGB'
  }
});

const instrumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true }
  },
  socket: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
  instrumentType_id: {
    type: Schema.Types.ObjectId,
    ref: 'InstrumentTypes'
  } 
});

const sceneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true }
  },
  sortOrder: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  transition: {
    name: {
      type: String,
      required: true,
    }
  },
  instruments: [
    {
      instrument_id: {
        type: Schema.Types.ObjectId,
        ref: 'Instruments',
        required: true
      },
      color: {
        type: String,
        required: true
      },
      colorScheme: {
        type: String,
        required: true
      }
    }
  ]
});

function indexError(error) {
  if (error) {
    console.log("Index error");
    console.log(error);
  }
}

const instModel = mongoose.model('Instruments', instrumentSchema);
const instTypeModel = mongoose.model('InstrumentTypes', instrumentTypeSchema);
const sceneModel = mongoose.model('SceneTypes', sceneSchema);

instModel.on('index', indexError);
instTypeModel.on('index', indexError);