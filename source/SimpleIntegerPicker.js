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
			Fires in response to Return keypress while the picker has focus in Spotlight 5-way mode.

			_inEvent.value_ contains the value of the currently selected item.

			_inEvent.content_ contains the content of the currently selected item.
		*/
		onSelect: ""
	},
	handlers: {
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
		value: -1,
		min: 1,
		max: 9,
		step: 1,
		unit: "sec"
	},
	indexhash: null,
	firstflow: true,


	//* @protected

	components: [
		{name: "leftOverlay", classes: "moon-scroll-picker-overlay-container-left", showing: false, components:[
			{classes: "moon-scroll-picker-overlay-left"},
			{classes: "moon-scroll-picker-overlay-left-border"}
		]},
		{name: "rightOverlay", classes: "moon-scroll-picker-overlay-container-right", showing: false, components:[
			{classes: "moon-scroll-picker-overlay-right"},
			{classes: "moon-scroll-picker-overlay-right-border"}
		]},
		{name: "buttonLeft", kind: "enyo.Button", classes: "moon-simple-integer-picker-button left", ontap: "previous"},
		{name: "client", kind: "enyo.Panels", classes: "moon-simple-integer-picker-client", controlClasses: "moon-simple-integer-picker-item", draggable: false, arrangerKind: "CarouselArranger",
			onTransitionStart: "transitionStart", onTransitionFinish:"transitionFinished"
		},
		{name: "buttonRight", kind: "enyo.Button", classes: "moon-simple-integer-picker-button right", ontap: "next"}
	],
	bindings: [
		{from: ".animate",  to: ".$.client.animate"},
		{from: ".disabled", to: ".$.buttonLeft.disabled"},
		{from: ".disabled", to: ".$.buttonRight.disabled"},
		{from: ".$.client.index",   to: ".index"}
	],
	//* @public

	//* Cycles the selected item to the one before the currently selected item.
	previous: function() {
		this.$.client.previous();
		return true;
	},
	//* Cycles the selected item to the one after the currently selected item.
	next: function() {
		this.$.client.next();
		return true;
	},
	//* Facade for currently active panel
	getContent: function() {
		return (this.$.client && this.$.client.hasNode() && this.$.client.getActive()) ? this.$.client.getActive().getContent() : "";
	},

	//* @protected

	create: function() {
		this.inherited(arguments);
		this.populateIndexhash();
		this.disabledChanged();
	},
	rendered: function() {
		this.$.client.setAnimate(false);
		this.valueChanged();
		this.$.client.setAnimate(this.animate);
		this.inherited(arguments);
	},
	populateIndexhash: function() {
		this.indexhash = [];
		var valueValid = false;

		for (var i = this.min; i <= this.max; i += this.step) {
			this.createComponent({content: i + " " + this.unit, value: i});
			this.indexhash[i] = this.$.client.getPanels().length - 1;
			if (i == this.value) {
				valueValid = true;
			}
		}
		if (!valueValid) {
			this.value = this.min;
		}
	},

	// Change handlers
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.getDisabled());
	},
	valueChanged: function(inOld) {
		if (this.$.client && this.$.client.hasNode()) {
			this.$.client.setIndex(this.lookupIndex(this.value));
		}
	},
	indexChanged: function() {
		this.updateValue();
	},

	//* Find appropriate index in _this.$.client_ panels based on _inValue_
	lookupIndex: function(inValue) {
		return (this.indexhash && this.indexhash.length > 0) ? this.indexhash[inValue] : -1;
	},
	//* Quietly update _this.value_ when _this.index_ changes
	updateValue: function() {
		this.value = (this.$.client && this.$.client.hasNode() && this.$.client.getActive()) ? this.$.client.getActive().value : this.value;
	},
	//* On reflow, update the bounds of _this.$.client_
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
		}
	},
	transitionStart: function(inSender, inEvent) {
		if (inEvent.fromIndex > inEvent.toIndex) {
			this.$.leftOverlay.show();
		} else if (inEvent.fromIndex < inEvent.toIndex) {
			this.$.rightOverlay.show();
		}
		return true;
	},
	transitionFinished: function(inSender, inEvent) {
		this.fireChangeEvent();
		this.hideOverlays();
		return true;
	},
	spotlightBlur: function() {
		this.hideOverlays();
	},
	hideOverlays: function() {
		this.$.leftOverlay.setShowing(false);
		this.$.rightOverlay.setShowing(false);
	},
	fireSelectEvent: function () {
		if (this.hasNode()) {
			this.doSelect({content: this.getContent(), value: this.value});
		}
	},
	fireChangeEvent: function() {
		if (this.hasNode()) {
			this.doChange({content: this.getContent(), value: this.value});
		}
	}
});