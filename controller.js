'use strict';

class Controller {
	constructor(client, channels) {
		this.dmxData = new Array(channels);
		this.client = client;
	}

	setChannel(channel, value) {
		this.dmxData[channel - 1] = value;
	}

	setChannels(values) {
		for (let channel in values) {
			if (values.hasOwnProperty(channel)) {
				this.dmxData[channel - 1] = values[channel];
			}
		}

	}

	send() {
		this.client.send(this.dmxData);
	}
}

module.exports = Controller;