/**
	_moon.InputDecorator_ is a control that provides input styling. Any controls
	in the InputDecorator will appear to be inside an area styled as an	input.
	Usually, an InputDecorator surrounds a [moon.Input](#moon.Input):

		{kind: 'moon.InputDecorator', components: [
			{kind: 'moon.Input'}
		]}

	Other controls, such as buttons, may be placed to the right or left of the
	input control, e.g.:

		{kind: 'moon.InputDecorator', components: [
			{kind: 'moon.IconButton', src: 'search.png'},
			{kind: 'moon.Input'},
			{kind: 'moon.IconButton', src: 'cancel.png'}
		]}

	Note that the InputDecorator fits around the content inside it. If the
	decorator is sized, then its contents will likely need to be sized as well.

		{kind: 'moon.InputDecorator', style: 'width: 500px;', components: [
			{kind: 'moon.Input', style: 'width: 100%;'}
		]}
*/

enyo.kind({
	name              : 'moon.InputDecorator',
	kind              : 'enyo.ToolDecorator',
	//* @protected
	tag               : 'label',
	
	spotlight         : true,
	spotlightDecorate : false,

	handlers : {
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

	//* @protected
	/**************************************************/

	_oInputControl: null,

	// Returns boolean indicating whether passed-in control is an input field.
	_isInput: function(oControl) {
		return (
			oControl instanceof moon.Input		||
			oControl instanceof moon.RichText	||
			oControl instanceof moon.TextArea
		);
	},

	// Traverses tree of children to find input control.
	_findInputControl: function(oControl) {
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

	//* @public
	/**************************************************/

	create: function() {
		this.inherited(arguments);
		this.updateFocus(false);
		this._oInputControl = this._findInputControl();
		if (this._oInputControl instanceof moon.Input) {
			this.addClass("moon-input-decorator");
		}
		if (this._oInputControl instanceof moon.TextArea || this._oInputControl instanceof moon.RichText) {
			this.addClass("moon-textarea-decorator");
		}
	},

	createComponent: function() {
		this.inherited(arguments);
		this._oInputControl = this._findInputControl();
	},

	createComponents: function() {
		this.inherited(arguments);
		this._oInputControl = this._findInputControl();
	},

	updateFocus: function(bFocus) {
		this.focused = bFocus;
		this.addRemoveClass('moon-focused', this.alwaysLooksFocused || this.focused);
	},

	getInputControl: function() {
		return this._oInputControl;
	},

	//* @protected
	// Event handlers:
	/**************************************************/
	focusHandler: function(oSender, oEvent) {
		if (enyo.Spotlight.getCurrent() != this) {
			// Force a spot here, even when we're in pointer mode,
			// to ensure that clicks inside us (e.g. to position
			// the cursor) don't cause Spotlight to unfreeze
			enyo.Spotlight.spot(this, null, true);
		}
		enyo.Spotlight.freeze();
		this.updateFocus(true);
	},

	blurHandler: function() {
		enyo.Spotlight.unfreeze();
		this.updateFocus(false);
	},

	disabledChangeHandler: function(oSender, oEvent) {
		this.addRemoveClass('moon-disabled', oEvent.originator.disabled);
	},

	// Spotlight Event handlers:
	/**************************************************/

	spotlightFocusHandler: function() {
		this.bubble("onRequestScrollIntoView");
	},

	spotlightSelectHandler: function(oSender, oEvent) {
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

	spotlightBlurHandler: function(oSender, oEvent) {
		this.blur();
	},

	spotlightLeftHandler: function(oSender, oEvent) {
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

	spotlightRightHandler: function(oSender, oEvent) {
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

	spotlightUpHandler: function(oSender, oEvent) {
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

	spotlightDownHandler: function(oSender, oEvent) {
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
