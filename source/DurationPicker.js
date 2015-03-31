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
	*/

	var 
		/**
		* Optional label for hour
		*
		* @type {String}
		* @default moon.$L("1#hour|#hours")
		* @private
		*/
		hourText = moon.$L("1#hour|#hours"),		// i18n 'HOUR' label in moon.DurationPicker widget

		/**
		* Optional label for minute
		*
		* @type {String}
		* @default moon.$L('1#minute|#minutes')
		* @private
		*/
		minuteText = moon.$L('1#minute|#minutes'),	// i18n 'MINUTE' label in moon.DurationPicker widget

		/**
		* Optional label for second
		*
		* @type {String}
		* @default moon.$L('1#second|#seconds')
		* @private
		*/
		secondText = moon.$L('1#second|#seconds'),	// i18n 'SECOND' label in moon.DurationPicker widget

		/**
		* Optional label for Start Button
		*
		* @type {String}
		* @default moon.$L('Start')
		* @private
		*/
		startText = moon.$L('Start'),			// i18n 'Start' label in moon.DurationPicker buttons

		/**
		* Optional label for Pause Button
		*
		* @type {String}
		* @default moon.$L('Pause')
		* @private
		*/
		pauseText = moon.$L('Pause'),			// i18n 'Pause' label in moon.DurationPicker buttons

		/**
		* Optional label for Cancel Button
		*
		* @type {String}
		* @default moon.$L('Cancel')
		* @private
		*/
		cancelText = moon.$L('Cancel'),			// i18n 'Cancel' label in moon.DurationPicker buttons

		/**
		* Optional label for Resume Button
		*
		* @type {String}
		* @default moon.$L('Resume')
		* @private
		*/
		resumeText = moon.$L('Resume');			// i18n 'Resume' label in moon.DurationPicker buttons

	/*
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
		classes: 'moon-duration-picker moon-expandable-picker',

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
		* @type {Boolean}
		* @default true
		* @private
		*/
		pauseDisabled: true,

		/**
		* Refresh time in milliseconds.
		*
		* @type {Number}
		* @default 1000
		* @public
		*/
		refresh: 1000,

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
			* Enable and disable the timer feature of duration picker
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			enableTimer: true,

			/**
			* Show/hide the hour picker in duration picker
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			showHour: true,

			/**
			* Show/hide the minute picker in duration picker
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			showMinute: true,

			/**
			* Show/hide the second picker in duration picker
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			showSecond: true
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
			{from: 'enableTimer', to: '$.buttonPlaceHolder.showing'},
			{from: 'showHour', to: '$.hourPicker.showing'},
			{from: 'showMinute', to: '$.minutePicker.showing'},
			{from: 'showSecond', to: '$.secondPicker.showing'}
		],

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
			this.hourStr = new ilib.String(hourText);
			this.minuteStr = new ilib.String(minuteText);
			this.secondStr = new ilib.String(secondText);
			this.durFormat = new ilib.DurFmt({length: 'full', useNative: false});
			this.startContent = startText;
			this.pauseContent = pauseText;
			this.setupPickers();
			if(this.value !== '') {
				this.valueChanged();
			} else {
				this.noneTextUpdate();
			}
		},

		/**
		* creating the hour, minute and second picker components
		*
		* @private
		*/
		setupPickers: function () {
			this.createComponent(
				{name: 'hourPicker', classes: 'moon-date-picker-wrap', components:[
					{kind: 'moon.IntegerPicker', name: 'hour', min: 0, max: 23, wrap: true, value: this.values.hour, disabled: this.countdown},
					{name: 'hourLabel', content: this.hourStr.formatChoice(1), classes: 'moon-date-picker-label moon-divider-text'}
				]}
			);
			this.createComponent(
				{name: 'minutePicker', classes: 'moon-date-picker-wrap', components:[
					{kind: 'moon.IntegerPicker', name: 'minute', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, value: this.values.minute, disabled: this.countdown},
					{name: 'minuteLabel', content: this.minuteStr.formatChoice(1), classes: 'moon-date-picker-label moon-divider-text'}
				]}
			);
			this.createComponent(
				{name: 'secondPicker', classes: 'moon-date-picker-wrap', components:[
					{kind: 'moon.IntegerPicker', name: 'second', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, value: this.values.second, disabled: this.countdownSS},
					{name: 'secondLabel', content: this.secondStr.formatChoice(1), classes: 'moon-date-picker-label moon-divider-text'}
				]}
			);
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
		* If no item is selected, uses [`noneText`]{@link moon.DurationPicker#noneText}
		* as current value and if noneText value is not provided, use 'Pick Duration'
		* as default.
		*
		* @private
		*/
		noneTextUpdate: function () {
			this.$.currentValue.set('content', moon.$L(this.getNoneText()) || moon.$L('Pick Duration'));
			this.doDurationChange({name: this.name, value: this.$.currentValue.content});
		},

		/**
		* @private
		*/
		noneTextChanged: function () {
			if (this.value == null || this.value === '') {
				this.noneTextUpdate();
			}
		},

		/**
		* @private
		*/
		valueChanged: function () {
			if (this.value == null || this.value === '') {
				this.resetPicker();
				this.noneTextUpdate();
			} else {
				this.createValues();
				this.updatePicker();
				this.updateText();
			}
		},

		/**
		* @private
		*/
		createValues: function () {
			var tempValue = 0,
				timeArray = this.value.toString().split(':');
			if (this.showHour || !this.showHour && timeArray.length > 2) {
				tempValue = Math.round(timeArray.shift());
				if (isNaN(tempValue) || tempValue > 23 || tempValue < 0) {
					tempValue = 0;
				}
			}
			this.values['hour'] = tempValue;
			tempValue = 0;
			if (this.showMinute || !this.showMinute && timeArray.length > 1) {
				tempValue = Math.round(timeArray.shift());
				if (isNaN(tempValue) || tempValue > 59 || tempValue < 0) {
					tempValue = 0;
				}
			}
			this.values['minute'] = tempValue;
			tempValue = 0;
			if (this.showSecond || !this.showSecond && timeArray.length > 0) {
				tempValue = Math.round(timeArray.shift());
				if (isNaN(tempValue) || tempValue> 59 || tempValue < 0) {
					tempValue = 0;
				}
			}
			this.values['second'] = tempValue;
		},

		/**
		* @private
		*/
		updatePicker: function () {
			if (this.$.hour.value != this.values['hour'])
				this.$.hour.set('value', this.values['hour']);

			if (this.$.minute.value != this.values['minute'])
				this.$.minute.set('value', this.values['minute']);

			if (this.$.second.value != this.values['second'])
				this.$.second.set('value',this.values['second']);
		},

		/**
		* @private
		*/
		updateText: function () {
			var text,
				val = {},
				zeroValue = true;

			if (this.values && (this.values['hour'] !== 0 || this.values['minute'] !== 0 || this.values['second'] !== 0)) {
				val.hour = this.values['hour'];
				val.minute = this.values['minute'];
				val.second = this.values['second'];
				text = this.durFormat.format(val);
				this.$.currentValue.set('content', text);
				this.doDurationChange({name: this.name, value: text});
			} else {
				this.noneTextUpdate();
			}
		},

		/**
		* @private
		*/
		tick: function () {
			var hr = this.values['hour'],
				mn = this.values['minute'],
				ss = this.values['second'];
			ss--;
			if (hr <= 0 && mn <= 0 && ss <= 0) {
				this.set('value','');
				this.pickerExpired();
				return;
			} else {
				if (ss <= 0) {
					ss = 59;
					if (mn > 0) {
						mn--;
					} else {
						mn = 59;
						hr--;
					}
				}
			}
			this.set('value', hr+':'+mn+':'+ss);
		},

		/**
		* @private
		*/
		updateValue: function (sender, ev) {
			var hour = this.$.hour.get('value'),
				minute = this.$.minute.get('value'),
				second = this.$.second.get('value');
			if (ev.name == this.secondStr.formatChoice(1) && this.values['second'] == second) {
				return;
			} else if (ev.name == this.minuteStr.formatChoice(1) &&  this.values['minute'] == minute) {
				return;
			} else if (ev.name == this.hourStr.formatChoice(1) && this.values['hour'] == hour) {
				return;
			}
			this.set('value', hour+':'+minute+':'+second);
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
			this.$.hour.set('disabled', this.countdown);
			this.$.minute.set('disabled', this.countdown);
			this.$.second.set('disabled' , this.countdown);
		},

		/**
		* @private
		*/
		startTapped: function () {
			if (this.pauseDisabled) {
				if(this.values['hour'] || this.values['minute'] || this.values['second']) {
					this.set('startContent', cancelText);
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
				this.set('pauseContent', resumeText);
				this.pauseTimer();
			} else {
				this.set('pauseContent', pauseText);
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
			this.set('startContent', startText);
			this.set('pauseContent', pauseText);
			this.set('pauseDisabled', true);
			this.pauseTimer();
		},

		/**
		* @private
		*/
		refreshJob: function () {
		if (this.countdown) {
				this.tick();
				this.startJob('refresh', this.bindSafely('refreshJob'), this.refresh);
			}
		},

		/**
		* @private
		*/
		startTimer: function () {
			if (this.value) {
				this.set('countdown', true);
				this.startJob('refresh', this.bindSafely('refreshJob'), this.refresh);
			}
		},

		/**
		* @private
		*/
		pauseTimer: function () {
			this.set('countdown', false);
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
		}
	});
})(enyo, this);
