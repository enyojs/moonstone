require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/TimePicker~TimePicker} kind.
* @module moonstone/TimePicker
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var
	dateFactory = require('enyo-ilib/DateFactory'),
	DateFmt = require('enyo-ilib/DateFmt'),
	LocaleInfo = require('enyo-ilib/LocaleInfo');

var
	DateTimePickerBase = require('../DateTimePickerBase'),
	$L = require('../i18n'),
	IntegerPicker = require('../IntegerPicker');

/**
* {@link module:moonstone/TimePicker~MeridiemPicker} is a helper kind used by {@link module:moonstone/TimePicker~TimePicker}.
* It is not intended for use in other contexts.
*
* @class MeridiemPicker
* @extends module:moonstone/IntegerPicker~IntegerPicker
* @ui
* @protected
*/
var MeridiemPicker = kind(
	/** @lends module:moonstone/TimePicker~MeridiemPicker.prototype */ {

	/**
	* @private
	*/
	name: 'moon.MeridiemPicker',

	/**
	* @private
	*/
	kind: IntegerPicker,

	/**
	* @private
	*/
	classes: 'moon-date-picker-month',

	/**
	* @private
	*/
	min: 0,

	/**
	* @private
	*/
	max: 1,

	/**
	* @private
	*/
	wrap: true,

	/**
	* @private
	*/
	locale: null,

	/**
	* @private
	* @lends module:moonstone/TimePicker~MeridiemPicker.prototype
	*/
	published: {
		/**
		* The meridiem names and time ranges to use if
		* [meridiemEnable]{@link module:moonstone/TimePicker~TimePicker#meridiemEnable}
		* is `true`.
		*
		* @type {Object[]}
		* @default [{name: 'AM', start: '00:00', end: '11:59'}, {name: 'PM', start: '12:00', end: '23:59'}]
		* @public
		*/
		meridiems: [{name: 'AM', start: '00:00', end: '11:59'}, {name: 'PM', start: '12:00', end: '23:59'}]
	},

	/**
	* @private
	*/
	initILib: function () {
		// Get localized meridiem values
		var fmtParams = {
			template: 'a',
			useNative: false,
			timezone: 'local'
		};

		if (this.locale) fmtParams.locale = this.locale;

		var merFormatter = new DateFmt(fmtParams);
		this.meridiems = merFormatter.getMeridiemsRange(fmtParams);
	},

	/**
	* @private
	*/
	create: function () {
		this.initILib();
		this.max = this.meridiems.length - 1;
		IntegerPicker.prototype.create.apply(this, arguments);
	},

	/**
	* Set meridiem value based on given hour and minute
	*
	* @param  {Number} hour - hour between 0 to 23
	* @param  {Number} minute - minute between 0 to 59
	*
	* @public
	*/
	setValueByTime: function (hour, minute) {
		var meridiems = this.meridiems,
			start, end, time;
		for (var i = 0; i < meridiems.length; i++) {
			start = parseInt(meridiems[i].start.substring(0,2) + meridiems[i].start.substring(3,5), 10);
			end = parseInt(meridiems[i].end.substring(0,2) + meridiems[i].end.substring(3,5), 10);
			time = hour * 100 + minute;

			if ( start <= time && time <= end) this.set('value', i);
		}
		this.offset = hour - parseInt(meridiems[this.value].start, 10);
	},

	/**
	* Get meridiem based on given value
	*
	* @param  {Number} value - value between min to max
	* @return {Object} meridiem - element of meridiems
	*
	* @public
	*/
	getMeridiemByValue: function (value) {
		if (value < this.min || value > this.max) return null;
		return this.meridiems[value];
	},

	/**
	* @private
	*/
	valueChanged: function () {
		IntegerPicker.prototype.valueChanged.apply(this, arguments);
		this.updateOverlays();
	},

	/**
	* @private
	*/
	setupItem: function (inSender, inEvent) {
		var index = inEvent.index % this.range || 0;
		this.$.item.setContent(this.meridiems[index].name);
	},

	// Accessibility
	
	ariaValue: function () {
		this.setAriaAttribute('aria-valuetext', this.meridiems[this.value].name);
	}
});

