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
		//* Boolean indicating whether toggle button is currently in the "on"
		//* state
		value: false,
		//* Button text displayed in the "on" state. If empty, will default to
		//* displaying _content_ as button text
		toggleOnLabel: "",
		//* Button text displayed in the "off" state. If empty, will default to
		//* displaying _content_ as button text
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
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.updateContent();
			this.updateVisualState();
		};
	}),
	rendered: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.setActive(this.value);
			this.fireChangeEvent();
			this._rendered = true;
		};
	}),
	updateVisualState: function() {
		this.addRemoveClass("moon-toggle-button-on", this.value && !this.disabled);
	},
	disabledChanged: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.updateVisualState();
		};
	}),
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
