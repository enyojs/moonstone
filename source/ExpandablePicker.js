/**
	_moon.ExpandablePicker is used to as a drop-down picker menu that solicits a choice
	from the user.  The picker's child components, typically _moon.LabeledCheckbox_s,
	become the options for the picker.
		
		{kind: "moon.ExpandablePicker", noneText: "None Selected", content: "Choose City", components: [
			{content: "San Francisco"},
			{content: "Boston"},
			{content: "Tokyo"}
		]}

	The picker can be programmatically changed by modifying the published properties _selectedIndex_
	or _selected_ by calling the appropriate setter functions (_setSelectedIndex()_ and
	_getSelectedIndex()_).

	The _onChange_ event is fired when the selected item changes, and contains the following
	properties:

		{
			selected: [object Object],	// Reference to selected item
			content: "San Francisco",	// Content of selected item
			index: 1					// Index of selected item
		}

	Picker options can be adjusted programmatically using standard means, by calling
	_createComponent()/render()_ or _destroy()_.

		// Add new items to picker
		this.$.expandablePicker.createComponent({"New York"}).render();
		this.$.expandablePicker.createComponent({"London"}).render();

		// Remove currently selected item from picker
		this.$.expandablePicker.getSelected().destroy();
	
	When the picker is minimized, the content of the currently selected item is displayed as subtext
	below the picker label.
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
		//* Reference to currently selected item, if any.
		selected: null,
		//* Index of currently selected item, if any.
		selectedIndex: -1,
		//* Text to be displayed in the _currentValue_ control if no item is currently selected.
		noneText: ""
	},
	//* @protected
	defaultKind: "moon.LabeledCheckbox",
	handlers: {
		onActivate: "activated"
	},
	components: [
		{name: "header", kind: "moon.Item", classes: "moon-expandable-picker-header", spotlight: true,
			onSpotlightFocus: "headerFocus", ontap: "expandContract", onSpotlightSelect: "expandContract"
		},
		{name: "drawer", kind: "moon.Drawer", components: [
			{name: "client", kind: "Group", highlander: true}
		]},
		{name: "currentValue", kind: "moon.Item", spotlight: false, classes: "moon-expandable-picker-current-value", ontap: "expandContract", content: ""},
		{name: "bottom", kind: "enyo.Control", spotlight: true, onSpotlightFocus: "spotlightFocusBottom"}
	],
	create: function() {
		this.inherited(arguments);
		this.initializeActiveItem();
		this.noneTextChanged();
	},
	//* When the _selected_ control changes, update _checked_ values appropriately and fire an onChange event
	selectedChanged: function() {
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
		
		if(index > -1 && index !== this.getSelectedIndex()) {
			this.setSelectedIndex(index);
			this.$.currentValue.setContent(selected.getContent());
			this.fireChangeEvent();
		}
	},
	//* When the _selectedIndex_ changes, call _this.setChecked()_ on the appropriate control
	selectedIndexChanged: function() {
		var selected = this.getSelected(),
			controls = this.getClientControls(),
			index = this.getSelectedIndex();
		
		if(controls[index] && controls[index] !== selected) {
			this.setSelected(controls[index]);
		}
	},
	//* If no selected item, use _this.noneText_ for current value
	noneTextChanged: function() {
		if(this.getSelected() === null && this.getSelectedIndex() === -1) {
			this.$.currentValue.setContent(this.getNoneText());
		}
	},
	//* When _this.open_ changes, show/hide _this.$.currentValue_
	openChanged: function() {
		this.inherited(arguments);
		this.$.currentValue.setShowing(!this.$.drawer.getOpen());
	},
	/*
		When the picker is initialized, look for any items with an active:true flag, and
		set them to be the currently selected item. This is done without triggering an
		onChange event, as this happens during initialization.
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
	//* When an item is chosen, mark it as checked, and close the picker.
	activated: function(inSender, inEvent) {
		var index = this.getClientControls().indexOf(inEvent.toggledControl),
			_this = this;
		
		if(inEvent.checked && index > -1 && this.getAutoCollapse()) {
			this.setSelected(inEvent.toggledControl);
			if(this.isRendered) {
				setTimeout(function() {
					_this.setOpen(false);
					enyo.Spotlight.spot(_this);
				}, 300);
			}
		}
	},
	//* Fire an onChange event
	fireChangeEvent: function() {
		this.doChange({
			selected: this.getSelected(),
			content: this.getSelected().getContent(),
			index: this.getSelectedIndex()
		});
	}
});
