require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/InputDecorator~InputDecorator} kind.
* @module moonstone/InputDecorator
*/

var
	kind = require('enyo/kind'),
	ToolDecorator = require('enyo/ToolDecorator');

var
	Spotlight = require('spotlight');

var
	Input = require('../Input'),
	RichText = require('../RichText'),
	TextArea = require('../TextArea');

/**
* {@link module:moonstone/InputDecorator~InputDecorator} is a control that provides input styling. Any controls
* in the InputDecorator will appear to be inside an area styled as an input. Usually,
* an InputDecorator surrounds a [moon.Input]{@link module:moonstone/Input~Input}:
*
* ```
* {kind: 'moon.InputDecorator', components: [
* 	{kind: 'moon.Input'}
* ]}
* ```
*
* Other controls, such as buttons, may be placed to the right or left of the
* input control, e.g.:
*
* ```
* {kind: 'moon.InputDecorator', components: [
* 	{kind: 'moon.IconButton', src: 'search.png'},
* 	{kind: 'moon.Input'},
* 	{kind: 'moon.IconButton', src: 'cancel.png'}
* ]}
* ```
*
* Note that the InputDecorator fits around the content inside it. If the
* decorator is sized, then its contents will likely need to be sized as well.
*
* ```
* {kind: 'moon.InputDecorator', style: 'width: 500px;', components: [
* 	{kind: 'moon.Input', style: 'width: 100%;'}
* ]}
* ```
*
* @class InputDecorator
* @extends module:enyo/ToolDecorator~ToolDecorator
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/InputDecorator~InputDecorator.prototype */ {

	/**
	* @private
	*/
	name: 'moon.InputDecorator',

	/**
	* @private
	*/
	kind: ToolDecorator,

	/**
	* @private
	*/
	tag: 'label',

	/**
	* @private
	*/
	spotlight: true,

	/**
	* @private
	*/
	spotlightDecorate: false,

	/**
	* @private
	*/
	handlers: {
		onDisabledChange  : 'disabledChangeHandler',
		onfocus           : 'focusHandler',
		onblur            : 'blurHandler',
		onSpotlightFocus  : 'spotlightFocusHandler',
		onSpotlightSelect : 'spotlightSelectHandler',
		onSpotlightBlur   : 'spotlightBlurHandler',
		onSpotlightLeft   : 'spotlightLeftHandler',
		onSpotlightRight  : 'spotlightRightHandler',
		onSpotlightUp     : 'spotlightUpHandler',
		onSpotlightDown   : 'spotlightDownHandler'
	},

	/**
	* @private
	*/
	_oInputControl: null,

	/**
	* Returns boolean indicating whether passed-in control is an input field.
	*
	* @private
	*/
	_isInput: function (oControl) {
		return (
			oControl instanceof Input		||
			oControl instanceof RichText	||
			oControl instanceof TextArea
		);
	},

	/**
	* Traverses tree of children to find input control.
	*
	* @private
	*/
	_findInputControl: function (oControl) {
		oControl = oControl || this;

		var oInputControl = null;

		for (var n=0; n<oControl.children.length; n++) {
			if (this._isInput(oControl.children[n])) {
				return oControl.children[n];
			}
			if ((oInputControl = this._findInputControl(oControl.children[n]))) {
				return oInputControl;
			}
		}
	},

	/**
	* @private
	*/
	create: function () {
		ToolDecorator.prototype.create.apply(this, arguments);
		this.updateFocus(false);
		this._oInputControl = this._findInputControl();
		if (this._oInputControl instanceof Input) {
			this.addClass('moon-divider-text moon-input-decorator');
		}
		if (this._oInputControl instanceof TextArea || this._oInputControl instanceof RichText) {
			this.addClass('moon-divider-text moon-textarea-decorator');
		}
	},

	/**
	* @private
	*/
	createComponent: function () {
		ToolDecorator.prototype.createComponent.apply(this, arguments);
		this._oInputControl = this._findInputControl();
	},

	/**
	* @private
	*/
	createComponents: function () {
		ToolDecorator.prototype.createComponents.apply(this, arguments);
		this._oInputControl = this._findInputControl();
	},

	/**
	* Updates styling based on focus state.
	*
	* @param {Boolean} bFocus - Whether to add/remove `moon-focused` class.
	* @public
	*/
	updateFocus: function (bFocus) {
		this.focused = bFocus;
		this.addRemoveClass('moon-focused', this.alwaysLooksFocused || this.focused);
	},

	/**
	* Retrieves the child input control.
	*
	* @returns {Object} A reference to the child input control.
	* @public
	*/
	getInputControl: function () {
		return this._oInputControl;
	},

	// Event handlers:
	/**************************************************/

	/**
	* @private
	*/
	focusHandler: function (oSender, oEvent) {
		if (Spotlight.getCurrent() != this) {
			// Force a spot here, even when we're in pointer mode,
			// to ensure that clicks inside us (e.g. to position
			// the cursor) don't cause Spotlight to unfreeze
			Spotlight.spot(this, null, true);
		}
		Spotlight.freeze();
		this.updateFocus(true);
	},

	/**
	* @private
	*/
	blurHandler: function () {
		Spotlight.unfreeze();
		this.updateFocus(false);
	},

	/**
	* @private
	*/
	disabledChangeHandler: function (oSender, oEvent) {
		this.addRemoveClass('moon-disabled', oEvent.originator.disabled);
	},

	// Spotlight Event handlers:
	/**************************************************/

	/**
	* @fires module:moonstone/Scroller~Scroller#onRequestScrollIntoView
	* @private
	*/
	spotlightFocusHandler: function () {
		this.bubble('onRequestScrollIntoView');
	},

	/**
	* @private
	*/
	spotlightSelectHandler: function (oSender, oEvent) {
		var oInput = this.getInputControl();
		if (oInput) {
			if (oInput.hasFocus() && oEvent) {
				return true;
			} else {
				oInput.focus();
			}
			return false;
		}
	},

	/**
	* @private
	*/
	spotlightBlurHandler: function (oSender, oEvent) {
		this.blur();
	},

	/**
	* @private
	*/
	spotlightLeftHandler: function (oSender, oEvent) {
		var oInput = this.getInputControl();
		if (oInput && oInput.hasFocus() && oInput.left) {
			if (oInput.left()) {
				oEvent.allowDomDefault();       // Allow keydown to bubble
				return true;                    // Prevent onSpotlightLeft to bubble
			} else {
				this.blur();
				oInput.blur();
			}
		}
	},

	/**
	* @private
	*/
	spotlightRightHandler: function (oSender, oEvent) {
		var oInput = this.getInputControl();
		if (oInput && oInput.hasFocus() && oInput.right) {
			if (oInput.right()) {
				oEvent.allowDomDefault();       // Allow keydown to bubble
				return true;                    // Prevent onSpotlightRight to bubble
			} else {
				this.blur();
				oInput.blur();
			}
		}
	},

	/**
	* @private
	*/
	spotlightUpHandler: function (oSender, oEvent) {
		var oInput = this.getInputControl();
		if (oInput && oInput.hasFocus() && oInput.up) {
			if (oInput.up()) {
				oEvent.allowDomDefault();       // Allow keydown to bubble
				return true;                    // Prevent onSpotlightUp to bubble
			} else {
				this.blur();
				oInput.blur();
			}
		}
	},

	/**
	* @private
	*/
	spotlightDownHandler: function (oSender, oEvent) {
		var oInput = this.getInputControl();
		if (oInput && oInput.hasFocus() && oInput.down) {
			if (oInput.down()) {
				oEvent.allowDomDefault();       // Allow keydown to bubble
				return true;                    // Prevent onSpotlightLeft to bubble
			} else {
				this.blur();
				oInput.blur();
			}
		}
	}
});
