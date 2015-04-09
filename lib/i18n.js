var
	hooks = require('enyo/hooks');

var
	ilib = require('enyo-ilib').ilib;

var $L;

/**
* Localized strings from [iLib]{@link ilib} translations.
*
* @param {String} string - String to be localized.
* @returns {String} Localized string.
* @name moon.$L
* @public
*/
if (ilib) {
	$L = function (string) {
		if (!$L.rb) {
			return string;
		}
		var str = $L.rb.getString(string);
		return str.toString();
	};
	$L.rb = new ilib.ResBundle({
		loadParams: {
			root: 'resources'
		}
	});
} else {
	$L = hooks.$L;
}

module.exports = $L;