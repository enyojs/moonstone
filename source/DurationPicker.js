(function (enyo, scope) {
	/**
	* `moon.DurationPicker` is a [control]{@link enyo.Control} that can display -- or allow the
	* selection of -- a duration expressed in hours, minutes and seconds, the selection
	* display is configurable using template.
	*

	* @class moon.DurationPicker
	* @extends moon.DurationPickerBase
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.DurationPicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.DurationPicker',

		/**
		* @private
		*/
		kind: 'moon.DurationPickerBase',

		events: {
			/**
			* {@link moon.DurationPicker#event:onDurationChange}
			*/
			onDurationChange: '',

			/**
			* {@link moon.DurationPicker#event:onCountdownExpired}
			*/
			onCountdownExpired: ''
		},

		/**
		* @private
		* @lends moon.DurationPicker.prototype
		*/
		published: {

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
			* Optional label for second
			*
			* @type {String}
			* @default moon.$L('second')
			* @public
			*/
			secondText: moon.$L('second'),	// i18n 'MERIDIEM' label in moon.TimePicker widget

			/**
			* @type {String}
			* @default ''
			* @public
			*/
			valueHour: '',

			/**
			* @type {String}
			* @default ''
			* @public
			*/
			valueMinute: '',

			/**
			* @type {String}
			* @default ''
			* @public
			*/
			valueSecond: '',

			/**
			* @type {Boolean}
			* @default ''
			* @public
			*/
			countdown: false,

			/**
			* @type {Number}
			* @default 0
			* @public
			*/
			min: 0,

			/**
			* @type {Number}
			* @default 59
			* @public
			*/
			max: 59
		},

		/**
		* @type {String}
		* @default null
		* @private
		*/
		timer: null,

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.initDefault();
		},

		/**
		* @private
		*/
		initDefault: function () {
			this.templateChanged();
			this.valueHourChanged();
			this.valueMinuteChanged();
			this.valueSecondChanged();
		},

		/**
		* @private
		*/
		hidePickers: function () {
			this.$.hourPicker.set('showing', false);
			this.$.minutePicker.set('showing', false);
			this.$.secondPicker.set('showing', false);
		},

		/**
		* @private
		*/
		setupPickers: function () {
			this.createComponent(
				{name: 'hourPicker', classes: 'moon-date-picker-wrap', components:[
					{kind: 'moon.IntegerPicker', name: 'hour', min: this.min, max: 23, wrap: true, digits: 2, value: this.valueHour},
					{name: 'hourLabel', content: this.hourText, classes: 'moon-date-picker-label moon-divider-text'}
				]}
			);
			this.createComponent(
				{name: 'minutePicker', classes: 'moon-date-picker-wrap', components:[
					{kind: 'moon.IntegerPicker', name: 'minute', classes: 'moon-date-picker-field', min: this.min, max: this.max, wrap: true, digits: 2, value: this.valueMinute},
					{name: 'minuteLabel', content: this.minuteText, classes: 'moon-date-picker-label moon-divider-text'}
				]}
			);
			this.createComponent(
				{name: 'secondPicker', classes: 'moon-date-picker-wrap', components:[
					{kind: 'moon.IntegerPicker', name: 'second', classes: 'moon-date-picker-field', min: this.min, max: this.max, wrap: true, digits: 2, value: this.valueSecond},
					{name: 'secondLabel', content: this.secondText, classes: 'moon-date-picker-label moon-divider-text'}
				]}
			);
		},

		/**
		* @private
		*/
		valueHourChanged: function () {
			if (this.valueHour === '') {
				this.noneTextCheck();
				this.$.hour.set('value', 0);
			} else if (this.valueHour <= 23 && this.valueHour >= this.min) {
				this.valueHour = Math.round(this.valueHour);
				this.$.currentValue.set('content', this.formatValue());
				this.$.hour.set('value',this.valueHour);
			} else {
				this.set('valueHour', 0);
			}
		},

		/**
		* @private
		*/
		valueMinuteChanged: function () {
			if (this.valueMinute === '') {
				this.noneTextCheck();
				this.$.minute.set('value', 0);
			}
			else if (this.valueMinute <= this.max && this.valueMinute >= this.min) {
				this.valueMinute = Math.round(this.valueMinute);
				this.$.currentValue.set('content', this.formatValue());
				this.$.minute.set('value', this.valueMinute);
			} else {
				this.set('valueMinute', 0);
			}
		},

		/**
		* @private
		*/
		valueSecondChanged: function () {
			if (this.valueSecond === '') {
				this.noneTextCheck();
				this.$.second.set('value', 0);
			}
			else if (this.valueSecond <= this.max && this.valueSecond >= this.min) {
				this.valueSecond = Math.round(this.valueSecond);
				this.$.currentValue.set('content', this.formatValue());
				this.$.second.set('value', this.valueSecond);
			} else {
				this.set('valueSecond', 0);
			}
		},

		/**
		* @private
		*/
		noneTextCheck: function () {
			if (this.valueHour === '' && this.valueMinute === '' && this.valueSecond === '') {
				this.noneTextChanged();
			}
		},

		/**
		* @private
		*/
		countdownChanged: function () {
			this.updateValue();
		},

		/**
		* @private
		*/
		templateChanged: function () {
			if (this.template) {
				this.hidePickers();
				var orderingArr = this.template.toLowerCase().split('');
				var doneArr = [];
				var o,f,l;
				for(f = 0, l = orderingArr.length; f < l; f++) {
					o = orderingArr[f].toLowerCase();

					//only accepts the hour, minute, second template values 'h', 'm' and 's'
					if (doneArr.indexOf(o) < 0 && (o == 'h' || o == 'm' || o == 's' )) {
						doneArr.push(o);
					}
				}
				if (doneArr.length > 0) {
					for(f = 0, l = doneArr.length; f < l; f++) {
						o = doneArr[f];
						switch (o) {
						case 'h':
							this.$.hourPicker.set('showing', true);
							break;
						case 'm':
							this.$.minutePicker.set('showing', true);
							break;
						case 's':
							this.$.secondPicker.set('showing', true);
							break;
						default:
							break;
						}
					}
				} else {
					this.$.hourPicker.set('showing', true);
					this.$.minutePicker.set('showing', true);
					this.$.secondPicker.set('showing', true);
				}
			}
		},

		/**
		* @private
		*/
		formatValue: function () {
			var text = '';
			if (this.$.hourPicker.get('showing')) {
				text = (this.valueHour === '' ? this.min : this.valueHour) + ' Hours ';
			}
			if (this.$.minutePicker.get('showing')) {
				text = text + (this.valueMinute === '' ? this.min : this.valueMinute) + ' Minutes ';
			}
			if (this.$.secondPicker.get('showing')) {
				text = text + (this.valueSecond === '' ? this.min : this.valueSecond) + ' Seconds';
			}
			this.doDurationChange({name: this.name, value: text});
			return text;
		},

		/**
		* @private
		*/
		tick: function () {
			var hr = this.$.hourPicker.get('showing') ? this.get('valueHour') : 0;
			var mn = this.$.minutePicker.get('showing') ? this.get('valueMinute') : 0;
			var ss = this.$.secondPicker.get('showing') ? this.get('valueSecond') : 0;

			if (hr <= this.min && mn <= this.min && ss <= this.min) {
				window.clearTimeout(this.timer);
				this.doCountdownExpired({name:this.name});
				return;
			} else {
				if (ss == this.min ) {
					if (mn > this.min ) {
						mn--;
					} else {
						mn = this.max;
						hr--;
						this.set('valueHour', hr);
					}
					this.set('valueMinute', mn);
					ss = this.max;
				} else{
					ss--;
				}
				this.set('valueSecond', ss);
			}
		},

		/**
		* @private
		*/
		updateValue: function (inSender, inEvent) {
			var hour = this.$.hour.get('value');
			var minute = this.$.minute.get('value');
			var second = this.$.second.get('value');
			this.set('valueHour', hour);
			this.set('valueMinute', minute);
			this.set('valueSecond', second);

			window.clearTimeout(this.timer);
			if (this.countdown) {
				this.timer = window.setInterval(
					enyo.bind (this, function () {
						this.tick();
					}), 1000);
			}
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
		secondTextChanged: function (inOldvalue, inNewValue) {
			this.$.secondLabel.set('content', inNewValue);
		}
	});
})(enyo, this);
