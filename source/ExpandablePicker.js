/**
	_moon.ExpandablePicker_, which extends
	[moon.ExpandableListItem](#moon.ExpandableListItem), is a drop-down picker
	menu that solicits a choice from the user. The picker's child components,
	which are instances of [moon.CheckboxItem](#moon.CheckboxItem) by default,
	provide the options for the picker.

		{kind: "moon.ExpandablePicker", noneText: "None Selected", content: "Choose City",
			components: [
				{content: "San Francisco"},
				{content: "Boston"},
				{content: "Tokyo"}
			]
		}

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
	//* @protected
	classes: "moon-expandable-picker",
	//* @public
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
		//* Text to be displayed when the drawer is opened
		helpText: null,
		//* If true, auto collapse when an item is selected
		autoCollapseOnSelect: true,
		//* If true, allow multiple selections
		multipleSelection: false,
	},
	//* @protected
	autoCollapse: true,
	lockBottom: true,

	defaultKind: "moon.CheckboxItem",
	selectAndCloseDelayMS: 600,
	components: [
		{name: "headerWrapper", kind: "moon.Item", classes: "moon-expandable-picker-header-wrapper", onSpotlightFocus: "headerFocus", ontap: "expandContract", components: [
			// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
			{name: "headerContainer", classes: "moon-expandable-list-item-header moon-expandable-picker-header", components: [
				{name: "header", kind: "moon.MarqueeText"}
			]},
			{name: "currentValue", kind: "moon.MarqueeText", classes: "moon-expandable-picker-current-value"}
		]},
		{name: "drawer", kind: "enyo.Drawer", resizeContainer:false, classes:"moon-expandable-list-item-client", components: [
			{name: "client", tag: null, kind: "Group", onActivate: "activated", highlander: true},
			{name: "helpText", kind:"moon.BodyText", canGenerate: false, classes: "moon-expandable-picker-help-text"}
		]}
	],
	bindings: [
		{from: ".allowHtml", to: ".$.header.allowHtml"},
		{from: ".allowHtml", to: ".$.currentValue.allowHtml"},
		{from: ".disabled", to: ".$.headerWrapper.disabled"}
	],
	create: function() {
		this.inherited(arguments);
		if (this.multipleSelection) {
			this.selected = (this.selected) ? this.selected : [];
			this.selectedIndex = (this.selectedIndex != -1) ? this.selectedIndex : [];
			this.$.client.setHighlander(false);
		}
		this.initializeActiveItem();
		this.selectedIndexChanged();
		this.noneTextChanged();
		this.helpTextChanged();
		this.openChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.isRendered = true;
	},
	multiSelectCurrentValue: function() {
		if (!this.multipleSelection) return;
		var controls = this.getClientControls();
		var str = "";
		this.selectedIndex.sort();
		for (var i=0; i < this.selectedIndex.length; i++) {
			if (!str) {
				str = controls[this.selectedIndex[i]].getContent();
			} else {
				str = str + ", " + controls[this.selectedIndex[i]].getContent();
			}
		}
		return str;
	},
	//* When the _selected_ control changes, updates _checked_ values appropriately and fires an _onChange_ event.	
	selectedChanged: function(inOldValue) {
		var selected = this.getSelected(),
		controls = this.getClientControls();

		if (this.multipleSelection) {
			var index = this.getSelectedIndex();
			for (var i=0;i<controls.length;i++) {
				controls[i].silence();
				if (selected.indexOf(controls[i]) >= 0) {
					controls[i].setChecked(true);
					if (index.indexOf(i) == -1) index.push(i);
				} else {
					controls[i].setChecked(false);
					if (index.indexOf(i) >= 0) index.splice(index.indexOf(i),1);
				}
				controls[i].unsilence();
			}
			this.$.currentValue.setContent(this.multiSelectCurrentValue());
			if(this.hasNode()) {
				this.fireChangeEvent();
			}
			return;
		}

		var index = -1;
		for (var i=0;i<controls.length;i++) {
			controls[i].silence();
			if(controls[i] === selected) {
				controls[i].setChecked(true);
				index = i;
			} else {
				controls[i].setChecked(false);
			}
			controls[i].unsilence();
		}
		if (index > -1 && selected !== inOldValue) {
			this.setSelectedIndex(index);
			this.$.currentValue.setContent(selected.getContent());
			if(this.hasNode()) {
				this.fireChangeEvent();
			}
		}
	},
	//* When the _selectedIndex_ changes, calls _this.setChecked()_ on the appropriate control.
	selectedIndexChanged: function() {
		var selected = this.getSelected(),
		controls = this.getClientControls(),
		index = this.getSelectedIndex();

		if (this.multipleSelection) {
			for (var i=0;i<controls.length;i++) {
				controls[i].silence();
				if (index.indexOf(i) >= 0) {
					controls[i].setChecked(true);
					if (selected.indexOf(controls[i]) == -1) selected.push(controls[i]);
				} else {
					controls[i].setChecked(false);
					if (selected.indexOf(controls[i]) >= 0) selected.splice(selected.indexOf(controls[i]), 1);
				}
				controls[i].unsilence();
			}
			this.$.currentValue.setContent(this.multiSelectCurrentValue());
			return;
		}

		if (controls[index] && controls[index] !== selected) {
			this.setSelected(controls[index]);
		}
	},
	//* If there is no selected item, uses _this.noneText_ as current value.
	noneTextChanged: function() {
		if (this.multipleSelection) {
			if (!this.getSelected().length && !this.getSelectedIndex().length) {
				this.$.currentValue.setContent(this.getNoneText());
			}
			return;
		}
		if (!this.getSelected() && this.getSelectedIndex() === -1) {
			this.$.currentValue.setContent(this.getNoneText());
		}
	},
	//* When _this.open_ changes, shows/hides _this.$.currentValue_.
	openChanged: function() {
		this.inherited(arguments);
		this.$.currentValue.setShowing(!this.open);
		this.setActive(this.getOpen());
	},
	//* When drawer is opened/closed, shows/hides _this.$.helpText.
	helpTextChanged: function() {
		if (this.helpText !== null && !this.$.helpText.canGenerate) {
			this.generateHelpText();
		}
		this.$.helpText.setContent(this.helpText);
		this.$.helpText.setShowing(!!this.helpText);
	},
	destroy: enyo.inherit(function(sup) {
		return function() {
			// When the expandablePicker itself is going away, take note so we don't try and do single-picker option
			// remove logic such as setting some properties to default value when each picker option is destroyed
			this.destroying = true;
			sup.apply(this, arguments);
		};
	}),
	removeControl: enyo.inherit(function(sup) {
		return function(inControl) {
			// Skip extra work during panel destruction.
			if (!this.destroying) {
				// set currentValue, selected and selectedIndex to defaults value
				if (this.selected === inControl) {
					if (this.multipleSelection) {
						this.setSelected([]);
						this.setSelectedIndex([]);
						this.$.currentValue.setContent(this.getNoneText());
					}
					else {
						this.setSelected(null);
						this.setSelectedIndex(-1);
						this.$.currentValue.setContent(this.getNoneText());
					}
				}
			}
			sup.apply(this, arguments);
		};
	}),
	generateHelpText: function() {
		this.$.helpText.canGenerate = true;
		this.$.helpText.render();
	},
	/*
		When the picker is initialized, looks for any items with an _active: true_
		flag; if one is found, it is set as the currently selected item. This is
		done without triggering an _onChange_ event, as it happens during
		initialization.
	*/
	initializeActiveItem: function() {
		var controls = this.getClientControls();

		for (var i=0; i<controls.length; i++) {
			if (!controls[i].active) {
				continue;
			}

			if (this.multipleSelection) {
				this.selectedIndex.push(i);
				this.selected.push(controls[i]);
				controls[i].setChecked(true);
			} else {
				this.selectedIndex = i;
				this.selected = controls[i];
				this.$.currentValue.setContent(controls[i].getContent());
				controls[i].setChecked(true);
				return;
			}
		}
		this.$.currentValue.setContent(this.multiSelectCurrentValue());
	},
	//* When an item is chosen, marks it as checked and closes the picker.
	activated: function(inSender, inEvent) {
		var toggledControl = inEvent && inEvent.toggledControl, index;

		if (!toggledControl) {
			return;
		}

		index = this.getClientControls().indexOf(toggledControl);

		if (this.multipleSelection) {
			if (index >= 0) {
				if (inEvent.checked && (this.selectedIndex.indexOf(index) == -1)) {
					this.selectedIndex.push(index);
					this.selectedIndexChanged();
				}
				if (!inEvent.checked && (this.selectedIndex.indexOf(index) >= 0)) {
					this.selectedIndex.splice(this.selectedIndex.indexOf(index), 1);
					this.selectedIndexChanged();
				}
			}
		} else {
			if (inEvent.checked && index >= 0) {
				this.setSelected(inEvent.toggledControl);
			}
		}

		if (this.getAutoCollapseOnSelect() && this.isRendered && this.getOpen()) {
			this.startJob("selectAndClose", "selectAndClose", this.selectAndCloseDelayMS);
		}

		return true;
	},
	//* Closes drawer and selects header.
	selectAndClose: function() {
		this.setActive(false);
		if (!enyo.Spotlight.getPointerMode() && enyo.Spotlight.getCurrent() && enyo.Spotlight.getCurrent().isDescendantOf(this)) {
			enyo.Spotlight.spot(this.$.headerWrapper);
		}
	},
	//* Fires an _onChange_ event.
	fireChangeEvent: function() {
		var contentStr = (this.multipleSelection) ? this.multiSelectCurrentValue() : this.getSelected().getContent();
		this.doChange({
			selected: this.getSelected(),
			content: contentStr,
			index: this.getSelectedIndex()
		});
	},
	multipleSelectionChanged : function(inOldValue) {
		this.$.client.setHighlander(!this.multipleSelection);
	}
});
