require('moonstone');

/**
* Contains the declaration for the {@link moon.FormCheckbox} kind.
* @module moonstone/FormCheckbox
*/

var
	kind = require('enyo/kind');

var
	CheckboxItem = require('../CheckboxItem');

/**
* {@link moon.FormCheckbox} is a labeled checkbox designed for use in form layouts.
* Unlike {@link moon.CheckboxItem}, which it extends, `moon.FormCheckbox` provides
* a circular 'hit target' that is always visible, regardless of whether the checkbox
* is currently checked.
*
* @namespace moon
* @class moon.FormCheckbox
* @extends moon.CheckboxItem
* @ui
* @definedby module:moonstone/FormCheckbox
* @public
*/

module.exports = kind(
	/** @lends moon.FormCheckbox.prototype */ {

	/**
	* @private
	*/
	name: 'moon.FormCheckbox',

	/**
	* @private
	*/
	kind: CheckboxItem,

	/**
	* @private
	*/
	classes: 'moon-formcheckbox-item'
});
