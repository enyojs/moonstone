require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ContextualPopupButton~ContextualPopupButton} kind.
* @module moonstone/ContextualPopupButton
*/

var
	kind = require('enyo/kind');

var
	Button = require('../Button');

/**
* {@link module:moonstone/ContextualPopupButton~ContextualPopupButton} is a {@link module:moonstone/Button~Button} with additional
* styling applied.
*
* For more information, see the documentation on
* [Buttons]{@linkplain $dev-guide/building-apps/controls/buttons.html} in the
* Enyo Developer Guide.
*
* @class ContextualPopupButton
* @extends module:moonstone/Button~Button
* @ui
* @public
*/

module.exports = kind(
	/** @lends module:moonstone/ContextualPopupButton~ContextualPopupButton.prototype */ {

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
