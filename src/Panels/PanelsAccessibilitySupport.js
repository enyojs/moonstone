/**
* Provides a mixin to add accessibility support to
* {@link module:moonstone/Panels~Panels}
*
* @module moonstone/Panels/PanelsAccessibilitySupport
* @private
*/

var
	kind = require('enyo/kind');

var
	Panel = require('../Panel');

/**
* @name PanelsAccessibilitySupport
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	rendered: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.setAriaRole();
		};
	}),

	_setIndex: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.setAriaRole();
		};
	}),

	setAriaRole: function () {
		console.log('aaa');
		var panels = this.getPanels(),
			active = this.getActive(),
			l = panels.length,
			panel;

		while (--l >= 0) {
			panel = panels[l];
			if (panel instanceof Panel && panel.title) {
				panel.set('accessibilityRole', panel === active ? 'alert' : 'region');
			}
		}
	}
};