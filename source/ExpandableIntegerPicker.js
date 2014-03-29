/**
	_moon.ExpandableIntegerPicker_, which extends
	[moon.ExpandableListItem](#moon.ExpandableListItem), is a drop-down picker
	menu that prompts the user to make a selection from a range of integer-based
	options.

	The value of the currently selected item is available in the picker's _value_
	property, while the content of the item is available in _content_.

	When the picker is minimized, the content of the currently selected item is
	displayed as subtext below the picker label.
*/
enyo.kind({
	name: "moon.ExpandableIntegerPicker",
	kind: "moon.ExpandableListItem",
	//* @protected
	classes: "moon-expandable-integer-picker",
	//* @public
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
		//* Initial value of the picker
		value: -1,
		//* Minimum value of the picker
		min: 0,
		//* Maximum value of the picker
		max: 9,
		//* Amount to increment/decrement by
		step: 1,
		//* Unit/label to be appended to the end of the number
		unit: "sec"
	},
	//* @protected
	lockBottom: true,
	autoCollapse: true,

	handlers: {
		requestScrollIntoView: "requestScrollIntoView"
	},
	components: [
		{name: "headerWrapper", kind: "moon.Item", classes: "moon-expandable-picker-header-wrapper", onSpotlightFocus: "headerFocus", ontap: "expandContract", components: [
			{name: "header", kind: "moon.MarqueeText", classes: "moon-expandable-list-item-header moon-expandable-picker-header"},
			{name: "currentValue", kind: "moon.MarqueeText", classes: "moon-expandable-picker-current-value"}
		]},
		{name: "drawer", kind: "enyo.Drawer", resizeContainer:false, classes:"moon-expandable-list-item-client indented", components: [
			{name: "picker", kind: "moon.SimpleIntegerPicker", deferInitialization: true, onSelect: "toggleActive", onActivate: "activated"}
		]}
	],
	bindings: [
		{from: ".min", to: ".$.picker.min"},
		{from: ".max", to: ".$.picker.max"},
		{from: ".step", to: ".$.picker.step"},
		{from: ".unit", to: ".$.picker.unit"},
		{from: ".value", to: ".$.picker.value", oneWay: false},
		{from: ".showCurrentValue", to: ".$.currentValue.showing"},
		{from: ".currentValueText", to: ".$.currentValue.content"},
		{from: ".disabled", to: ".$.headerWrapper.disabled"}
	],
	computed: {
		"showCurrentValue": ["open"],
		"currentValueText": ["value", "unit", "noneText"]
	},

	// Change handlers
	valueChanged: function(inOld) {
		if (this.value < this.min || this.value > this.max) {
			this.value = inOld;
		}
		this.fireChangeEvent();
	},
	openChanged: function() {
		this.inherited(arguments);
		this.setActive(this.getOpen());
	},

	// Computed props
	showCurrentValue: function() {
		return !this.open;
	},
	currentValueText: function() {
		return (this.value === "") ? this.noneText : this.value + " " + this.unit;
	},

	//* Sets _this.value_ to _this.$.clientInput.value_.
	updateValue: function() {
		this.setValue(this.$.picker.getValue());
	},
	//* If open, closes and spots header. If closed, opens and unspots.
	toggleActive: function() {
		if (this.getOpen()) {
			this.setActive(false);
			if (!enyo.Spotlight.getPointerMode()) {
				enyo.Spotlight.spot(this.$.headerWrapper);
			}
		} else {
			this.setActive(true);
		}
	},
	//* Kills any _onActivate_ events coming from buttons in the SimplePicker.
	activated: function(inSender, inEvent) {
		return true;
	},
	//* Fires an _onChange_ event.
	fireChangeEvent: function() {
		this.doChange({value: this.value, content: this.content});
	},
	spotlightDown: function(inSender, inEvent) {
		if (this.getLockBottom() && (inEvent.originator === this.$.picker) && this.getOpen()) {
			return true;
		}
	}
});
