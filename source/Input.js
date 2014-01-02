/**
	_moon.Input_ is a Moonstone-styled input control, derived from
	[enyo.Input](#enyo.Input). Typically, a _moon.Input_ is placed inside a
	[moon.InputDecorator](#moon.InputDecorator), which provides styling, e.g.:

		{kind: 'moon.InputDecorator', components: [
			{kind: 'moon.Input', placeholder: 'Enter some text...', onchange: 'inputChange'}
		]}

	For more information, see the documentation on [Text
	Fields](building-apps/controls/text-fields.html) in the Enyo Developer Guide.
*/

enyo.kind({
	name	: 'moon.Input',
	kind	: 'enyo.Input',
	//* @protected
	classes	: 'moon-input',
	//* @public
	published: {
		//* When true, blur on Enter keypress (if focused)
		dismissOnEnter: false,
		//* Limits the length of the input
		maxLength: 128
	},
	//* @protected
	handlers: {
		onkeypress : 'onKeyUp',
		onblur     : 'onBlur',
		onfocus    : 'onFocus'
	},

	//* @protected
	/**********************************************/
	
	_bFocused: false, // Used only for dismissOnEnter feature, cannot rely on hasFocus in this case because of racing condition

	create: function() {
		this.inherited(arguments);
		this.maxLengthChanged();
	},
	onFocus: function() {
		if (this.dismissOnEnter) {
			var oThis = this;
			enyo.asyncMethod(this, function() {oThis._bFocused = true;});
		}
	},
	onBlur: function() {
		if (this.dismissOnEnter) {
			this._bFocused = false;
		}
	},
	onKeyUp: function(oSender, oEvent) {
		if (this.dismissOnEnter) {
			if (oEvent.keyCode == 13) {
				if (this._bFocused) {
					this.blur();
				}
			}
		}
	},

	blur: function() {
		if (this.hasNode()) {
			this.node.blur();
		}
	},

	left: function() {
		if (!this.hasNode() || this.node.selectionStart === 0) {
			return false;
		}
		return true;
	},

	right: function() {
		if (!this.hasNode() || this.node.selectionStart == this.node.value.length) {
			return false;
		}
		return true;
	},

	up: function() {
		return false;
	},

	down: function() {
		return false;
	},
	maxLengthChanged: function() {
		this.setAttribute("maxlength", this.maxLength);
		if (this.getNodeProperty("maxlength", this.maxLength) !== this.maxLength) {
			this.setNodeProperty("maxlength", this.maxLength);
		}
	}
});
