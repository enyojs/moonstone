var
	kind = require('enyo/kind');

/**
* @name SimpleIntegerPickerAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	bindings: [
		{from: 'unit', to: 'accessibilityLabel'}
	]
};