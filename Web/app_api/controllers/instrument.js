const http = require('http')
const mongoose = require('mongoose');
const instruments = mongoose.model('Instruments');
const config = require('../config')

const instrumentById = function (req, res) {
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

const getInstruments = function (req, res) {
    if ( req.query.full) {
        instruments
            .find()
            .populate('instrumentTypeId')
        //     .aggregate([   {
        //         $lookup: {
        //            from: "instrumenttypes",
        //            localField: "instrumentTypeId",    // field in the orders collection
        //            foreignField: "_id",  // field in the items collection
        //            as: "instruments"
        //         }
        //      }
        //     ,
        //      {
        //         $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$instruments", 0 ] }, "$$ROOT" ] } }
        //      },
        //      { $project: { instruments: 0 } }
        //   ])
            .exec((err, inst) => {
                console.log("Ok!");
                res
                    .status(200)
                    .json(inst)
            });
    } else {
        instruments
            .find()
            .exec((err, inst) => {
                console.log("Ok!");
                res
                    .status(200)
                    .json(inst)
            });
    }
}

const instrumentsCreate = function (req, res) {
    instruments.create({
        name: req.body.name,
        socketOffset: req.body.socketOffset ? req.body.socketOffset : 0,
        socket: req.body.socket
    }, (err, instrument) => {
        if (err) {
            res
                .status(400)
                .json(err);
        } else {
            res
                .status(201)
                .json(instrument);
        }
    });
}

const instrumentsSet = function (req, res) {
    const id = req.params.id;
    const color = req.body.color;
    console.log(`>>> InstrumentSet ${id} ${color}`);

    const postData = `{
        "channels":  [
                         {
                             "value":  ${color},
                             "circuit":  ${id}
                         }
                     ]
    }`

    const options = {
        hostname: '192.168.1.107',
        port: 80,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log(">>> before request")

    console.log(postData)

    const req2 = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    console.log(">>> after request1")

    req2.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    console.log(">>> after request2")

    // write data to request body
    req2.write(postData);
    req2.end();

    console.log("req2 end")

    res
        .status(200)
        .json({ "id": "yahoo" })

    console.log("something else")
}

const instrumentsDelete = function (req, res) {
    const id = req.params.id;
    if (id) {
        instruments
            .findByIdAndRemove(id)
            .exec((err, instrument) => {
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
    instrumentById,
    getInstruments,
    instrumentsCreate,
    instrumentsSet,
    instrumentsDelete
};
