require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/DateTimePickerBase~DateTimePickerBase} kind.
* @module moonstone/DateTimePickerBase
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	Signals = require('enyo/Signals');

var
	ilib = require('enyo-ilib'),
	dateFactory = require('enyo-ilib/DateFactory'),
	DateFmt = require('enyo-ilib/DateFmt');

var
	ExpandableListItem = require('../ExpandableListItem');

/**
* Fires when the picker's value changes.
*
* @event module:moonstone/DateTimePickerBase~DateTimePickerBase#onChange
* @type {Object}
* @property {String} name - The name of this control.
* @property {Date} value - A standard JavaScript {@glossary Date} object representing
* the picker's current value.
* @public
*/

/**
* {@link module:moonstone/DateTimePickerBase~DateTimePickerBase} is a base kind implementing fuctionality shared by
* {@link module:moonstone/DatePicker~DatePicker} and {@link module:moonstone/TimePicker~TimePicker}. It is not intended to be used
* directly.
*
* @class DateTimePickerBase
* @extends module:moonstone/ExpandableListItem~ExpandableListItem
* @ui
* @protected
*/

module.exports = kind(
	/** @lends module:moonstone/DateTimePickerBase~DateTimePickerBase.prototype */ {

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
	classes: 'moon-date-picker',

	/**
	* @private
	*/
	events: {

		/**
		* {@link module:moonstone/DateTimePickerBase~DateTimePickerBase#onChange}
		*/
		onChange: ''
	},

	/**
	* @private
	* @lends module:moonstone/DateTimePickerBase~DateTimePickerBase.prototype
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
	drawerComponents: [
		{name: 'client', kind: Control, classes: 'moon-date-time-picker-client', onSpotlightLeft:'closePicker', onSpotlightSelect: 'closePicker'},
		{kind: Signals, onlocalechange: 'handleLocaleChangeEvent'}
	],

	computed: {
		'currentValueText': ['value', 'noneText', 'locale']
	},

	/**
	* @private
	*/
	initComponents: function () {
		ExpandableListItem.prototype.initComponents.apply(this, arguments);
		this.initDefaults();
		this.$.drawer.addClass('indented');
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
		this._tf = new DateFmt(fmtParams);
	},

	/**
	* @private
	*/
	initDefaults: function () {
		this.initILib();
		this.setupPickers(this._tf.getTemplate());
	},

	/**
	* @private
	*/
	setupPickers: function (ordering) {
		// implement in subkind
	},

	/**
	* @private
	*/
	formatValue: function () {
		// implement in subkind
	},

	/**
	* @fires module:moonstone/DateTimePickerBase~DateTimePickerBase#onChange
	* @private
	*/
	valueChanged: function (inOld) {
		this.syncingPickers = true;
		this.setChildPickers(inOld);
		this.syncingPickers = false;

		if (this.value) {
			this.doChange({name:this.name, value:this.value});
		}
	},

	/**
	* @private
	*/
	setChildPickers: function (inOld) {
		// implement in subkind
	},

	/**
	* If no item is selected, sets [noneText]{@link module:moonstone/DateTimePickerBase~DateTimePickerBase#noneText}
	* as current value.
	*
	* @private
	*/
	currentValueText: function () {
		return this.value ? this.formatValue() : this.noneText;
	},

	/**
	* @private
	*/
	currentValueShowing: function () {
		return true;
	},

	/**
	* When [open]{@link module:moonstone/ExpandableListItem~ExpandableListItem#open} changes, shows/hides the current value.
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
	expandContract: function () {
		// if currently closed and without a value, set it to now before opening
		if (!this.open && !this.value) {
			this.set('value', new Date());
		}
		ExpandableListItem.prototype.expandContract.apply(this, arguments);
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
			this.localeValue = dateFactory({unixtime: this.value.getTime(), timezone: "local"});
		}
		this.set('open', false);
		this.initDefaults();
		this.render();
	}
});
