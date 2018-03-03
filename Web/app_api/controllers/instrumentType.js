const mongoose = require('mongoose');
const instrumentType = mongoose.model('InstrumentTypes');


const instrumentTypeById = function (req, res) {
    if (!req.params || !req.params.id) {
        res
        .status(404)
        .json({ message: "id not supplied" });
    }
    else {
        instrumentType
            .findById(req.params.id)
            .exec((err, inst) => {
                if (err) {
                    res
                        .status(404)
                        .json(err)
                }
                else if (inst) {
                    res
                        .status(200)
                        .json(inst)
                }
                else {
                    res
                        .status(404)
                        .json({ message: "id not found" });
                }
            });
    }
}

const instrumentTypes = function (req, res) {
    instrumentType
        .find()
        .exec((err, inst) => {
            console.log("Ok!");
            res
                .status(200)
                .json(inst)
        });
}

const instrumentTypesCreate = function (req, res) {
    console.log("test")
    console.log(req.body)
    instrumentType.create({
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        url: req.body.url,
        max_voltage: req.body.max_voltage,
        instrumentCount: req.body.instrumentCount
    }, (err, instrumentType) => {
        if (err) {
            res
                .status(400)
                .json(err);
        } else {
            res
                .status(201)
                .json(instrumentType);
        }
    });
}

const instrumentTypesDelete = function (req, res) {
    const id = req.params.id;
    if (id) {
        instrumentType
            .findByIdAndRemove(id)
            .exec((err, instrumentType) => {
                if (err) {
                    res
                        .status(404)
                        .json(err);
                    return;
                }
                res
                    .status(204)
                    .json(null);
            }
            );
    } else {
        res
            .status(404)
            .json({
                "message": `No id found for ${id}`
            });
    }
};

module.exports = {
    instrumentTypeById,
    instrumentTypes,
    instrumentTypesCreate,
    instrumentTypesDelete
};
