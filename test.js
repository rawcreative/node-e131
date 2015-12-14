'use strict';
const Controller = require('./controller.js');
const Client = require('./client.js');
const Pixel = require('./pixel.js');

const client = new Client('10.10.10.12', 25);
const controller = new Controller(client, 512);

const blue  = {red:0, green:0, blue:255};
const green = {red:0, green:255, blue:0};
const red   = {red:255, green:0, blue:0};
const white = {red:255, green:255, blue:255};

const pixel   = new Pixel(controller, 1);
const pixel2  = new Pixel(controller, 4);
const pixel3  = new Pixel(controller, 7);

const colors = [blue, green, red, white];
const len = colors.length;
const cyclewait = 500;
let counter = 0;

const cycleColors = function(){
    pixel.setValues(colors[counter%len]);
    pixel2.setValues(colors[(counter+1)%len]);
    pixel3.setValues(colors[(counter+2)%len]);
    controller.send();
    counter++;

    setTimeout(cycleColors, cyclewait);
};
cycleColors();