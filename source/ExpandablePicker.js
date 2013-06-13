/**
	_moon.ExpandablePicker_, which extends
	<a href="#moon.ExpandableListItem">moon.ExpandableListItem</a>, is a drop-down
	picker menu that solicits a choice from the user. The picker's child
	components, which are instances of <a href="#moon.CheckboxItem">moon.CheckboxItem</a>
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
	name: "moon.ExpandablePicker",
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
		//* Reference to currently selected item, if any
		selected: null,
		//* Index of currently selected item, if any
		selectedIndex: -1,
		//* Text to be displayed in the _currentValue_ control if no item is currently selected
		noneText: "",
		//* Text to be display when the drawer is opened
		helpText: "",
		/**
			If true, the drawer automatically closes when the user makes a selection; 
			if false, the user must select/tap the header to close the drawer
		*/
		autoCollapse: true
	},
	//* @protected
	defaultKind: "moon.CheckboxItem",
	handlers: {
		onActivate: "activated",
		requestScrollIntoView: "requestScrollIntoView"
	},
	components: [
		{name: "header", kind: "moon.Item", classes: "moon-expandable-picker-header", spotlight: true,
			onSpotlightFocus: "headerFocus", ontap: "expandContract", onSpotlightSelect: "expandContract"
		},
		{name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep", components: [
			{name: "client", kind: "Group", highlander: true},
			{name: "helpText", classes: "moon-expandable-picker-help-text"}
		]},
		{name: "currentValue", kind: "moon.Item", spotlight: false, classes: "moon-expandable-picker-current-value", ontap: "expandContract", content: ""},
		{name: "bottom", kind: "enyo.Control", spotlight: true, onSpotlightFocus: "spotlightFocusBottom"}
	],
	create: function() {
		this.inherited(arguments);
		this.initializeActiveItem();
		this.selectedIndexChanged();
		this.noneTextChanged();
		this.helpTextChanged();
		this.openChanged();
	},
	//* When the _selected_ control changes, updates _checked_ values
	//* appropriately and fires an _onChange_ event.
	selectedChanged: function(inOldValue) {
		var selected = this.getSelected(),
			controls = this.getClientControls(),
			index = -1;

		for(var i=0;i<controls.length;i++) {
			if(controls[i] === selected) {
				controls[i].setChecked(true);
				index = i;
			} else {
				controls[i].setChecked(false);
			}
		}

		if(index > -1 && selected !== inOldValue) {
			this.setSelectedIndex(index);
			this.$.currentValue.setContent(selected.getContent());
			if(this.hasNode()) {
				this.fireChangeEvent();
			}
		}
	},
	//* When the _selectedIndex_ changes, calls _this.setChecked()_ on the
	//* appropriate control.
	selectedIndexChanged: function() {
		var selected = this.getSelected(),
			controls = this.getClientControls(),
			index = this.getSelectedIndex();

		if(controls[index] && controls[index] !== selected) {
			this.setSelected(controls[index]);
		}
	},
	//* If there is no selected item, uses _this.noneText_ as current value.
	noneTextChanged: function() {
		if(this.getSelected() === null && this.getSelectedIndex() === -1) {
			this.$.currentValue.setContent(this.getNoneText());
		}
	},
	//* When _this.open_ changes, shows/hides _this.$.currentValue_.
	openChanged: function() {
		this.inherited(arguments);
		this.$.currentValue.setShowing(!this.open);
		this.$.bottom.setShowing(this.open);
	},
	//* When drawer is opened/closed, shows/hides _this.$.helpText.
	helpTextChanged: function() {
		this.$.helpText.setContent(this.helpText);
		this.$.helpText.setShowing(!!this.helpText);
	},
	/*
		When the picker is initialized, looks for any items with an _active:true_
		flag; if one is found, it is set as the currently selected item. This is
		done without triggering an _onChange_ event, as it happens during
		initialization.
	*/
	initializeActiveItem: function() {
		var controls = this.getClientControls();
		for(var i=0;i<controls.length;i++) {
			if(controls[i].active) {
				this.selectedIndex = i;
				this.selected = controls[i];
				this.$.currentValue.setContent(controls[i].getContent());
				controls[i].setChecked(true);
				return;
			}
		}
	},
	//* When an item is chosen, marks it as checked and closes the picker.
	activated: function(inSender, inEvent) {
		var index = this.getClientControls().indexOf(inEvent.toggledControl),
			_this = this;

		if(inEvent.checked && index > -1) {
			this.setSelected(inEvent.toggledControl);
			// If _autoCollapse_ is set to true and this control is rendered, auto collapse.
			if(this.getAutoCollapse() && this.isRendered) {
				setTimeout(function() {
					_this.setOpen(false);
					enyo.Spotlight.spot(_this);
				}, 300);
			}
		}
	},
	//* Fires an _onChange_ event.
	fireChangeEvent: function() {
		this.doChange({
			selected: this.getSelected(),
			content: this.getSelected().getContent(),
			index: this.getSelectedIndex()
		});
	}
});
