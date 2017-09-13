 /* ----------------------------------------------------------- *\
| overboard.js                                                    |
| Local and Remote logging of errors and alerts.                  |
| What could go wrong on a pleasent day out on a beautiful canoe. |
 \* ----------------------------------------------------------- */

const request	= require('http');
const log		= require('../lib/logger');
const fs		= require('fs');

let receiverURL;
let wikiURL;
let ob = {};

module.exports	= function(url, errorURL) {
	receiverURL = url;
	wikiURL = errorURL;
	return flare;
}

ob.build = function(jsonString) {
	var json = JSON.parse(jsonString);
	var newFlare = new flare.Flare(json.title, json.message, json.status, json.error, json.source);
	newFlare.setLink(json.links.self, json.links.about);
	newFlare.setMeta(json.meta);
	newFlare.setID(json.id);

	return newFlare;
}

// Error object
ob.Capsize = class {
	constructor(title, message, statusCode, errorCode, source) {
		this.json	= {
			'id'		: generateErrorID(),
			'title' 	: "",
			'message'	: "",
			'status': 0,
			'errorCode'	: "",
			'source'	: "",
			'links'		: {
				'self'	: "",
				'about'	: ""
			},
			'meta'		: {}
		}

		this.setLink(wikiURL, errorCode);
		this.setTitle(title);
		this.setDetail(message);
		this.setStatus(statusCode);
		this.setSource(source);
		this.newMeta();
	}

	setID(uid) {
		this.json.id = uid;
	}

	setLink(link, errorCode) {
		this.json.links.self	= link;
		this.json.links.about	= link + "/errors#" + errorCode;
	}

	setStatus(status) {
		this.json.status = status;
	}

	setTitle(title) {
		this.json.title = title;
	}

	setDetail(message) {
		this.json.detail = message;
	}

	setSource(file) {
		this.json.source = "{station}" + file;
	}

	newMeta() {
		this.json.meta	= {
			'createdAt'	: Date()
		};
	}
	clearMeta() { newMeta(); } // Alias of newMeta

	appendMeta(key, value) {
		if (typeof this.json.meta == undefined) newMeta();

		this.json.meta[key] = value;
	}

	setMeta(meta) {
		this.json.meta = meta;
	}

	save() {
		log.log(log.overboard, "save", "Writing: " + this.toString());

		fs.appendFile('./station.log', this.toString() + "\n", (err) => {
			if (err) {
				log.log(log.flare, "save", err);
				return;
			}

			log.log(log.flare, "save", "Flare saved to station.log");
		});
	}

	toString() {
		return JSON.stringify(this.json);
	}
}

// Connection to error reciever, send capsize errors
flare.Overboard = class {
	constructor(receiverURL, receiverPath, receiverPort) {
		recieverPort	= recieverPort === undefined
						? 80
						: recieverPort;

		this.options	= {
			hostname	: receiverURL,
			path		: receiverPath,
			port		: receiverPort,
			method		: POST,
			headers		: {
				'Content-Type'	: 'application/json'
			}
		};

		this.receiver = http.request(this.options);
	}

	/**
	 * Send prebuilt Capsize Error Object to receiver
	 * @param {Capsize} capsize 
	 */
	send(capsize, callback) {
		log.log(log.overboard, 'sos', "Sending...");
		this.receiver.on('end', () => {
			log.log(log.overboard, 'sos', "Sent...");
		});
		this.receiver.on('response', () => {
			log.log(log.overboard, 'remote', "Received!");
		});
	}
}

// If 2 keys happen to be generated at the exact same
// nano second and seconds there is:
// seventy-nine octillion, two hundred twenty-eight septillion,
// one hundred and sixty-two sextillion possible combinations
// give or take a few hundred quintillion
function generateErrorID() {
	var out = process.hrtime()[0] + "-" + process.hrtime()[1];

	for (var i=0; i<6; i++) {
		out += "-" + (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}

	return out;
}