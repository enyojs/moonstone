/**
	_moon.ToggleButton_, which extends <a href="#moon.Button">moon.Button</a>,
	is a button with two states, "on" and "off".  When the ToggleButton is tapped,
	it switches its state and fires an _onChange_ event.
*/

enyo.kind({
	name: "moon.ToggleButton",
	kind: "moon.Button",
	published: {
		//* If true, indicates that this is the active button of the group;
		//* otherwise, false
		active: false,
		//* Boolean indicating whether toggle button is currently in the "on"
		//* state
		value: false,
		//* Label for toggle button's "on" state
		onContent: $L("On"),
		//* Label for toggle button's "off" state
		offContent: $L("Off"),
		//* Label for separator
		labelSeparator: $L(":"), 
		//* If true, toggle button cannot be tapped and thus will not generate
		//* any events
		disabled: false
	},
	events: {
		/**
			Fires when the user changes the value of the toggle button,	but not
			when the value is changed programmatically.

			_inEvent.value_ contains the value of the toggle button.
		*/
		onChange: ""
	},
	//* @protected
	classes: "moon-toggle-button",
	create: function() {
		this.inherited(arguments);
		this.value = Boolean(this.value || this.active);
		this.updateContent();
		this.disabledChanged();
	},
	initComponents: function() {
		this.inherited(arguments);
		this.$.client.addClass("moon-toggle-button-text");
	},
	rendered: function() {
		this.inherited(arguments);
		this.updateVisualState();
	},
	updateVisualState: function() {
		this.addRemoveClass("moon-overlay", this.value);
		this.setActive(this.value);
	},
	contentChanged: function() {
		this.updateContent();
	},
	activeChanged: function() {
		this.setValue(this.active);
		this.bubble("onActivate");
	},
	valueChanged: function() {
		this.updateContent();
		this.updateVisualState();
		this.doChange({value: this.value});
	},
	onContentChanged: function() {
		this.updateContent();
	}, 
	offContentChanged: function() {
		this.updateContent();
	},
	labelSeparatorChanged: function() {
		this.updateContent();
	},
	disabledChanged: function() {
		this.setAttribute("disabled", this.disabled);
	},
	updateValue: function(inValue) {
		if (!this.disabled) {
			this.setValue(inValue);
		}
	},
	tap: function() {
		this.updateValue(!this.value);
	},
	updateContent: function() {
		this._postfix = (this.value) ? this.onContent : this.offContent;
		if (this.$.client) {
			this.$.client.setContent((this.content || "") + (this.labelSeparator || " ") + (this._postfix || ""));
		}
	}
});
