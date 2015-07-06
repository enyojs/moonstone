var
	kind = require('enyo/kind');

/**
* @name ButtonAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function () {
			var enabled = !this.accessibilityDisabled,
				id = this.$.client ? this.$.client.getId() : this.getId();
			sup.apply(this, arguments);
			this.setAttribute('aria-labelledby', enabled ? id : null);
		};
	})
};