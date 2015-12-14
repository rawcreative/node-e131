var e131 = require('./main.js');
var ctrl = require('./ctrl.js');
var controller;
var colors ;
var len;
var counter = 0;

module.exports = function(RED) {
    function e131Node(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
			
//var input = msg.topic.split(" ");
//node.log(input[1]);
				
if (msg.topic == "start") {

controller  = new ctrl.Controller("239.255."+(msg.payload>>8)+"."+msg.payload, msg.payload, 512);
//controller  = new ctrl.Controller((input[1]), input[2], 512);

var black  = {red:0, green:0, blue:0};
var blue  = {red:0, green:0, blue:3};
var green = {red:0, green:2, blue:0};
var red   = {red:1, green:0, blue:0};
var white = {red:4, green:4, blue:4};
var dimmer = {red:55, };

var pixel   = new ctrl.Pixel(controller, 1);
var pixel2  = new ctrl.Pixel(controller, 2);
var pixel3  = new ctrl.Pixel(controller, 55);
var pixel4  = new ctrl.Pixel(controller, 510);
var pixel5  = new ctrl.Pixel(controller, 44);

 colors = [dimmer];
 len = colors.length;
var cyclewait = 22;
 counter = 0;
 
    pixel.setVals(colors[counter%len]);
    pixel2.setVals(colors[(counter+1)%len]);
    pixel3.setVals(colors[(counter+2)%len]);
	pixel4.setVals(colors[(counter+3)%len]);
	pixel5.setVals(colors[(counter+4)%len]);
	

var update = function(){

    controller.send();
    counter++;
	
    setTimeout(update, cyclewait);
};
update();

            msg.payload = colors;
            node.send(msg);
			
		}
	if (msg.topic == "channel")	{
		var msginput = msg.payload.split(" ");
		controller.setChannel(msginput[0],msginput[1]);
		
	}
	if (msg.topic == "pixel")	{
		var pixelX = new ctrl.Pixel(controller, 10);
		pixelX.setVals(colors[counter%len]);
		controller.setChannel(33,parseInt(msg.payload));
	}
		if (msg.topic == "stop")	{
		controller.close();
	}
        });
    }
    RED.nodes.registerType("e131",e131Node);
}
