var e131 = require('./main.js');

var Controller = function(ip, universe, channels) {
    this.client = e131.createClient(ip);
    this.client.UNIVERSE = universe;
    this.channels = channels;
    this.dmxData = new Array(channels);
}

Controller.prototype.setChannel = function(channel, value) {
    this.dmxData[channel - 1] = value;
};

Controller.prototype.send = function() {
    this.client.send(this.dmxData);
};

module.exports.Controller = Controller;

var Pixel = function(controller, startChannel) {
    this.map = {
        red: 0,
        green: 1,
        blue: 2
    };

    this.controller = controller;
    for (key in this.map) {
        this[key] = startChannel + this.map[key];
    }

};

Pixel.prototype.setVals = function(values) {

    for (key in this.map) {
        this.controller.setChannel(this[key], values[key]);
    }
};

Pixel.prototype.setAll = function(value) {
    for (key in this.map) {
        this.controller.setChannel(this[key], value);
    }
};

module.exports.Pixel = Pixel;