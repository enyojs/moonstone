/**
	_moon.DateTimePickerBase_ is a base kind implementing fuctionality shared
	by [moon.DatePicker](#moon.DatePicker) and [moon.TimePicker](#moon.TimePicker).
	It is not intended to be used directly.
*/
enyo.kind({
	name: "moon.DateTimePickerBase",
	kind: "moon.ExpandableListItem",
	//* @protected
	defaultKind: "enyo.Control",
	classes: "moon-expandable-picker moon-date-picker",
	//* @public
	events: {
		/**
			Fires when the value changes.

			_inEvent.name_ contains the name of this control.

			_inEvent.value_ contains a standard JavaScript Date object representing
			the current value.
		*/
		onChange: ""
	},
	//* @protected
	handlers: {
		//* Handler for _onChange_ events coming from constituent controls
		onChange: "handleChangeEvent"
	},
	//* @public
	published: {
		//* Text to be displayed in the _currentValue_ control if no item is
		//* currently selected
		noneText: "",
		/**
			The locale (in IETF format) used for picker formatting.

			This setting only applies when the _ilib_ library is loaded.

			* When ilib is not present, US English (en-US) formatting is applied.

			* When ilib is present and _locale_ is set to the default value (_null_),
			the picker uses ilib's current locale (which ilib tries to determine
			from the system).

			* When ilib is present and an explicit _locale_ is provided, that locale
			will be used (regardless of ilib's current locale).

			_locale_ may be changed after the picker is created, in which case the
			picker will	be reformatted to match the new setting.

		*/
		locale: null,
		/**
			The value, expressed as a standard JavaScript Date object. When a Date object
			is passed to _set("value")_, the control is updated to reflect the new
			value. _get("value")_ returns a Date object.
		*/
		value: null,
		/**
			When true, the picker uses a 12-hour clock (this value is ignored when ilib
			is loaded, since the meridiem will be set by the current locale)
		*/
		meridiemEnable: false
	},
	//*@protected
	iLibFormatType: null, // set in subkind
	defaultOrdering: null, // set in subkind
	components: [
		{name: "headerWrapper", kind: "moon.Item", classes: "moon-date-picker-header-wrapper", onSpotlightFocus: "headerFocus", ontap: "expandContract", components: [
			{name: "header", kind: "moon.MarqueeText", classes: "moon-expandable-list-item-header moon-expandable-picker-header"},
			{name: "currentValue", kind: "moon.MarqueeText", classes: "moon-expandable-picker-current-value"}
		]},
		{name: "drawer", kind: "enyo.Drawer", classes:"moon-expandable-list-item-client indented", components: [
			{name: "client", kind: "enyo.Control", classes: "enyo-tool-decorator moon-date-picker-client", onSpotlightLeft:"closePicker", onSpotlightSelect: "closePicker"}
		]}
	],
	bindings: [
		{from: ".disabled", to: ".$.headerWrapper.disabled"}
	],
	create: function() {
		this.inherited(arguments);
		this.createComponent({kind: "enyo.Signals", onlocalechange: "handleLocaleChangeEvent"});
		this.initDefaults();
	},
	initILib: function() {
		var fmtParams = {
			type: this.iLibFormatType,
			useNative: false,
			timezone: "local",
			length: "full"
		};
		if (this.locale) {
			fmtParams.locale = this.locale;
			this.iLibLocale = null;
		} else {
			this.iLibLocale = ilib.getLocale();
		}
		this._tf = new ilib.DateFmt(fmtParams);
	},
	initDefaults: function() {
		var ordering;
		this.value = this.value || new Date();
		//Attempt to use the ilib lib (assuming that it is loaded)
		if (typeof ilib !== "undefined") {
			this.initILib();
			ordering = this._tf.getTemplate();
		} else {
			ordering = this.defaultOrdering;
		}
		this.setupPickers(ordering);
		this.noneTextChanged();
	},
	setupPickers: function(ordering) {
		// implement in subkind, calling this.inherited() at the end
		this.pickers = this.getClientControls();
	},
	formatValue: function() {
		// implement in subkind
	},
	handleChangeEvent: function(inSender, inEvent) {
		if (inEvent && inEvent.originator === this) {
			// Don't handle our own change events
			return;
		} else {
			this.updateValue(inSender, inEvent);
			return true;
		}
	},
	updateValue: function(inSender, inEvent) {
		// implement in subkind
	},
	valueChanged: function(inOld) {
		this.setChildPickers(inOld);
		if (this.value) {
			this.doChange({name:this.name, value:this.value});
		}
	},
	setChildPickers: function(inOld) {
		// implement in subkind
	},
	// If no item is selected, uses _this.noneText_ as current value.
	noneTextChanged: function() {
		if(this.value == null) {
			this.$.currentValue.setContent(this.getNoneText());
		} else {
			this.$.currentValue.setContent(this.formatValue());
		}
	},
	// When _this.open_ changes, shows/hides _this.$.currentValue_.
	openChanged: function() {
		this.inherited(arguments);
		var open = this.$.drawer.get("open"),
			pickers = this.pickers,
			i, p;
		this.$.currentValue.setShowing(!open);
		if (pickers) {
			for (i = 0; i < pickers.length; i++) {
				p = pickers[i];
				if (p.getClientControls().length > 0) {
					p = p.getClientControls()[0];
				}
				if (open) {
					//Force the pickers to update their scroll positions (they don't update while the drawer is closed)
					p.refreshScrollState();
				} else {
					// If one of the pickers is animating when the drawer closes, it won't display properly
					// when the drawer reopens, unless we stabilize here
					p.stabilize();
				}
			}
		}
	},
	toggleActive: function() {
		if (this.getOpen()) {
			this.setActive(false);
			if (!enyo.Spotlight.getPointerMode()) {
				enyo.Spotlight.spot(this.$.headerWrapper);
			}
		} else {
			this.setActive(true);
		}
	},
	closePicker: function(inSender, inEvent) {
		//* If select/enter is pressed on any date picker item or the left key is pressed on the first item, close the drawer
		if (inEvent.type == "onSpotlightSelect" ||
			this.$.client.children[0].id == inEvent.originator.id) {
			this.expandContract();
			this.noneTextChanged();
			return true;
		}
	},
	localeChanged: function() {
		// Our own locale property has changed, so we need to rebuild our child pickers
		this.refresh();
	},
	handleLocaleChangeEvent: function() {
		// We've received a localechange event from the system, which means either the system
		// locale or the timzezone may have changed.
		if (ilib && ilib.getLocale() !== this.iLibLocale) {
			// We're using iLib locale, and it has changed, so we'll rebuild the child pickers entirely
			this.refresh();
		} else {
			// We don't care about the iLib locale or it hasn't changed, but timezone might have changed,
			// so we'll just update the child pickers
			this.setChildPickers();
		}
	},
	refresh: function(){
		this.destroyClientControls();
		this.pickers = null;
		if (this._tf) {
			delete this._tf;
		}
		this.initDefaults();
		this.render();
	},
	stopHeaderMarquee: function() {
		this.$.headerWrapper.stopMarquee();
	}
});