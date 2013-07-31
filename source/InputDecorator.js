/**
	_moon.InputDecorator_ is a control that provides input styling. Any controls
	in the InputDecorator will appear to be inside an area styled as an	input.
	Usually, an InputDecorator surrounds a <a href='#moon.Input'>moon.Input</a>:

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
	tag               : 'label',
	classes           : 'moon-input-decorator',
	spotlight         : true,
	spotlightDecorate : false,

	handlers : {
		onDisabledChange  : 'onDisabledChange',
		onfocus           : 'onFocus',
		onblur            : 'onBlur',
		onSpotlightSelect : 'onSpotlightSelect',
		onSpotlightBlur   : 'onSpotlightBlur',
		onSpotlightLeft   : 'onSpotlightLeft',
		onSpotlightRight  : 'onSpotlightRight',
		onSpotlightUp     : 'onSpotlightUp',
		onSpotlightDown   : 'onSpotlightDown'
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


	// Event handlers:
	/**************************************************/

	onFocus: function(oSender, oEvent) {
		enyo.Spotlight.spot(this);
		// enyo.Spotlight.disablePointerMode();
		this.updateFocus(true);
	},

	onBlur: function() {
		// enyo.Spotlight.enablePointerMode();
		this.updateFocus(false);
	},

	onDisabledChange: function(oSender, oEvent) {
		this.addRemoveClass('moon-disabled', oEvent.originator.disabled);
	},

	// Spotlight Event handlers:
	/**************************************************/

	onSpotlightSelect: function(oSender, oEvent) {
		var oInput = this.getInputControl();
		var textArea = oInput instanceof moon.TextArea;
		if (textArea && !oInput.hasFocus() && oEvent && (oEvent.keyCode === 13)) {
			this.focus();
			return false;
		}
		this.focus();
		if (oInput && oInput.hasFocus() && oEvent) {
			oEvent.allowDomDefault();            // Allow keydown to bubble
			return true;                         // Prevent onSpotlightLeft to bubble
		}
	},

	onSpotlightBlur: function(oSender, oEvent) {
		this.blur();
	},

	onSpotlightLeft: function(oSender, oEvent) {
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

	onSpotlightRight: function(oSender, oEvent) {
		var oInput = this.getInputControl();
		if (oInput && oInput.hasFocus() && oInput.right) {
			if (oInput.right()) {
				oEvent.allowDomDefault();       // Allow keydown to bubble
				return true;                    // Prevent onSpotlightLeft to bubble
			} else {
				this.onBlur();
				oInput.blur();
			}
		}
	},

	onSpotlightUp: function(oSender, oEvent) {
		var oInput = this.getInputControl();
		if (oInput && oInput.hasFocus() && oInput.up) {
			if (oInput.up()) {
				oEvent.allowDomDefault();       // Allow keydown to bubble
				return true;                    // Prevent onSpotlightLeft to bubble
			} else {
				this.blur();
				oInput.blur();
			}
		}
	},

	onSpotlightDown: function(oSender, oEvent) {
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
