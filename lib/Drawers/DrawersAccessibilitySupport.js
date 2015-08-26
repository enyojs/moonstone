var
	kind = require('enyo/kind');

var
	$L = require('../i18n');

/**
* @name DrawersAccessibilitySupport
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	updateActivator: kind.inherit(function (sup) {
		return function (open) {
			sup.apply(this, arguments);
			// According to drawer is open or close or handleContainer state, drawers activator label is defined.
			// In addition, if user add accessibilityLabel, label is higher priority than below string, so user should handle label text in app side.
			// However, if user add only accessibilityHint, hint text is appended to below string.
			if (!this.accessibilityLabel) {
				if (this.isDrawerOpen() || this.$.handleContainer.getOpen()) {
					this.$.activator.set('accessibilityLabel', $L('close drawer') + ' ' + this.accessibilityHint);
				} else {
					this.$.activator.set('accessibilityLabel', $L('open drawer') + ' ' + this.accessibilityHint);
				}
			}
		};
	}),

	ariaObservers: [
		{path: ['accessibilityLabel', 'accessibilityHint'], method: function () {
			var defaultLabel = (this.isDrawerOpen() || this.$.handleContainer.getOpen()) ? $L('close drawer') : $L('open drawer'),
				label = this.accessibilityHint && this.accessibilityLabel && (this.accessibilityLabel + ' ' + this.accessibilityHint) ||
						this.accessibilityHint && (defaultLabel + ' ' + this.accessibilityHint) ||
						this.accessibilityLabel ||
						defaultLabel;
			this.$.activator.set('accessibilityLabel', label);
		}}
	]
	
};