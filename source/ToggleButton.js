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
		//* App developer has the choice to ust set the one label for both toggle on and toggle off content, or they have a toggle on label and toggle off label
		//* Label for toggle button's "on" state, which is set programmatically by app developer
		toggleOnLabel: "",
		//* Label for toggle button's "off" state, which is set programmatically by app debeloper
		toggleOffLabel: ""
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
	_rendered: false,
	classes: "moon-toggle-button",
	create: function() {
		this.inherited(arguments);
		this.updateContent();
		this.updateVisualState();
	},
	rendered: function() {
		this.inherited(arguments);
		this.setActive(this.value);
		this.fireChangeEvent();
		this._rendered = true;
	},
	updateVisualState: function() {
		this.addRemoveClass("moon-toggle-button-on", this.value);
	},
	valueChanged: function() {
		this.updateContent();
		this.updateVisualState();
		this.setActive(this.value);
		this.fireChangeEvent();
	},
	toggleOnLabelChanged: function() {
		this.updateContent();
	}, 
	toggleOffLabelChanged: function() {
		this.updateContent();
	},
	// we override the inherited activeChanged method
	activeChanged: function() {
		if (this._rendered) {
			this.active = enyo.isTrue(this.active);
			this.setValue(this.active);
		}
		this.bubble("onActivate");
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
		if (!this.toggleOnLabel || !this.toggleOffLabel) {
			this.setContent(this.content);
		} else {
			this.setContent(this.value ? this.toggleOnLabel : this.toggleOffLabel);
		}
	},
	fireChangeEvent: function() {
		this.doChange({value: this.value});
	}
});
