/**
	_moon.SimpleIntegerPicker_ is a control that solicits a choice from the user by
	cycling through a list of options. The picker's child components, typically
	simple <a href="#enyo.Control">enyo.Control</a> objects with text content,
	become the options for the picker.

		{kind:"moon.SimpleIntegerPicker", onChange:"changed", selectedIndex:1, components: [
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
	name: "moon.SimpleIntegerPicker",
	classes: "moon-simple-integer-picker",
	spotlight:true,
	events: {
		/**
			Fires when the currently selected item changes.

			_inEvent.selected_ contains a reference to the currently selected item.

			_inEvent.content_ contains the content of the currently selected item.

			_inEvent.index_ contains the index of the currently selected item.
		*/
		onChange: "",
		onSelect: ""
	},
	handlers: {
		onTransitionStart: "transitionStart",
		onTransitionFinish:"transitionFinished",
		onSpotlightSelect: "fireSelectEvent",
		onSpotlightRight: "next",
		onSpotlightBlur: "spotlightBlur",
		onSpotlightFocus: "spotlightFocus",
		onSpotlightFocused: "spotlightFocus",
		onSpotlightLeft: "previous",
		onSpotlightScrollLeft: "previous",
		onSpotlightScrollRight: "next"
	},
	published: {
		//* When true, picker transitions animate left/right
		animate:true,
		//* When true, button is shown as disabled and does not generate tap events
		disabled: false,
		content: "sec",
		value: -1,
		min: 1,
		max: 9,
		step: 1,
		unit: "sec"
	},
	indexhash: [],
	//* @protected
	components: [
		{name:"leftOverlay", classes:"moon-scroll-picker-overlay-container-left", showing:false, components:[
			{classes:"moon-scroll-picker-overlay-left"},
			{classes:"moon-scroll-picker-overlay-left-border"}
		]},
		{name:"rightOverlay", classes:"moon-scroll-picker-overlay-container-right", showing:false, components:[
			{classes:"moon-scroll-picker-overlay-right"},
			{classes:"moon-scroll-picker-overlay-right-border"}
		]},
		{kind:"enyo.Button", classes:"moon-simple-integer-picker-button", content:"<", ontap:"previous", name:"buttonLeft"},
		{kind:"enyo.Panels", classes:"moon-simple-integer-picker-client", controlClasses:"moon-simple-integer-picker-item", draggable:false, arrangerKind: "CarouselArranger", name:"client"},
		{kind:"enyo.Button", classes:"moon-simple-integer-picker-button", content:">", ontap:"next", name:"buttonRight"}
	],
	create: function() {
		this.inherited(arguments);
		this.populate();
		this.animateChanged();
		this.valueChanged();
		this.disabledChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this._rendered = true;
	},
	populate: function() {
		for(var i=this.min; i<=this.max; i=i+this.step) {
			var o = this.createComponent({content: i + " " + this.unit, value: i});
			this.indexhash[i] = this.$.client.getPanels().length - 1;
		}
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
		if (this.getAbsoluteShowing()) {
			var width = 0;
			for (var c$=this.$.client.getPanels(), i=0; i<c$.length; i++) {
				width = Math.max(width, c$[i].getBounds().width);
			}
			this.$.client.setBounds({width:width});
			for (c$=this.$.client.getPanels(), i=0; i<c$.length; i++) {
				c$[i].setBounds({width:width});
			}
			this.$.client.reflow();
			this.$.client.setBounds({height: this.$.buttonLeft.getBounds().height});
		}

		// Make sure selected item is in sync after Panels reflow, which may have
		// followed an item being added/removed
		// if (this.value != this.$.client.getActive().value) {
		//   this.setValue(this.$.client.getActive().value);
		//   this.fireChangedEvent();
		// }
	},
	hideOverlay: function() {
		this.$.leftOverlay.setShowing(false);
		this.$.rightOverlay.setShowing(false);
	},
	transitionStart: function(inSender, inEvent) {
		if (inEvent.fromIndex > inEvent.toIndex) {
			this.$.leftOverlay.show();
		} else if (inEvent.fromIndex < inEvent.toIndex) {
			this.$.rightOverlay.show();
		}
	},
	transitionFinished: function(inSender, inEvent) {
		this.content = this.$.client.getPanels()[this.$.client.getIndex()].content;
		this.value = this.$.client.getPanels()[this.$.client.getIndex()].value;
		this.fireChangedEvent();
		this.hideOverlay();
		return true;
	},
	spotlightBlur: function() {
		this.hideOverlay();
	},
	fireSelectEvent: function () {
		if (this._rendered) {
			var _this = this;
			this.doSelect({
				content: _this.content,
				value: _this.value
			});
		}
	},
	fireChangedEvent: function() {
		if (this._rendered) {
			var _this = this;
			this.doChange({
				content: _this.content,
				value: _this.value
			});
		}
	},
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
		this.$.buttonLeft.setDisabled(this.disabled);
		this.$.buttonRight.setDisabled(this.disabled);
	},
	animateChanged: function() {
		this.$.client.setAnimate(this.animate);
	},
	valueChanged: function(inOld) {
		if ((this.$.client.getIndex() != this.indexhash[this.value])) {
			this.$.client.setIndex(this.indexhash[this.value]);
			this.content = this.$.client.getPanels()[this.$.client.getIndex()].content;
		}
	},
	//* @public
	//* Cycles the selected item to the one before the currently selected item.
	previous: function() {
		this.$.client.previous();
		return true;
	},
	//* @public
	//* Cycles the selected item to the one after the currently selected item.
	next: function() {
		this.$.client.next();
		return true;
	}
});