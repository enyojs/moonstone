/**
	_moon.ToggleButton_, which extends [moon.Button](#moon.Button), is a button
	with two states, "on" and "off".  When the ToggleButton is tapped, it switches
	its state and fires an _onChange_ event.

	One has the choice to show the same text (via the _content_ property) for 
	both toggle states, or different text can be shown for each toggle state, 
	utilizing the _toggleOnLabel_ and the _toggleOffLabel_. Note that both of 
	these properties need to be set to display differentiating text, otherwise 
	the _content_ property will be shown for the button text.
*/

enyo.kind({
	name: "moon.ToggleButton",
	kind: "moon.Button",
	//* @public
	published: {
		//* If true, indicates that this is the active button of the group;
		//* otherwise, false
		active: false,
		//* Boolean indicating whether toggle button is currently in the "on"
		//* state
		value: false,
		//* Button text displayed in the "on" state. If empty, will default to 
		//* displaying _content_ as button text
		toggleOnLabel: "",
		//* Button text displayed in the "off" state. If empty, will default to 
		//* displaying _content_ as button text
		toggleOffLabel: "",
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
	bindings: [
		{from: ".value", to: ".active", oneWay: false}
	],
	//* @protected
	classes: "moon-toggle-button",
	create: function() {
		this.inherited(arguments);
		this.set("value", Boolean(this.value || this.active), true);
		this.active = this.value;
		this.disabledChanged();
	},
	updateVisualState: function() {
		this.addRemoveClass("moon-toggle-switch-off",!this.value);
		this.addRemoveClass("moon-toggle-switch-on",this.value);
	},
	activeChanged: function() {
		this.bubble("onActivate");
	},
	valueChanged: function() {
		this.updateContent();
		this.updateVisualState();
		this.doChange({value: this.value});
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
		if (!this.toggleOnLabel || !this.toggleOffLabel) {
			this.setContent(this.content);
		} else {
			this.setContent(this.value ? this.toggleOnLabel : this.toggleOffLabel);
		}
	}
});
