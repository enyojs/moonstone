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
	bindings: [
		{from: 'accessibilityDisabled', to: '$.inputDecorator.accessibilityDisabled'}
	],

	/**
	* @method
	* @private
	*/
	determineLabelledBy: kind.inherit(function (sup) {
		return function () {
			return sup.call(this) + ' ' + $L('edit box');
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