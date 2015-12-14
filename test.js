var ctrl = require('./ctrl.js');
var controller    = new ctrl.Controller("10.10.10.12", 25, 512);

var blue  = {red:0, green:0, blue:255};
var green = {red:0, green:255, blue:0};
var red   = {red:255, green:0, blue:0};
var white = {red:255, green:255, blue:255};

var pixel   = new ctrl.Pixel(controller, 1);
var pixel2  = new ctrl.Pixel(controller, 4);
var pixel3  = new ctrl.Pixel(controller, 7);

var colors = [blue, green, red, white];
var len = colors.length;
var cyclewait = 500;
var counter = 0;

var cycleColors = function(){
    pixel.setVals(colors[counter%len]);
    pixel2.setVals(colors[(counter+1)%len]);
    pixel3.setVals(colors[(counter+2)%len]);
    controller.send();
    counter++;

    setTimeout(cycleColors, cyclewait);
};
cycleColors();