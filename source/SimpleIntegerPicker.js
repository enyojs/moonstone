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
	kind: "moon.SimplePicker",
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
		onSelect: ""
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

		onmousewheel           : "mousewheel",
		ontransitionend        : "transitionFinished"
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
		{classes: "moon-scroll-picker-overlay-container-left", components: [
			{name: "leftOverlay", showing: false, components:[
				{classes: "moon-scroll-picker-overlay-left"},
				{classes: "moon-scroll-picker-overlay-left-border"} 
			]},
			{name: "buttonLeft", kind: "enyo.Button", classes: "moon-simple-integer-picker-button left", ontap: "previous", onholdpulse:"previous"}
		]},
		{kind: "enyo.Control", name: "clientWrapper", classes:"moon-simple-picker-client-wrapper", components: [
			{kind: "enyo.Control", name: "client", classes: "moon-simple-picker-client"}
		]},
		{classes: "moon-scroll-picker-overlay-container-right", components: [
			{name: "rightOverlay", showing: false, components:[
				{classes: "moon-scroll-picker-overlay-right"},
				{classes: "moon-scroll-picker-overlay-right-border"}
			]},
			{name: "buttonRight", kind: "enyo.Button", classes: "moon-simple-integer-picker-button right", ontap: "next", onholdpulse:"next"}
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
		{from: ".value",   to: ".selectedIndex", oneWay: false, transform: "sync"}
	],
	sync: function(inVal, inOrigin, inBinding) {
		if (this.values) {
			return (inOrigin === "source") ? this.indices[inVal] : this.values[inVal];
		}
	},
	//* @public

	//* Cycles the selected item to the one before the currently selected item.
	previous: function() {
		this.inherited(arguments);
		this.showOverlays(false);
	},
	//* Cycles the selected item to the one after the currently selected item.
	next: function() {
		this.inherited(arguments);
		//Its better to define isNext as true/false 
		//while moving next or pervious as it would help 
		//in scenarios where wrapping is turned on.
		this.showOverlays(true);
	},
	//* Facades the currently active panel.
	getContent: function() {
		return (this.$.client && this.$.client.hasNode()) && this.getSelected() ? this.getSelected().getContent() : "";
	},

	//* @protected
	create: function() {
		this.inherited(arguments);
		if (!this.deferInitialization) {
			this.build();
			this.validate();
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
			if (this.step <= 0) {
				// if step value is 0 or negative, should create only "min" value and then break this loop. 
				break;
			}
		}
		if (this.generated) {
			this.render();
		}
	},
	validate: function() {
		var index = this.indices[this.value];
		if (index !== undefined) {
			this.set("selectedIndex", index);
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
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.getDisabled());
	},
	transitionFinished: function(inSender, inEvent) {
		this.hideOverlays();
		return true;
	},
	spotlightBlur: function() {
		this.hideOverlays();
	},
	showOverlays: function(isNext) {
		if (isNext) {
			this.$.rightOverlay.show();
		} else {
			this.$.leftOverlay.show();
		}
	},
	hideOverlays: function() {
		this.$.leftOverlay.setShowing(false);
		this.$.rightOverlay.setShowing(false);
	},
	setButtonVisibility: function(inOld, inNew) {
		if (this.values && !this.wrap) {
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