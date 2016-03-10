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
* {@link module:enyo/Input~Input}. Typically, a `moonstone/Input` is placed inside a
* {@link module:moonstone/InputDecorator~InputDecorator}, which provides styling, e.g.:
*
* ```javascript
* 	var
* 		kind = require('enyo/kind'),
* 		Input = require('moonstone/Input'),
* 		InputDecorator = require('moonstone/InputDecorator');
*
* 	{kind: InputDecorator, components: [
* 		{kind: Input, placeholder: 'Enter some text...', onchange: 'inputChange'}
* 	]}
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
		dismissOnEnter: false,

		/**
		* The min attribute specifies the minimum value for an [input]{@link module:enyo/Input~Input}.
		*
		* @type {Number}
		* @default null
		* public
		*/
		min: null,

		/**
		* The max attribute specifies the maximum value for an [input]{@link module:enyo/Input~Input}.
		*
		* @type {Number}
		* @default null
		* public
		*/
		max: null,

		/**
		* When `true`, check validity for 'number' type.
		*
		* @type {Boolean}
		* @default false
		* public
		*/
		validity: false,

		/**
		* When `true`, invalid message popup is shown for input value.
		*
		* @type {Boolean}
		* @default false
		* public
		*/
		useValidityPopup: false
	},

	/**
	* @private
	*/
	handlers: {
		onkeyup    : 'onKeyUp',
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
	components: [
		{name: 'validityIcon'}
	],

	/**
	* @private
	*/
	create: function () {
		Input.prototype.create.apply(this, arguments);
		this.validityChanged();
	},

	/**
	* @private
	*/
	onFocus: function (oSender, oEvent) {
		var node = this.hasNode();

		if (this.dismissOnEnter) {
			var oThis = this;
			util.asyncMethod(this, function () {oThis._bFocused = true;});
		}
		// Force cursor to end of text during a generic focus event. Creating the input by compiling
		// a string of text with value="this.value" produces different initial caret position than
		// using node.setAttribute('value', this.value), which is what would happen any time after
		// the initial creation. The initial end-position of the caret is required to support
		// Virtual keyboards because without arrow-keys because normal left/right arrow navigation
		// in inputs is impossible, so the caret must be positioned at the end to allow for deletion
		// of the previous input. We are intentionally setting the value to force the cursor to the
		// end of the text. `selectionStart` is the obvious choice, but it is not supported in
		// certain types of fields (i.e. number, email).
		if (node) node.value = this.get('value');
		if (this.validity && this.useValidityPopup && this.type == 'number' && this.canValidity(oEvent)) {
			this.showHideValidityPopup(oEvent.target);
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
	},

	/**
	* @private
	*/
	input: function (oSender, oEvent) {
		Input.prototype.input.apply(this, arguments);
		if (this.validity && this.useValidityPopup && this.type == 'number' && this.canValidity(oEvent)) {
			this.showHideValidityPopup(oEvent.target);
		}
	},

	/**
	* @private
	*/
	minChanged: function () {
		if (this.validity) {
			this.setAttribute('min', this.min);
		}
	},

	/**
	* @private
	*/
	maxChanged: function () {
		if (this.validity) {
			this.setAttribute('max', this.max);
		}
	},

	/**
	* @private
	*/
	validityChanged: function () {
		if (this.validity) {
			this.$.validityIcon.addClass('input-validation');
			this.setAttribute('required', true);
			this.setAttribute('min', this.min);
			this.setAttribute('max', this.max);
		} else {
			this.$.validityIcon.removeClass('input-validation');
		}
	},

	/**
	* @private
	*/
	canValidity: function (event) {
		if (this.min && this.max && this.min <= this.max && event && event.target) {
			return true;
		}

		return false;
	},

	/**
	* @private
	*/
	// [Validation Message]
	// Valid   : ""
	// Invalid : "Value must be greater than or equal to {min}."
	// Invalid : "Value must be less than or equal to {max}."
	showHideValidityPopup: function (target) {
		if (!target.validationMessage == "") {
			this.bubble('onShowValidityPopup', {message: target.validationMessage});
		} else {
			this.bubble('onHideValidityPopup');
		}
	}
});
