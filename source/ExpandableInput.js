/**
	_moon.ExpandableInput_, which extends
	<a href="#moon.ExpandableListItem">moon.ExpandableListItem</a>, is a drop-down
	input that prompts the user to enter text.
*/
enyo.kind({
	name: "moon.ExpandableInput",
	kind: "moon.ExpandableListItem",
	classes: "moon-expandable-input",
	events: {
		/**
			Fires when the current text changes.
			_inEvent.value_ contains the value of the input.
		*/
		onChange: ""
	},
	published: {
		//* Text to be displayed in the _currentValue_ control if no item is currently selected
		noneText: "",
		//* Text to be displayed in the input if no text has been entered
		placeholder: "",
		//* Initial value
		value: ""
	},
	autoCollapse: true,
	lockBottom: true,
	
	//* @protected
	
	componentOverrides: {
		headerWrapper: {components: [
			{name: "header", kind: "moon.Item", spotlight: false, classes: "moon-expandable-list-item-header moon-expandable-picker-header moon-expandable-input-header"},
			{name: "currentValue", kind: "moon.Item", spotlight: false, classes: "moon-expandable-picker-current-value"}
		]},
		client: {name: "inputDecorator", kind: "moon.InputDecorator", onSpotlightFocus: "inputFocus", onSpotlightSelect: "expandContract", onSpotlightDown: "inputDown", components: [
			{name: "clientInput", kind: "moon.Input"}
		]}
	},
	bindings: [
		{from: ".value", to: ".$.clientInput.value"},
		{from: ".placeholder", to: ".$.clientInput.placeholder"},
		{from: ".showCurrentValue", to: ".$.currentValue.showing"},
		{from: ".currentValueText", to: ".$.currentValue.content"}
	],
	computed: {
		"showCurrentValue": ["open", "value", "noneText"],
		"currentValueText": ["value", "noneText"]
	},
	
	// Change handlers
	valueChanged: function() {
		if (this.generated) {
			this.fireChangeEvent();
		}
	},
	openChanged: function() {
		this.inherited(arguments);
		
		if (this.generated && !this.getOpen()) {
			this.updateValue();
		}
	},
	
	// Computed props
	showCurrentValue: function() {
		return !this.open && this.currentValueText() !== "";
	},
	currentValueText: function() {
		return (this.value === "") ? this.noneText : this.value;
	},
	toggleActive: function() {
		if (this.getOpen()) {
			this.setActive(false);
			enyo.Spotlight.spot(this.$.headerWrapper);
		} else {
			this.setActive(true);
			this.focusInput();
		}
	},
	//* Set _this.value_ to _this.$.clientInput.value_
	updateValue: function() {
		this.setValue(this.$.clientInput.getValue());
	},
	//* Focuses the _moon.Input_ when the input decorator receives focus.
	inputFocus: function(inSender, inEvent) {
		var direction = inEvent && inEvent.dir;
		if (this.getOpen() && direction) {
			this.focusInput();
		}
	},
	//* If navigating down from the header when the drawer is open, focus on the input field
	spotlightDown: function(inSender, inEvent) {
		if (inEvent.originator === this.$.headerWrapper && this.getOpen()) {
			this.focusInput();
		}
	},
	//* Focus on the input field
	focusInput: function() {
		this.$.clientInput.focus();
		enyo.Spotlight.spot(this.$.clientInput);
	},
	//* If _this.lockBottom_ is _true_, don't allow user to navigate down from the input field
	inputDown: function(inSender, inEvent) {
		return this.getLockBottom();
	},
	//* Fires an _onChange_ event
	fireChangeEvent: function() {
		this.doChange({value: this.value});
	},
	_marqueeSpotlightFocus: function(inSender, inEvent) {
		if (inSender === this) {
			this.$.header.startMarquee();
			this.$.currentValue.startMarquee();
		}
	},
	_marqueeSpotlightBlur: function(inSender, inEvent) {
		if (inSender === this) {
			this.$.header.stopMarquee();
			this.$.currentValue.stopMarquee();
		}
	}
});
