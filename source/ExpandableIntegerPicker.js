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
	classes: "moon-expandable-picker",
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
		spotlightFocus: "activated",
		requestScrollIntoView: "requestScrollIntoView"
	},
	components: [
		{name: "header", kind: "moon.Item", classes: "moon-expandable-picker-header", spotlight: true,
			onSpotlightFocus: "headerFocus", ontap: "expandContract", onSpotlightSelect: "expandContract"
		},
		{name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep"},
		{name: "currentValue", kind: "moon.Item", spotlight: false, classes: "moon-expandable-picker-current-value", ontap: "expandContract", content: ""},
		{name: "bottom", kind: "enyo.Control", spotlight: true, onSpotlightFocus: "spotlightFocusBottom"}
	],
	create: function() {
		this.inherited(arguments);
		this.createComponent({name: "client", kind: "moon.SimpleIntegerPicker", min: this.min, max: this.max, unit: this.unit, onSelect: "valueSelectHandler"});
		this.valueChanged();
		this.noneTextChanged();
	},
	initComponents: function() {
		this.controlParentName = "drawer";
		this.discoverControlParent();
		this.inherited(arguments);
	},
	valueChanged: function(inOld) {
			this.$.client.setValue(this.value);
	},
	valueChangeHandler: function() {
		var selected = this.$.client.selected;

		if(selected.value !== this.value) {
			this.value = selected.value;
			this.$.currentValue.setContent(selected.getContent());
			this.fireChangeEvent();
		}
	},
	valueSelectHandler: function() {
		var _this = this;
		this.valueChangeHandler();
		// If _autoCollapse_ is set to true and this control is rendered, auto collapse.
		if(this.getAutoCollapse() && this.isRendered) {
			setTimeout(function() {
				_this.setOpen(false);
				enyo.Spotlight.spot(_this);
			}, 300);
		}
	},
	//* If there is no selected item, uses _this.noneText_ as current value.
	noneTextChanged: function() {
		var selected = this.$.client.selected;

		if(selected.value !== this.value) {
			this.$.currentValue.setContent(this.getNoneText());
		}
	},

	//* When _this.open_ changes, shows/hides _this.$.currentValue_.
	openChanged: function() {
		this.inherited(arguments);
		this.$.currentValue.setShowing(!this.$.drawer.getOpen());
	},

	//* When an item is chosen, marks it as checked and closes the picker.
	// activated: function(inSender, inEvent) {
	// 	console.log("activated");
	// 		// If _autoCollapse_ is set to true and this control is rendered, auto collapse.
	// 		if(this.getAutoCollapse() && this.isRendered) {
	// 			setTimeout(function() {
	// 				_this.setOpen(false);
	// 				enyo.Spotlight.spot(_this);
	// 			}, 300);
	// 		}

	// },
	//* Fires an _onChange_ event.
	fireChangeEvent: function() {
		this.doChange({
			value: this.$.client.selected.value,
			content: this.$.client.selected.content,
			index: this.$.client.selectedIndex
		});
	}
});
