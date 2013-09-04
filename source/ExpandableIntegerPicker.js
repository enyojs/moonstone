/**
	_moon.ExpandableIntegerPicker_, which extends
	<a href="#moon.ExpandableListItem">moon.ExpandableListItem</a>, is a drop-down
	picker menu that prompts the user to make a selection from a range of
	integer-based options.

	The value of the currently selected item is available in the picker's _value_
	property, while the content of the item is available in _content_.

	When the picker is minimized, the content of the currently selected item is
	displayed as subtext below the picker label.
*/
enyo.kind({
	name: "moon.ExpandableIntegerPicker",
	kind: "moon.ExpandableListItem",
	classes: "moon-expandable-integer-picker",
	events: {
		/**
			Fires when the currently selected item changes.
			_inEvent.value_ contains the value of the currently selected item.
			_inEvent.content_ contains the content of the currently selected item.
		*/
		onChange: ""
	},
	published: {
		//* Text to be displayed in the _currentValue_ control if no item is currently selected
		noneText: "",
		//* Initial value
		value: -1,
		//* Minimum value
		min: 0,
		//* Maximum value
		max: 9,
		//* Amount to increment/decrement by
		step: 1,
		//* Unit/label to be appended to the end of the number
		unit: "sec"
	},
	lockBottom: true,

	//* @protected

	handlers: {
		requestScrollIntoView: "requestScrollIntoView"
	},
	componentOverrides: {
		headerWrapper: {components: [
			{name: "header", kind: "moon.Item", spotlight: false, classes: "moon-expandable-list-item-header moon-expandable-picker-header"},
			{name: "currentValue", kind: "moon.Item", spotlight: false, classes: "moon-expandable-picker-current-value"}
		]},
		client: {components: [
			{name: "picker", kind: "moon.SimpleIntegerPicker", onSelect: "toggleActive", onActivate: "activated"}
		]}
	},
	bindings: [
		{from: ".min", to: ".$.picker.min"},
		{from: ".max", to: ".$.picker.max"},
		{from: ".unit", to: ".$.picker.unit"},
		{from: ".value", to: ".$.picker.value"},
		{from: ".showCurrentValue", to: ".$.currentValue.showing"},
		{from: ".currentValueText", to: ".$.currentValue.content"}
	],
	computed: {
		"showCurrentValue": ["open"],
		"currentValueText": ["value", "noneText"]
	},

	// Change handlers
	valueChanged: function() {
		this.fireChangeEvent();
	},
	openChanged: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);

			if (!this.getOpen()) {
				this.updateValue();
			}

			this.preventResize = false;
		};
	}),
	activeChanged: function() {
		var active = this.getActive();
		if (active) {
			// enyo.Group's highlander logic actually prevents an item from being
			// de-activated once it's been activated; that's not exactly the logic
			// we want for ExpandablePicker, so we only notify the group when an
			// item is activated, not when it's de-activated.
			this.bubble("onActivate");
		}
		this.setOpen(active);
	},

	// Computed props
	showCurrentValue: function() {
		return !this.open;
	},
	currentValueText: function() {
		return (this.value === "") ? this.noneText : this.value + " " + this.unit;
	},

	//* Set _this.value_ to _this.$.clientInput.value_
	updateValue: function() {
		this.setValue(this.$.picker.getValue());
	},
	//* If open, close and spot header. If closed, open and unspot.
	toggleActive: function() {
		if (this.getOpen()) {
			this.setActive(false);
			enyo.Spotlight.spot(this.$.headerWrapper);
		} else {
			this.setActive(true);
			enyo.Spotlight.unspot();
		}
	},
	//* Kill any onActivate events coming from buttons in the SimplePicker
	activated: function(inSender, inEvent) {
		return true;
	},
	//* Fires an _onChange_ event.
	fireChangeEvent: function() {
		this.doChange({value: this.value, content: this.content});
	},
	//* Resize _this.$.picker_
	resized: function() {
		if (!this.preventResize) {
			this.$.picker.resized();
			this.preventResize = true;
		}
	}
});
