/**
	_moon.SimpleIntegerPicker_ is a control that prompts the user to make a
	selection from a range of integer-based options.

	The picker may be changed programmatically by calling _previous()_ or
	_next()_, or by modifying the published property _value_.

	The _onChange_ event, fired when the selected item changes, contains the
	_value_ and _content_ properties.
*/
enyo.kind({
	name: "moon.SimpleIntegerPicker",
	classes: "moon-simple-integer-picker",
	spotlight:true,
	events: {
		/**
			Fires when the currently selected item changes.

			_inEvent.value_ contains the value of the currently selected item.

			_inEvent.content_ contains the content of the currently selected item.
		*/
		onChange: "",
		/**
			Fires in response to Return keypress while the picker has focus in
			Spotlight 5-way mode.

			_inEvent.value_ contains the value of the currently selected item.

			_inEvent.content_ contains the content of the currently selected item.
		*/
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
			this.createComponent({content: i + " " + this.unit, value: i});
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