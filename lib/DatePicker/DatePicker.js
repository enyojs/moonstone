require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/DatePicker~DatePicker} kind.
* @module moonstone/DatePicker
*/

var
	kind = require('enyo/kind'),
	options = require('enyo/options');

var
	DateFactory = require('enyo-ilib/DateFactory');

var
	DateTimePickerBase = require('../DateTimePickerBase'),
	$L = require('../i18n'),
	IntegerPicker = require('../IntegerPicker'),
	DatePickerAccessibilitySupport = require('./DatePickerAccessibilitySupport');

/**
* {@link module:moonstone/DatePicker~DatePicker} is a control used to allow the selection of (or simply
* display) a day, month, and year.
*
* ```javascript
* var
* 	kind = require('enyo/kind'),
* 	DatePicker = require('moonstone/DatePicker');
*
* {kind: DatePicker, noneText: 'Pick a Date', content: 'Date', onChange: 'changed'}
* ```
*
* Set the [value]{@link module:moonstone/DatePicker~DatePicker#value} property to a standard JavaScript
* {@glossary Date} object to initialize the picker, or to change it programmatically
* at runtime.
*
* @class DatePicker
* @extends module:moonstone/DateTimePickerBase~DateTimePickerBase
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/DatePicker~DatePicker.prototype */ {

	/**
	* @private
	*/
	name: 'moon.DatePicker',

	/**
	* @private
	*/
	kind: DateTimePickerBase,

	/**
	* @private
	*/
	mixins: options.accessibility ? [DatePickerAccessibilitySupport] : null,

	/**
	* @private
	* @lends module:moonstone/DatePicker~DatePicker.prototype
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
		dayText: $L('day'),			// i18n 'DAY' label in moon.DatePicker widget

		/**
		* Optional label for month.
		*
		* @type {String}
		* @default 'month'
		* @public
		*/
		monthText: $L('month'),		// i18n 'MONTH' label in moon.DatePicker widget

		/**
		* Optional label for year.
		*
		* @type {String}
		* @default 'year'
		* @public
		*/
		yearText: $L('year')			// i18n 'YEAR' label in Moon.DatePicker widget
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
	initILib: function () {
		DateTimePickerBase.prototype.initILib.apply(this, arguments);
		if (this.value) {
			this.localeValue = DateFactory({unixtime: this.value.getTime(), timezone: 'local'});
		}
	},

	/**
	 * When [iLib]{@glossary ilib} is supported, calculates the minimum year in the
	 * current calendar. Otherwise, returns the value of the published property
	 * [minYear]{@link module:moonstone/DatePicker~DatePicker#minYear}.
	 *
	 * @private
	 */
	getMinYear: function() {
		var greg = DateFactory({
			type: 'gregorian',
			year: this.minYear,
			month: 1,
			day: 1,
			timezone: 'local'
		});
		var localCalendarDate = DateFactory({
			julianday: greg.getJulianDay(),
			timezone: 'local'
		});
		return localCalendarDate.getYears();
	},

	/**
	 * When [iLib]{@glossary ilib} is supported, calculates the maximum year in the
	 * current calendar. Otherwise, returns the value of the published property
	 * [maxYear]{@link module:moonstone/DatePicker~DatePicker#maxYear}.
	 *
	 * @private
	 */
	getMaxYear: function() {
		var greg = DateFactory({
			type: 'gregorian',
			year: this.maxYear,
			month: 1,
			day: 1,
			timezone: 'local'
		});
		var localCalendarDate = DateFactory({
			julianday: greg.getJulianDay(),
			timezone: 'local'
		});
		return localCalendarDate.getYears();
	},


	/**
	* @private
	*/
	setupPickers: function (ordering) {
		var pickers = [];
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
				pickers.push(this.createComponent(
					{classes: 'moon-date-picker-wrap', components:[
						{kind: IntegerPicker, name:'day', classes:'moon-date-picker-field', wrap:true, digits:digits, min:1,
						max: values.maxDays, value: values.date, onChange: 'pickerChanged'},
						{name: 'dayLabel', content: this.dayText, classes: 'moon-date-picker-label moon-divider-text'}
					]}
				));
				break;
			case 'M':
				digits = (ordering.indexOf('MM') > -1) ? 2 : null;
				pickers.push(this.createComponent(
					{classes: 'moon-date-picker-wrap', components:[
						{kind: IntegerPicker, name:'month', classes:'moon-date-picker-field', wrap:true, min:1, max:values.maxMonths, value:values.month, onChange: 'pickerChanged'},
						{name: 'monthLabel', content: this.monthText, classes: 'moon-date-picker-label moon-divider-text'}
					]}
				));
				break;
			case 'y':
				pickers.push(this.createComponent(
					{classes: 'moon-date-picker-wrap year', components:[
						{kind: IntegerPicker, name:'year', classes:'moon-date-picker-field year', value:values.fullYear, min:this.getMinYear(), max:this.getMaxYear(), onChange: 'pickerChanged'},
						{name: 'yearLabel', content: this.yearText, classes: 'moon-date-picker-label moon-divider-text'}
					]}
				));
				break;
			default:
				break;
			}
		}

		this.unsilence();
		this.pickers = pickers;
	},

	/**
	* @private
	*/
	formatValue: function () {
		if (!this.value) {
			return (this.noneText);
		}
		return this._tf.format(this.value);
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

		maxDays = this.monthLength(year, month);
		this.localeValue = DateFactory({
			day: (day <= maxDays) ? day : maxDays,
			month: month,
			year: year,
			hour: valueHours,
			minute: valueMinutes,
			second: valueSeconds,
			millisecond: valueMilliseconds
		});
		this.setValue(this.localeValue.getJSDate());

		return true;
	},

	/**
	* @private
	*/
	setChildPickers: function (inOld) {
		if (this.value) {
			this.localeValue = DateFactory({unixtime: this.value.getTime(), timezone: 'local'});
		}

		if (this.localeValue || this.value) {
			var values = this.calcPickerValues();

			this.$.year.set('value', values.fullYear);
			this.$.month.set('value', values.month);
			this.$.day.set('value', values.date);
			this.$.month.set('max', values.maxMonths);
			this.$.day.set('max', values.maxDays);
			this.$.currentValue.setContent(this.formatValue());
		}
	},

	/**
	* @private
	*/
	calcPickerValues: function () {
		var values = {
			maxMonths: 12,
			maxDays: 31
		};

		if (this.localeValue) {
			values.fullYear = this.localeValue.getYears();
			values.month = this.localeValue.getMonths();
			values.date = this.localeValue.getDays();
			if (values.fullYear) {
				values.maxMonths = this._tf.cal.getNumMonths(values.fullYear);
				values.maxDays = this.monthLength(values.fullYear, values.month);
			}
		}

		return values;
	},

	/**
	* Returns number of days in a particular month/year.
	*
	* @private
	*/
	monthLength: function (inYear, inMonth) {
		return this._tf.cal.getMonLength(inMonth, inYear);
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
