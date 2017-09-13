const fs		= require('fs');
const overboard	= require('../lib/overboard')("", "");

let reports = [];

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
			report[i] = overboard.build(rows[i]);
	}

	console.log(i + " reports loaded");
}

module.exports = function() {
	read();
}