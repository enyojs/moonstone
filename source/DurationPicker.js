(function (enyo, scope) {
	/**
	* Fires when the value changes.
	*
	* @event moon.DurationPicker#onChange
	* @type {Object}
	* @property {String} name - contains the name of this control.
	* @public
	*/

	/**
	* `moon.DurationPicker` is a [control]{@link enyo.Control} that can display -- or allow the
	* selection of -- a duration expressed in hours, minutes and seconds, the selection
	* display is configurable using template.
	*
	* @class moon.DurationPicker
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
		kind: 'moon.ExpandableListItem',

		/**
		* @private
		*/
		defaultKind: 'enyo.Control',

		/**
		* @private
		*/
		classes: 'moon-expandable-picker',

		/**
		* @private
		*/
		handlers: {
			//* Handler for _onChange_ events coming from constituent controls
			onChange: 'handleChangeEvent'
		},

		events: {
			/**
			* {@link moon.DurationPicker#event:onDurationChange}
			*/
			onDurationChange: '',

			/**
			* {@link moon.DurationPicker#event:onCountdownExpired}
			*/
			onPickerExpired: ''
		},

		/**
		* @public
		* @lends moon.DurationPicker.prototype
		*/
		published: {

			/**
			* Text to be displayed as the current value if no item is currently selected
			*
			* @type {String}
			* @default ''
			* @public
			*/
			noneText: '',

			/**
			* The value of the picker, expressed as a standard JavaScript 
			* object.
			*
			* @type {String}
			* @default null
			* @public
			*/
			value: null,

			/**
			* Optional label for hour
			*
			* @type {String}
			* @default moon.$L('hour')
			* @public
			*/
			hourText: moon.$L('hour'),		// i18n 'HOUR' label in moon.DurationPicker widget

			/**
			* Optional label for minute
			*
			* @type {String}
			* @default moon.$L('minute')
			* @public
			*/
			minuteText: moon.$L('minute'),		// i18n 'MINUTE' label in moon.DurationPicker widget

			/**
			* Optional label for second
			*
			* @type {String}
			* @default moon.$L('second')
			* @public
			*/
			secondText: moon.$L('second'),		// i18n 'SECOND' label in moon.DurationPicker widget

			/**
			* The template format of the picker
			*
			* @type {String}
			* @default ''
			* @public
			*/
			template: '',

			/**
			* Enable and disable the timer feature of duration picker
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			enableTimer: true
		},

		/**
		* @type {Boolean}
		* @default false
		* @private
		*/
		countdown: false,

		/**
		* @type {String}
		* @default null
		* @private
		*/
		timer: null,

		/**
		* @type {Object}
		* @default {}
		* @private
		*/
		values: {},

		/**
		* @type {Array}
		* @default []
		* @private
		*/
		templateArray: [],

		/**
		* Optional label for Start Button
		*
		* @type {String}
		* @default moon.$L('Start')
		* @private
		*/
		startText: moon.$L('Start'),			// i18n 'Start' label in moon.DurationPicker buttons

		/**
		* Optional label for Pause Button
		*
		* @type {String}
		* @default moon.$L('Pause')
		* @private
		*/
		pauseText: moon.$L('Pause'),			// i18n 'Pause' label in moon.DurationPicker buttons

		/**
		* Optional label for Cancel Button
		*
		* @type {String}
		* @default moon.$L('Cancel')
		* @private
		*/
		cancelText: moon.$L('Cancel'),			// i18n 'Cancel' label in moon.DurationPicker buttons

		/**
		* Optional label for Resume Button
		*
		* @type {String}
		* @default moon.$L('Resume')
		* @private
		*/
		resumeText: moon.$L('Resume'),			// i18n 'Resume' label in moon.DurationPicker buttons

		/**
		* Content for Start Button
		*
		* @type {String}
		* @default null
		* @private
		*/
		startContent: null,

		/**
		* Content for Pause Button
		*
		* @type {String}
		* @default null
		* @private
		*/
		pauseContent: null,

		/**
		* @type {Boolean}
		* @default true
		* @private
		*/
		pauseDisabled: true,

		/**
		* @private
		*/
		components: [
			{name: 'headerWrapper', kind: 'moon.Item', classes: 'moon-date-picker-header-wrapper', onSpotlightFocus: 'headerFocus', ontap: 'expandContract', components: [
				// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
				{name: 'headerContainer', classes: 'moon-expandable-list-item-header moon-expandable-picker-header moon-expandable-datetime-header', components: [
					{name: 'header', kind: 'moon.MarqueeText'}
				]},
				{name: 'currentValue', kind: 'moon.MarqueeText', classes: 'moon-expandable-picker-current-value'}
			]},
			{name: 'drawer', kind: 'enyo.Drawer', resizeContainer: false, classes: 'moon-expandable-list-item-client moon-duration-picker-item', components: [
				{name: 'client', kind: 'enyo.Control', classes: 'enyo-tool-decorator', onSpotlightLeft: 'closePicker', onSpotlightSelect: 'closePicker'},
				{name: 'buttonPlaceHolder', components: [
					{kind: 'moon.Button', name: 'startButton', small: true, ontap: 'startTapped'},
					{kind: 'moon.Button', name: 'pauseButton', small: true, ontap: 'pauseTapped'}
				]}
			]}
		],

		/**
		* @private
		*/
		bindings: [
			{from: 'disabled', to: '$.headerWrapper.disabled'},
			{from: 'startContent', to: '$.startButton.content'},
			{from: 'pauseContent', to: '$.pauseButton.content'},
			{from: 'pauseDisabled', to: '$.pauseButton.disabled'},
			{from: 'enableTimer', to: '$.buttonPlaceHolder.showing'}
		],

		/**
		* @fires moon.DurationePicker#onChange
		* @private
		*/
		handleChangeEvent: function (sender, ev) {
			if (ev && ev.originator === this) {
				// Don't handle our own change events
				return;
			} else {
				this.updateValue(sender, ev);
				return true;
			}
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.initDefaults();
		},

		/**
		* @private
		*/
		initDefaults: function () {
			this.values = {
				'hour': 0,
				'minute': 0,
				'second': 0
			};
			this.templateArray = [];
			this.startContent = this.startText;
			this.pauseContent = this.pauseText;
			this.initTemplate();
			this.setupPickers();
			if(this.value !== '') {
				this.valueChanged();
			} else {
				this.noneTextChanged();
			}
		},

		/**
		* creating the hour, minute and second picker components
		*
		* @private
		*/
		setupPickers: function () {
			var len, idx, item;
			len = this.templateArray.length;
			if (len) {
				for (idx = 0; idx < len; idx++) {
					item = this.templateArray[idx];
					switch (item) {
					case 'h':
						this.createComponent(
							{name: 'hourPicker', classes: 'moon-date-picker-wrap', components:[
								{kind: 'moon.IntegerPicker', name: 'hour', min: 0, max: 23, wrap: true, value: this.values.hour, disabled: this.countdown},
								{name: 'hourLabel', content: this.hourText, classes: 'moon-date-picker-label moon-divider-text'}
							]}
						);
						break;
					case 'm':
						this.createComponent(
							{name: 'minutePicker', classes: 'moon-date-picker-wrap', components:[
								{kind: 'moon.IntegerPicker', name: 'minute', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, value: this.values.minute, disabled: this.countdown},
								{name: 'minuteLabel', content: this.minuteText, classes: 'moon-date-picker-label moon-divider-text'}
							]}
						);
						break;
					case 's':
						this.createComponent(
							{name: 'secondPicker', classes: 'moon-date-picker-wrap', components:[
								{kind: 'moon.IntegerPicker', name: 'second', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, value: this.values.second, disabled: this.countdown},
								{name: 'secondLabel', content: this.secondText, classes: 'moon-date-picker-label moon-divider-text'}
							]}
						);
						break;
					}
				}
			} else {
				this.createComponent(
					{name: 'hourPicker', classes: 'moon-date-picker-wrap', components:[
						{kind: 'moon.IntegerPicker', name: 'hour', min: 0, max: 23, wrap: true, value: this.values.hour, disabled: this.countdown},
						{name: 'hourLabel', content: this.hourText, classes: 'moon-date-picker-label moon-divider-text'}
					]}
				);
				this.createComponent(
					{name: 'minutePicker', classes: 'moon-date-picker-wrap', components:[
						{kind: 'moon.IntegerPicker', name: 'minute', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, value: this.values.minute, disabled: this.countdown},
						{name: 'minuteLabel', content: this.minuteText, classes: 'moon-date-picker-label moon-divider-text'}
					]}
				);
				this.createComponent(
					{name: 'secondPicker', classes: 'moon-date-picker-wrap', components:[
						{kind: 'moon.IntegerPicker', name: 'second', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, value: this.values.second, disabled: this.countdownSS},
						{name: 'secondLabel', content: this.secondText, classes: 'moon-date-picker-label moon-divider-text'}
					]}
				);
			}
			this.render();
		},

		/**
		* @private
		*/
		initTemplate: function () {
			if (this.template) {
				var orderingArr = this.template.toLowerCase().split('');
				var o,f,l;
				for (f = 0, l = orderingArr.length; f < l; f++) {
					o = orderingArr[f].toLowerCase();
					//only accepts the hour, minute, second template values 'h', 'm' and 's'
					if (this.templateArray.indexOf(o) < 0 && (o == 'h' || o == 'm' || o == 's' )) {
						this.templateArray.push(o);
					}
				}
				if (!this.templateArray.length) {
					this.templateArray.push('h','m','s');
				}
				return;
			}
			this.templateArray.push('h','m','s');
		},

		/**
		* @private
		*/
		templateChanged: function () {
			this.templateArray = [];
			this.deletePickers();
			this.initTemplate();
			this.setupPickers();
			this.setupArray();
			this.setValue(this.formatValue());
		},

		/**
		* @private
		*/
		setupArray: function () {
			if (this.template.indexOf('h') < 0)
				this.values['hour'] = 0;
			if (this.template.indexOf('m') < 0)
				this.values['minute'] = 0;
			if (this.template.indexOf('s') < 0)
				this.values['second'] = 0;
		},

		/**
		* If no item is selected, uses [`noneText`]{@link moon.DurationPicker#noneText}
		* as current value and if nonoText value is not provided, use 'Pick Duration'
		* as default.
		*
		* @private
		*/
		noneTextChanged: function () {
			if (this.value == null || this.value === '') {
				this.$.currentValue.set('content', moon.$L(this.getNoneText()) || moon.$L('Pick Duration'));
			}
		},

		
		/**
		* @private
		*/
		valueChanged: function () {
			if (this.value == null || this.value === '') {
				this.resetPicker();
				this.noneTextChanged();
				this.doDurationChange({name: this.name, value: this.$.currentValue.content});
			} else {
				this.createValues();
				this.updatePicker();
				this.$.currentValue.set('content', this.formatText());
			}
		},

		/**
		* @private
		*/
		createValues: function () {
			var tempValue;
			if (this.value != null && this.value !== '') {
				var timeArray = this.value.toString().split(':');
				for (var idx = 0; idx < this.templateArray.length; idx++) {
					var item = this.templateArray[idx];
					switch (item) {
						case 'h':
						if (this.$.hourPicker || !this.$.hourPicker && timeArray.length > 2) {
							tempValue = Math.round(timeArray.shift());
							if (isNaN(tempValue) || tempValue > 23 || tempValue < 0) {
								tempValue = 0;
							}
							this.values['hour'] = tempValue;
						}
						break;
						case 'm':
						if (this.$.minutePicker || !this.$.minutePicker && timeArray.length > 1) {
							tempValue = Math.round(timeArray.shift());
							if (isNaN(tempValue) || tempValue > 59 || tempValue < 0) {
								tempValue = 0;
							}
							this.values['minute'] = tempValue;
						}
						break;
						case 's':
						if (this.$.secondPicker || !this.$.secondPicker && timeArray.length > 0) {
							tempValue = Math.round(timeArray.shift());
							if (isNaN(tempValue) || tempValue> 59 || tempValue < 0) {
								tempValue = 0;
							}
							this.values['second'] = tempValue;
						break;
						}
					}
				}
			}
		},

		/**
		* @private
		*/
		updatePicker: function () {
			if (this.$.hourPicker && this.$.hour.value != this.values['hour'])
				this.$.hour.set('value', this.values['hour']);

			if (this.$.minutePicker && this.$.minute.value != this.values['minute'])
				this.$.minute.set('value', this.values['minute']);

			if (this.$.secondPicker && this.$.second.value != this.values['second'])
				this.$.second.set('value',this.values['second']);
		},

		/**
		* @private
		*/
		formatValue: function () {
			var item, idx, val = '';
			for (idx = 0; idx < this.templateArray.length; idx++) {
				item = this.templateArray[idx];
				switch (item) {
					case 'h':
						val = val + ':' + this.values['hour'];
						break;
					case 'm':
						val = val + ':' + this.values['minute'];
						break;
					case 's':
						val = val + ':' + this.values['second'];
						break;
				}
			}
			return val.substring(1);
		},

		/**
		* @private
		*/
		formatText: function () {
			var item, idx, text = '';
			if (this.values) {
				for (idx = 0; idx < this.templateArray.length; idx++) {
					item = this.templateArray[idx];
					switch (item) {
						case 'h':
							text = text + ' ' + this.values['hour'] + ' ' + (this.values['hour'] == 1 ? moon.$L('Hour') : moon.$L('Hours'));
							break;
						case 'm':
							text = text + ' ' + this.values['minute'] + ' ' + (this.values['minute'] == 1 ? moon.$L('Minute') : moon.$L('Minutes'));
							break;
						case 's':
							text = text + ' ' + this.values['second'] + ' ' + (this.values['second'] == 1 ? moon.$L('Second') : moon.$L('Seconds'));
							break;
					}
				}
			}
			this.doDurationChange({name: this.name, value: text});
			return text.trim();
		},

		/**
		* @private
		*/
		tick: function () {
			var hr = this.values['hour'];
			var mn = this.values['minute'];
			var ss = this.values['second'];
			if (hr <= 0 && mn <= 0 && ss <= 0) {
				this.pickerExpired();
				return;
			} else {
				if (ss === 0 ) {
					ss = 59;
					this.values['second'] = ss;
					if (mn > 0 ) {
						mn--;
						this.values['minute'] = mn;
					} else {
						mn = 59;
						hr--;
						this.values['minute'] = mn;
						this.values['hour'] = hr;
					}
				} else {
					ss--;
					this.values['second'] = ss;
				}
				this.set('value', this.formatValue());
			}
		},

		/**
		* @private
		*/
		updateValue: function (sender, ev) {
			var hour = this.$.hourPicker ? this.$.hour.get('value') : this.values['hour'];
			var minute = this.$.minutePicker ? this.$.minute.get('value') : this.values['minute'];
			var second = this.$.secondPicker ? this.$.second.get('value') : this.values['second'];
			if (ev.name == 'second' && this.values['second'] == second) {
				return;
			} else if (ev.name == 'minute' &&  this.values['minute'] == minute) {
				return;
			} else if (ev.name == 'hour' && this.values['hour'] == hour) {
				return;
			}
			this.values['second'] = second;
			this.values['minute'] = minute;
			this.values['hour'] = hour;
			this.set('value', this.formatValue());
		},

		/**
		* @private
		*/
		pickerExpired: function () {
			this.cancelPicker();
			this.doPickerExpired({name:this.name});
		},

		/**
		* @private
		*/
		countdownChanged: function () {
			if (this.$.hour)
				this.$.hour.set('disabled', this.countdown);
			if (this.$.minute)
				this.$.minute.set('disabled', this.countdown);
			if (this.$.second)
				this.$.second.set('disabled' , this.countdown);
		},

		/**
		* @private
		*/
		startTapped: function () {
			if (this.pauseDisabled) {
				if(this.values['hour'] || this.values['minute'] || this.values['second']) {
					this.set('startContent', this.cancelText);
					this.startPicker();
				}
			} else {
				this.set('value', '');
			}
		},

		/**
		* @private
		*/
		pauseTapped: function () {
			if (this.countdown) {
				this.set('pauseContent', this.resumeText);
				this.pauseTimer();
			} else {
				this.set('pauseContent', this.pauseText);
				this.startTimer();
			}
		},

		/**
		* @private
		*/
		startPicker: function () {
			this.set('pauseDisabled', false);
			this.startTimer();
		},

		/**
		* @private
		*/
		cancelPicker: function () {
			this.set('startContent', this.startText);
			this.set('pauseContent', this.pauseText);
			this.set('pauseDisabled', true);
			this.pauseTimer();
		},

		/**
		* @private
		*/
		startTimer: function () {
			window.clearInterval(this.timer);
			if (this.value) {
				this.set('countdown', true);
				this.tick();
				this.timer = window.setInterval(
					enyo.bind (this, function () {
						this.tick();
					}), 1000);
			}
		},

		/**
		* @private
		*/
		pauseTimer: function () {
			this.set('countdown', false);
			window.clearInterval(this.timer);
		},

		/**
		* @private
		*/
		deletePickers: function () {
			if (this.$.hourPicker) this.$.hourPicker.destroy();
			if (this.$.minutePicker) this.$.minutePicker.destroy();
			if (this.$.secondPicker) this.$.secondPicker.destroy();
		},

		/**
		* @private
		*/
		resetPicker: function () {
			if (!this.pauseDisabled) {
				this.cancelPicker();
			}
			this.values['hour'] = 0;
			if (this.$.hour) this.$.hour.set('value', 0);

			this.values['minute'] = 0;
			if (this.$.minute) this.$.minute.set('value', 0);

			this.values['second'] = 0;
			if (this.$.second) this.$.second.set('value',0);
		},

		/**
		* @private
		*/
		closePicker: function (sender, ev) {
			/**
			* If select/enter is pressed on any duration picker item close the drawer
			*/
			if (ev.type == 'onSpotlightSelect' ||
				this.$.client.children[0].id == ev.originator.id) {
				this.expandContract();
				return true;
			}
		},

		/**
		* @private
		*/
		toggleActive: function () {
			if (this.get('open')) {
				this.set('active', false);
				if (!enyo.Spotlight.getPointerMode()) {
					enyo.Spotlight.spot(this.$.headerWrapper);
				}
			} else {
				this.set('active', true);
			}
		},

		/**
		* @private
		*/
		startTextChanged: function (was, is) {
			this.$.startContent.set('content', is);
		},

		/**
		* @private
		*/
		pauseTextChanged: function (was, is) {
			this.$.pauseContent.set('content', is);
		},

		/**
		* @private
		*/
		cancelTextChanged: function (was, is) {
			if (this.pauseDisabled)
				this.$.startContent.set('content', is);
		},

		/**
		* @private
		*/
		resumeTextChanged: function (was, is) {
			if (!this.countdown)
				this.$.pauseContent.set('content', is);
		},

		/**
		* @private
		*/
		hourTextChanged: function (was, is) {
			this.$.hourLabel.set('content', is);
		},

		/**
		* @private
		*/
		minuteTextChanged: function (was, is) {
			this.$.minuteLabel.set('content', is);
		},

		/**
		* @private
		*/
		secondTextChanged: function (was, is) {
			this.$.secondLabel.set('content', is);
		}
	});
})(enyo, this);