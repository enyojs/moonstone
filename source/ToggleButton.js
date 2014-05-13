/**
	_moon.ToggleButton_, which extends [moon.Button](#moon.Button), is a button
	with two states, "on" and "off".  When the ToggleButton is tapped, it switches
	its state and fires an _onChange_ event.
*/

enyo.kind({
	name: "moon.ToggleButton",
	kind: "moon.Button",
	//* @public
	published: {
		//* Boolean indicating whether toggle button is currently in the "on"
		//* state
		value: false,
		//* Label for toggle button's "on" state
		onContent: moon.$L("On"),  // i18n "ON" label in moon.ToggleButton widget
		//* Label for toggle button's "off" state
		offContent: moon.$L("Off"),  // i18n "OFF" label in moon.ToggleButton widget
		//* Label for separator
		labelSeparator: moon.$L(": ")   // i18n Separator between moon.ToggleButton text label and ON/OFF indicator
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
	isRendered: false,
	classes: "moon-toggle-button",
	create: function() {
		this.inherited(arguments);
		this.updateContent();
		this.disabledChanged();
	},
	initComponents: function() {
		this.inherited(arguments);
		this.$.client.addClass("moon-toggle-button-text");
	},
	rendered: function() {
		this.inherited(arguments);
		this.valueChanged();
		this.isRendered = true;
	},
	updateVisualState: function() {
		this.addRemoveClass("moon-overlay", this.value);
	},
	contentChanged: function() {
		this.updateContent();
	},
	// we override the inherited activeChanged method
	activeChanged: function() {
		if (this.isRendered) {
			this.active = enyo.isTrue(this.active);
			this.setValue(this.active);
		}
		this.bubble("onActivate");
	},
	valueChanged: function() {
		this.updateContent();
		this.updateVisualState();
		this.setActive(this.value);
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
	// we override the inherited tap method
	tap: function() {
		if (this.disabled) {
			return true;
		} else {
			this.setValue(!this.value);
		}
	},
	updateContent: function() {
		var content = this.getContent();
		content = this.contentUpperCase ? enyo.toUpperCase(content) : content;
		var postfix = enyo.toUpperCase(this.value ? this.onContent : this.offContent);
		if (this.$.client) {
			this.$.client.setContent((content || "") + (this.labelSeparator || " ") + (postfix || ""));
		}
	}
});
