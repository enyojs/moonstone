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
		valueArray: {},

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
		startConent: moon.$L('Start'),

		/**
		* Optional label for Pause Button
		*
		* @type {String}
		* @default moon.$L('Pause')
		* @private
		*/
		pauseConent: moon.$L('Pause'),

		/**
		* @type {Boolean}
		* @default true
		* @private
		*/
		pauseDisabled: true,

		/**
		* @private
		*/
		observers: {
			'changeCountdown': ['countdown']
		},

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
					{kind: 'moon.Button', name: 'startButton', content: this.startConent, small: true, ontap: 'startTapped'},
					{kind: 'moon.Button', name: 'pauseButton', content: this.pauseConent, small: true, ontap: 'pauseTapped'}
				]}
			]}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.disabled', to: '.$.headerWrapper.disabled'},
			{from: '.startConent', to: '.$.startButton.content'},
			{from: '.pauseConent', to: '.$.pauseButton.content'},
			{from: '.pauseDisabled', to: '.$.pauseButton.disabled'},
			{from: '.enableTimer', to: '.$.buttonPlaceHolder.showing'}
		],

		/**
		* @private
		*/
		constructor: function () {
			this.inherited(arguments);
			this.valueArray = {
				'hour': 0,
				'minute': 0,
				'second': 0
			};
			this.templateArray = [];
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.initDefaults();
		},

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
		initDefaults: function () {
			this.currentTemplate();
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
								{kind: 'moon.IntegerPicker', name: 'hour', min: 0, max: 23, wrap: true, value: this.valueArray.hour, disabled: this.countdown},
								{name: 'hourLabel', content: this.hourText, classes: 'moon-date-picker-label moon-divider-text'}
							]}
						);
						break;
					case 'm':
						this.createComponent(
							{name: 'minutePicker', classes: 'moon-date-picker-wrap', components:[
								{kind: 'moon.IntegerPicker', name: 'minute', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, value: this.valueArray.minute, disabled: this.countdown},
								{name: 'minuteLabel', content: this.minuteText, classes: 'moon-date-picker-label moon-divider-text'}
							]}
						);
						break;
					case 's':
						this.createComponent(
							{name: 'secondPicker', classes: 'moon-date-picker-wrap', components:[
								{kind: 'moon.IntegerPicker', name: 'second', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, value: this.valueArray.second, disabled: this.countdown},
								{name: 'secondLabel', content: this.secondText, classes: 'moon-date-picker-label moon-divider-text'}
							]}
						);
						break;
					}
				}
			} else {
				this.createComponent(
					{name: 'hourPicker', classes: 'moon-date-picker-wrap', components:[
						{kind: 'moon.IntegerPicker', name: 'hour', min: 0, max: 23, wrap: true, value: this.valueArray.hour, disabled: this.countdown},
						{name: 'hourLabel', content: this.hourText, classes: 'moon-date-picker-label moon-divider-text'}
					]}
				);
				this.createComponent(
					{name: 'minutePicker', classes: 'moon-date-picker-wrap', components:[
						{kind: 'moon.IntegerPicker', name: 'minute', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, value: this.valueArray.minute, disabled: this.countdown},
						{name: 'minuteLabel', content: this.minuteText, classes: 'moon-date-picker-label moon-divider-text'}
					]}
				);
				this.createComponent(
					{name: 'secondPicker', classes: 'moon-date-picker-wrap', components:[
						{kind: 'moon.IntegerPicker', name: 'second', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, value: this.valueArray.second, disabled: this.countdownSS},
						{name: 'secondLabel', content: this.secondText, classes: 'moon-date-picker-label moon-divider-text'}
					]}
				);
			}
			this.render();
		},

		/**
		* @private
		*/
		currentTemplate: function () {
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
			this.currentTemplate();
			this.setupPickers();
			this.setupArray();
			this.setValue(this.formatValue());
		},

		/**
		* @private
		*/
		setupArray: function () {
			if (this.template.search('h') < 0)
				this.valueArray['hour'] = 0;
			if (this.template.search('m') < 0)
				this.valueArray['minute'] = 0;
			if (this.template.search('s') < 0)
				this.valueArray['second'] = 0;
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
				this.createValueArray();
				this.updatePicker();
				this.$.currentValue.set('content', this.formatText());
			}
		},

		/**
		* @private
		*/
		createValueArray: function () {
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
							this.valueArray['hour'] = tempValue;
						}
						break;
						case 'm':
						if (this.$.minutePicker || !this.$.minutePicker && timeArray.length > 1) {
							tempValue = Math.round(timeArray.shift());
							if (isNaN(tempValue) || tempValue > 59 || tempValue < 0) {
								tempValue = 0;
							}
							this.valueArray['minute'] = tempValue;
						}
						break;
						case 's':
						if (this.$.secondPicker || !this.$.secondPicker && timeArray.length > 0) {
							tempValue = Math.round(timeArray.shift());
							if (isNaN(tempValue) || tempValue> 59 || tempValue < 0) {
								tempValue = 0;
							}
							this.valueArray['second'] = tempValue;
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
			if (this.$.hourPicker && this.$.hour.value != this.valueArray['hour'])
				this.$.hour.set('value', this.valueArray['hour']);

			if (this.$.minutePicker && this.$.minute.value != this.valueArray['minute'])
				this.$.minute.set('value', this.valueArray['minute']);

			if (this.$.secondPicker && this.$.second.value != this.valueArray['second'])
				this.$.second.set('value',this.valueArray['second']);
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
						val = val + ':' + this.valueArray['hour'];
						break;
					case 'm':
						val = val + ':' + this.valueArray['minute'];
						break;
					case 's':
						val = val + ':' + this.valueArray['second'];
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
			if (this.valueArray) {
				for (idx = 0; idx < this.templateArray.length; idx++) {
					item = this.templateArray[idx];
					switch (item) {
						case 'h':
							text = text + ' ' + this.valueArray['hour'] + ' ' + moon.$L('Hours');
							break;
						case 'm':
							text = text + ' ' + this.valueArray['minute'] + ' ' + moon.$L('Minutes');
							break;
						case 's':
							text = text + ' ' + this.valueArray['second'] + ' ' + moon.$L('Seconds');
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
			var hr = this.valueArray['hour'];
			var mn = this.valueArray['minute'];
			var ss = this.valueArray['second'];
			if (hr <= 0 && mn <= 0 && ss <= 0) {
				this.pickerExpired();
				return;
			} else {
				if (ss === 0 ) {
					ss = 59;
					this.valueArray['second'] = ss;
					if (mn > 0 ) {
						mn--;
						this.valueArray['minute'] = mn;
					} else {
						mn = 59;
						hr--;
						this.valueArray['minute'] = mn;
						this.valueArray['hour'] = hr;
					}
				} else {
					ss--;
					this.valueArray['second'] = ss;
				}
				this.set('value', this.formatValue());
			}
		},

		/**
		* @private
		*/
		updateValue: function (sender, ev) {
			var hour = this.$.hourPicker ? this.$.hour.get('value') : this.valueArray['hour'];
			var minute = this.$.minutePicker ? this.$.minute.get('value') : this.valueArray['minute'];
			var second = this.$.secondPicker ? this.$.second.get('value') : this.valueArray['second'];
			if (ev.name == 'second' && this.valueArray['second'] == second) {
				return;
			} else if (ev.name == 'minute' &&  this.valueArray['minute'] == minute) {
				return;
			} else if (ev.name == 'hour' && this.valueArray['hour'] == hour) {
				return;
			}
			this.valueArray['second'] = second;
			this.valueArray['minute'] = minute;
			this.valueArray['hour'] = hour;
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
		changeCountdown: function () {
			if (this.countdown) {
				if (this.$.hour)
					this.$.hour.set('disabled', true);
				if (this.$.minute)
					this.$.minute.set('disabled', true);
				if (this.$.second)
					this.$.second.set('disabled' , true);
			} else {
				if (this.$.hour)
					this.$.hour.set('disabled', false);
				if (this.$.minute)
					this.$.minute.set('disabled', false);
				if (this.$.second)
					this.$.second.set('disabled' , false);
			}
		},

		/**
		* @private
		*/
		startTapped: function () {
			if (this.startConent == moon.$L('Start')) {
				if(this.valueArray['hour'] || this.valueArray['minute'] || this.valueArray['second']) {
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
			if (this.pauseConent == moon.$L('Pause')) {
				this.set('pauseConent', moon.$L('Resume'));
				this.pauseTimer();
			} else {
				this.set('pauseConent', moon.$L('Pause'));
				this.startTimer();
			}
		},

		/**
		* @private
		*/
		startPicker: function () {
			this.set('startConent', moon.$L('Cancel'));
			this.set('pauseDisabled', false);
			this.startTimer();
		},

		/**
		* @private
		*/
		cancelPicker: function () {
			this.set('startConent', moon.$L('Start'));
			this.set('pauseConent', moon.$L('Pause'));
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
				this.timer = window.setInterval(
					enyo.bind (this, function () {
						this.tick();
					}), 1000);				
			}
		},

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
			if (this.startConent == moon.$L('Cancel')) {
				this.cancelPicker();
			}
			this.valueArray['hour'] = 0;
			if (this.$.hour) this.$.hour.set('value', 0);

			this.valueArray['minute'] = 0;
			if (this.$.minute) this.$.minute.set('value', 0);

			this.valueArray['second'] = 0;
			if (this.$.second) this.$.second.set('value',0);
		},

		/**
		* @private
		*/
		closePicker: function (sender, ev) {
			/**
			* If select/enter is pressed on any date picker item or the left key is pressed on the
			* first item, close the drawer
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