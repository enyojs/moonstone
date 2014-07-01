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
	//* @protected
	classes: "moon-simple-integer-picker",
	spotlight:true,
	//* @public
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
		onSelect: "",
		/**
			Fires when the picker is rebuilt, allowing other controls the opportunity to reflow the 
			picker as necessary, i.e. as a child of _moon.ExpandableIntegerPicker_ needing to be 
			reflowed when opened as it may currently not be visible.
		*/
		onRebuilt: ""
	},
	//* @protected
	handlers: {
		onSpotlightSelect      : "fireSelectEvent",
		onSpotlightRight       : "next",
		onSpotlightLeft        : "previous",
		onSpotlightScrollUp    : "next",
		onSpotlightScrollDown  : "previous",
		
		onSpotlightBlur        : "spotlightBlur",
		onSpotlightFocus       : "spotlightFocus",
		onSpotlightFocused     : "spotlightFocus",

		onmousewheel           : "mousewheel"
	},
	//* @public
	published: {
		//* When true, picker transitions animate left/right
		animate:true,
		//* When true, button is shown as disabled and does not generate tap events
		disabled: false,
		//* Initial picker value
		value: -1,
		//* Minimum picker value
		min: 1,
		//* Maximum picker value
		max: 9,
		//* Amount to increment/decrement by when moving picker between _min_ and _max_
		step: 1,
		//* Unit label to be appended to the value for display
		unit: "sec"
	},

	//* @protected
	deferInitialization: false,
	indices: null,
	values: null,

	components: [
		{name: "buttonLeft", classes: "moon-simple-integer-picker-button left", ondown: "downPrevious", onholdpulse:"previous", components: [
			{classes: "moon-simple-integer-picker-button-tap-area"}
		]},
		{name: "client", kind: "enyo.Panels", classes: "moon-simple-integer-picker-client", controlClasses: "moon-simple-integer-picker-item", draggable: false, arrangerKind: "CarouselArranger",
			onTransitionStart: "transitionStart", onTransitionFinish:"transitionFinished"
		},
		{name: "buttonRight", classes: "moon-simple-integer-picker-button right", ondown: "downNext", onholdpulse:"next", components: [
			{classes: "moon-simple-integer-picker-button-tap-area"}
		]}
	],
	observers: {
		triggerRebuild: ["step", "min", "max", "unit"],
		handleValueChange: ["value"]
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
	downPrevious: function(inSender, inEvent) {
		inEvent.configureHoldPulse({endHold: "onLeave", delay: 300});
		this.previous();
	},
	downNext: function(inSender, inEvent) {
		inEvent.configureHoldPulse({endHold: "onLeave", delay: 300});
		this.next();
	},
	//* Facades the currently active panel.
	getContent: function() {
		return (this.$.client && this.$.client.hasNode() && this.$.client.getActive()) ? this.$.client.getActive().getContent() : "";
	},

	//* @protected
	create: function() {
		this.inherited(arguments);
		if (!this.deferInitialization) {
			this.build();
			this.validate();
		}
		this.disabledChanged();
		this.reflow();
	},
	build: function() {
		var indices = this.indices = {},
			values = this.values = [],
			ilibNumFmt = (typeof ilib !== "undefined") ? new ilib.NumFmt({locale: new ilib.LocaleInfo().locale, useNative: false}) : null,
			fmtValue;

		for (var i = 0, v = this.min; v <= this.max; i++, v += this.step) {
			fmtValue = ilibNumFmt ? ilibNumFmt.format(v) : v;
			this.createComponent({content: fmtValue + " " + this.unit, value: v});
			values[i] = v;
			indices[v] = i;
			if (this.step <= 0) {
				// if step value is 0 or negative, should create only "min" value and then break this loop. 
				break;
			}
		}
	},
	validate: function() {
		var index = this.indices[this.value];
		if (index !== undefined) {
			this.$.client.set("index", index);
			this.setButtonVisibility(null, this.value);
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
		this.doRebuilt();
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

	disabledChanged: function() {
		this.addRemoveClass("disabled", this.getDisabled());
	},

	//* On reflow, updates the bounds of _this.$.client_.
	reflow: function() {
		this.inherited(arguments);

		// Find max width of all children
		if (this.getAbsoluteShowing()) {
			var i,
				maxWidth = 0,
				c = this.$.client.getPanels();
			for (i = 0; i < c.length; i++) {
				maxWidth = Math.max(maxWidth, c[i].getBounds().width);
			}
			this.$.client.setBounds({width: maxWidth});
			for (i = 0; i < c.length; i++) {
				c[i].setBounds({width: maxWidth});
			}
			this.$.client.reflow();
		}
	},
	transitionStart: function(inSender, inEvent) {
		if (inEvent.fromIndex > inEvent.toIndex) {
			this.$.buttonLeft.addClass("pressed");
		} else if (inEvent.fromIndex < inEvent.toIndex) {
			this.$.buttonRight.addClass("pressed");
		}
		return true;
	},
	transitionFinished: function(inSender, inEvent) {
		this.hideOverlays();
		return true;
	},
	spotlightBlur: function() {
		this.hideOverlays();
	},
	hideOverlays: function() {
		this.$.buttonLeft.removeClass("pressed");
		this.$.buttonRight.removeClass("pressed");
	},
	setButtonVisibility: function(inOld, inNew) {
		if (this.values) {
			var min = this.values[0],
				max = this.values[this.values.length - 1];
			if (inNew === min) {
				this.$.buttonLeft.applyStyle("visibility", "hidden");
			}
			else if (inOld === min) {
				this.$.buttonLeft.applyStyle("visibility", "visible");
			}
			if (inNew === max) {
				this.$.buttonRight.applyStyle("visibility", "hidden");
			}
			else if (inOld === max) {
				this.$.buttonRight.applyStyle("visibility", "visible");
			}
		}
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
	},
	handleValueChange: function(inOld, inNew) {
		this.setButtonVisibility(inOld, inNew);
		this.fireChangeEvent();
	},
	mousewheel: function(inSender, inEvent) {
		// Make sure scrollers that container integer pickers don't scroll
		inEvent.preventDefault();
		return true;
	}
});