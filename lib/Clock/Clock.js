require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Clock~Clock} kind.
* @module moonstone/Clock
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	Signals = require('enyo/Signals');

var
	ilib = require('enyo-ilib');

/**
* Used to set a static time for {@link module:moonstone/Clock~Clock} to display.
*
* @typedef {Object} module:moonstone/Clock~Clock~DateTimeObject
* @property {Number} year - The year to display.
* @property {Number} month - The month to display.
* @property {Number} day - The day to display.
* @property {Number} hour - The hour to display.
* @property {Number} minute - The minute to display.
* @property {Number} second - The second to display.
* @public
*/

/**
* {@link module:moonstone/Clock~Clock} is a control that displays clock information.
*
* Example:
*
* ```
*	var Clock = require('moonstone/Clock');
*	...
*		{kind: Clock}
* ```
*
* @class Clock
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Clock~Clock.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Clock',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'moon-clock',

	/**
	* @private
	* @lends module:moonstone/Clock~Clock.prototype
	*/
	published: {

		/**
		* Refresh time in milliseconds.
		*
		* @type {Number}
		* @default 1000
		* @public
		*/
		refresh: 1000,

		/**
		* A user-provided date; if `undefined`, system date is used. May be either a
		* JavaScript {@glossary Date} object or a {@link module:moonstone/Clock~Clock~DateTimeObject}
		* describing a static date/time to be displayed.
		*
		* @type {Date|module:moonstone/Clock~Clock~DateTimeObject}
		* @default undefined
		* @public
		*/
		date: undefined,

		/**
		* Current locale used for formatting. May be set after the control is
		* created, in which case the control will be updated to reflect the
		* new value.  Only valid if [iLib]{@glossary ilib} is loaded.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		locale: ''
	},

	/**
	* @private
	*/
	observers: {
		modeChanged: ['mode']
	},

	/**
	* @private
	*/
	components: [
		{name: 'clock', kind: Control, classes: 'moon-bold-text'},
		{kind: Signals, onlocalechange: 'handleLocaleChangeEvent'}
	],

	/**
	* @private
	*/
	_timeDiff: 0,

	/**
	* [iLib]{@glossary ilib} locale info instance; it contains information about the
	* particular locale.
	*
	* @private
	*/
	ilibLocaleInfo: null,

	/**
	* Defines clock mode.
	* If `date` is assigned with JavaScript Date object or `null`, it will be `'normal'`.
	* If `date` is assigned with JavaScript object that indicates the exact time components
	* to be formatted into the clock, it will be `'static'`.
	*
	* @private
	*/
	mode: 'normal',

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.initILib();
		this.refreshJob();
	},

	/**
	* @private
	*/
	initILib: function () {
		this.ilibLocaleInfo = new ilib.LocaleInfo(this.locale || undefined);
		var clockPref = this.ilibLocaleInfo.getClock();
		var clock = clockPref !== 'locale' ? clockPref : undefined;

		var fmtParams = {
			locale: this.locale,
			type: 'time',
			time: 'hma',
			useNative: false,
			clock: clock,
			timezone: (this.mode === 'normal') ? 'local' : 'Etc/UTC'
		};

		this._tf = new ilib.DateFmt(fmtParams);
	},

	/**
	* @private
	*/
	refreshChanged: function () {
		this.startJob('refresh', this.bindSafely('refreshJob'), this.getRefresh());
	},

	/**
	* @private
	*/
	dateChanged: function () {
		if (this.date && !(this.date instanceof Date)) {
			this.set('mode', 'static');
		} else if(this.date && this.date instanceof Date) {
			this.set('mode', 'normal');
			this._timeDiff = (this.date.getTime() - Date.now()) || 0;
		} else {
			this.set('mode', 'normal');
			this._timeDiff = 0;
		}
		this.refreshJob();
	},

	/**
	* @private
	*/
	refreshJob: function () {
		this.updateDate();
		if (this.mode === 'normal') {
			this.startJob('refresh', this.bindSafely('refreshJob'), this.getRefresh());
		}
	},

	/**
	* @private
	*/
	localeChanged: function () {
		this._refresh();
		this.updateDate();
	},

	/**
	* @private
	*/
	modeChanged: function () {
		this._refresh();
	},

	/**
	* @private
	*/
	_refresh: function () {
		if (this._tf) {
			delete this._tf;
		}
		this.initILib();
	},

	/**
	* If user sets time without using a JavaScript Date object, this method
	* parses the object into an array for an `iLib.Date` object.
	*
	* @private
	*/
	parseStaticDate: function (date) {
		return {
			year: (date.year !== undefined) ? date.year : 0,
			month: (date.month !== undefined) ? date.month : 1,
			day: (date.day !== undefined) ? date.day : 0,
			hour: (date.hour !== undefined) ? date.hour : 0,
			minute: (date.min !== undefined) ? date.min : 0,
			second: (date.sec !== undefined) ? date.sec : 0,
			timezone: 'Etc/UTC'
		};
	},

	/**
	* @private
	*/
	updateDate: function () {
		var d, h;
		if (this.mode === 'normal') {
			d = new Date(Date.now() + this._timeDiff);
			h = d.getHours();
		} else {
			d = this.date;
			h = (this.date.hour) ? this.date.hour : 0;
		}
		this.updateTime(d, h);
	},

	/**
	* @private
	*/
	updateTime: function (inDate, inHour) {
		var date = (this.mode === 'normal') ? {unixtime: inDate.getTime(), timezone:'Etc/UTC'} : this.parseStaticDate(inDate),
			time = this._tf.format(ilib.Date.newInstance(date));
		this.$.clock.setContent(time);
	},

	/**
	* @private
	*/
	handleLocaleChangeEvent: function () {
		this._refresh();
		this.updateDate();
	}
});
