(function (enyo, scope) {
	/**
	* Fires when the currently selected item changes.
	*
	* @event moon.SimpleIntegerPicker#onChange
	* @type {Object}
	* @property {Number} value - The value of the currently selected item.
	* @property {String} content - The content of the currently selected item.
	* @public
	*/

	/**
	* Fires in response to "Return" keypress while the picker has focus in
	* {@glossary Spotlight} 5-way mode.
	*
	* @event moon.SimpleIntegerPicker#onSelect
	* @type {Object}
	* @property {Number} value - The value of the currently selected item.
	* @property {String} content - The content of the currently selected item.
	* @public
	*/

	/**
	* Fires when the picker is rebuilt, allowing other controls the opportunity to reflow
	* the picker as necessary (e.g., a child of a {@link moon.ExpandableIntegerPicker} may
	* need to be reflowed when the picker is opened, as it may not be currently visible).
	* No event-specific data is sent with this event.
	*
	* @event moon.SimpleIntegerPicker#onRebuilt
	* @type {Object}
	* @public
	*/

	/**
	* {@link moon.SimpleIntegerPicker} is a [control]{@link enyo.Control} that prompts the
	* user to make a selection from a range of integer-based options.
	*
	* The picker may be changed programmatically by calling
	* [previous()]{@link moon.SimpleIntegerPicker#previous} or
	* [next()]{@link moon.SimpleIntegerPicker#next}, or by modifying the published property
	* [value]{@link moon.SimpleIntegerPicker#value}.
	*
	* @class moon.SimpleIntegerPicker
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.SimpleIntegerPicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.SimpleIntegerPicker',

		/**
		* @private
		*/
		kind: 'moon.IntegerPicker',

		/**
		* @private
		*/
		classes: 'moon-simple-integer-picker',

		/**
		* @private
		*/
		spotlight: true,

		/**
		* @private
		*/
		events: {
			onSelect: ''
		},

		/**
		* @private
		*/
		handlers: {
			onSpotlightUp: null,
			onSpotlightDown: null,
			onSpotlightRight: 'spotRight',
			onSpotlightLeft: 'spotLeft',
			onSpotlightSelect: 'fireSelectEvent'
		},

		/**
		* @private
		* @lends moon.SimpleIntegerPicker.prototype
		*/
		published:
			/** @lends moon.SimpleIntegerPicker.prototype */ {

			/**
			* Unit label to be appended to the value for display.
			*
			* @type {String}
			* @default 'sec'
			* @public
			*/
			unit: 'sec'
		},

		/**
		* Amount added to the width of each picker item as padding. Note that this is not a CSS
		* padding value
		*
		* @type {Number}
		* @default 60
		* @public
		*/
		itemPadding: 60,

		/**
		* Appends `unit` to label
		*
		* @see moon.IntegerPicker#labelForValue
		* @private
		* @method
		*/
		labelForValue: enyo.inherit(function (sup) {
			return function (value) {
				var content = sup.apply(this, arguments);
				return this.unit? content + ' ' + this.unit : content;
			}
		}),

		/**
		* Calculates the width of the picker when the first item is rendered
		*
		* @see moon.IntegerPicker#updateRepeater
		* @private
		* @method
		*/
		updateRepeater: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);

				if(!this.width) {
					var ib;
					this.$.repeater.performOnRow(this.$.repeater.rowOffset, function() {
						// have to reset to natural width before getting bounds
						this.$.item.setStyle('width: auto');
						ib = this.$.item.getBounds();
					}, this);

					this.width = ib.width + this.itemPadding;
					this.applyStyle('width', this.width + 'px');
					this.$.item.setStyle('width: ' + this.width + 'px');
				};
			}
		}),

		/**
		* Swaps the handler for a "right" keypress when rtl is true
		*
		* @private
		*/
		spotRight: function (sender, event) {
			if(this.rtl) {
				this.previous(sender, event);
			} else {
				this.next(sender, event);
			}

			return true;
		},

		/**
		* Swaps the handler for a "left" keypress when rtl is true
		*
		* @private
		*/
		spotLeft: function (sender, event) {
			if(this.rtl) {
				this.next(sender, event);
			} else {
				this.previous(sender, event);
			}

			return true;
		},

		/**
		* @fires moon.SimpleIntegerPicker#event:onSelect
		* @private
		*/
		fireSelectEvent: function () {
			if (this.hasNode()) {
				this.doSelect({
					content: this.labelForValue(this.value),
					value: this.value
				});
			}
		},

		/**
		* Forces a recalculation of the width of the picker
		*
		* @see enyo.UiComponent#reflow
		* @private
		* @method
		*/
		reflow: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.width = 0;
				this.scrollToValue();
			};
		})
	});

})(enyo, this);
