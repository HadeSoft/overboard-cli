const colors	= require('colors');

module.exports	= exports = {
	station		: 'station',
	server		: 'host',
	reader		: 'reader',
	browser		: 'browser',
	overboard	: 'canoe',
	columns		: [
		10, 4, 8, 4
	],
	col			: {
		client	: 0,
		action	: 2,
		message	: 4
	},
	colours		: {
		client	: 'yellow',
		action	: ['black', 'bgWhite'],
		message	: 'reset'
	}
};

// COLOUR DEFAULTS
exports.colours[exports.station]	= 'cyan';
exports.colours[exports.server]		= 'grey';
exports.colours[exports.reader]		= 'green';
exports.colours[exports.browser]	= 'red';
exports.colours[exports.overboard]	= 'rainbow';
updateColours();

exports.log = function(client, action, message) {
	var buffer = exports.columns[0] - client.length;
	client = "[" + client[client];
	var output 	 = formatColumns(exports.col.client, client, buffer, "]");
	action		 = ">" + action;
	buffer = exports.columns[2] - action.length;
	output 		+= formatColumns(exports.col.action, action.action, buffer, ":".action);
	output		+= formatColumns(exports.col.message, message.message);

	console.log(output);
}

exports.marker = function() {
	console.log("~~~~~~~~~~~~~~~~~~~~~~MARKER~~~~~~~~~~~~~~~~~~~~~~~~~");
}

//TODO: Report to host, station errors

/**
 * Trim or extend content to fit to column
 * @param {integer} col the column index. ref (exports.columns)
 * @param {string} content content to be trimmed for column
 * @param {string} suffix optional. String to be appened to content
 */
function formatColumns(col, content, buffer, suffix) {
	suffix	= typeof suffix === 'undefined'
			? ""
			: suffix;

	// Column selection validation
	if (exports.columns.length <= col) {
		return content;
	}

	var columnWidth = exports.columns[col];
	var contentWidth = exports.columns[col]; //Starts at maximum width
	contentWidth	= suffix != ""
			? contentWidth -1
			: contentWidth;

	content.substring(0, contentWidth); //Trim long content
	content += suffix;

	content += appendSpaces(buffer);
	content += appendSpaces(exports.columns[col+1]);

	return content;
}

function appendSpaces(nSpaces) {
	spaces = "";
	for (var n = 0; n < nSpaces; n++) {
		spaces += " ";
	}
	return spaces;
}

function updateColours() {
	var theme = {};

	theme[exports.station]	= exports.colours[exports.station];
	theme[exports.server]	= exports.colours[exports.server];
	theme[exports.reader]	= exports.colours[exports.reader];
	theme[exports.browser]	= exports.colours[exports.browser];
	theme[exports.overboard]= exports.colours[exports.overboard];
	theme['action']			= exports.colours['action'];
	theme['message']		= exports.colours['message'];

	colors.setTheme(theme);
}