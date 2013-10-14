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
		//* Initial value
		value: -1,
		//* Minimum value
		min: 1,
		//* Maximum value
		max: 9,
		//* Amount to increment/decrement by
		step: 1,
		//* Unit/label to be appended to the end of the number
		unit: "sec"
	},

	//* @protected
	deferInitialization: false,
	indices: null,
	values: null,

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
	observers: {
		triggerRebuild: ["step", "min", "max", "unit"]
	},
	bindings: [
		{from: ".animate",  to: ".$.client.animate"},
		{from: ".disabled", to: ".$.buttonLeft.disabled"},
		{from: ".disabled", to: ".$.buttonRight.disabled"},
		{from: ".value",   to: ".$.client.index", oneWay: false, transform: "sync"}
	],
	sync: function(inVal, inOrigin, inBinding) {
		if (this.values) {
			return (inOrigin === "source") ? this.indices[inVal] : this.values[inVal];
		}
		else {
			inBinding.stop();
		}
	},
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
		if (!this.deferInitialization) {
			this.build();
		}
		this.disabledChanged();
	},
	build: function() {
		var indices = this.indices = {},
			values = this.values = [];

		for (var i = 0, v = this.min; v <= this.max; i++, v += this.step) {
			this.createComponent({content: v + " " + this.unit, value: v});
			values[i] = v;
			indices[v] = i;
		}
	},
	validate: function() {
		var index = this.indices[this.value];
		if (index) {
			this.$.client.set("index", index);
		}
		else
		{
			this.set("value", this.min);
		}
	},
	rebuild: function() {
		this.destroyClientControls();
		this.build();
		this.$.client.render();
		this.reflow();
		this.validate();
	},
	triggerRebuild: function() {
		// We use a job here to avoid rebuilding the picker multiple
		// times in succession when more than one of the properties it
		// depends on (min, max, step, unit) change at once. This case
		// occurs when SimpleIntegerPicker is used inside
		// ExpandableIntegerPicker, since ExpandableIntegerPicker
		// facades these properties and therefore sets them all upon
		// creation.
		this.startJob("rebuild", this.rebuild, 10);
	},

	// Change handlers
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.getDisabled());
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