/**
	_moon.ExpandableInput_, which extends
	[moon.ExpandableListItem](#moon.ExpandableListItem), is a drop-down input that
	prompts the user to enter text.
*/
enyo.kind({
	name: "moon.ExpandableInput",
	kind: "moon.ExpandableListItem",
	//* @protected
	classes: "moon-expandable-input",
	//* @public
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
		//* Initial value of the input
		value: ""
	},
	//* @protected
	autoCollapse: true,
	lockBottom: false,

	components: [
		{name: "headerWrapper", kind: "moon.Item", classes: "moon-expandable-picker-header-wrapper", onSpotlightFocus: "headerFocus", ondown: "headerDown", ontap: "expandContract", components: [
			// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
			{name: "headerContainer", classes: "moon-expandable-list-item-header moon-expandable-picker-header moon-expandable-input-header", components: [
				{name: "header", kind: "moon.MarqueeText"}
			]},
			{name: "currentValue", kind: "moon.MarqueeText", classes: "moon-expandable-picker-current-value"}
		]},
		{name: "drawer", kind: "enyo.Drawer", resizeContainer:false, classes:"moon-expandable-list-item-client indented", components: [
			{name: "inputDecorator", kind: "moon.InputDecorator", onSpotlightBlur: "inputBlur", onSpotlightFocus: "inputFocus", onSpotlightDown: "inputDown", components: [
				{name: "clientInput", kind: "moon.Input", onchange: "doChange", onkeydown: "inputKeyDown"}
			]}
		]}
	],
	bindings: [
		{from: ".value", to: ".$.clientInput.value", oneWay: false},
		{from: ".placeholder", to: ".$.clientInput.placeholder"},
		{from: ".showCurrentValue", to: ".$.currentValue.showing"},
		{from: ".currentValueText", to: ".$.currentValue.content"},
		{from: ".disabled", to: ".$.headerWrapper.disabled"}
	],
	computed: {
		"showCurrentValue": ["open", "value", "noneText"],
		"currentValueText": ["value", "noneText"]
	},

	// Computed props
	showCurrentValue: function() {
		return !this.open && this.currentValueText() !== "";
	},
	currentValueText: function() {
		return (this.value === "") ? this.noneText : this.value;
	},
	expandContract: function() {
		if (this.disabled) {
			return true;
		}
		this.toggleActive();
	},
	toggleActive: function() {
		if (this.getOpen()) {
			this.setActive(false);
			this.$.clientInput.blur();
		} else {
			this.setActive(true);
			enyo.Spotlight.unspot();
			enyo.Spotlight.freeze();
		}
	},
	//* Focuses the _moon.Input_ when the input decorator receives focus.
	inputFocus: function(inSender, inEvent) {
		var direction = inEvent && inEvent.dir;
		if (this.getOpen() && direction) {
			this.focusInput();
		}
	},
	//* value should submit if user clicks outside control. We check for "down" to make sure not to contract on mousemove
	inputBlur: function(inSender, inEvent) {
		if (this.$.clientInput.hasFocus() && enyo.Spotlight.getPointerMode() && enyo.Spotlight.getLastEvent().type === "down") {
			this.expandContract();
		}
	},
	inputKeyDown: function(inSender, inEvent) {
		if (inEvent.keyCode === 13) {
			this.closeDrawerAndHighlightHeader();
		}
	},
	headerDown: function() {
		enyo.Spotlight.unfreeze();
	},
	/**
		Focuses the input field if navigating down from the header while the drawer
		is open.
	*/
	spotlightDown: function(inSender, inEvent) {
		if (inEvent.originator === this.$.headerWrapper && this.getOpen()) {
			this.focusInput();
		}
	},
	//* Focuses the input field.
	focusInput: function() {
		this.$.clientInput.focus();
		// Force cursor to end of text. We were sometimes seeing the
		// cursor positioned at the start of the text, which caused
		// problems in 5-way mode (where there's no way to move the
		// cursor).
		this.$.clientInput.hasNode().selectionStart = this.value.length;
	},
	/**
		If _this.lockBottom_ is _true_, don't allow user to navigate down from the
		input field. If _this.lockBottom_ is _false_, close drawer and return true 
		to keep spotlight on header.
	*/
	inputDown: function(inSender, inEvent) {
		if (this.getLockBottom()) {
			this.focusInput();
		} else {
			this.closeDrawerAndHighlightHeader();
		}
		return true; 
	},
	drawerAnimationEnd: function() {
		enyo.Spotlight.unfreeze();
		this.focusInput();
		this.inherited(arguments);
	},
	/** 
		We manually set pointer mode to false as it was seemingly the
		least harmful method to re-highlight the header after the drawer
		closes. The other options had side effects of resetting the 
		current spotted control to the root, or requiring a double-press to 
		subsequently 5-way move.
	*/
	closeDrawerAndHighlightHeader: function() {
		enyo.Spotlight.setPointerMode(false);
		enyo.Spotlight.unfreeze();
		enyo.Spotlight.spot(this.$.headerWrapper);
		this.expandContract();
	}
});
