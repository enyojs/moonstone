require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/FormCheckbox~FormCheckbox} kind.
* @module moonstone/FormCheckbox
*/

var
	kind = require('enyo/kind');

var
	CheckboxItem = require('../CheckboxItem');

/**
* {@link module:moonstone/FormCheckbox~FormCheckbox} is a labeled checkbox designed for use in form layouts.
* Unlike {@link module:moonstone/CheckboxItem~CheckboxItem}, which it extends, `moon.FormCheckbox` provides
* a circular 'hit target' that is always visible, regardless of whether the checkbox
* is currently checked.
*
* @class FormCheckbox
* @extends module:moonstone/CheckboxItem~CheckboxItem
* @ui
* @public
*/

module.exports = kind(
	/** @lends module:moonstone/FormCheckbox~FormCheckbox.prototype */ {

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
