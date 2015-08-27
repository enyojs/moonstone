require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ExpandableIntegerPicker~ExpandableIntegerPicker} kind.
* @module moonstone/ExpandableIntegerPicker
*/

var
	kind = require('enyo/kind');

var
	ExpandableListItem = require('../ExpandableListItem'),
	SimpleIntegerPicker = require('../SimpleIntegerPicker');

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
* {@link module:moonstone/ExpandableIntegerPicker~ExpandableIntegerPicker}, which extends {@link module:moonstone/ExpandableListItem~ExpandableListItem},
* is a drop-down picker menu that prompts the user to make a selection from a range of
* integer-based options.
*
* The value of the currently selected item is available in the picker's
* [value]{@link module:moonstone/ExpandableIntegerPicker~ExpandableIntegerPicker#value} property.
*
* When the picker is minimized, the content of the currently selected item is
* displayed as subtext below the picker label.
*
* @class ExpandableIntegerPicker
* @extends module:moonstone/ExpandableListItem~ExpandableListItem
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/ExpandableIntegerPicker~ExpandableIntegerPicker.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ExpandableIntegerPicker',

	/**
	* @private
	*/
	kind: ExpandableListItem,

	/**
	* @private
	*/
	classes: 'moon-expandable-integer-picker',

	/**
	* @private
	*/
	events: {

		/**
		* {@link module:moonstone/ExpandableIntegerPicker~ExpandableIntegerPicker#onChange}
		*/
		onChange: ''
	},

	/**
	* @private
	* @lends module:moonstone/ExpandableIntegerPicker~ExpandableIntegerPicker.prototype
	*/
	published: {
		/**
		* Initial value of the picker.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		value: 0,

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
	drawerComponents: [
		{name: 'picker', kind: SimpleIntegerPicker, deferInitialization: true, onSelect: 'toggleActive', onChange: 'pickerValueChanged'}
	],

	/**
	* @private
	*/
	bindings: [
		{from: '.min', to: '.$.picker.min', oneWay: false},
		{from: '.max', to: '.$.picker.max', oneWay: false},
		{from: '.step', to: '.$.picker.step'},
		{from: '.unit', to: '.$.picker.unit'}
	],

	/**
	* @private
	*/
	create: function () {
		ExpandableListItem.prototype.create.apply(this, arguments);
		this.requestPickerReflow();
		this.valueChanged();
	},

	/**
	* @private
	*/
	requestPickerReflow: function () {
		this._needsPickerReflow = true;
	},

	/**
	* Intentionally using an observer instead of a binding since the order of applying `value`,
	* `min`, and `max` is important. Bindings are processed after `create()` so calling this
	* in `create()` guarantees it runs first.
	*
	* @private
	*/
	valueChanged: function () {
		this.$.picker.set('value', this.value);
	},

	/**
	* @see module:moonstone/ExpandableListItem~ExpandableListItem#currentValueShowing
	* @private
	*/
	currentValueShowing: function () {
		return !this.open;
	},

	/**
	* @see module:moonstone/ExpandableListItem~ExpandableListItem#currentValueText
	* @private
	*/
	currentValueText: function () {
		return this.unit? this.value + ' ' + this.unit : this.value;
	},

	/**
	* Change handler
	*
	* @private
	*/
	openChanged: function () {
		ExpandableListItem.prototype.openChanged.apply(this, arguments);
		if (this.open && this._needsPickerReflow) {
			this.$.picker.reflow();
			this._needsPickerReflow = false;
		}
	},

	/**
	* Catch onChange events from the picker and update the value as it may have been clamped
	* by the picker's `step` property. Firing its own event so `content` can be fixed because
	* it may not have synced to SimpleIntegerPicker before this fires (e.g. the first time).
	*
	* @private
	*/
	pickerValueChanged: function (sender, event) {
		var content = this.unit? event.value + ' ' + this.unit : event.value;
		this.set('value', event.value);

		this.doChange({
			value: this.value,
			content: content
		});

		return true;
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
