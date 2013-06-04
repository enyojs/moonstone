/**
	_moon.ExpandablePicker_, which extends
	<a href="#moon.ExpandableListItem">moon.ExpandableListItem</a>, is a drop-down
	picker menu that solicits a choice from the user. The picker's child
	components, which are instances of <a href="#moon.LabeledCheckbox">moon.LabeledCheckbox</a>
	by default, provide the options for the picker.

		{kind: "moon.ExpandablePicker", noneText: "None Selected", content: "Choose City", components: [
			{content: "San Francisco"},
			{content: "Boston"},
			{content: "Tokyo"}
		]}

	The currently selected item is available in the picker's _selected_ property
	and may be accessed in the normal manner, by calling _get("selected")_ and
	_set("selected", &lt;value&gt;)_. Similarly, the index of the current selection is
	available in _selectedIndex_.

	The _onChange_ event is fired when the selected item changes, and contains the
	following properties:

		{
			selected: [object Object],	// Reference to selected item
			content: "San Francisco",	// Content of selected item
			index: 1					// Index of selected item
		}

	The picker options may be modified programmatically in the standard manner, by
	calling _createComponent().render()_ or _destroy()_.

		// Add new items to picker
		this.$.expandablePicker.createComponent({"New York"}).render();
		this.$.expandablePicker.createComponent({"London"}).render();

		// Remove currently selected item from picker
		this.$.expandablePicker.getSelected().destroy();

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

			_inEvent.selected_ contains a reference to the currently selected item.

			_inEvent.content_ contains the content of the currently selected item.

			_inEvent.index_ contains the index of the currently selected item.
		*/
		onChange: ""
	},
	published: {
		//* Text to be displayed in the _currentValue_ control if no item is currently selected
		noneText: "",
		value: -1,
		min: 0,
		max: 9,
		step: 1,
		unit: "sec"
	},
	//* @protected
	defaultKind: "moon.SimpleIntegerPicker",
	handlers: {
		// spotlightFocus: "activated",
		requestScrollIntoView: "requestScrollIntoView"
	},
	components: [
		{name: "header", kind: "moon.Item", classes: "moon-expandable-integer-picker-header", spotlight: true,
			onSpotlightFocus: "headerFocus", ontap: "expandContract", onSpotlightSelect: "expandContract"
		},
		{name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep"},
		{name: "currentValue", kind: "moon.Item", spotlight: false, classes: "moon-expandable-integer-picker-current-value", ontap: "expandContract", content: ""},
		{name: "bottom", kind: "enyo.Control", spotlight: true, onSpotlightFocus: "spotlightFocusBottom"}
	],
	create: function() {
		this.inherited(arguments);
		this.createComponent({name: "client", kind: "moon.SimpleIntegerPicker", value: this.value, min: this.min, max: this.max, unit: this.unit, onChange: "changeHandler", onSelect: "selectHandler"});
		this.noneTextChanged();
		this.updateContent();
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
		this.$.currentValue.setShowing(!this.$.drawer.getOpen());
	},
	//* When an item is chosen, marks it as checked and closes the picker.
	selectHandler: function(inSender, inEvent) {
		var _this = this;
		// If _autoCollapse_ is set to true and this control is rendered, auto collapse.
		if(this.getAutoCollapse() && this.isRendered) {
			setTimeout(function() {
				_this.setOpen(false);
				enyo.Spotlight.spot(_this);
			}, 300);
		}
	},
	changeHandler: function(inSender, inEvent) {
		this.updateContent();
	},	
	//* Fires an _onChange_ event.
	fireChangeEvent: function() {
		this.doChange({
			value: this.value,
			content: this.content,
		});
	},
	resized: function() {
		if (!this.preventResize){
			this.$.client.resized();
			enyo.log();
			this.preventResize = true;
		}
	}
});
