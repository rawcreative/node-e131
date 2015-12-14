var dgram = require('dgram');
var Buffer = require('buffer').Buffer;

function E131Client(host, port) {
    this._host = host;
    this._port = port || 5568;
    this._socket = dgram.createSocket("udp4");

    this.UNIVERSE = 1;

    var data = new Array(126);

    data[1] = 16; 
    data[4] = 65; 
    data[5] = 83;
    data[6] = 67;
    data[7] = 45;
    data[8] = 69;
    data[9] = 49;
    data[10] = 46;
    data[11] = 49;
    data[12] = 55;
    data[16] = 114; 
    data[17] = 110; 
    data[21] = 4;
    data[38] = 114; 
    data[39] = 88; 
    data[43] = 2;
    data[108] = 100; 
    data[113] = this.UNIVERSE >> 8; 
    data[114] = this.UNIVERSE; 
    data[115] = 114; 
    data[116] = 11; 
    data[117] = 2; 
    data[118] = 161; 
    data[122] = 1; 
    data[123] = 2; 
    data[124] = 1; 

    this.data = data;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

exports.E131Client = E131Client;

exports.createClient = function(host, port) {
    return new E131Client(host, port);
}

E131Client.prototype.send = function(data) {

    var numChannels = data.length;
    var data = this.data.concat(data);
    var buf = Buffer(data, 'hex');
    var i = numChannels + 1;
    var hi;

    buf[123] = i >> 8;
    buf[124] = i;

    //RLP Flags & Length
    i = 638 - 16 - (512 - numChannels);
    hi = i >> 8;
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


    this._socket.send(buf, 0, buf.length, this._port, this._host, function() {});

}

E131Client.prototype.close = function() {
    this._socket.close();
};