require('moonstone');

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
* @class moon.FormCheckbox
* @extends moon.CheckboxItem
* @ui
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