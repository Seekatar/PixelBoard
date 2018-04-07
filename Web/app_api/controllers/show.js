'use strict'
const http = require('http')
const mongoose = require('mongoose');
const shows = mongoose.model('Shows');
const config = require('../config')

const _debug = true;
const logDebugMsg = function (msg) {
    if (_debug) {
        console.log(msg);
    }
}

const getShow = function (req, res) {
    logDebugMsg(">>>>>>>>>>>>>>>>>>>>> in getShow", req.params.id);
    if (!req.params || !req.params.id) {
        res
            .status(404)
            .json({ message: "id not supplied" });
    } else {
        logDebugMsg(">>>>>>>>>>>>>>>>>>>>> in getShow", req.params.id);
        const id = req.params.id
        shows
            .findById(id)
            .populate("scenes")
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

const getShows = function (req, res) {
    shows
        .find()
        .exec((err, show) => {
            logDebugMsg("Ok!");
            res
                .status(200)
                .json(show)
        });
}

const getMaxSortOrder = async function () {
    return await shows
        .aggregate()
        .group({ _id: null, max: { $max: "$sortOrder" } })
        .exec();
}

const addShow = async function (req, res) {

    let sortOrder = null
    try {
        const sortOrder = await getMaxSortOrder();
    } catch (err) { // need to get await error
        console.error(err);
        console.error(`ERROR in addShow: ${JSON.stringify(err)}`);
        res
            .status(400)
            .json(err)
    }

    var max = 1;
    if (sortOrder)
        max = sortOrder[0].max + 1
    console.debug("Show sort order is", max);
    _addShow(req, res, max);
}

const _addShow = function (req, res, sortOrder) {
    shows.create({
        name: req.body.name,
        description: req.body.description,
        sortOrder: sortOrder,
        scenes: req.body.scenes
    }, (err, show) => {
        if (err) {
            logDebugMsg("Error", err)
            res
                .status(400)
                .json(err);
        } else {
            res
                .status(201)
                .json(show);
        }
    });
}

const setShow = function (req, res) {
    const id = req.params.id;
    shows.update({ _id: id },
        {
            $set: {
                name: req.body.name,
                description: req.body.description
            }
        }, (err) => {
            if ( err ) {
                res
                    .status(400)
                    .json(err);
            }
            res
                .status(200)
                .json({ "id": "yahoo" })

            logDebugMsg("something else")
        }
    );

}

const deleteShow = function (req, res) {
    const id = req.params.id;
    if (id) {
        shows
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
    getShows,
    addShow,
    getShow,
    setShow,
    deleteShow
};
