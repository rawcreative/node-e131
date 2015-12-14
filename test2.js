'use strict';
const Client = require('./client.js');
const client = new Client('10.10.10.12', 25);

let data = new Array(512); // empty array turns off all channels

client.send(data);

setTimeout(function() {
	process.exit();
}, 1000);