(function (enyo, scope) {
	/**
	* {@link moon.MeridiemPicker} is a helper kind used by {@link moon.TimePicker}.
	* It is not intended for use in other contexts.
	*
	* @class moon.MeridiemPicker
	* @extends moon.IntegerPicker
	* @ui
	* @protected
	*/
	enyo.kind(
		/** @lends  moon.MeridiemPicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.MeridiemPicker',

		/**
		* @private
		*/
		kind: 'moon.IntegerPicker',

		/**
		* @private
		*/
		classes:'moon-date-picker-month',

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
		* @lends moon.MeridiemPicker.prototype
		*/
		published: {
			/**
			* The meridiem text to display if [meridiemEnable]{@link moon.TimePicker#meridiemEnable}
			* is `true`. The first item is used if the `hour` is less than `12`; otherwise, the
			* second is used.
			*
			* @type {String[]}
			* @default [{name: 'AM', start: '00:00', end: '11:59'}, {name: 'PM', start: '12:00', end: '23:59'}]
			* @public
			*/
			meridiems: [{name: 'AM', start: '00:00', end: '11:59'}, {name: 'PM', start: '12:00', end: '23:59'}]
		},

		/**
		* @private
		*/
		initILib: function() {
			// Get localized meridiem values
			var fmtParams = {
				template: 'a',
				useNative: false,
				timezone: 'local'
			};

			if (this.locale) fmtParams.locale = this.locale;

			var merFormatter = new ilib.DateFmt(fmtParams);
			this.meridiems = merFormatter.getMeridiemsRange(fmtParams);
		},

		/**
		* @private
		*/
		create: function() {
			if (typeof ilib !== 'undefined') this.initILib();
			this.max = this.meridiems.length - 1;
			this.inherited(arguments);
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
		},

		/**
		* @private
		*/
		valueChanged: function () {
			this.inherited(arguments);
			this.updateOverlays();
		},

		/**
		* @private
		*/
		setupItem: function (inSender, inEvent) {
			var index = inEvent.index % this.range || 0;
			this.$.item.setContent(this.meridiems[index].name);
		}
	});

	/**
	* {@link moon.HourMinutePickerBase} is a helper kind used by {@link moon.TimePicker}.
	*  It is not intended for use in other contexts.
	*
	* @class moon.MinutePicker
	* @extends moon.IntegerPicker
	* @ui
	* @protected
	*/
	enyo.kind(
		/** @lends moon.HourMinutePickerBase.prototype */ {

		/**
		* @private
		*/
		name: 'moon.HourMinutePickerBase',

		/**
		* @private
		*/
		kind: 'moon.IntegerPicker',

		/**
		* @private
		*/
		classes:'moon-date-picker-field',

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
			this.inherited(arguments);
			// Create ilib Date object used for formatting hours
			if (typeof ilib !== 'undefined') {
				this.date = ilib.Date.newInstance();
			}
		},

		/**
		* @private
		*/
		setupItem: function (inSender, inEvent) {
			var value = this.format(inEvent.index % this.range || 0);
			this.$.item.setContent(value);
		}
	});
	/**
	* {@link moon.MinutePicker} is a helper kind used by {@link moon.TimePicker}.
	*  It is not intended for use in other contexts.
	*
	* @class moon.MinutePicker
	* @extends moon.HourMinutePickerBase
	* @ui
	* @protected
	*/
	enyo.kind(
		/** @lends moon.MinutePicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.MinutePicker',
		/**
		* @private
		*/
		kind: 'moon.HourMinutePickerBase',

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
			var minute;

			if (this.date) { // ilib enabled
				this.date.minute = index;
				minute = this.formatter.format(this.date);
			} else {	// Have TimePicker format the minutes
				minute = this.formatter.formatMinute(index);
			}

			return minute;
		}
	});

	/**
	* {@link moon.HourPicker} is a helper kind used by {@link moon.TimePicker}. It is
	*  not intended for use in other contexts.
	*
	* @class moon.HourPicker
	* @extends moon.HourMinutePickerBase
	* @ui
	* @protected
	*/
	enyo.kind(
		/** @lends moon.HourPicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.HourPicker',

		/**
		* @private
		*/
		kind: 'moon.HourMinutePickerBase',

		/**
		* @private
		*/
		min: 0,

		/**
		* @private
		*/
		max: 23,


		/**
		 * Formats the hour at `index` for the current locale
		 *
		 * @param  {Number} index - Hour between 0 and 24
		 * @return {String}       - Formatted hour
		 * @private
		 */
		format: function (index) {
			var hour;

			if (this.date) { // ilib enabled
				this.date.hour = index;
				hour = this.formatter.format(this.date);
			} else {	// Have TimePicker format the hours
				hour = this.formatter.formatHour(index);
			}

			return hour;
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
		 * @see moon.IntegerPicker.scrollToValue
		 * @private
		 */
		scrollToValue: enyo.inherit(function (sup) {
			return function(old) {
				// try to avoid the format calls if the old and current values
				// don't mod to the same value
				var maybeSame = old !== undefined && old%12 === this.value%12;
				if(maybeSame && this.format(old) === this.format(this.value)) {
					sup.call(this);
				} else {
					sup.apply(this, arguments);
				}
			};
		})
	});
	/**
	* {@link moon.TimePicker} is a [control]{@link enyo.Control} used to allow the
	* selection of (or to simply display) a time expressed in hours and minutes, with an
	* optional meridiem indicator ('am' or 'pm').
	*
	* ```
	* {kind: 'moon.TimePicker', content: 'Time', meridiemEnable: true, onChange: 'changed'}
	* ```
	* Set the [value]{@link moon.TimePicker#value} property to a standard JavaScript
	* {@glossary Date} object to initialize the picker, or to change it programmatically at
	* runtime.
	*
	* @class moon.TimePicker
	* @extends moon.DateTimePickerBase
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.TimePicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.TimePicker',

		/**
		* @private
		*/
		kind: 'moon.DateTimePickerBase',

		/**
		* @private
		* @lends moon.TimePicker.prototype
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
			* @default 'moon.$L('hour')'
			* @public
			*/
			hourText: moon.$L('hour'),			// i18n 'HOUR' label in moon.TimePicker widget

			/**
			* Optional label for minute.
			*
			* @type {String}
			* @default 'moon.$L('minute')'
			* @public
			*/
			minuteText: moon.$L('minute'),		// i18n 'MINUTE' label in moon.TimePicker widget

			/**
			* Optional label for meridiem.
			*
			* @type {String}
			* @default 'moon.$L('meridiem')'
			* @public
			*/

			meridiemText: moon.$L('meridiem'),	// i18n 'MERIDIEM' label in moon.TimePicker widget
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
			hoursZeroPadded: false
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
			this.inherited(arguments);

			// Set picker format 12 vs 24 hour clock
			var li = new ilib.LocaleInfo(this.locale || undefined);
			var clockPref = li.getClock();
			this.meridiemEnable = (clockPref == '12');

			var fmtParams = {
				type: 'time',
				time: 'h',
				clock: clockPref !== 'locale' ? clockPref : undefined,
				useNative: false,
				timezone: 'local'
			};
			if (this.locale) {
				fmtParams.locale = this.locale;
			}
			this.hourFormatter = new ilib.DateFmt(fmtParams);

			fmtParams.time = 'm';
			this.minuteFormatter = new ilib.DateFmt(fmtParams);
		},

		/**
		* @private
		*/
		setupPickers: function (ordering) {
			var orderingArr = ordering.toLowerCase().split('');
			var doneArr = [];
			var o, f, l, values;
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

				switch (o){
				case 'h':
				case 'k':
					this.wrapComponent(
						{name: 'timeWrapper', classes: 'moon-time-picker-wrap'},
						{classes: 'moon-date-picker-wrap', components:[
							{kind: 'moon.HourPicker', name:'hour', formatter: this.hourFormatter || this, value: values.hour, onChange: 'pickerChanged'},
							{name: 'hourLabel', content: this.hourText, classes: 'moon-date-picker-label moon-divider-text'}
						]},
						this
					);
					break;
				case 'm':
					this.wrapComponent(
						{name: 'timeWrapper', classes: 'moon-time-picker-wrap'},
						{classes: 'moon-date-picker-wrap', components:[
							{kind: 'moon.MinutePicker', name:'minute', formatter: this.minuteFormatter || this, value: values.minute, onChange: 'pickerChanged'},
							{name: 'minuteLabel', content: this.minuteText, classes: 'moon-date-picker-label moon-divider-text'}
						]},
						this
					);
					break;
				case 'a':
					if (this.meridiemEnable === true) {
						this.createComponent(
							{classes: 'moon-date-picker-wrap', components:[
								{kind:'moon.MeridiemPicker', name:'meridiem', classes:'moon-date-picker-field', locale: this.locale, onChange: 'meridiemPickerChanged'},
								{name: 'meridiemLabel', content: this.meridiemText, classes: 'moon-date-picker-label moon-divider-text'}
							]}
						);
						this.$.meridiem.setValueByTime(values.hour, values.minute);
					}
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
		wrapComponent: function (wrapperProps, compProps, owner) {
			var wrapper = this.$[wrapperProps.name];
			if (!wrapper) {
				wrapper = this.createComponent(wrapperProps);
			}
			wrapper.createComponent(compProps, {owner: owner});
		},

		/**
		* @private
		*/
		formatValue: function () {
			if (!this.value) {
				return (this.noneText);
			}
			var dateStr = '';
			if (this._tf) {
				dateStr = this._tf.format(this.value);
			}
			else {
				dateStr += this.formatHour(this.value.getHours());
				dateStr += ':' + ('00' + this.value.getMinutes()).slice(-2) + ' ';
				dateStr += this.meridiemEnable ? this.$.meridiem.getMeridiems()[this.$.meridiem.getValue()].name : '';
			}
			return dateStr;
		},

		/**
		* @private
		*/
		formatHour: function (hour) {
			if (this.meridiemEnable) {
				if (hour > 12) {
					hour -= 12;
				}
				if (this.hoursStartAtZero) {
					if (hour == 12) {
						hour = 0;
					}
				} else {
					hour = hour || 12;
				}
			} else {
				if (!this.hoursStartAtZero) {
					hour = hour || 24;
				}
			}
			if (this.hoursZeroPadded) {
				hour = ('0' + hour).slice(-2);
			}
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
		pickerChanged: function (sender, event) {
			if(this.syncingPickers) return true;

			var value = event.value;

			if (this.value) {
				if (sender == this.$.hour) this.updateValue(value);
				else this.updateValue(null, value);
			}

			return true;
		},

		/**
		* @private
		*/
		meridiemPickerChanged: function (sender, event) {
			if(this.syncingPickers) return true;

			var meridiems = event.originator.get('meridiems'),
				oldMeridiem = meridiems[event.old],
				newMeridiem = meridiems[this.$.meridiem.get('value')],
				oldHour = this.$.hour.get('value'),
				startHour = parseInt(newMeridiem.start, 10),
				offset = oldHour - parseInt(oldMeridiem.start, 10);

			if (meridiems.length == 2) {
				this.updateValue(startHour + offset);
			} else {
				var oldMinute =  this.$.minute.get('value'),
					endHour = parseInt(newMeridiem.end, 10),
					startMinute = parseInt(newMeridiem.start.split(':')[1], 10),
					endMinute = parseInt(newMeridiem.end.split(':')[1], 10),
					newHour = startHour + offset,
					newMinute;

				if (startHour * 100 + startMinute > newHour * 100 + oldMinute) {
					newHour = startHour;
					newMinute = startMinute;
				} else if (endHour * 100 + endMinute < newHour * 100 + oldMinute) {
					newHour = endHour;
					newMinute = endMinute;
				}
				offset = newHour - oldHour;
				this.updateValue(this.value.getHours() + offset, newMinute);
			}

			return true;
		},

		/**
		* webOS TVs which rounds down when setting the hour to the skipped hour of DST
		* whereas other implementations round up.
		*
		* @private
		*/
		dstOffset: enyo.platform.webos? 3600000 : -3600000,

		/**
		* @private
		*/
		updateValue: function (newHour, newMinute) {
			var valueTime = this.value.getTime();

			if (newHour != null) this.value.setHours(newHour);
			if (newMinute != null) this.value.setMinutes(newMinute);

			// in the rare case that the value didn't change because it was snapped back to the
			// same value due to DST rules, push it back another hour.
			if (valueTime == this.value.getTime()) {
				this.value = new Date(valueTime + this.dstOffset);
			}

			this.set('value', this.value, {force: true});
		},

		/**
		* @private
		*/
		setChildPickers: function () {
			var value = this.value;
			if (this.value) {
				this.$.hour.set('value', value.getHours());
				this.$.minute.set('value', value.getMinutes());
				if (this.meridiemEnable) {
					this.$.meridiem.setValueByTime(value.getHours(), value.getMinutes());
				}
			}
			this.$.currentValue.set('content', this.formatValue());
		},

		/**
		* @private
		*/
		calcPickerValues: function () {
			var values = {},
				value = this.value;

			if (value) {
				values.hour = value.getHours();
				values.minute = value.getMinutes();
			} else {
				values.hour = values.minute = 0;
			}

			return values;
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
		}
	});

})(enyo, this);
