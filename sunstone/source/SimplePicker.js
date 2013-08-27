/**
	_sun.SimplePicker_ is a control that solicits a choice from the user by
	cycling through a list of options. The picker's child components, typically
	simple <a href="#enyo.Control">enyo.Control</a> objects with text content,
	become the options for the picker.

		{kind:"sun.SimplePicker", onChange:"changed", selectedIndex:1, components: [
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
	calling	_createComponent().render()_ or _destroy()_.  Note that _reflow()_
	must be called after components are added or removed:

		// Add new items to picker
		this.$.picker.createComponent({"New York"}).render();
		this.$.picker.createComponent({"London"}).render();
		this.$.picker.reflow();

		// Remove currently selected item from picker
		this.$.picker.getSelected().destroy();
		this.$.picker.reflow();
*/
enyo.kind({
	name: "sun.SimplePicker",
	classes: "sun-simple-picker",
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
		selectedIndex: null,
		//* When true, picker transitions animate left/right
		animate: true,
		//* When true, button is shown as disabled and does not generate tap events
		disabled: false,
		//* When true, picker will wrap around from last item to first
		wrap: false
	},
	//* @protected
	components: [
		{kind: "enyo.Spotlight"},
		{name: "buttonLeft", kind: "sun.IconButton", classes: "sun-simple-picker-button left", src: "../images/1080x1920/picker-arrow.png", ontap: "previous"},
		{name: "client", 	 kind: "enyo.Panels", classes: "sun-simple-picker-client", arrangerKind: "CarouselArranger", narrowFit: false, controlClasses: "sun-simple-picker-item", draggable: false, onTransitionFinish:"transitionFinished"},
		{name: "buttonRight",kind: "sun.IconButton", classes: "sun-simple-picker-button right", src: "../images/1080x1920/picker-arrow.png", ontap: "next"}
	],
	create: function() {
		this.inherited(arguments);
		this.animateChanged();
		this.initializeActiveItem();
		this.selectedIndexChanged();
		this.disabledChanged();
		this.updateMarqueeDisable();
		this.wrapChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this._rendered = true;
	},
	createComponents: function(inC, inOpts) {
		var inherited = this.createComponents._inherited;
		if (this.$.client) {
			inOpts = inOpts || {};
			inOpts.container = this.$.client;
			inOpts.kind = "moon.MarqueeText";
		}
		return inherited.call(this, inC, inOpts);
	},
	createComponent: function(inC, inOpts) {
		var inherited = this.createComponent._inherited;
		if (this.$.client) {
			inOpts = inOpts || {};
			inOpts.container = this.$.client;
			inOpts.kind = "moon.MarqueeText";
		}
		return inherited.call(this, inC, inOpts);
	},
	reflow: function() {
		this.inherited(arguments);
		
		var maxHeight = 0,
			maxWidth = 0,
			panels,
			panel,
			i;

		// Find max width/height of all children
		if (this.getAbsoluteShowing()) {
			panels = this.$.client.getPanels();
			
			for (i = 0; (panel = panels[i]); i++) {
				if (panel.hasNode()) {
					bounds = panel.getBounds();
					maxWidth = Math.max(maxWidth, bounds.width);
					maxHeight = Math.max(maxHeight, bounds.height);
				}
			}
			
			this.$.client.setBounds({width: maxWidth, height: maxHeight});
			
			for (i = 0; (panel = panels[i]); i++) {
				panel.setBounds({width: maxWidth, height: maxHeight});
			}
			
			this.$.client.reflow();
		}

		// Make sure selected item is in sync after Panels reflow, which may have
		// followed an item being added/removed
		if (this.selected != this.$.client.getActive()) {
			this.setSelected(this.$.client.getActive());
			this.setSelectedIndex(this.$.client.getIndex());
			this.fireChangedEvent();
		}
		
		this.showHideNavButtons();
	},
	transitionFinished: function(inSender, inEvent) {
		var fp = (this.getSelected() === this.$.client.getActive()); // false positive
		this.setSelected(this.$.client.getActive());
		this.setSelectedIndex(this.$.client.getIndex());
		if (!fp) {
			this.fireChangedEvent();
		}
		return true;
	},
	fireChangedEvent: function() {
		if (!this._rendered) {
			return;
		}
		
		this.doChange({
			selected: 	this.selected,
			content: 	this.selected && this.selected.content,
			index: 		this.selected && this.selectedIndex
		});
	},
	//* Show/hide prev/next buttons based on current index
	showHideNavButtons: function() {
		var index = this.getSelectedIndex(),
			maxIndex = this.$.client.getClientControls().length - 1;
		
		// Always show buttons if _this.wrap_ is _true_
		if (this.wrap) {
			this.showNavButton(this.$.buttonLeft);
			this.showNavButton(this.$.buttonRight);
		// If we have one or less options, always show no buttons
		} else if (maxIndex <= 0) {
			this.hideNavButton(this.$.buttonLeft);
			this.hideNavButton(this.$.buttonRight);
		// If we are on the first option, hide the left button
		} else if (index <= 0) {
			this.hideNavButton(this.$.buttonLeft);
			this.showNavButton(this.$.buttonRight);
		// If we are on the last item, hide the right button
		} else if (index >= maxIndex) {
			this.showNavButton(this.$.buttonLeft);
			this.hideNavButton(this.$.buttonRight);
		// Otherwise show both buttons
		} else {
			this.showNavButton(this.$.buttonLeft);
			this.showNavButton(this.$.buttonRight);
		}
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
		this.addRemoveClass("disabled", this.disabled);
		this.$.buttonLeft.setDisabled(this.disabled);
		this.$.buttonRight.setDisabled(this.disabled);
	},
	animateChanged: function() {
		this.$.client.setAnimate(this.animate);
	},
	wrapChanged: function() {
		this.$.client.setWrap(this.wrap);
	},
	selectedChanged: function() {
		if (this.selected != this.$.client.getActive()) {
			this.$.client.setIndex(this.selected.indexInContainer());
			this.fireChangedEvent();
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
		if ((this.selectedIndex !== null) && (this.selectedIndex != this.$.client.getIndex())) {
			this.$.client.setIndex(this.selectedIndex);
			this.updateMarqueeDisable();
		}

		this.showHideNavButtons();
	},
	updateMarqueeDisable: function() {
		for (var c$=this.$.client.getPanels(), i=0; i<c$.length; i++) {
			if (i == this.$.client.getIndex()) {
				c$[i].disabled = false;
			} else {
				c$[i].disabled = true;
			}
		}
	},
	//* Facade _getClientControls()_ to return client controls inside of _this.client_
	getClientControls: function() {
		return this.$.client.getClientControls();
	},
	//* @public
	//* Cycles the selected item to the one before the currently selected item.
	previous: function() {
		this.$.client.previous();
		this.updateMarqueeDisable();
		this._marqueeSpotlightFocus();
	},
	//* @public
	//* Cycles the selected item to the one after the currently selected item.
	next: function() {
		this.$.client.next();
		this.updateMarqueeDisable();
		this._marqueeSpotlightFocus();
	},
	showingChanged: function() {
		this.inherited(arguments);
		if(this.showing && this.generated) {
			this.reflow();
		}
	}
});
