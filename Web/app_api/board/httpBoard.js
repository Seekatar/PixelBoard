const http = require('http')
const mongoose = require('mongoose');
const instruments = mongoose.model('Instruments');
const config = require('../config')

let board = {

    setPixel: (id, color) => {
        debug(`>>> InstrumentSet ${id} ${color}`);

        const postData = `{
        "channels":  [
                         {
                             "value":  ${color},
                             "circuit":  ${id}
                         }
                     ]
        }`

        const options = {
            hostname: config.pixelBoard.httpBoard.hostname,
            port: config.pixelBoard.httpBoard.port,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        debug(">>> before request")
        debug(postData)

        const req2 = http.request(options, (res) => {
            debug(`STATUS: ${res.statusCode}`);
            debug(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                debug(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                debug('No more data in response.');
            });
        });

        debug(">>> after request1")

        req2.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        debug(">>> after request2")

        // write data to request body
        req2.write(postData);
        req2.end();
    }
}

module.exports = board