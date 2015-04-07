(function (enyo, scope) {
	/**
	* {@link moon.DatePicker} is a control used to allow the selection of (or simply
	* display) a day, month, and year.
	*
	* ```
	* {
	* 	kind: 'moon.DatePicker',
	* 	noneText: 'Pick a Date',
	* 	content: 'Date',
	* 	onChange: 'changed'
	* }
	* ```
	*
	* Set the [value]{@link moon.DatePicker#value} property to a standard JavaScript
	* {@glossary Date} object to initialize the picker, or to change it programmatically
	* at runtime.
	*
	* @class moon.DatePicker
	* @extends moon.DateTimePickerBase
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.DatePicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.DatePicker',

		/**
		* @private
		*/
		kind: 'moon.DateTimePickerBase',

		/**
		* @private
		* @lends moon.DatePicker.prototype
		*/
		published: {

			/**
			* Optional minimum year value. Must be specified using the Gregorian
			* calendar, regardless of the calendar type used by the specified locale.
			*
			* @type {Number}
			* @default 1900
			* @public
			*/
			minYear: 1900,

			/**
			* Optional maximum year value. Must be specified using the Gregorian
			* calendar, regardless of the calendar type used by the specified locale.
			*
			* @type {Number}
			* @default 2099
			* @public
			*/
			maxYear: 2099,

			/**
			* Optional label for day.
			*
			* @type {String}
			* @default 'day'
			* @public
			*/
			dayText: moon.$L('day'),			// i18n 'DAY' label in moon.DatePicker widget

			/**
			* Optional label for month.
			*
			* @type {String}
			* @default 'month'
			* @public
			*/
			monthText: moon.$L('month'),		// i18n 'MONTH' label in moon.DatePicker widget

			/**
			* Optional label for year.
			*
			* @type {String}
			* @default 'year'
			* @public
			*/
			yearText: moon.$L('year')			// i18n 'YEAR' label in Moon.DatePicker widget
		},

		/**
		* @private
		*/
		iLibFormatType: 'date',

		/**
		* @private
		*/
		defaultOrdering: 'Mdy',

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
		},

		/**
		* @private
		*/
		initILib: function () {
			this.inherited(arguments);
			if (typeof ilib !== 'undefined' && this.value) {
				this.localeValue = ilib.Date.newInstance({unixtime: this.value.getTime(), timezone: "local"});
			}
		},

		/**
		 * When [iLib]{@glossary ilib} is supported, calculates the minimum year in the
		 * current calendar. Otherwise, returns the value of the published property
		 * [minYear]{@link moon.DatePicker#minYear}.
		 *
		 * @private
		 */
		getMinYear: function() {
			if (typeof ilib !== 'undefined') {
				var greg = ilib.Date.newInstance({
					type: "gregorian",
					year: this.minYear,
					month: 1,
					day: 1,
					timezone: 'local'
				});
				var localCalendarDate = ilib.Date.newInstance({
					julianday: greg.getJulianDay(),
					timezone: "local"
				});
				return localCalendarDate.getYears();
			} else {
				return this.minYear;
			}
		},

		/**
		 * When [iLib]{@glossary ilib} is supported, calculates the maximum year in the
		 * current calendar. Otherwise, returns the value of the published property
		 * [maxYear]{@link moon.DatePicker#maxYear}.
		 *
		 * @private
		 */
		getMaxYear: function() {
			if (typeof ilib !== 'undefined') {
				var greg = ilib.Date.newInstance({
					type: "gregorian",
					year: this.maxYear,
					month: 1,
					day: 1,
					timezone: 'local'
				});
				var localCalendarDate = ilib.Date.newInstance({
					julianday: greg.getJulianDay(),
					timezone: "local"
				});
				return localCalendarDate.getYears();
			} else {
				return this.maxYear;
			}
		},


		/**
		* @private
		*/
		setupPickers: function (ordering) {
			var orderingArr = ordering.split('');
			var doneArr = [];
			var o, f, l, digits, values;
			for(f = 0, l = orderingArr.length; f < l; f++) {
				o = orderingArr[f];
				if (doneArr.indexOf(o) < 0) {
					doneArr.push(o);
				}
			}

			values = this.calcPickerValues();
			this.silence();

			for(f = 0, l = doneArr.length; f < l; f++) {
				o = doneArr[f];

				switch (o) {
				case 'd':
					digits = (ordering.indexOf('dd') > -1) ? 2 : null;
					this.createComponent(
						{classes: 'moon-date-picker-wrap', components:[
							{kind:'moon.IntegerPicker', name:'day', classes:'moon-date-picker-field', wrap:true, digits:digits, min:1,
							max:this.monthLength(values.fullYear, values.month), value: values.date, onChange: 'pickerChanged'},
							{name: 'dayLabel', content: this.dayText, classes: 'moon-date-picker-label moon-divider-text'}
						]});
					break;
				case 'M':
					digits = (ordering.indexOf('MM') > -1) ? 2 : null;
					this.createComponent(
						{classes: 'moon-date-picker-wrap', components:[
							{kind:'moon.IntegerPicker', name:'month', classes:'moon-date-picker-field', wrap:true, min:1, max:values.maxMonths, value:values.month, onChange: 'pickerChanged'},
							{name: 'monthLabel', content: this.monthText, classes: 'moon-date-picker-label moon-divider-text'}
						]});
					break;
				case 'y':
					this.createComponent(
						{classes: 'moon-date-picker-wrap year', components:[
							{kind:'moon.IntegerPicker', name:'year', classes:'moon-date-picker-field year', value:values.fullYear, min:this.getMinYear(), max:this.getMaxYear(), onChange: 'pickerChanged'},
							{name: 'yearLabel', content: this.yearText, classes: 'moon-date-picker-label moon-divider-text'}
						]});
					break;
				default:
					break;
				}
			}

			this.unsilence();
			this.inherited(arguments);
		},

		/**
		* @private
		*/
		formatValue: function () {
			if (!this.value) {
				return (this.noneText);
			}
			if (this._tf) {
				return this._tf.format(this.value);
			} else {
				return this.getWeekDay()[this.value.getDay()] + ' ' + this.getMonthName()[this.value.getMonth()] + ' ' + this.value.getDate() + ' ' + this.value.getFullYear();
			}
		},

		/**
		* @private
		*/
		pickerChanged: function (inSender, inEvent) {
			if(this.syncingPickers) return true;

			var day = this.$.day.getValue(),
				month = this.$.month.getValue(),
				year = this.$.year.getValue(),
				maxDays;
			var valueHours = this.value ? this.value.getHours() : 0;
			var valueMinutes = this.value ? this.value.getMinutes() : 0;
			var valueSeconds = this.value ? this.value.getSeconds() : 0;
			var valueMilliseconds = this.value ? this.value.getMilliseconds() : 0;

			if (typeof ilib !== 'undefined') {
				maxDays = this.monthLength(year, month);
				this.localeValue = ilib.Date.newInstance({
					day: (day <= maxDays) ? day : maxDays,
					month: month,
					year: year,
					hour: valueHours,
					minute: valueMinutes,
					second: valueSeconds,
					millisecond: valueMilliseconds
				});
				this.setValue(this.localeValue.getJSDate());
			} else {
				maxDays = this.monthLength(year, month);
				this.setValue(new Date(year, month-1, (day <= maxDays) ? day : maxDays,
					valueHours,
					valueMinutes,
					valueSeconds,
					valueMilliseconds));
			}

			return true;
		},

		/**
		* @private
		*/
		setChildPickers: function (inOld) {
			if (this.value && typeof ilib !== 'undefined') {
				this.localeValue = ilib.Date.newInstance({unixtime: this.value.getTime(), timezone: "local"});
			}

			if (this.localeValue || this.value) {
				var values = this.calcPickerValues();

				this.$.year.set('value', values.fullYear);
				this.$.month.set('value', values.month);
				this.$.day.set('value', values.date);
				this.$.month.set('max', values.maxMonths);
				this.$.day.set('max', this.monthLength(values.fullYear, values.month));
				this.$.currentValue.setContent(this.formatValue());
			}
		},

		/**
		* @private
		*/
		calcPickerValues: function () {
			var values = {};
			if (typeof ilib !== 'undefined') {
				if (this.localeValue) {
					values.fullYear = this.localeValue.getYears();
					values.month = this.localeValue.getMonths();
					values.date = this.localeValue.getDays();
				}
				values.maxMonths = this._tf.cal.getNumMonths(values.fullYear);
			} else {
				if (this.value) {
					values.fullYear = this.value.getFullYear();
					values.month = this.value.getMonth()+1;
					values.date = this.value.getDate();
				}
				values.maxMonths = 12;
			}
			return values;
		},

		/**
		* @private
		*/
		getMonthName: function () {
			// Only used when ilib is not loaded
			return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		},

		/**
		* @private
		*/
		getWeekDay: function() {
			// Only used when ilib is not loaded
			return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		},

		/**
		* Returns number of days in a particular month/year.
		*
		* @private
		*/
		monthLength: function (inYear, inMonth) {
			if (inYear && (inMonth == 0 || inMonth)) {
				if (typeof ilib !== 'undefined') {
					return this._tf.cal.getMonLength(inMonth, inYear);
				} else {
					return 32 - new Date(inYear, inMonth - 1, 32).getDate();
				}
			}
		},
		
		/**
		* @private
		*/
		yearTextChanged: function (inOldvalue, inNewValue) {
			this.$.yearLabel.setContent(inNewValue);
		},

		/**
		* @private
		*/
		monthTextChanged: function (inOldvalue, inNewValue) {
			this.$.monthLabel.setContent(inNewValue);
		},

		/**
		* @private
		*/
		dayTextChanged: function (inOldvalue, inNewValue) {
			this.$.dayLabel.setContent(inNewValue);
		}
	});

})(enyo, this);
