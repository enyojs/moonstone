require('moonstone');

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var
	Spotlight = require('spotlight');

var
	ExpandableListDrawer = require('../ExpandableListDrawer'),
	ExpandableListItem = require('../ExpandableListItem'),
	Item = require('../Item'),
	Marquee = require('../Marquee'),
	MarqueeText = Marquee.Text,
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
module.exports = kind(
	/** @lends moon.ExpandableIntegerPicker.prototype */ {

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
	components: [
		{name: 'headerWrapper', kind: Item, classes: 'moon-expandable-picker-header-wrapper', onSpotlightFocus: 'headerFocus', ontap: 'expandContract', components: [
			// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
			{name: 'headerContainer', kind: Control, classes: 'moon-expandable-list-item-header moon-expandable-picker-header', components: [
				{name: 'header', kind: MarqueeText}
			]},
			{name: 'currentValue', kind: MarqueeText, classes: 'moon-expandable-picker-current-value'}
		]},
		{name: 'drawer', kind: ExpandableListDrawer, resizeContainer:false, classes:'moon-expandable-list-item-client indented', components: [
			{name: 'picker', kind: SimpleIntegerPicker, deferInitialization: true, onSelect: 'toggleActive', onChange: 'pickerValueChanged'}
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
		{from: '.disabled', to: '.$.headerWrapper.disabled'}
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
	* Change handler
	*
	* @private
	*/
	openChanged: function () {
		ExpandableListItem.prototype.openChanged.apply(this, arguments);
		this.setActive(this.getOpen());
		this.$.currentValue.set('showing', !this.open);
		if (this.open && this._needsPickerReflow) {
			this.$.picker.reflow();
			this._needsPickerReflow = false;
		}
	},

	/**
	* If picker is open, closes and spots header; if picker is closed, opens and unspots.
	*
	* @private
	*/
	toggleActive: function () {
		if (this.getOpen()) {
			this.setActive(false);
			if (!Spotlight.getPointerMode()) {
				Spotlight.spot(this.$.headerWrapper);
			}
		} else {
			this.setActive(true);
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
		this.$.currentValue.set('content', content);

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