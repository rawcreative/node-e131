var e1client = require('./main.js');
var client    = new e1client.createClient("10.10.10.12", 5568, 25);

var data = new Array(512); // empty array turns off all channels

client.send(data);

setTimeout(function() {
	process.exit();
}, 1000);