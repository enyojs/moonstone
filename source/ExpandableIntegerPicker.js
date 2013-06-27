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
	//* @protected
	defaultKind: "moon.SimpleIntegerPicker",
	handlers: {
		onActivate: "activated",
		requestScrollIntoView: "requestScrollIntoView"
	},
	components: [
		{name: "header", kind: "moon.Item", classes: "moon-expandable-integer-picker-header", spotlight: true,
			onSpotlightFocus: "headerFocus", ontap: "expandContract", onSpotlightSelect: "expandContract"
		},
		{name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep", classes:"moon-expandable-integer-picker-drawer"},
		{name: "currentValue", kind: "moon.Item", spotlight: false, classes: "moon-expandable-integer-picker-current-value", ontap: "expandContract", content: ""},
		{name: "bottom", kind: "enyo.Control", spotlight: true, onSpotlightFocus: "spotlightFocusBottom"}
	],
	create: function() {
		this.inherited(arguments);
		this.createComponent({name: "client", kind: "moon.SimpleIntegerPicker", value: this.value, min: this.min, max: this.max, unit: this.unit, onChange: "changeHandler", onSelect: "selectHandler"});
		this.noneTextChanged();
		this.updateContent();
		this.openChanged();
	},
	initComponents: function() {
		this.controlParentName = "drawer";
		this.discoverControlParent();
		this.inherited(arguments);
	},
	valueChanged: function(inOld) {
		this.$.client.setValue(this.value);
	},
	updateContent: function() {
		if(this.$.client.content !== this.content) {
			this.value = this.$.client.value;
			this.content = this.$.client.content;
			this.$.currentValue.setContent(this.content);
			this.fireChangeEvent();
		}
	},
	//* If there is no selected item, uses _this.noneText_ as current value.
	noneTextChanged: function() {
		if(this.$.client.getValue() == -1) {
			this.$.currentValue.setContent(this.getNoneText());
		}
	},
	//* When _this.open_ changes, shows/hides _this.$.currentValue_.
	openChanged: function() {
		this.inherited(arguments);
		this.preventResize = false;
		this.$.currentValue.setShowing(!this.open);
		this.$.bottom.setShowing(this.open);
	},
	//* When an item is chosen, marks it as checked and closes the picker.
	selectHandler: function(inSender, inEvent) {
		var _this = this;
		if (this.isRendered) {
			setTimeout(function() {
				_this.setOpen(false);
				_this.active = false;
				enyo.Spotlight.spot(_this);
			}, 300);
		}
	},
	changeHandler: function(inSender, inEvent) {
		this.updateContent();
	},
	//* Capture onActivate events to prevent bubbling
	activated: function(inSender, inEvent) {
		//* Prevent bubbling if _inEvent.originator_ is not an instance of _this.kind_
		var eli = inEvent.originator instanceof moon.ExpandableListItem;
		if (!eli) {
			return true;
		}
	},
	//* Fires an _onChange_ event.
	fireChangeEvent: function() {
		this.doChange({
			value: this.value,
			content: this.content
		});
	},
	resized: function() {
		if (!this.preventResize){
			this.$.client.resized();
			this.preventResize = true;
		}
	}
});
