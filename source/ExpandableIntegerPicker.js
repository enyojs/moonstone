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
	* {@link moon.ExpandableIntegerPicker}, which extends {@link moon.ExpandableListItem},
	* is a drop-down picker menu that prompts the user to make a selection from a range of
	* integer-based options.
	*
	* The value of the currently selected item is available in the picker's
	* [value]{@link moon.ExpandableIntegerPicker#value} property.
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
			* {@link moon.ExpandableIntegerPicker#onChange}
			*/
			onChange: ''
		},

		/**
		* @private
		* @lends moon.ExpandableIntegerPicker.prototype
		*/
		published: {

			/**
			* Text to be displayed as the current value if no item is currently selected.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			noneText: '',

			/**
			* Initial value of the picker.
			*
			* @type {Number}
			* @default -1
			* @public
			*/
			value: -1,

			/**
			* Minimum value of the picker.
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			min: 0,

			/**
			* Maximum value of the picker.
			*
			* @type {Number}
			* @default 9
			* @public
			*/
			max: 9,

			/**
			* Amount by which to increment/decrement.
			*
			* @type {Number}
			* @default 1
			* @public
			*/
			step: 1,

			/**
			* Unit/label to be appended to the end of the number.
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
			requestScrollIntoView: 'requestScrollIntoView'
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
				{name: 'picker', kind: 'moon.SimpleIntegerPicker', deferInitialization: true, onSelect: 'toggleActive', onChange: 'pickerValueChanged'}
			]}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.min', to: '.$.picker.min', oneWay: false},
			{from: '.max', to: '.$.picker.max', oneWay: false},
			{from: '.step', to: '.$.picker.step'},
			{from: '.unit', to: '.$.picker.unit'},
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
		openChanged: function () {
			this.inherited(arguments);
			this.setActive(this.getOpen());
			if (this.open && this._needsPickerReflow) {
				this.$.picker.reflow();
				this._needsPickerReflow = false;
			}

			// if the picker is value-less when opening, set the value as min
			if (this.open && !this.hasValue()) {
				this.$.picker.set('value', this.$.picker.min || 0);
			}
		},

		/**
		* Pass the value down to the contained picker if the value is valid. Note that the
		* validation only ensures it is truthy or 0.
		*
		* @private
		*/
		valueChanged: function () {
			if (this.hasValue()) {
				this.$.picker.set('value', this.value);
			}
		},

		/**
		* Computed property
		*
		* @private
		*/
		showCurrentValue: function () {
			return !this.open;
		},

		/**
		* Computed property
		*
		* @private
		*/
		currentValueText: function () {
			return !this.hasValue()? this.noneText : this.value + ' ' + this.unit;
		},

		/**
		* Utility method to test if the picker is valued
		*
		* @private
		*/
		hasValue: function () {
			return !!(this.value || this.value === 0);
		},

		/**
		* If picker is open, closes and spots header; if picker is closed, opens and unspots.
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
		* Catch onChange events from the picker and update the value as it may have been clamped
		* by the picker's `step` property
		*
		* @private
		*/
		pickerValueChanged: function (sender, event) {
			this.set('value', event.value);
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
