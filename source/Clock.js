(function (enyo, scope) {
	/**
	* Used to set a static time for {@link moon.Clock} to display.
	*
	* @typedef {Object} moon.Clock~DateTimeObject
	* @property {Number} year - Year to display.
	* @property {Number} month - Month to display.
	* @property {Number} day - Day to display.
	* @property {Number} hour - Hour to display.
	* @property {Number} minute - Minute to display.
	* @property {Number} second - Second to display.
	* @public
	*/

	/**
	* {@link moon.Clock} is a control that displays clock information.
	*
	* Example:
	*
	* ```
	*		{kind: 'moon.Clock'}
	* ```
	*
	* @class moon.Clock
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.Clock.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Clock',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		*/
		classes: 'moon-clock moon-header-font',

		/**
		* @private
		* @lends moon.Clock.prototype
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
			* User-provided date; if `undefined`, system date is used. Can be either a
			* JavaScript {@glossary Date} object or a {@link moon.Clock~DateTimeObject}
			* detailing the static date/time to use.
			*
			* @type {Date|moon.Clock~DateTimeObject}
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
			{kind: 'enyo.Control', name: 'hour', classes: 'moon-header-text moon-clock-hour'},
			{name: 'right', classes: 'moon-clock-right', components: [
				{kind: 'enyo.Control', name: 'top', classes: 'moon-header-font moon-clock-top'},
				{name: 'meridiem', classes: 'moon-bold-text moon-clock-meridiem'},
				{name: 'divider', classes: 'moon-clock-divider'},
				{kind: 'enyo.Control', name: 'bottom', classes: 'moon-body-text moon-clock-bottom'}
			]},
			{kind: 'enyo.Signals', onlocalechange: 'handleLocaleChangeEvent'}
		],

		/**
		* @private
		*/
		months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

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
			this.inherited(arguments);
			this.initDefaults();
			this.refreshJob();
		},

		/**
		* @private
		*/
		initILib: function () {
			this.ilibLocaleInfo = new ilib.LocaleInfo(this.locale || undefined);
			var clockPref = this.ilibLocaleInfo.getClock();
			var clock = clockPref !== 'locale' ? clockPref : undefined;
			var dateLen, fmtMin;

			if (this.ilibLocaleInfo.locale.spec === 'en-US') {
				dateLen = 'long';
				fmtMin = 'm';
				this.$.right.addRemoveClass('mini', false);
				this.$.hour.show();
				this.$.meridiem.show();
			} else {
				dateLen = 'full';
				fmtMin = 'hma';
				this.$.right.addRemoveClass('mini', true);
				this.$.hour.hide();
				this.$.meridiem.hide();
			}

			var fmtHourParams = {
				locale: this.locale,
				type: 'time',
				time: 'h',
				clock: clock,
				timezone: (this.mode === 'normal') ? 'local' : 'Etc/UTC'
			};
			var fmtMinuteParams = {
				locale: this.locale,
				type: 'time',
				time: fmtMin,
				clock: clock,
				timezone: (this.mode === 'normal') ? 'local' : 'Etc/UTC'
			};
			var fmtMonthDayParams = {
				locale: this.locale,
				type: 'date',
				date: 'md',
				length: dateLen,
				timezone: (this.mode === 'normal') ? 'local' : 'Etc/UTC'
			};

			this._hf = new ilib.DateFmt(fmtHourParams);
			this._mf = new ilib.DateFmt(fmtMinuteParams);
			this._mdf = new ilib.DateFmt(fmtMonthDayParams);
		},

		/**
		* @private
		*/
		initDefaults: function () {
			// Attempt to use the ilib lib
			if (typeof ilib !== 'undefined') {
				this.initILib();
			}
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
		_formatNumber: function (inValue) {
			// Used when ilib is not present
			return (inValue) ? (String(inValue).length < 2) ? '0'+inValue : inValue : '00';
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
			if (this._hf) {
				delete this._hf;
			}
			if (this._mf) {
				delete this._mf;
			}
			if (this._mdf) {
				delete this._mdf;
			}
			this.initDefaults();
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
			this.updateHour(d, h);
			this.updateMinute(d, h);
			this.updateMonthDay(d);
		},

		/**
		* @private
		*/
		updateHour: function (inDate, inHour) {
			inHour = (inHour > 12 ? inHour-12: inHour) || 12;

			var hour = this._hf ? this._hf.format((this.mode === 'normal')	? ilib.Date.newInstance({unixtime: inDate.getTime(), timezone:'Etc/UTC'})
																			: ilib.Date.newInstance(this.parseStaticDate(inDate)))
								: inHour;
			this.$.hour.setContent(hour);
		},

		/**
		* @private
		*/
		updateMinute: function (inDate, inHour) {
			var time = this._mf ? this._mf.format((this.mode === 'normal')	? ilib.Date.newInstance({unixtime: inDate.getTime(), timezone:'Etc/UTC'})
																			: ilib.Date.newInstance(this.parseStaticDate(inDate)))
								: (this.mode === 'normal')	? this._formatNumber(inDate.getMinutes())
															: this._formatNumber(inDate.min);
			var meridiem = '';
			if (!this.ilibLocaleInfo || this.ilibLocaleInfo.locale.spec === 'en-US') {
				meridiem = inHour > 11 ? 'pm' : 'am';
			}
			this.$.top.setContent(time);
			this.$.meridiem.setContent(meridiem);
		},

		/**
		* @private
		*/
		updateMonthDay: function (inDate) {
			var md = this._mdf	? this._mdf.format((this.mode === 'normal') ? ilib.Date.newInstance({unixtime: inDate.getTime(), timezone:'Etc/UTC'})
																			: ilib.Date.newInstance(this.parseStaticDate(inDate)))
								: (this.mode === 'normal')	? this.months[inDate.getMonth()] + ' ' + this._formatNumber(inDate.getUTCDate())
															: ((inDate.month !== undefined) ? this.months[inDate.month-1] : 0) + ' ' + this._formatNumber(inDate.day);
			this.$.bottom.setContent(md);
		},

		/**
		* @private
		*/
		handleLocaleChangeEvent: function () {
			this._refresh();
			this.updateDate();
		}
	});

})(enyo, this);
