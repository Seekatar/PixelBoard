'use strict'
const http = require('http')
const mongoose = require('mongoose');
const scenes = mongoose.model('Scenes');
const config = require('../config')

const _debug = true;
const logDebugMsg = function (msg) {
    if (_debug) {
        console.log(msg);
    }
}

const getLiveScene = function (resRet) {
    const options = {
        hostname: '192.168.1.107',
        port: 80,
        path: '/api/pixel',
        method: 'GET',
    };

    logDebugMsg(">>> before get for live request")

    const req2 = http.request(options, (res) => {
        logDebugMsg(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            const obj = JSON.parse(chunk)
            let instruments = []
            if (obj.status === "OK") {
                obj.channels.forEach(inst => {
                    instruments.push({ instrument_id: inst.channel, color: inst.value })
                });

            }
            let result = { name: "LiveScene", transition: "None", instruments: instruments }
            resRet
                .status(200)
                .json(result)
        });
        res.on('end', () => {
            logDebugMsg('No more data in response.');
        });
    });

    logDebugMsg(">>> after request1")

    req2.on('error', (e) => {
        console.error(`problem with getLiveScene request: ${JSON.stringify(e)}`);
        resRet
            .status(400)
            .json(e)
    });

    logDebugMsg(">>> after request2")

    req2.end();

}

const getScene = function (req, res) {
    logDebugMsg(">>>>>>>>>>>>>>>>>>>>> in getScene", req.params.id);
    if (!req.params || !req.params.id) {
        res
            .status(404)
            .json({ message: "id not supplied" });
    } else {
        logDebugMsg(">>>>>>>>>>>>>>>>>>>>> in getScene", req.params.id);
        const id = req.params.id
        logDebugMsg(">>>>>>>>>>>>>>>>>>>>> in getScene", req.params.id, id === "0", id === 0);
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
            logDebugMsg("Ok!");
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

    let sortOrder = null
    try {
        const sortOrder = await getMaxSortOrder();
    } catch (err) { // need to get await error
        console.error(err);
        console.error(`ERROR in addScene: ${JSON.stringify(err)}`);
        res
            .status(400)
            .json(err)
    }

    var max = 1;
    if (sortOrder)
        max = sortOrder[0].max + 1
    console.debug("Scene sort order is", max);
    _addScene(req, res, max);
}

const _addScene = function (req, res, sortOrder) {
    scenes.create({
        name: req.body.name,
        description: req.body.description,
        sortOrder: sortOrder,
        transition: req.body.transition,
        instruments: req.body.instruments
    }, (err, scene) => {
        if (err) {
            logDebugMsg("Error", err)
            res
                .status(400)
                .json(err);
        } else {
            res
                .status(201)
                .json(scene);
        }
    });
}

const setLiveScene = function (req, res) {
    const id = req.params.id;
    const sockets = req.body.sockets;
    logDebugMsg(`>>> Setting scene with ${sockets.length} sockets`)

    const channels = [];
    sockets.forEach(socket => {
        channels.push({
            value: socket.color,
            circuit: socket.socket
        });
    });
    const postData = {
        transition: req.body.transition,
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

    logDebugMsg(">>> before request")

    logDebugMsg(postData)

    const req2 = http.request(options, (res) => {
        logDebugMsg(`STATUS: ${res.statusCode}`);
        logDebugMsg(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            logDebugMsg(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            logDebugMsg('No more data in response.');
        });
    });

    logDebugMsg(">>> after request1")

    req2.on('error', (e) => {
        console.error(`problem with setLiveScene request: ${e.message}`);
    });

    logDebugMsg(">>> after request2")

    // write data to request body
    req2.write(body);
    req2.end();

    logDebugMsg("req2 end")

    res
        .status(200)
        .json({ "id": "yahoo" })

    logDebugMsg("something else")
}

const deleteScene = function (req, res) {
    const id = req.params.id;
    if (id) {
        scenes
            .findByIdAndRemove(id)
            .exec((err, scene) => {
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
    setLiveScene,
    deleteScene
};
