require('moonstone');

/**
* Contains the declaration for the {@link moon.ContextualPopupButton} kind.
* @module moonstone/ContextualPopupButton
*/

var
	kind = require('enyo/kind');

var
	Button = require('../Button');

/**
* {@link moon.ContextualPopupButton} is a {@link moon.Button} with additional
* styling applied.
*
* For more information, see the documentation on
* [Buttons]{@linkplain $dev-guide/building-apps/controls/buttons.html} in the
* Enyo Developer Guide.
*
* @namespace moon
* @class moon.ContextualPopupButton
* @extends moon.Button
* @ui
* @definedby module:moonstone/ContextualPopupButton
* @public
*/

module.exports = kind(
	/** @lends moon.ContextualPopupButton.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ContextualPopupButton',

	/**
	* @private
	*/
	kind: Button,

	/**
	* @private
	*/
	classes: 'contextual-popup-button'
});
