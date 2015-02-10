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
			onCountdownExpired: ''
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
			hourText: moon.$L('hour'),			// i18n 'HOUR' label in moon.DurationPicker widget

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
			* @type {Boolean}
			* @default ''
			* @public
			*/
			countdown: false,

			/**
			* @type {String}
			* @default ''
			* @public
			*/
			template: ''
		},

		/**
		* @type {String}
		* @default null
		* @private
		*/
		timer: null,

		/**
		* @type {Object}
		* @default '0, 0, 0'
		* @private
		*/

		valueArray: {},

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
			{name: 'drawer', kind: 'enyo.Drawer', resizeContainer: false, classes: 'moon-expandable-list-item-client indented', components: [
				{name: 'client', kind: 'enyo.Control', classes: 'enyo-tool-decorator moon-date-picker-client', onSpotlightLeft: 'closePicker', onSpotlightSelect: 'closePicker'}
			]}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.disabled', to: '.$.headerWrapper.disabled'},
			{from: '.disabledPicker', to: '.$.hour.disabled'},
			{from: '.disabledPicker', to: '.$.minute.disabled'},
			{from: '.disabledPicker', to: '.$.second.disabled'}
		],

		/**
		* @private
		*/
		constructor: function() {
			this.inherited(arguments);
			this.valueArray = {
				'hour': 0,
				'minute': 0,
				'second': 0
			};
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
			this.setupPickers();
			this.templateChanged();
			if(this.value !== '') {
				this.valueChanged();
				this.countdownChanged();
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
			this.createComponent(
				{name: 'hourPicker', classes: 'moon-date-picker-wrap', components:[
					{kind: 'moon.IntegerPicker', name: 'hour', min: 0, max: 23, wrap: true, digits: 2, value: this.valueArray['hour']},
					{name: 'hourLabel', content: this.hourText, classes: 'moon-date-picker-label moon-divider-text'}
				]}
			);
			this.createComponent(
				{name: 'minutePicker', classes: 'moon-date-picker-wrap', components:[
					{kind: 'moon.IntegerPicker', name: 'minute', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, digits: 2, value: this.valueArray['minute']},
					{name: 'minuteLabel', content: this.minuteText, classes: 'moon-date-picker-label moon-divider-text'}
				]}
			);
			this.createComponent(
				{name: 'secondPicker', classes: 'moon-date-picker-wrap', components:[
					{kind: 'moon.IntegerPicker', name: 'second', classes: 'moon-date-picker-field', min: 0, max: 59, wrap: true, digits: 2, value: this.valueArray['second']},
					{name: 'secondLabel', content: this.secondText, classes: 'moon-date-picker-label moon-divider-text'}
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
		* If no item is selected, uses [`noneText`]{@link moon.DurationPickerBase#noneText}
		* as current value and if nonoText value is not provided, use 'Pick Duration'
		* as default.
		*
		* @private
		*/
		noneTextChanged: function () {
			if(this.value == null || this.value === '') {
				this.$.currentValue.set('content', moon.$L(this.getNoneText()) || moon.$L('Pick Duration'));
			}
		},

		
		/**
		* @private
		*/
		valueChanged: function(){
			if(this.value == null || this.value === '') {
				this.resetPicker();
			 	this.noneTextChanged();
			 } else {
			 	this.createValueArray();
				this.updatePicker();
				this.$.currentValue.set('content', this.formatValue());
			 }
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
		createValueArray: function(){
			var tempValue;
			if(this.value != null && this.value !== ''){
				var timeArray = this.value.toString().split(':');
				if(this.$.hourPicker.get('showing') || (!this.$.hourPicker.get('showing') && timeArray.length > 2)) {
					tempValue =  Math.round(timeArray.shift());
					if(isNaN(tempValue) || tempValue > 23 || tempValue < 0) {
						tempValue = 0;
					}
					this.valueArray['hour'] = tempValue;
				}
				if(this.$.minutePicker.get('showing') || (!this.$.minutePicker.get('showing') && timeArray.length > 1)){
					tempValue = Math.round(timeArray.shift());
					if(isNaN(tempValue) || tempValue > 59 || tempValue < 0){
						tempValue = 0;
					}
					this.valueArray['minute'] = tempValue;
				}
				if(this.$.secondPicker.get('showing') || (!this.$.secondPicker.get('showing') && timeArray.length > 0)){
					tempValue = Math.round(timeArray.shift());
					if(isNaN(tempValue) || tempValue> 59 || tempValue < 0){
						tempValue = 0;
					}
					this.valueArray['second'] = tempValue;
				}
			}
		},

		/**
		* @private
		*/
		updatePicker: function(){
			if(this.$.hour.value != this.valueArray['hour'])
				this.$.hour.set('value', this.valueArray['hour']);
			if(this.$.minute.value != this.valueArray['minute'])
				this.$.minute.set('value', this.valueArray['minute']);
			if(this.$.second.value != this.valueArray['second'])
				this.$.second.set('value',this.valueArray['second']);
			if (this.countdown && !this.timer) {
				this.countdownChanged();
			}
		},

		/**
		* @private
		*/
		formatValue: function () {
			var text = '';
			if(this.valueArray){
				if(this.$.hourPicker.get('showing')){
					text = this.valueArray['hour'] + ' ' + moon.$L('Hours');
				}
				if(this.$.minutePicker.get('showing')){
					text = text + ' ' + this.valueArray['minute'] + ' ' + moon.$L('Minutes');
				}
				if(this.$.secondPicker.get('showing')){
					text = text + ' ' + this.valueArray['second'] + ' ' + moon.$L('Seconds');
				}
			}
			this.doDurationChange({name: this.name, value: text});
			return text;
		},

		/**
		* @private
		*/
		tick: function () {
			var hr = this.valueArray['hour'];
			var mn = this.valueArray['minute'];
			var ss = this.valueArray['second'];
			if (hr <= 0 && mn <= 0 && ss <= 0) {
				window.clearTimeout(this.timer);
				this.timer = null;
				this.doCountdownExpired({name:this.name});
				return;
			} else {
				if (ss === 0 ) {
					if (mn > 0 ) {
						mn--;
					} else {
						mn = 59;
						hr--;
					}
					ss = 59;
				} else{
					ss--;
				}
				this.setValue(hr + ':' + mn  + ':' + ss);
			}
		},

		/**
		* @private
		*/
		updateValue: function (inSender, inEvent) {
			var hour = this.$.hour.get('value');
			var minute = this.$.minute.get('value');
			var second = this.$.second.get('value');
			if(inEvent.name == 'second' && this.valueArray['second'] == second) {
				return;
			} else if (inEvent.name == 'minute' && this.valueArray['minute'] == minute) {
				return;
			} else if(inEvent.name == 'hour' && this.valueArray['hour'] == hour) {
				return;
			}
			this.setValue(hour + ':' + minute + ':' + second);
			if (this.countdown && !this.timer) {
				this.countdownChanged();
			}
		},

		/**
		* @private
		*/
		countdownChanged: function () {
			window.clearTimeout(this.timer);
			this.timer = null;
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
		hidePickers: function () {
			this.$.hourPicker.set('showing', false);
			this.$.minutePicker.set('showing', false);
			this.$.secondPicker.set('showing', false);
		},

		/**
		* @private
		*/
		resetPicker: function(){
			window.clearTimeout(this.timer);
			this.timer = null;
			this.valueArray['hour'] = 0;
			this.$.hour.set('value', 0);
			this.valueArray['minute'] = 0;
			this.$.minute.set('value', 0);
			this.valueArray['second'] = 0;
			this.$.second.set('value',0);
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