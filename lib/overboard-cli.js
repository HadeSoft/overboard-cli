const fs		= require('fs');
const overboard	= require('../lib/flare')("", "");

let flares = [];

function read() {
	fs.readFile(__dirname + '/overboard.log', 'utf-8', (err, data) => {
		if (err) {
			console.log("Could not open 'station.log'");
			process.exit(0);
		}

		console.log(data);
		parse(data);
	});
}

function parse(data) {
	rows = data.split('\n');

	for (var i = 0; i < rows.length; i++) {
		if (rows[i] != "")
			flares[i] = flare.build(rows[i]);
	}

	console.log(i + " flares loaded");
}

module.exports = function() {
	read();
}