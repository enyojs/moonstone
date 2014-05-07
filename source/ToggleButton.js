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
		//* If true, indicates that this is the active button of the group;
		//* otherwise, false
		active: false,
		//* Boolean indicating whether toggle button is currently in the "on"
		//* state
		value: false,
		//* App developer has the choice to ust set the one label for both toggle on and toggle off content, or they have a toggle on label and toggle off label
		//* Label for toggle button's "on" state, which is set programmatically by app developer
		toggleOnLabel: "",
		//* Label for toggle button's "off" state, which is set programmatically by app debeloper
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
	//* @protected
	classes: "moon-toggle-button",
	create: function() {
		this.inherited(arguments);
		this.value = Boolean(this.value || this.active);
		this.updateContent();
		this.updateVisualState();
		this.disabledChanged();
		},
	updateVisualState: function() {
		this.addRemoveClass("moon-toggle-switch-off",!this.value);
		this.addRemoveClass("moon-toggle-switch-on",this.value);
		this.setActive(this.value);
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
