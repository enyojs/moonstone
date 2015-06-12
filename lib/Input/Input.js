require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Input~Input} kind.
* @module moonstone/Input
*/

var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	Input = require('enyo/Input');

var
	Spotlight = require('spotlight');

/**
* {@link module:moonstone/Input~Input} is a Moonstone-styled input control, derived from
* {@link module:enyo/Input~Input}. Typically, a `moon.Input` is placed inside a
* {@link module:moonstone/InputDecorator~InputDecorator}, which provides styling, e.g.:
*
* ```
* var InputDecorator = require('moonstone/InputDecorator');
*
* {kind: InputDecorator, components: [
*	{kind: 'moon.Input', placeholder: 'Enter some text...', onchange: 'inputChange'}
* ]}
* ```
*
* For more information, see the documentation on
* [Text Fields]{@linkplain $dev-guide/building-apps/controls/text-fields.html}
* in the Enyo Developer Guide.
*
* @class Input
* @extends module:enyo/Input~Input
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Input~Input.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Input',

	/**
	* @private
	*/
	kind: Input,

	/**
	* @private
	*/
	classes: 'moon-body-text moon-input',

	/**
	* 13==Enter, 16777221==KeypadEnter
	*
	* @private
	*/
	spotlightIgnoredKeys: [13, 16777221],

	/**
	* @private
	* @lends module:moonstone/Input~Input.prototype
	*/
	published: {

		/**
		* When `true`, input blurs on Enter keypress (if focused).
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		dismissOnEnter: false
	},

	/**
	* @private
	*/
	handlers: {
		onkeyup : 'onKeyUp',
		onblur     : 'onBlur',
		onfocus    : 'onFocus'
	},

	/**
	* Used only for [dismissOnEnter]{@link module:moonstone/Input~Input#dismissOnEnter} feature;
	* we cannot rely on `hasFocus()` in this case due to race condition.
	*
	* @private
	*/
	_bFocused: false,

	/**
	* @private
	*/
	onFocus: function () {
		if (this.dismissOnEnter) {
			var oThis = this;
			util.asyncMethod(this, function () {oThis._bFocused = true;});
		}
	},

	/**
	* @private
	*/
	onBlur: function () {
		if (this.dismissOnEnter) {
			this._bFocused = false;
		}
	},

	/**
	* @private
	*/
	onKeyUp: function (oSender, oEvent) {
		if (this.dismissOnEnter) {
			if (oEvent.keyCode == 13 && this._bFocused) {
				this.blur();
				if (Spotlight.getPointerMode()) {
					Spotlight.unspot();
				}
			}
		}
	},

	/**
	* @private
	*/
	blur: function () {
		if (this.hasNode()) {
			this.node.blur();
		}
	},

	/**
	* @private
	*/
	left: function () {
		if (!this.hasNode() || this.node.selectionStart === 0) {
			return false;
		}
		return true;
	},

	/**
	* @private
	*/
	right: function () {
		if (!this.hasNode() || this.node.selectionStart == this.node.value.length) {
			return false;
		}
		return true;
	},

	/**
	* @private
	*/
	up: function () {
		return false;
	},

	/**
	* @private
	*/
	down: function () {
		return false;
	}
});
