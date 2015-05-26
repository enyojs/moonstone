require('moonstone');

/**
* Contains the declaration for the {@link moon.DateTimePickerBase} kind.
* @module moonstone/DateTimePickerBase
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	Signals = require('enyo/Signals');

var
	Spotlight = require('spotlight');

var
	ilib = require('enyo-ilib');

var
	ExpandableListDrawer = require('../ExpandableListDrawer'),
	ExpandableListItem = require('../ExpandableListItem'),
	Item = require('../Item'),
	Marquee = require('../Marquee'),
	MarqueeText = Marquee.Text;

/**
* Fires when the picker's value changes.
*
* @event moon.DateTimePickerBase#onChange
* @type {Object}
* @property {String} name - The name of this control.
* @property {Date} value - A standard JavaScript {@glossary Date} object representing
* the picker's current value.
* @public
*/

/**
* {@link moon.DateTimePickerBase} is a base kind implementing fuctionality shared by
* {@link moon.DatePicker} and {@link moon.TimePicker}. It is not intended to be used
* directly.
*
* @namespace moon
* @class moon.DateTimePickerBase
* @extends moon.ExpandableListItem
* @ui
* @definedby module:moonstone/DateTimePickerBase
* @protected
*/

module.exports = kind(
	/** @lends moon.DateTimePickerBase.prototype */ {

	/**
	* @private
	*/
	name: 'moon.DateTimePickerBase',

	/**
	* @private
	*/
	kind: ExpandableListItem,

	/**
	* @private
	*/
	defaultKind: Control,

	/**
	* @private
	*/
	classes: 'moon-expandable-picker moon-date-picker',

	/**
	* @private
	*/
	events: {

		/**
		* {@link moon.DateTimePickerBase#onChange}
		*/
		onChange: ''
	},

	/**
	* @private
	* @lends moon.DateTimePickerBase.prototype
	*/
	published: {

		/**
		* Text to be displayed as the current value if no item is currently selected.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		noneText: '',

		/**
		* The locale (in IETF format) used for picker formatting.
		*
		* This setting only applies when the [iLib]{@glossary ilib} library is loaded.
		*
		* When `iLib` is not present, U.S. English `(en-US)` formatting is applied.
		*
		* When `iLib` is present and `locale` is set to the default value `(null)`,
		* the picker uses `iLib`'s current locale (which `iLib` tries to determine
		* from the system).
		*
		* When `iLib` is present and an explicit `locale` is provided, that locale
		* will be used (regardless of `iLib`'s current locale).
		*
		* The `locale` value may be changed after the picker is created; if this happens,
		* the picker will be reformatted to reflect the new setting.
		*
		* @type {Object}
		* @default null
		* @public
		*/
		locale: null,

		/**
		* The value of the picker, expressed as a standard JavaScript {@glossary Date}
		* object.
		*
		* @type {Date}
		* @default null
		* @public
		*/
		value: null,

		/**
		* If `true`, the picker will use a 12-hour clock (this value is ignored when
		* `iLib` is loaded, since the meridiem will be set by the current locale).
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		meridiemEnable: false
	},

	/**
	* Set in subkind.
	*
	* @private
	*/
	iLibFormatType: null,

	/**
	* Set in subkind.
	*
	* @private
	*/
	defaultOrdering: null,

	/**
	* @private
	*/
	components: [
		{name: 'headerWrapper', kind: Item, classes: 'moon-date-picker-header-wrapper', onSpotlightFocus: 'headerFocus', ontap: 'expandContract', components: [
			// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
			{name: 'headerContainer', kind: Control, classes: 'moon-expandable-list-item-header moon-expandable-picker-header moon-expandable-datetime-header', components: [
				{name: 'header', kind: MarqueeText}
			]},
			{name: 'currentValue', kind: MarqueeText, classes: 'moon-expandable-picker-current-value'}
		]},
		{name: 'drawer', kind: ExpandableListDrawer, resizeContainer:false, classes:'moon-expandable-list-item-client indented', components: [
			{name: 'client', kind: Control, classes: 'enyo-tool-decorator moon-date-picker-client', onSpotlightLeft:'closePicker', onSpotlightSelect: 'closePicker'}
		]},
		{kind: Signals, onlocalechange: 'handleLocaleChangeEvent'}
	],

	/**
	* @private
	*/
	bindings: [
		{from: '.disabled', to: '.$.headerWrapper.disabled'}
	],

	/**
	* @private
	*/
	create: function () {
		ExpandableListItem.prototype.create.apply(this, arguments);
		this.initDefaults();
	},

	/**
	* @private
	*/
	initILib: function () {
		var fmtParams = {
			type: this.iLibFormatType,
			useNative: false,
			timezone: 'local',
			length: 'full',
			date: 'dmwy'
		};

		fmtParams.locale = this.locale;
		this.iLibLocale = ilib.getLocale();
		this._tf = new ilib.DateFmt(fmtParams);
	},

	/**
	* @private
	*/
	initDefaults: function () {
		this.initILib();
		this.setupPickers(this._tf.getTemplate());
		this.noneTextChanged();
	},

	/**
	* @private
	*/
	setupPickers: function (ordering) {
		// implement in subkind, calling this.inherited() at the end
		this.pickers = this.getClientControls();
	},

	/**
	* @private
	*/
	formatValue: function () {
		// implement in subkind
	},

	/**
	* @fires moon.DateTimePickerBase#onChange
	* @private
	*/
	valueChanged: function (inOld) {
		this.syncingPickers = true;
		this.setChildPickers(inOld);
		this.syncingPickers = false;

		if (this.value) {
			this.doChange({name:this.name, value:this.value});
		} else {
			this.noneTextChanged();
		}
	},

	/**
	* @private
	*/
	setChildPickers: function (inOld) {
		// implement in subkind
	},

	/**
	* If no item is selected, sets [noneText]{@link moon.DateTimePickerBase#noneText}
	* as current value.
	*
	* @private
	*/
	noneTextChanged: function () {
		if(!this.value) {
			this.$.currentValue.setContent(this.getNoneText());
		} else {
			this.$.currentValue.setContent(this.formatValue());
		}
	},

	/**
	* When [open]{@link moon.ExpandableListItem#open} changes, shows/hides the current value.
	*
	* @private
	*/
	openChanged: function () {
		ExpandableListItem.prototype.openChanged.apply(this, arguments);
		var pickers = this.pickers,
			i, p;
		if (pickers && this.open) {
			for (i = 0; i < pickers.length; i++) {
				p = pickers[i];
				if (p.getClientControls().length > 0) {
					p = p.getClientControls()[0];
				}
				p.reflow();
			}
		}
	},

	/**
	* @private
	*/
	toggleActive: function () {
		if (this.getOpen()) {
			this.setActive(false);
			if (!Spotlight.getPointerMode()) {
				Spotlight.spot(this.$.headerWrapper);
			}
		} else {
			if (!this.value) {
				this.setValue(new Date());
			}
			this.setActive(true);
		}
	},

	/**
	* @private
	*/
	closePicker: function (inSender, inEvent) {
		/**
		* If select/enter is pressed on any date picker item or the left key is pressed on the
		* first item, close the drawer
		*/
		if (inEvent.type == 'onSpotlightSelect' ||
			this.$.client.children[0].id == inEvent.originator.id) {
			this.expandContract();
			this.noneTextChanged();
			return true;
		}
	},

	/**
	* @private
	*/
	localeChanged: function () {
		// Our own locale property has changed, so we need to rebuild our child pickers
		ilib.setLocale(this.locale);
		this.iLibLocale = ilib.getLocale();
		this.refresh();
	},

	/**
	* @private
	*/
	handleLocaleChangeEvent: function () {
		// We've received a localechange event from the system, which means either the system
		// locale or the timezone may have changed.
		if (ilib.getLocale() !== this.iLibLocale) {
			// We're using iLib locale, and it has changed, so we'll rebuild the child pickers
			// entirely
			this.refresh();
		} else {
			// We don't care about the iLib locale or it hasn't changed, but timezone might have
			// changed, so we'll just update the child pickers
			this.setChildPickers();
		}
	},

	/**
	* @private
	*/
	refresh: function (){
		this.destroyClientControls();
		this.pickers = null;
		delete this._tf;
		if (this.value) {
			this.localeValue = ilib.Date.newInstance({unixtime: this.value.getTime(), timezone: "local"});
		}
		this.initDefaults();
		this.render();
	}
});
