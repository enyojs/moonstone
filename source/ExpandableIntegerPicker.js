(function (enyo, scope) {
	/**
	* Fires when the currently selected item changes.
	*
	* @event moon.ExpandableIntegerPicker#onChange
	* @type {Object}
	* @property {Number} value - The value of the currently selected item.
	* @property {String} content -  The content of the currently selected item.
	*
	* @public
	*/

	/**
	* `moon.ExpandableIntegerPicker`, which extends
	* [`moon.ExpandableListItem`]{@link moon.ExpandableListItem}, is a drop-down picker
	* menu that prompts the user to make a selection from a range of integer-based
	* options.
	*
	* The value of the currently selected item is available in the picker's
	* [`value`]{@link moon.ExpandableIntegerPicker.value} property.
	*
	* When the picker is minimized, the content of the currently selected item is
	* displayed as subtext below the picker label.
	*
	* @class moon.ExpandableIntegerPicker
	* @extends moon.ExpandableListItem
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ExpandableIntegerPicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ExpandableIntegerPicker',

		/**
		* @private
		*/
		kind: 'moon.ExpandableListItem',

		/**
		* @private
		*/
		classes: 'moon-expandable-integer-picker',

		/**
		* @private
		*/
		events: {

			/**
			* {@link moon.ExpandableIntegerPicker#event:onChange}
			*/
			onChange: ''
		},

		/**
		* @private
		* @lends moon.ExpandableIntegerPicker.prototype
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
			* Initial value of the picker
			*
			* @type {Number}
			* @default -1
			* @public
			*/
			value: -1,

			/**
			* Minimum value of the picker
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			min: 0,

			/**
			* Maximum value of the picker
			*
			* @type {Number}
			* @default 9
			* @public
			*/
			max: 9,

			/**
			* Amount to increment/decrement by
			*
			* @type {Number}
			* @default 1
			* @public
			*/
			step: 1,

			/**
			* Unit/label to be appended to the end of the number
			*
			* @type {String}
			* @default 'sec'
			* @public
			*/
			unit: 'sec'
		},

		/**
		* @private
		*/
		lockBottom: true,

		/**
		* @private
		*/
		autoCollapse: true,

		/**
		* @private
		*/
		handlers: {
			requestScrollIntoView: 'requestScrollIntoView',
			onRebuilt: 'requestPickerReflow'
		},

		/**
		* @private
		*/
		components: [
			{name: 'headerWrapper', kind: 'moon.Item', classes: 'moon-expandable-picker-header-wrapper', onSpotlightFocus: 'headerFocus', ontap: 'expandContract', components: [
				// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
				{name: 'headerContainer', classes: 'moon-expandable-list-item-header moon-expandable-picker-header', components: [
					{name: 'header', kind: 'moon.MarqueeText'}
				]},
				{name: 'currentValue', kind: 'moon.MarqueeText', classes: 'moon-expandable-picker-current-value'}
			]},
			{name: 'drawer', kind: 'enyo.Drawer', resizeContainer:false, classes:'moon-expandable-list-item-client indented', components: [
				{name: 'picker', kind: 'moon.SimpleIntegerPicker', deferInitialization: true, onSelect: 'toggleActive', onActivate: 'activated'}
			]}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.min', to: '.$.picker.min'},
			{from: '.max', to: '.$.picker.max'},
			{from: '.step', to: '.$.picker.step'},
			{from: '.unit', to: '.$.picker.unit'},
			{from: '.value', to: '.$.picker.value', oneWay: false},
			{from: '.showCurrentValue', to: '.$.currentValue.showing'},
			{from: '.currentValueText', to: '.$.currentValue.content'},
			{from: '.disabled', to: '.$.headerWrapper.disabled'}
		],

		/**
		* @private
		*/
		computed: {
			'showCurrentValue': ['open'],
			'currentValueText': ['value', 'unit', 'noneText']
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.requestPickerReflow();
		},

		/**
		* @private
		*/
		requestPickerReflow: function () {
			this._needsPickerReflow = true;
		},

		/**
		* Change handler
		*
		* @private
		*/
		valueChanged: function (inOld) {
			if (this.value < this.min || this.value > this.max) {
				this.value = inOld;
			}
			this.fireChangeEvent();
		},

		/**
		* Change handler
		*
		* @private
		*/
		openChanged: function () {
			this.inherited(arguments);
			this.setActive(this.getOpen());
			if (this.open && this._needsPickerReflow) {
				this.$.picker.reflow();
				this._needsPickerReflow = false;
			}
		},

		/**
		* Computed prop
		*
		* @private
		*/
		showCurrentValue: function () {
			return !this.open;
		},

		/**
		* Computed prop
		*
		* @private
		*/
		currentValueText: function () {
			return (this.value === '') ? this.noneText : this.value + ' ' + this.unit;
		},

		/**
		* Sets {@link @moon.ExpandableIntegerPicker#value} to `this.$.clientInput.value`.
		*
		* @private
		*/
		updateValue: function () {
			this.setValue(this.$.picker.getValue());
		},

		/**
		* If open, closes and spots header. If closed, opens and unspots.
		*
		* @private
		*/
		toggleActive: function () {
			if (this.getOpen()) {
				this.setActive(false);
				if (!enyo.Spotlight.getPointerMode()) {
					enyo.Spotlight.spot(this.$.headerWrapper);
				}
			} else {
				this.setActive(true);
			}
		},

		/**
		* Kills any {@link moon.SimplePicker#event:onActivate} events coming from buttons in the
		* SimplePicker.
		*
		* @private
		*/
		activated: function (inSender, inEvent) {
			return true;
		},

		/**
		* @fires moon.ExpandableIntegerPicker#onChange
		* @private
		*/
		fireChangeEvent: function () {
			this.doChange({value: this.value, content: this.content});
		},

		/**
		* @private
		*/
		spotlightDown: function (inSender, inEvent) {
			if (this.getLockBottom() && (inEvent.originator === this.$.picker) && this.getOpen()) {
				return true;
			}
		}
	});

})(enyo, this);
