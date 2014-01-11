var e1client = require('./main.js');
var client    = new e1client.createClient("10.10.10.10");

var data = new Array(512); // empty array turns off all channels

client.send(data);