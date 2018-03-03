const mongoose = require('mongoose');
const instruments = mongoose.model('Instruments');


const pixelById = function (req, res) {
    if (!req.params || !req.params.id) {
        res
        .status(404)
        .json({ message: "id not supplied" });
    }
    else {
        instruments
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

const pixels = function (req, res) {
    instruments
        .find()
        .exec((err, inst) => {
            console.log("Ok!");
            res
                .status(200)
                .json(inst)
        });
}

const pixelsCreate = function (req, res) {
    instruments.create({
        name: req.body.name,
        socketOffset: req.body.socketOffset ? req.body.socketOffset : 0,
        socket: req.body.socket
    }, (err, location) => {
        if (err) {
            res
                .status(400)
                .json(err);
        } else {
            res
                .status(201)
                .json(location);
        }
    });
}

const pixelsSet = function (req, res) {
    const id = req.params.id;
    console.log(`>>> PixelSet ${id}`);

    res
        .status(200)
        .json({ "id": "yahoo" })

}

const pixelsDelete = function (req, res) {
    const id = req.params.id;
    if (id) {
        instruments
            .findByIdAndRemove(id)
            .exec((err, location) => {
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
    pixelById,
    pixels,
    pixelsCreate,
    pixelsSet,
    pixelsDelete
};
