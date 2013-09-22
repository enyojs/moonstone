/**
	_moon.SimplePicker_ is a control that solicits a choice from the user by
	cycling through a list of options. The picker's child components, typically
	simple <a href="#enyo.Control">enyo.Control</a> objects with text content,
	become the options for the picker.

		{kind:"moon.SimplePicker", onChange:"changed", selectedIndex:1, components: [
			{content:"San Francisco"},
			{content:"Boston"},
			{content:"Tokyo"}
		]}

	The picker may be changed programmatically by calling _previous()_ or
	_next()_, or by modifying the _selectedIndex_ published property by calling
	_set("selectedIndex", &lt;value&gt;)_.

	The _onChange_ event is fired when the selected item changes, and contains the
	following	properties:

		{
			selected: [object Object],	// Reference to selected item
			content: "San Francisco",	// Content of selected item
			index: 1					// Index of selected item
		}

	The picker options may be modified programmatically in the standard manner, by
	calling	_createComponent().render()_ or _destroy()_.

		// Add new items to picker
		this.$.picker.createComponent({"New York"}).render();
		this.$.picker.createComponent({"London"}).render();

		// Remove currently selected item from picker
		this.$.picker.getSelected().destroy();
*/
enyo.kind({
	name: "moon.SimplePicker",
	classes: "moon-simple-picker",
	mixins: ["moon.MarqueeSupport"],
	events: {
		/**
			Fires when the currently selected item changes.

			_inEvent.selected_ contains a reference to the currently selected item.

			_inEvent.content_ contains the content of the currently selected item.

			_inEvent.index_ contains the index of the currently selected item.
		*/
		onChange:""
	},
	published: {
		//* Reference to currently selected item, if any
		selected: "",
		//* Index of currently selected item, if any
		selectedIndex: 0,
		//* When true, picker transitions animate left/right
		animate: true,
		//* When true, button is shown as disabled and does not generate tap events
		disabled: false,
		//* When true, picker will wrap around from last item to first
		wrap: false,
		//* By default, SimplePicker is an inline-block element; Setting `block: true` makes it a block element
		block: false
	},
	defaultKind:"moon.MarqueeText",
	//* @protected
	components: [
		{name: "buttonLeft",  kind: "enyo.Button", classes: "moon-simple-picker-button left", spotlight: true, defaultSpotlightRight: "buttonRight", ontap: "left"},
		{kind: "enyo.Control", name: "clientWrapper", classes:"moon-simple-picker-client-wrapper", components: [
			{kind: "enyo.Control", name: "client", classes: "moon-simple-picker-client"}
		]},
		{name: "buttonRight", kind: "enyo.Button", classes: "moon-simple-picker-button right", spotlight: true, defaultSpotlightLeft: "buttonLeft", ontap: "right"}
	],
	create: function() {
		this.inherited(arguments);
		this.animateChanged();
		this.initializeActiveItem();
		this.disabledChanged();
		this.selectedIndexChanged();
		this.updateMarqueeDisable();
		this.blockChanged();
	},
	fireChangedEvent: function() {
		if (!this.generated) {
			return;
		}

		this.doChange({
			selected:   this.selected,
			content:    this.selected && this.selected.content,
			index:      this.selected && this.selectedIndex
		});
	},
	blockChanged: function() {
		this.addRemoveClass("block", this.block);
	},
	//* Show/hide prev/next buttons based on current index
	showHideNavButtons: function() {
		var index = this.getSelectedIndex(),
			maxIndex = this.getClientControls().length - 1;
		var prevButton = this.rtl ? this.$.buttonRight : this.$.buttonLeft;
		var nextButton = this.rtl ? this.$.buttonLeft : this.$.buttonRight;

		if (this.disabled) {
			this.hideNavButton(prevButton);
			this.hideNavButton(nextButton);
		// Always show buttons if _this.wrap_ is _true_
		} else if (this.wrap) {
			this.showNavButton(prevButton);
			this.showNavButton(nextButton);
		// If we have one or less options, always show no buttons
		} else if (maxIndex <= 0) {
			this.hideNavButton(prevButton);
			this.hideNavButton(nextButton);
		// If we are on the first option, hide the left button
		} else if (index <= 0) {
			this.hideNavButton(prevButton);
			this.showNavButton(nextButton);
		// If we are on the last item, hide the right button
		} else if (index >= maxIndex) {
			this.showNavButton(prevButton);
			this.hideNavButton(nextButton);
		// Otherwise show both buttons
		} else {
			this.showNavButton(prevButton);
			this.showNavButton(nextButton);
		}
	},
	addControl: function(inControl) {
		this.inherited(arguments);
		var addedIdx = this.getClientControls().indexOf(inControl);
		var selectedIdx = this.selectedIndex;
		if (this.generated) {
			if ((selectedIdx < 0) || (addedIdx < selectedIdx)) {
				this.setSelectedIndex(selectedIdx + 1);
			} else if (selectedIdx == addedIdx) {
				// Force change handler, since the currently selected item actually changed
				this.selectedIndexChanged();
			}
			this.showHideNavButtons();
		}
	},
	removeControl: function(inControl) {
		var removedIdx = this.getClientControls().indexOf(inControl);
		var selectedIdx = this.selectedIndex;
		var wasLast = (removedIdx == this.getClientControls().length-1);

		this.inherited(arguments);

		if ((removedIdx < selectedIdx) || ((selectedIdx == removedIdx) && wasLast)) {
			this.setSelectedIndex(selectedIdx - 1);
		} else if (selectedIdx == removedIdx) {
			// Force change handler, since the currently selected item actually changed
			this.selectedIndexChanged();
		}
		this.showHideNavButtons();
	},
	//* Hide _inControl_ and disable spotlight functionality
	hideNavButton: function(inControl) {
		inControl.addClass("hidden");
		enyo.Spotlight.unspot();
		inControl.spotlight = false;
	},
	//* Show _inControl_ and enable spotlight functionality
	showNavButton: function(inControl) {
		inControl.removeClass("hidden");
		inControl.spotlight = true;
	},
	disabledChanged: function() {
		this.$.client.addRemoveClass("disabled", this.disabled);
		if (this.generated) {
			this.showHideNavButtons();
		}
	},
	animateChanged: function() {
		this.$.client.addRemoveClass("animated", this.animate);
	},
	selectedChanged: function() {
		var idx = this.getClientControls().indexOf(this.selected);
		if (idx >= 0) {
			this.setSelectedIndex(idx);
		}
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
				return;
			}
		}
	},
	selectedIndexChanged: function() {
		enyo.dom.transform(this.$.client, {translateX: (this.selectedIndex * 100 * (this.rtl ? 1 : -1)) + "%"});
		if (this.selectedIndex !== null) {
			this.updateMarqueeDisable();
		}
		this.setSelected(this.getClientControls()[this.selectedIndex]);
		this.fireChangedEvent();
		this.showHideNavButtons();
	},
	updateMarqueeDisable: function() {
		for (var c$=this.getClientControls(), i=0; i<c$.length; i++) {
			if (i == this.selectedIndex) {
				c$[i].disabled = false;
			} else {
				c$[i].disabled = true;
			}
		}
	},
	left: function() {
		if (this.rtl) {
			this.next();
		} else {
			this.previous();
		}
	},
	right: function() {
		if (this.rtl) {
			this.previous();
		} else {
			this.next();
		}
	},
	//* @public
	//* Cycles the selected item to the one before the currently selected item.
	previous: function() {
		if (!this.disabled) {
			var idx = this.selectedIndex - 1;
			if (idx < 0) {
				idx = this.wrap ? this.getClientControls().length - 1 : 0;
			}
			this.setSelectedIndex(idx);
			this.updateMarqueeDisable();
			this._marqueeSpotlightFocus();
		}
	},
	//* @public
	//* Cycles the selected item to the one after the currently selected item.
	next: function() {
		if (!this.disabled) {
			var idx = this.selectedIndex + 1;
			if (idx > this.getClientControls().length - 1) {
				idx = this.wrap ? 0 : this.getClientControls().length - 1;
			}
			this.setSelectedIndex(idx);
			this.updateMarqueeDisable();
			this._marqueeSpotlightFocus();
		}
	}
});
