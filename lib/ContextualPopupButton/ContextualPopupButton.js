require('moonstone');

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
* @class moon.ContextualPopupButton
* @extends moon.Button
* @ui
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