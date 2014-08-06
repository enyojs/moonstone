(function (enyo, scope) {
	/**
	* `moon.MeridiemPicker` is a helper kind used by [`moon.TimePicker`]{@link moon.TimePicker}. It
	* is not intended for use in other contexts.
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
		value: null,

		/**
		* @private
		* @lends moon.MeridiemPicker.prototype
		*/
		published: {
			/**
			* The meridiem text to display if {@link TimePicker.meridiemEnable} is `true`. The first
			* item is used if the `hour` is less than `11`, otherwise the second is used.
			*
			* @type {String[]}
			* @default ['AM','PM']
			* @public
			*/
			meridiems: ['AM','PM']
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
			var index = inEvent.index;
			this.$.item.setContent(this.meridiems[index]);
		}
	});
	
	/**
	* `moon.HourPicker` is a helper kind used by [`moon.TimePicker`]{@link moon.TimePicker}. It is
	*  not intended for use in other contexts.
	*
	* @class moon.HourPicker
	* @extends moon.IntegerPicker
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
		kind: 'moon.IntegerPicker',

		/**
		* @private
		*/
		classes:'moon-date-picker-field',

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
		value: null,

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
			var hour = inEvent.index;
			if (this.date) { // ilib enabled
				this.date.hour = hour;
				hour = this.formatter.format(this.date);
			} else {	// Have TimePicker format the hours
				hour = this.formatter.formatHour(hour);
			}
			this.$.item.setContent(hour);
		}
	});
	
	/**
	* `moon.TimePicker` is a [control]{@link enyo.Control} that can display -- or allow the
	* selection of -- a time expressed in hours and minutes, with an optional meridiem indicator
	* ('am' or 'pm').
	*
	* ```
	* {kind: 'moon.TimePicker', content: 'Time', meridiemEnable: true, onChange: 'changed'}
	* ```
	* Set the [`value`]{@link moon.TimePicker#value} property to a standard JavaScript
	* {@glossary Date} object to initialize the picker, or to change it programmatically at runtime.
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
			* When `true`, the picker will use a 12-hour clock. (When [iLib]{@link iLib} is loaded,
			* this value will be ignored and the current locale's rules will determine whether a
			* 12-hour or 24-hour clock is used.)
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			meridiemEnable: false,

			/**
			* Optional label for hour
			*
			* @type {String}
			* @default moon.$L('hour')
			* @public
			*/
			hourText: moon.$L('hour'),			// i18n 'HOUR' label in moon.TimePicker widget

			/**
			* Optional label for minute
			*
			* @type {String}
			* @default moon.$L('minute')
			* @public
			*/
			minuteText: moon.$L('minute'),		// i18n 'MINUTE' label in moon.TimePicker widget

			/**
			* Optional label for meridiem
			*
			* @type {String}
			* @default moon.$L('meridiem')
			* @public
			*/

			meridiemText: moon.$L('meridiem'),	// i18n 'MERIDIEM' label in moon.TimePicker widget
			/**
			* When `true`, midnight (and noon, if `meridiemEnable: true`) will be represented as 0
			* instead of 24 (and 12). (When [iLib]{@link iLib} is loaded, this value will be ignored
			* and the current locale's rules will determine whether 0 is used.)
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			hoursStartAtZero: false,

			/**
			* When `true`, hours will be zero-padded. (When [iLib]{@link iLib} is loaded, this value
			* will be ignored and the current locale's rules will determine whether zero-padding is
			* used.)
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
	
			// Get localized meridiem values
			if (this.meridiemEnable) {
				fmtParams = {
					template: 'a',
					clock: clockPref !== 'locale' ? clockPref : undefined,
					useNative: false,
					timezone: 'local'
				};
				if (this.locale) {
					fmtParams.locale = this.locale;
				}
				var merFormatter = new ilib.DateFmt(fmtParams);
				var am = ilib.Date.newInstance({hour:10});
				var pm = ilib.Date.newInstance({hour:14});
				this.meridiems = [merFormatter.format(am), merFormatter.format(pm)];
			}
		},

		/**
		* @private
		*/
		setupPickers: function (ordering) {
			var orderingArr = ordering.toLowerCase().split('');
			var doneArr = [];
			var o,f,l;
			for(f = 0, l = orderingArr.length; f < l; f++) {
				o = orderingArr[f];
				if (doneArr.indexOf(o) < 0) {
					doneArr.push(o);
				}
			}
	
			for(f = 0, l = doneArr.length; f < l; f++) {
				o = doneArr[f];
				var valueHours = this.value ? this.value.getHours() : 0;
				var valueMinutes = this.value ? this.value.getMinutes() : 0;
	
				switch (o){
				case 'h':
				case 'k':
					this.createComponent(
						{classes: 'moon-date-picker-wrap', components:[
							{kind: 'moon.HourPicker', name:'hour', formatter: this.hourFormatter || this, value: valueHours},
							{name: 'hourLabel', content: this.hourText, classes: 'moon-date-picker-label moon-divider-text'}
						]}
					);
					break;
				case 'm':
					this.createComponent(
						{classes: 'moon-date-picker-wrap', components:[
							{kind: 'moon.IntegerPicker', name:'minute', classes:'moon-date-picker-field', min:0, max:59, wrap:true, digits: 2, value: valueMinutes},
							{name: 'minuteLabel', content: this.minuteText, classes: 'moon-date-picker-label moon-divider-text'}
						]}
					);
					break;
				case 'a':
					if (this.meridiemEnable === true) {
						this.createComponent(
							{classes: 'moon-date-picker-wrap', components:[
								{kind:'moon.MeridiemPicker', name:'meridiem', classes:'moon-date-picker-field', value: valueHours > 12 ? 1 : 0, meridiems: this.meridiems || ['am','pm'] },
								{name: 'meridiemLabel', content: this.meridiemText, classes: 'moon-date-picker-label moon-divider-text'}
							]}
						);
					}
					break;
				default:
					break;
				}
	
			}
	
			this.inherited(arguments);
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
				dateStr = this._tf.format(ilib.Date.newInstance({unixtime: this.value.getTime(), timezone:'Etc/UTC'}));
			}
			else {
				dateStr += this.formatHour(this.value.getHours());
				dateStr += ':' + ('00' + this.value.getMinutes()).slice(-2) + ' ';
				dateStr += this.meridiemEnable ? this.$.meridiem.getMeridiems()[this.$.meridiem.getValue()] : '';
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
		updateValue: function (inSender, inEvent) {
			var hour = this.$.hour.getValue();
			var minute = this.$.minute.getValue();
	
			if (inEvent.originator.kind == 'moon.MeridiemPicker') {
				if (hour < 12 && inEvent.originator.value == 1 ) {
					hour += 12;
				} else if ( hour > 12 && hour != 24 && inEvent.originator.value === 0) {
					hour -= 12;
				} else if (hour == 24 && inEvent.originator.value === 1) {
					hour -= 12;
				} else if (hour == 12 && inEvent.originator.value === 0) {
					hour += 12;
				}
				this.$.hour.setScrollTop(inEvent.originator.scrollBounds.clientHeight * (hour-1));
				this.$.hour.setValue(hour);
			}
	
			if (inEvent.originator.kind == 'moon.HourPicker') {
				var valueTime = this.value ? this.value.getTime() : 0;
				var valueHours = this.value ? this.value.getHours() : 0;
	
				// Excludes illegal hours based on DST rules by adding hour offset directly
				this.setValue(new Date(valueTime + ((hour - valueHours)*60*60*1000)));
			} else {
				var valueFullYear = this.value ? this.value.getFullYear() : 0;
				var valueMonth = this.value ? this.value.getMonth() : 0;
				var valueDate = this.value ? this.value.getDate() : 0;
				var valueSeconds = this.value ? this.value.getSeconds() : 0;
				var valueMilliseconds = this.value ? this.value.getMilliseconds() : 0;
	
				this.setValue(
					new Date(
						valueFullYear,
						valueMonth,
						valueDate,
						hour, 
						minute,
						valueSeconds,
						valueMilliseconds
					)
				);
			}
		},

		/**
		* @private
		*/
		setChildPickers: function (inOld) {
			if (this.value) {
				var hour = this.value.getHours();
				if (this.meridiemEnable === true) {
					this.$.meridiem.setValue(hour > 11 ? 1 : 0);
				}
				this.$.hour.setValue(this.value.getHours());
				this.$.minute.setValue(this.value.getMinutes());
			}
			this.$.currentValue.setContent(this.formatValue());
		},

		/**
		* @private
		*/
		hourTextChanged: function (inOldvalue, inNewValue) {
			this.$.hourLabel.setContent(inNewValue);
		},

		/**
		* @private
		*/
		minuteTextChanged: function (inOldvalue, inNewValue) {
			this.$.minuteLabel.setContent(inNewValue);
		},

		/**
		* @private
		*/
		meridiemTextChanged: function (inOldvalue, inNewValue) {
			this.$.meridiemLabel.setContent(inNewValue);
		}
	});

})(enyo, this);
