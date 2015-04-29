require('moonstone');

var
	kind = require('enyo/kind');

var
	CheckboxItem = require('../CheckboxItem'),
	ToggleSwitch = require('../ToggleSwitch');

/**
* {@link moon.ToggleItem} is a control that combines a {@link moon.ToggleSwitch}
* with a text label.
*
* @class moon.ToggleItem
* @extends moon.CheckboxItem
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.ToggleItem.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ToggleItem',

	/**
	* @private
	*/
	kind: CheckboxItem,

	/**
	* @private
	*/
	icon: 'circle',

	/**
	* @private
	*/
	classes: 'moon-toggle-item',

	/**
	* @private
	*/
	checkboxOnRight: true,

	/**
	* @private
	*/
	componentOverrides: {
		client: {classes: 'moon-toggle-item-label-wrapper'},
		input: {kind: ToggleSwitch, spotlight: false}
	}
});