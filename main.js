var dgram = require('dgram');
var Buffer = require('buffer').Buffer;

function E131Client(host, port, universe) {
    var id = this.uuid = 'fc118ca9-9cf0-4861-8ac7-06450a44ba8a';
    this._host = host;
    this._port = port || 5568; //default e1.31 = 5568
    this._socket = dgram.createSocket("udp4");

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
    data[44] = 0; // Source Name (64 bytes)
    data[45] = 0;
    data[46] = 0;
    data[47] = 0;
    data[48] = 0;
    data[49] = 0;
    data[50] = 0;
    data[51] = 0;
    data[52] = 0;
    data[53] = 0;
    data[54] = 0;
    data[55] = 0;
    data[56] = 0;
    data[57] = 0;
    data[58] = 0;
    data[59] = 0;
    data[60] = 0;
    data[61] = 0;
    data[61] = 0;
    data[62] = 0;
    data[63] = 0;
    data[64] = 0;
    data[65] = 0;
    data[66] = 0;
    data[67] = 0;
    data[68] = 0;
    data[69] = 0;
    data[70] = 0;
    data[71] = 0;
    data[71] = 0;
    data[72] = 0;
    data[73] = 0;
    data[74] = 0;
    data[75] = 0;
    data[76] = 0;
    data[77] = 0;
    data[78] = 0;
    data[79] = 0;
    data[80] = 0;
    data[81] = 0;
    data[81] = 0;
    data[82] = 0;
    data[83] = 0;
    data[84] = 0;
    data[85] = 0;
    data[86] = 0;
    data[87] = 0;
    data[88] = 0;
    data[89] = 0;
    data[90] = 0;
    data[91] = 0;
    data[91] = 0;
    data[92] = 0;
    data[93] = 0;
    data[94] = 0;
    data[95] = 0;
    data[96] = 0;
    data[97] = 0;
    data[98] = 0;
    data[99] = 0;
    data[100] = 0;
    data[101] = 0;
    data[101] = 0;
    data[102] = 0;
    data[103] = 0;
    data[104] = 0;
    data[105] = 0;
    data[106] = 0;
    data[107] = 0;
    data[108] = 100; // Priority
    data[109] = 0; // Reserved
    data[110] = 0; // Reserved
    data[111] = 0; // Sequence Number
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

exports.createClient = function(host, port, universe) {
    return new E131Client(host, port, universe);
}

E131Client.prototype.send = function(data) {

    var numChannels = data.length;
    var data = this.data.concat(data);
    var buf = Buffer(data, 'hex');
    var i = numChannels + 1;
    var hi;

	this.sequenceNumber++;
	buf[111] = this.sequenceNumber < 256 ? this.sequenceNumber = this.sequenceNumber : this.sequenceNumber = 0;
    
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