/**
* {@link module:moonstone/TimePicker~HourMinutePickerBase} is a helper kind used by {@link module:moonstone/TimePicker~TimePicker}.
*  It is not intended for use in other contexts.
*
* @class HourMinutePickerBase
* @extends module:moonstone/IntegerPicker~IntegerPicker
* @ui
* @protected
*/
var HourMinutePickerBase = kind(
	/** @lends module:moonstone/TimePicker~HourMinutePickerBase.prototype */ {

	/**
	* @private
	*/
	name: 'moon.HourMinutePickerBase',

	/**
	* @private
	*/
	kind: IntegerPicker,

	/**
	* @private
	*/
	classes: 'moon-date-picker-field',

	/**
	* @private
	*/
	formatter: null,

	/**
	* @private
	*/
	wrap: true,

	/**
	* @private
	*/
	create: function () {
		IntegerPicker.prototype.create.apply(this, arguments);
		// Create ilib Date object used for formatting hours
		this.date = dateFactory();
	},

	/**
	* @private
	*/
	setupItem: function (inSender, inEvent) {
		var value = this.format(inEvent.index % this.range || 0);
		this.$.item.setContent(value);
	},

	// Accessibility

	ariaValue: function () {
		if (this.date && this.range) {
			var value = this.format(this.value % this.range);
			this.setAriaAttribute('aria-valuenow', value);
		}
	}
});

/**
* {@link module:moonstone/TimePicker~MinutePicker} is a helper kind used by {@link module:moonstone/TimePicker~TimePicker}.
*  It is not intended for use in other contexts.
*
* @class MinutePicker
* @extends module:moonstone/TimePicker~HourMinutePickerBase
* @ui
* @protected
*/
var MinutePicker = kind(
	/** @lends module:moonstone/TimePicker~MinutePicker.prototype */ {

	/**
	* @private
	*/
	name: 'moon.MinutePicker',
	/**
	* @private
	*/
	kind: HourMinutePickerBase,

	/**
	* @private
	*/
	min: 0,

	/**
	* @private
	*/
	max: 59,

	/**
	 * Formats the minute at `index` for the current locale
	 *
	 * @param  {Number} index - Minute between 0 and 59
	 * @return {String}       - Formatted minute
	 * @private
	 */
	format: function (index) {
		this.date.minute = index;
		return this.formatter.format(this.date);
	}
});

