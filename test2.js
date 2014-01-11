var e1client = require('./main.js');
var client    = new e1client.createClient("10.10.10.10");

var data = new Array(512); 

client.send(data);