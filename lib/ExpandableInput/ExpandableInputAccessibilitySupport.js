var
	kind = require('enyo/kind');
var
	$L = require('../i18n');
/**
* @name ExpandableInputAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	observers: [
		{method: 'updateAccessibilityAttributes', path: ['value']}
	],

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function (was, is, prop) {
			var enabled = !this.accessibilityDisabled,
				text = this.$.header.getContent() + ' ' + this.currentValueText() + ' ' + $L('edit box');
			sup.apply(this, arguments);
			this.$.headerWrapper.set('accessibilityLabel', enabled ? text : null);
			this.$.headerWrapper.set('accessibilityDisabled', this.accessibilityDisabled);
			this.$.inputDecorator.set('accessibilityDisabled', this.accessibilityDisabled);
		};
	}),

	/**
	* @private
	*/
	toggleActive: kind.inherit(function (sup) {
		return function (inSender, inEvent) {
			sup.apply(this, arguments);
			this.$.inputDecorator.set('accessibilityLabel', null);
		};
	})
};