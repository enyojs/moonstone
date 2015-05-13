var
	ResBundle = require('enyo-ilib/ResBundle');

/**
* Localized strings from [iLib]{@link ilib} translations.
*
* @param {String} string - String to be localized.
* @returns {String} Localized string.
* @name moon.$L
* @public
*/
var $L = function (string) {
	if (!$L.rb) {
		return string;
	}
	var str = $L.rb.getString(string);
	return str.toString();
};
$L.rb = new ResBundle({
	loadParams: {
		root: 'resources'
	}
});

/**
* Exports the $L i18n function from [iLib]{@link ilib}.
* @module moonstone/i18n
*/
module.exports = $L;