/**
* {@link module:moonstone/TimePicker~HourPicker} is a helper kind used by {@link module:moonstone/TimePicker~TimePicker}. It is
*  not intended for use in other contexts.
*
* @class HourPicker
* @extends module:moonstone/TimePicker~HourMinutePickerBase
* @ui
* @protected
*/
var HourPicker = kind(
	/** @lends module:moonstone/TimePicker~HourPicker.prototype */ {

	/**
	* @private
	*/
	name: 'moon.HourPicker',

	/**
	* @private
	*/
	kind: HourMinutePickerBase,

	/**
	* @private
	*/
	min: 0,

	/**
	* @private
	*/
	max: 23,

	/**
	* @private
	*/
	valueChanged: function (old) {
		this.offset = this.value - old;
		IntegerPicker.prototype.valueChanged.apply(this, arguments);
	},

	/**
	 * Formats the hour at `index` for the current locale
	 *
	 * @param  {Number} index - Hour between 0 and 24
	 * @return {String}       - Formatted hour
	 * @private
	 */
	format: function (index) {
		this.date.hour = index;
		return this.formatter.format(this.date);
	},

	/**
	 * If the formatted new and old values are the same, skip animating by not passing
	 * the old value to `IntegerPicker.scrollToValue`.
	 *
	 * If the hour is changed by more than 12 but the locale is using 12 hour formatting, this
	 * will not prevent a big scroll through all intermediate values (e.g. from 3pm to 2am) even
	 * though it only has to scroll 1 index. This can be seen most easily by selecting a time
	 * between 2 and 3 pm on day when DST springs forward and then changing the meridiem to AM.
	 *
	 * @see module:moonstone/IntegerPicker~IntegerPicker.scrollToValue
	 * @private
	 */
	scrollToValue: function (old) {
		// try to avoid the format calls if the old and current values
		// don't mod to the same value
		var maybeSame = old !== undefined && old%12 === this.value%12;
		if (maybeSame && this.format(old) === this.format(this.value)) {
			HourMinutePickerBase.prototype.scrollToValue.call(this);
		} else {
			HourMinutePickerBase.prototype.scrollToValue.apply(this, arguments);
		}
	}
});
/**
* {@link module:moonstone/TimePicker~TimePicker} is a [control]{@link module:enyo/Control~Control} used to allow the
* selection of (or to simply display) a time expressed in hours and minutes, with an
* optional meridiem indicator ('am' or 'pm').
*
* ```javascript
* var
* 	kind = require('enyo/kind'),
* 	TimePicker = require('moonstone/TimePicker');
*
* {kind: TimePicker, content: 'Time', meridiemEnable: true, onChange: 'changed'}
* ```
*
* Set the [value]{@link module:moonstone/TimePicker~TimePicker#value} property to a standard JavaScript
* {@glossary Date} object to initialize the picker, or to change it programmatically at
* runtime.
*
* @class TimePicker
* @extends module:moonstone/DateTimePickerBase~DateTimePickerBase
* @ui
* @public
*/
var TimePicker = module.exports = kind(
	/** @lends module:moonstone/TimePicker~TimePicker.prototype */ {

	/**
	* @private
	*/
	name: 'moon.TimePicker',

	/**
	* @private
	*/
	kind: DateTimePickerBase,

	/**
	* @private
	* @lends module:moonstone/TimePicker~TimePicker.prototype
	*/
	published: {

		/**
		* When `true`, the picker will use a 12-hour clock. (When [iLib]{@glossary ilib} is loaded,
		* this value will be ignored and the current locale's rules will determine whether a
		* 12-hour or 24-hour clock is used.)
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		meridiemEnable: false,

		/**
		* Optional label for hour.
		*
		* @type {String}
		* @default 'moonstone/i18n.$L('hour')'
		* @public
		*/
		hourText: $L('hour'),			// i18n 'HOUR' label in moonstone/TimePicker widget

		/**
		* Optional label for minute.
		*
		* @type {String}
		* @default 'moonstone/i18n.$L('minute')'
		* @public
		*/
		minuteText: $L('minute'),		// i18n 'MINUTE' label in moonstone/TimePicker widget

		/**
		* Optional label for meridiem.
		*
		* @type {String}
		* @default 'moonstone/i18n.$L('meridiem')'
		* @public
		*/

		meridiemText: $L('meridiem'),	// i18n 'MERIDIEM' label in moonstone/TimePicker widget
		/**
		* When `true`, midnight (and noon, if `meridiemEnable: true`) will be represented as `0`
		* instead of `24` (and `12`). (When [iLib]{@glossary ilib} is loaded, this value will be
		* ignored and the current locale's rules will determine whether `0` is used.)
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		hoursStartAtZero: false,

		/**
		* When `true`, hours will be zero-padded. (When [iLib]{@glosary ilib} is loaded, this
		* value will be ignored and the current locale's rules will determine whether
		* zero-padding is used.)
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		hoursZeroPadded: false,

		/**
		* When `true`, bottom text will be displayed
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		showPickerLabels: true
	},

	/**
	* @private
	*/
	observers: {
		refresh: ['hoursStartAtZero', 'meridiemEnable', 'hoursZeroPadded']
	},

	/**
	* @private
	*/
	iLibFormatType  : 'time',

	/**
	* @private
	*/
	defaultOrdering : 'hma',


	/**
	* @private
	*/
	initILib: function () {
		DateTimePickerBase.prototype.initILib.apply(this, arguments);

		// Set picker format 12 vs 24 hour clock
		var li = new LocaleInfo(this.locale || undefined);
		var clockPref = li.getClock();
		this.meridiemEnable = (clockPref == '12');

		var fmtParams = {
			type: 'time',
			time: 'h',
			clock: clockPref !== 'locale' ? clockPref : undefined,
			useNative: false,
			timezone: 'local'
		};
		if (this.locale) fmtParams.locale = this.locale;
		this.hourFormatter = new DateFmt(fmtParams);

		fmtParams.time = 'm';
		this.minuteFormatter = new DateFmt(fmtParams);
	},

	/**
	* @private
	*/
	setupPickers: function (ordering) {
		var pickers = [];
		var orderingArr = ordering.toLowerCase().split('');
		var doneArr = [];
		var o, f, l, values;
		for(f = 0, l = orderingArr.length; f < l; f++) {
			o = orderingArr[f];
			if (doneArr.indexOf(o) < 0) doneArr.push(o);
		}

		values = this.calcPickerValues();
		this.silence();

		for(f = 0, l = doneArr.length; f < l; f++) {
			o = doneArr[f];

			switch (o){
			case 'h':
			case 'k':
				pickers.push(this.wrapComponent(
					{name: 'timeWrapper', kind: Control, classes: 'moon-time-picker-wrap'},
					{kind: Control, classes: 'moon-date-time-picker-wrap', components:[
						{name: 'hour', kind: HourPicker, formatter: this.hourFormatter || this, value: values.hour, onChange: 'hourPickerChanged'},
						{name: 'hourLabel', kind: Control, content: this.hourText, classes: 'moon-date-time-picker-label moon-divider-text', renderOnShow: true}
					]},
					this
				));
				break;
			case 'm':
				pickers.push(this.wrapComponent(
					{name: 'timeWrapper', kind: Control, classes: 'moon-time-picker-wrap'},
					{kind: Control, classes: 'moon-date-time-picker-wrap', components:[
						{name: 'minute', kind: MinutePicker, formatter: this.minuteFormatter || this, value: values.minute, onChange: 'minutePickerChanged'},
						{name: 'minuteLabel', kind: Control, content: this.minuteText, classes: 'moon-date-time-picker-label moon-divider-text', renderOnShow: true}
					]},
					this
				));
				break;
			case 'a':
				if (this.meridiemEnable === true) {
					pickers.push(this.createComponent(
						{kind: Control, classes: 'moon-date-time-picker-wrap', components:[
							{name: 'meridiem', kind: MeridiemPicker, classes: 'moon-date-picker-field', locale: this.locale, onChange: 'meridiemPickerChanged'},
							{name: 'meridiemLabel', kind: Control, content: this.meridiemText, classes: 'moon-date-time-picker-label moon-divider-text', renderOnShow: true}
						]}
					));
					this.$.meridiem.setValueByTime(values.hour, values.minute);
				}
				break;
			default:
				break;
			}

		}
		this.showPickerLabelsChanged();
		this.unsilence();
		this.pickers = pickers;
		DateTimePickerBase.prototype.setupPickers.apply(this, arguments);
	},

	/**
	* @private
	*/
	wrapComponent: function (wrapperProps, compProps, owner) {
		var wrapper = this.$[wrapperProps.name];
		if (!wrapper) wrapper = this.createComponent(wrapperProps);
		return wrapper.createComponent(compProps, {owner: owner});
	},

	/**
	* @private
	*/
	formatValue: function () {
		if (!this.value) return (this.noneText);
		return this._tf.format(dateFactory({unixtime: this.value.getTime(), timezone:'Etc/UTC'}));
	},

	/**
	* @private
	*/
	formatHour: function (hour) {
		if (this.meridiemEnable) {
			if (hour > 12) hour -= 12;
			if (this.hoursStartAtZero) {
				if (hour == 12) hour = 0;
			} else hour = hour || 12;
		} else {
			if (!this.hoursStartAtZero) hour = hour || 24;
		}
		if (this.hoursZeroPadded) hour = ('0' + hour).slice(-2);

		return hour;
	},

	/**
	* @private
	*/
	formatMinute: function (minute) {
		return minute;
	},

	/**
	* @private
	*/
	hourPickerChanged: function (sender, event) {
		if (this.syncingPickers) return true;

		var hour = this.value.getHours() + (event.originator.offset);

		if (this.value) this.updateValue(hour);

		return true;
	},

	/**
	* @private
	*/
	minutePickerChanged: function (sender, event) {
		if (this.syncingPickers) return true;

		var minutes = event.value;

		if (this.value) {
			this.value.setMinutes(minutes);
			this.set('value', this.value, {force: true});
		}

		return true;
	},

	/**
	* @private
	*/
	meridiemPickerChanged: function (sender, event) {
		if (this.syncingPickers) return true;

		var meridiemPicker = event.originator,
			meridiems = meridiemPicker.get('meridiems'),
			meridiem = meridiemPicker.getMeridiemByValue(event.value),
			start = meridiem.start.split(':'),
			startHour = parseInt(start[0], 10),
			offset = meridiemPicker.offset,
			newHour = startHour + offset;

		if (meridiems.length == 2) this.updateValue(newHour);
		else {
			var end = meridiem.end.split(':'),
				endHour = parseInt(end[0], 10),
				startMinute = parseInt(start[1], 10),
				endMinute = parseInt(end[1], 10),
				oldMinute = this.$.minute.get('value'),
				newMinute;

			if (startHour * 100 + startMinute > newHour * 100 + oldMinute) {
				newHour = startHour;
				newMinute = startMinute;
			} else if (endHour * 100 + endMinute < newHour * 100 + oldMinute) {
				newHour = endHour;
				newMinute = endMinute;
			}
			offset = newHour - this.$.hour.get('value');
			this.updateValue(this.value.getHours() + offset, newMinute);
		}

		return true;
	},

	/**
	* @private
	*/
	updateValue: function (newHour, newMinute) {
		var valueTime = this.value.getTime(),
			value = new Date(valueTime);

		if (newHour != null) value.setHours(newHour);
		if (newMinute != null) value.setMinutes(newMinute);

		// in the rare case that the value didn't change because it was snapped back to the
		// same value due to DST rules, push it back another hour.
		if (valueTime == value.getTime()) {
			value = new Date(valueTime - 3600000);
		}

		this.set('value', value, {force: true});
	},

	/**
	* @private
	*/
	setChildPickers: function (inOld) {
		if (this.value) {
			var values = this.calcPickerValues();
			this.$.hour.set('value', values.hour);
			this.$.minute.set('value',values.minute);
			if (this.meridiemEnable) this.$.meridiem.setValueByTime(values.hour, values.minute);
		}
	},

	/**
	* @private
	*/
	calcPickerValues: function () {
		var values = {},
			value = this.localeValue || this.value;

		if (value) {
			values.hour = value.getHours();
			values.minute = value.getMinutes();
		} else values.hour = values.minute = 0;

		return values;
	},

	/**
	* @private
	*/
	valueChanged: function (old) {
		if (this.value) this.localeValue = dateFactory({unixtime: this.value.getTime(), timezone: 'local'});

		DateTimePickerBase.prototype.valueChanged.apply(this, arguments);
	},

	/**
	* @private
	*/
	hourTextChanged: function (inOldvalue, inNewValue) {
		this.$.hourLabel.set('content', inNewValue);
	},

	/**
	* @private
	*/
	minuteTextChanged: function (inOldvalue, inNewValue) {
		this.$.minuteLabel.set('content', inNewValue);
	},

	/**
	* @private
	*/
	meridiemTextChanged: function (inOldvalue, inNewValue) {
		this.$.meridiemLabel.set('content', inNewValue);
	},

	/**
	* @private
	*/
	showPickerLabelsChanged: function (inOldvalue, inNewValue) {
		this.$.hourLabel.set('showing', this.showPickerLabels);
		this.$.minuteLabel.set('showing', this.showPickerLabels);
		if (this.meridiemEnable) this.$.meridiemLabel.set('showing', this.showPickerLabels);
 	},

	// Accessibility

	/**
	* @private
	*/
	ariaObservers: [
		{path: ['hourText', 'minuteText', 'meridiemText'], method: function () {
			this.$.hour.set('accessibilityLabel', this.hourText);
			this.$.minute.set('accessibilityLabel', this.minuteText);
			if (this.$.meridiem) this.$.meridiem.set('accessibilityLabel', this.meridiemText);
		}}
	]
});

TimePicker.HourPicker = HourPicker;
TimePicker.MinutePicker = MinutePicker;
TimePicker.MeridiemPicker = MeridiemPicker;
