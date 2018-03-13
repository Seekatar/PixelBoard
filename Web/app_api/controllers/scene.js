'use strict'
const http = require('http')
const mongoose = require('mongoose');
const scenes = mongoose.model('Scenes');
const config = require('../config')

const getLiveScene = function (resRet) {
    const options = {
        hostname: '192.168.1.107',
        port: 80,
        path: '/api/pixel',
        method: 'GET',
    };

    console.log(">>> before get for live request")

    const req2 = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            const obj = JSON.parse(chunk)
            let scenes = []
            if (obj.status === "OK") {
                obj.channels.forEach(inst => {
                    scenes.push({ instrument_id: inst.channel, color: inst.value })
                });

            }
            let result = { name: "LiveScene", transition: "None", scenes: scenes }
            resRet
                .status(200)
                .json(result)
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    console.log(">>> after request1")

    req2.on('error', (e) => {
        console.error(`problem with getLiveScene request: ${JSON.stringify(e)}`);
        resRet
            .status(400)
            .json(e)
    });

    console.log(">>> after request2")

    req2.end();

}

const getScene = function (req, res) {
    console.log(">>>>>>>>>>>>>>>>>>>>> in getScene", req.params.id);
    if (!req.params || !req.params.id) {
        res
            .status(404)
            .json({ message: "id not supplied" });
    }
    else {
        console.log(">>>>>>>>>>>>>>>>>>>>> in getScene", req.params.id );
        const id = req.params.id
        console.log(">>>>>>>>>>>>>>>>>>>>> in getScene", req.params.id, id === "0", id === 0 );
        if (id === "0" || id === 0) { // 0 is the live scene
            getLiveScene(res);
        }
        else {
            scenes
                .findById(id)
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
}

const getScenes = function (req, res) {
    scenes
        .find()
        .exec((err, scene) => {
            console.log("Ok!");
            res
                .status(200)
                .json(scene)
        });
}

const getMaxSortOrder = async function () {
    return await scenes
        .aggregate()
        .group({ _id: null, max: { $max: "$sortOrder" } })
        .exec();
}

const addScene = async function (req, res) {

    try {
        var sortOrder = await getMaxSortOrder()
        _addScene(req, res, sortOrder[0].max+1)
    } catch (err) { // need to get await error
        console.error(`ERROR in addScene: ${JSON.stringify(err)}`);
        res
            .status(400)
            .json(err)
    }
}

const _addScene = function (req, res, sortOrder) {
    let instruments = []
    req.body.instruments.forEach(o => instruments.push({ instrument: o._id, color: o.color, colorScheme: o.colorScheme ? o.colorScheme : "RGB" }))
    scenes.create({
        name: req.body.name,
        sortOrder: sortOrder,
        transition: req.body.transition,
        instruments: instruments
    }, (err, instrument) => {
        if (err) {
            console.log("Error", err)
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

const setScene = function (req, res) {
    const id = req.params.id;
    const sockets = req.body.sockets;
    console.log(`>>> Setting scene with ${sockets.length} sockets`)

    let channels = [];
    sockets.forEach(socket => {
        channels.push({
            value: socket.color,
            circuit: socket.socket
        });
    });
    postData = {
        channels: channels
    }
    const body = JSON.stringify(postData)

    const options = {
        hostname: '192.168.1.107',
        port: 80,
        path: '/api/pixel',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
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
        console.error(`problem with setScene request: ${e.message}`);
    });

    console.log(">>> after request2")

    // write data to request body
    req2.write(body);
    req2.end();

    console.log("req2 end")

    res
        .status(200)
        .json({ "id": "yahoo" })

    console.log("something else")
}

const deleteScene = function (req, res) {
    const id = req.params.id;
    if (id) {
        scenes
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
    getScenes,
    addScene,
    getScene,
    setScene,
    deleteScene
};
