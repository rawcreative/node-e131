'use strict';

class Pixel {

	constructor(controller, startChannel) {
		this.colors = new Map([
			['red', startChannel],
			['green', startChannel + 1],
			['blue', startChannel + 2]
		]);

		this.controller = controller;

	}

	setValues(values) {
		let channels = {};

		for (let color of this.colors.keys()) {
			channels[this.colors.get(color)] = values[color];
		}

		this.controller.setChannels(channels);
	}

	setAll(value) {
		let channels = {};

		for (let color of this.colors.keys()) {
			channels[this.colors.get(color)] = value;
		}
		this.controller.setChannels(channels);
	}

	set red(value) {
		this.controller.setChannel(this.colors.get('red'), values);
	}

	set green(value) {
		this.controller.setChannel(this.colors.get('green'), values);
	}

	set blue(value) {
		this.controller.setChannel(this.colors.get('blue'), values);
	}
}

module.exports = Pixel;