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
		this.$.expandablePicker.createCompoent({"New York"}).render();
		this.$.expandablePicker.createCompoent({"London"}).render();

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
		//* If true, only one item can be selected in this picker.
		highlander: false,
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
		{name: "header", kind: "moon.Item", spotlight: false, classes: "moon-expandable-picker-header"},
		{name: "drawer", kind: "moon.Drawer", components: [
			{name: "client", kind: "Group"}
		]},
		{name: "currentValue", kind: "moon.Item", spotlight: false, classes: "moon-expandable-picker-current-value", content: ""}
	],
	create: function() {
		this.inherited(arguments);
		this.highlanderChanged();
		this.initializeActiveItem();
		this.noneTextChanged();
	},
	highlanderChanged: function() {
		this.$.client.setHighlander(this.highlander);
	},
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
	selectedIndexChanged: function() {
		var selected = this.getSelected(),
			controls = this.getClientControls(),
			index = this.getSelectedIndex();
		
		if(controls[index] && controls[index] !== selected) {
			this.setSelected(controls[index]);
		}
	},
	noneTextChanged: function() {
		if(this.getSelected() === null && this.getSelectedIndex() === -1) {
			this.$.currentValue.setContent(this.getNoneText());
		}
	},
	openChanged: function() {
		this.inherited(arguments);
		
		if(this.$.drawer.getOpen()) {
			this.addClass("open");
			this.spotlight = false;
			this.$.currentValue.setShowing(false);
		} else {
			this.removeClass("open");
			this.spotlight = true;
			this.$.currentValue.setShowing(true);
		}
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
	activated: function(inSender, inEvent) {
		var index = this.getClientControls().indexOf(inEvent.toggledControl);
		if(inEvent.checked && index > -1) {
			this.setSelected(inEvent.toggledControl);
		}
	},
	fireChangeEvent: function() {
		this.doChange({
			selected: this.getSelected(),
			content: this.getSelected().getContent(),
			index: this.getSelectedIndex()
		});
	}
});
