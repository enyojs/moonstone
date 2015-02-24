require('moonstone');

var
	kind = require('enyo/kind'),
	util = require('enyo/utils');

var
	Checkbox = require('../Checkbox');

/**
* {@link moon.ToggleSwitch}, which extends {@link moon.Checkbox}, is a control
* that looks like a switch with 'on' and 'off' states. When the toggle switch is
* tapped, it switches its state and fires an
* [onChange]{@link enyo.Checkbox#onChange} event.
*
* @class moon.ToggleSwitch
* @extends moon.Checkbox
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.ToggleSwitch.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ToggleSwitch',

	/**
	* @private
	*/
	kind: Checkbox,

	/**
	* @private
	*/
	icon: 'circle',

	/**
	* @private
	*/
	classes: 'moon-toggle-switch',

	/**
	* @private
	*/
	rendered: function () {
		Checkbox.prototype.rendered.apply(this, arguments);
		// wait until after we're rendered to allow animation.
		util.asyncMethod(this, function () {
			this.addClass('animated');
		});
	}
});