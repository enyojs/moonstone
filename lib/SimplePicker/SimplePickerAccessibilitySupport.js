var
	kind = require('enyo/kind');
var
	$L = require('../i18n');

/**
* @name SimplePickerAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	bindings: [
		{from: 'selected.content', to: '.$.buttonLeft.accessibilityLabel'},
		{from: 'selected.content', to: '.$.buttonRight.accessibilityLabel'},
		{from: 'selected.content', to: 'accessibilityLabel'}
	],

	initAccessibility: kind.inherit(function (sup) {
		return function (was, is, prop) {
			sup.apply(this, arguments);
			this.$.buttonLeft.set('accessibilityHint', $L('press ok button to change the value'));
			this.$.buttonRight.set('accessibilityHint', $L('press ok button to change the value'));
		};
	}),

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function (was, is, prop) {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);
			this.set('accessibilityLive', enabled? true : null);
			this.$.buttonLeft.set('accessibilityDisabled', !enabled);
			this.$.buttonRight.set('accessibilityDisabled', !enabled);
		};
	})
};