'use strict';

const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const noop = function() {};

class Client {
    constructor(host, universe, port) {
        this._host = host;
        this._port = port || 5568;
        this._socket = dgram.createSocket('udp4');
        this._universe = universe || 1;
        this.sequence = 0;
        this.header = new Array(126).fill(0);

        this.header[1] = 16; 
        this.header[4] = 65;
        this.header[5] = 83;
        this.header[6] = 67;
        this.header[7] = 45;
        this.header[8] = 69;
        this.header[9] = 49;
        this.header[10] = 46;
        this.header[11] = 49;
        this.header[12] = 55;
        this.header[16] = 114;
        this.header[17] = 110;
        this.header[21] = 4;
        this.header[38] = 114;
        this.header[39] = 88;
        this.header[43] = 2;
        this.header[108] = 100;
        this.header[113] = this._universe >> 8;
        this.header[114] = this._universe;
        this.header[115] = 114;
        this.header[116] = 11;
        this.header[117] = 2;
        this.header[118] = 161;
        this.header[122] = 1;
        this.header[123] = 2;
        this.header[124] = 1;

    }

    send(data, callback) {
        let numChannels = data.length;
        let buf = Buffer(this.header.concat(data), 'hex');
        let i = numChannels + 1;
        callback = callback || noop;

        buf[123] = i >> 8;
        buf[124] = i;

        //RLP Flags & Length
        i = 638 - 16 - (512 - numChannels);
        let hi = i >> 8;

        buf[16] = hi + 0x70;
        buf[17] = i;

        //Framing Flags & Length      
        i = 638 - 38 - (512 - numChannels);
        hi = i >> 8;
        buf[38] = hi + 0x70;
        buf[39] = i;

        // //DMP Flags & Length
        i = 638 - 115 - (512 - numChannels);
        hi = i >> 8;
        buf[115] = hi + 0x70;
        buf[116] = i;

        buf[111] = this.sequence < 255 ? ++this.sequence : this.sequence = 0;
       
        this._socket.send(buf, 0, buf.length, this._port, this._host, callback);
    }

    close() {
        this._socket.close();
    }

    set port(port) {
        this._port = port;
    }

    set universe(universe) {
        this._universe = universe;
    }

    get host() {
        return this._host;
    }

    get universe() {
        return this._universe;
    }

    get port() {
        return this._port;
    }

}

module.exports = Client;