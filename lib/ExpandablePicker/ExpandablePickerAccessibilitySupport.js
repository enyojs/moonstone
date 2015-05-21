var
	kind = require('enyo/kind');

/**
* @name ExpandablePickerAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	initAccessibility: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			this.$.currentValue.observe('content', this.valueChanged, this);
			this.valueChanged();
		};
	}),

	/**
	* @private
	*/
	valueChanged: function() {
		this.set('accessibilityHint', this.$.currentValue.getContent());
	}
};