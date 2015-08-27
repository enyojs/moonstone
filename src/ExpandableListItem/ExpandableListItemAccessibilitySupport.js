var
	kind = require('enyo/kind');

/**
* @name ExpandableListItemAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	observers: [
		{method: 'updateAccessibilityAttributes', path: 'currentValueText'}
	],

	/**
	* @private
	*/
	determineLabelledBy: function () {
		return this.$.header.id;
	},

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function (was, is, prop) {
			var enabled = !this.accessibilityDisabled,
				label = enabled ? this.accessibilityLabel : null,
				labelledBy = !label && enabled ? this.determineLabelledBy() : null,
				header = this.$.header;

			sup.apply(this, arguments);

			header.setAttribute('aria-labelledby', labelledBy);
			header.set('accessibilityLabel', label);
			header.set('accessibilityDisabled', this.accessibilityDisabled);
		};
	})
};