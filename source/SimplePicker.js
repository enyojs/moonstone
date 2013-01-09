/**
	_moon.SimplePicker_ is used to solicit a choice from the user by cycling through a list
	of options.  The picker's child components, typically simple _enyo.Control_'s with text
	content, become the options for the picker.

		{kind:"moon.SimplePicker", onChange:"changed", selectedIndex:1, components: [
			{content:"San Francisco"},
			{content:"Boston"},
			{content:"Tokyo"}
		]}

	The picker can be programmatically changed by calling _previous()_, _next()_, or modifying
	the _selectedIndex_ published property by calling _setSelectedIndex()_.

	The _onChange_ event is fired when the selected item changes, and contains the following
	properties:

		{
			selected: [object Object],	// Reference to selected item
			content: "San Francisco",	// Content of selected item
			index: 1					// Index of selected item
		}

	Picker options can be adjusted programmatically using standard means, by calling
	_createComponet()/render()_ or _destroy()_.  Note reflow() must be called when adding
	new components:

		// Add new items to picker
		this.$.picker.createCompoent({"New York"}).render();
		this.$.picker.createCompoent({"London"}).render();
		this.$.picker.reflow();

		// Remove currently selected item from picker
		this.$.picker.getSelected().destroy();
		this.$.picker.reflow();
*/
enyo.kind({
	name: "moon.SimplePicker",
	classes: "moon-simple-picker",
	events: {
		/**
			Fires when the currently selected item changes.

			_inEvent.selected_ contains a reference to the currently selected item.

			_inEvent.content_ contains the content of the currently selected item.

			_inEvent.index contains the index of the currently selected item.
		*/
		onChange:""
	},
	published: {
		//* Reference to currently selected item, if any
		selected:"",
		//* Index of currently selected item, if any
		selectedIndex:null,
		//* Whether the picker transitions should animate left/right.
		animate:true
	},
	//* @protected
	components: [
		{kind:"enyo.Button", classes:"moon-simple-picker-button", content:"<", ontap:"previous", spotlight:true},
		{kind:"enyo.Panels", classes:"moon-simple-picker-client", controlClasses:"moon-simple-picker-item", draggable:false, arrangerKind: "CarouselArranger", name:"client", onTransitionFinish:"transitionFinished"},
		{kind:"enyo.Button", classes:"moon-simple-picker-button", content:">", ontap:"next", spotlight:true}
	],
	create: function() {
		this.inherited(arguments);
		this.animateChanged();
		this.selectedIndexChanged();
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
		}
		return inherited.call(this, inC, inOpts);
	},
	createComponent: function(inC, inOpts) {
		var inherited = this.createComponent._inherited;
		if (this.$.client) {
			inOpts = inOpts || {};
			inOpts.container = this.$.client;
		}
		return inherited.call(this, inC, inOpts);
	},
	reflow: function() {
		this.inherited(arguments);
		
		// Find max width of all children
		var width = 0;
		for (var c$=this.$.client.getPanels(), i=0; i<c$.length; i++) {
			width = Math.max(width, c$[i].getBounds().width);
		}
		this.$.client.setBounds({width:width});
		for (c$=this.$.client.getPanels(), i=0; i<c$.length; i++) {
			c$[i].setBounds({width:width});
		}
		this.$.client.reflow();

		// Make sure selected item is in sync after Panels reflow, which may have
		// followed an item being added/removed
		if (this.selected != this.$.client.getActive()) {
			this.setSelected(this.$.client.getActive());
			this.setSelectedIndex(this.$.client.getIndex());
			this.fireChangedEvent();
		}
	},
	transitionFinished: function(inSender, inEvent) {
		this.setSelected(this.$.client.getActive());
		this.setSelectedIndex(this.$.client.getIndex());
		this.fireChangedEvent();
		return true;
	},
	fireChangedEvent: function() {
		if (this._rendered) {
			this.doChange({
				selected: this.selected,
				content: this.selected && this.selected.content,
				index: this.selected && this.selectedIndex
			});
		}
	},
	animateChanged: function() {
		this.$.client.setAnimate(this.animate);
	},
	selectedChanged: function(inOld) {
		if (this.selected != this.$.client.getActive()) {
			this.$.client.setIndex(this.selected.indexInContainer());
		}
	},
	selectedIndexChanged: function(inOld) {
		if ((this.selectedIndex !== null) && (this.selectedIndex != this.$.client.getIndex())) {
			this.$.client.setIndex(this.selectedIndex);
		}
	},
	//* @public
	//* Cycles the selected item to the one previous to the currently selected item.
	previous: function() {
		this.$.client.previous();
	},
	//* @public
	//* Cycles the selected item to the one after to the currently selected item.
	next: function() {
		this.$.client.next();
	}
});