var dgram = require('dgram');
var Buffer = require('buffer').Buffer;

function E131Client(host, port, universe, name) {
    var id = this.uuid = 'fc118ca9-9cf0-4861-8ac7-06450a44ba8a';
	this.NAME = name || 'sACN source';;
    this._host = host;
    this._port = port || 5568; //default e1.31 = 5568
    this._socket = dgram.createSocket("udp4");
	this.sequenceNumber = 0;
    this.UNIVERSE = universe || 1;
    var data = new Array();

    data[0] = 0; // RLP preamble size (high)
    data[1] = 16; // RLP preamble size (low)
    data[2] = 0; // RLP postamble size (high)
    data[3] = 0; // RLP postamble size (low)
    data[4] = 65; // ACN Packet Identifier (12 bytes)
    data[5] = 83;
    data[6] = 67;
    data[7] = 45;
    data[8] = 69;
    data[9] = 49;
    data[10] = 46;
    data[11] = 49;
    data[12] = 55;
    data[13] = 0;
    data[14] = 0;
    data[15] = 0;
    data[16] = 114; // RLP Protocol flags and length (high)
    data[17] = 110; // 637 - 16
    data[18] = 0; // RLP Vector (Identifies RLP Data as 1.31 Protocol PDU)
    data[19] = 0;
    data[20] = 0;
    data[21] = 4;

    var cid;
    for (var i = 0, j = 22; i < 32; i += 2) {
        cid = id.charAt(i) + id.charAt(i + 1);

        data[j++] = parseInt(cid, 16);
    }
    data[38] = 114; // Framing Protocol flags and length (high)
    data[39] = 88; // 637 - 38
    data[40] = 0; // Framing Vector (indicates that the E1.31 framing layer is wrapping a DMP PDU)
    data[41] = 0;
    data[42] = 0;
    data[43] = 2;
    
	var namechar;
	for (var i = 0, j = 44; i < 16; i++) {
        namechar = this.NAME.charCodeAt(i);
        data[j++] = namechar;
    }
    data[108] = 100; // Priority
    data[109] = 0; // Reserved
    data[110] = 0; // Reserved
    data[111] = this.sequenceNumber; // Sequence Number
    data[112] = 0; // Framing Options Flags
    data[113] = this.UNIVERSE >> 8; // Universe high
    data[114] = this.UNIVERSE; // Universe low
    data[115] = 114; // DMP Protocol flags and length (high)
    data[116] = 11; // 637 - 115
    data[117] = 2; // DMP Vector (Identifies DMP Set Property Message PDU)
    data[118] = 161; // DMP Address Type & Data Type
    data[119] = 0; // First Property Address (high)
    data[120] = 0; // First Property Address (low)
    data[121] = 0; // Address Increment (high)
    data[122] = 1; // Address Increment (low)
    data[123] = 2; // Property value count (high)
    data[124] = 1; // Property value count (low)
    data[125] = 0; // DMX512-A START Code

    this.data = data;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

exports.E131Client = E131Client;

exports.createClient = function(host, port, universe, name) {
    return new E131Client(host, port, universe, name);
}

E131Client.prototype.send = function(data) {

    var numChannels = data.length;
    var data = this.data.concat(data);
    var buf = Buffer(data, 'hex');
    var i = numChannels + 1;
    var hi;
	
	buf[111] = this.sequenceNumber < 255 ? ++this.sequenceNumber : this.sequenceNumber = 0;
    
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
