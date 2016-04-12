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
	$L = require('../i18n'),
	Input = require('../Input'),
	RichText = require('../RichText'),
	TextArea = require('../TextArea'),
	Tooltip = require('../Tooltip');

/**
* {@link module:moonstone/InputDecorator~InputDecorator} is a control that provides input styling. Any controls
* in the InputDecorator will appear to be inside an area styled as an input. Usually,
* an InputDecorator surrounds a {@link module:moonstone/Input~Input}:
*
* ```
* 	var
* 		kind = require('enyo/kind'),
* 		Input = require('moonstone/Input'),
* 		InputDecorator = require('moonstone/InputDecorator');
*
* 	{kind: InputDecorator, components: [
* 		{kind: Input}
* 	]}
* ```
*
* Other controls, such as buttons, may be placed to the right or left of the
* input control, e.g.:
*
* ```
* 	var
* 		IconButton = require('moonstone/IconButton');
*
* 	{kind: InputDecorator, components: [
* 		{kind: IconButton, src: '@../assets/search.png'},
* 		{kind: Input},
* 		{kind: IconButton, src: '@../assets/cancel.png'}
* 	]}
* ```
*
* Note that the InputDecorator fits around the content inside it. If the
* decorator is sized, then its contents will likely need to be sized as well.
*
* ```
* 	{kind: InputDecorator, style: 'width: 500px;', components: [
* 		{kind: Input, style: 'width: 100%;'}
* 	]}
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
	* When `true`, the message tooltip is shown if it exists.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	invalid: false,

	/**
	* The tooltip text to be displayed when the contents of the input are invalid. If this value is
	* falsy, the tooltip will not be shown.
	*
	* @type {String}
	* @default ''
	* @public
	*/
	invalidMessage: '',

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
		onDisabledChange    : 'disabledChangeHandler',
		onfocus             : 'focusHandler',
		onblur              : 'blurHandler',
		onSpotlightFocused  : 'spotlightFocusedHandler',
		onSpotlightSelect   : 'spotlightSelectHandler',
		onSpotlightBlur     : 'spotlightBlurHandler',
		onSpotlightLeft     : 'spotlightLeftHandler',
		onSpotlightRight    : 'spotlightRightHandler',
		onSpotlightUp       : 'spotlightUpHandler',
		onSpotlightDown     : 'spotlightDownHandler'
	},

	/**
	* @private
	*/
	tools: [
		{name: 'tooltip', kind: Tooltip, floating: false, position: 'right top'}
	],

	/**
	* @private
	*/
	observers: [
		{path: ['invalid', 'invalidMessage'], method: 'updateValidity'}
	],

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

		this.updateValidity();
	},

	/**
	* @private
	*/
	createComponent: function () {
		var ret = ToolDecorator.prototype.createComponent.apply(this, arguments);
		this._oInputControl = this._findInputControl();
		return ret;
	},

	/**
	* @private
	*/
	createComponents: function () {
		var ret = ToolDecorator.prototype.createComponents.apply(this, arguments);
		this._oInputControl = this._findInputControl();
		return ret;
	},

	/**
	* Updates styling based on focus state.
	*
	* @param {Boolean} bFocus - Whether to add/remove `moon-focused` class.
	* @public
	*/
	updateFocus: function (bFocus) {
		this.set('focused', bFocus);
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
			Spotlight.spot(this, {focusType: 'point'});
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
	spotlightFocusedHandler: function () {
		this.set('spotted', true);
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
		this.set('spotted', false);
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
	},

	// Change handlers

	/**
	* @private
	*/
	updateValidity: function () {
		var comps, length, i;
		// we want the ability to add the 'moon-invalid' class even if there is no invalid message
		this.addRemoveClass('moon-invalid', this.invalid);
		if (this.invalid && this.invalidMessage) {
			if (!this.$.tooltip) { // lazy creation of tooltip
				comps = this.createComponents(this.tools);
				if (this.hasNode()) {
					// rendering only the created tools, to prevent loss of focus on the input
					for (i = 0, length = comps.length; i < length; i++) {
						comps[i].render();
					}
				}
				this.$.tooltip.activator = this;
			}
			this.$.tooltip.set('content', this.invalidMessage);
			this.$.tooltip.set('showing', true);
		} else if (this.$.tooltip) {
			this.$.tooltip.set('showing', false);
		}
	},

	// Accessibility

	/**
	* spotted and focused can change in sequence but within the same cycle causing the TV to read
	* changes when spotting a different control. Enabling this will batch up those changes into
	* one DOM update thereby avoiding this behavior.
	*
	* @type {Boolean}
	* @default true
	* @private
	*/
	accessibilityDefer: true,

	/**
	* @private
	*/
	ariaObservers: [
		{path: ['spotted', 'focused'], method: function () {
			var text = '',
				oInput = this.getInputControl();

			this.set('accessibilityLive', this.focused || !this.spotted ? null : 'polite');
			if (oInput) {
				if (oInput instanceof RichText && oInput.hasNode()) {
					text = (oInput.hasNode().innerText || oInput.getPlaceholder()) + ' ' + $L('edit box');
				} else if (oInput.type == 'password' && oInput.getValue()) {
					var character = (oInput.getValue().length > 1) ? $L('characters') : $L('character');
					text = oInput.getValue().length + ' ' + character + ' ' + $L('edit box');
				} else {
					text = (oInput.getValue() || oInput.getPlaceholder()) + ' ' + $L('edit box');
				}
			}
			this.set('accessibilityLabel', this.spotted && !this.focused ? text : null);
		}}
	]
});
