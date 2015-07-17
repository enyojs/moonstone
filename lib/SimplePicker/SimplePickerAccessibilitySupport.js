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
	observers: [
		{method: 'updateAccessibilityAttributes', path: ['selected']}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'selected.content', to: '.$.buttonLeft.accessibilityLabel'},
		{from: 'selected.content', to: '.$.buttonRight.accessibilityLabel'}
	],

	/**
	* @private
	*/
	initAccessibility: kind.inherit(function (sup) {
		return function (was, is, prop) {
			sup.apply(this, arguments);
			this.$.client.setAttribute('role', 'spinbutton');
			this.$.buttonLeft.set('accessibilityHint', $L('press ok button to change the value'));
			this.$.buttonRight.set('accessibilityHint', $L('press ok button to change the value'));
		};
	}),

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function (was, is, prop) {
			sup.apply(this, arguments);
			this.$.client.setAttribute('aria-valuetext', this.selected.content);
		};
	})
};