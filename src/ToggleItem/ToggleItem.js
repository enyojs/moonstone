require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ToggleItem~ToggleItem} kind.
* @module moonstone/ToggleItem
*/

var
	kind = require('enyo/kind');

var
	CheckboxItem = require('../CheckboxItem'),
	ToggleSwitch = require('../ToggleSwitch');

/**
* {@link module:moonstone/ToggleItem~ToggleItem} is a control that combines a {@link module:moonstone/ToggleSwitch~ToggleSwitch}
* with a text label.
*
* @class ToggleItem
* @extends module:moonstone/CheckboxItem~CheckboxItem
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/ToggleItem~ToggleItem.prototype */ {

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
