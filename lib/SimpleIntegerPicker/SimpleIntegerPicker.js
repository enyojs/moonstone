require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/SimpleIntegerPicker~SimpleIntegerPicker} kind.
* @module moonstone/SimpleIntegerPicker
*/

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom');

var
	IntegerPicker = require('../IntegerPicker');

/**
* Fires when the currently selected item changes.
*
* @event module:moonstone/SimpleIntegerPicker~SimpleIntegerPicker#onChange
* @type {Object}
* @property {Number} value - The value of the currently selected item.
* @property {String} content - The content of the currently selected item.
* @public
*/

/**
* Fires in response to Return keypress while the picker has focus in
* {@glossary Spotlight} 5-way mode.
*
* @event module:moonstone/SimpleIntegerPicker~SimpleIntegerPicker#onSelect
* @type {Object}
* @property {Number} value - The value of the currently selected item.
* @property {String} content - The content of the currently selected item.
* @public
*/

/**
* Fires when the picker is rebuilt, allowing other controls the opportunity to reflow
* the picker as necessary (e.g., a child of a {@link module:moonstone/ExpandableIntegerPicker~ExpandableIntegerPicker} may
* need to be reflowed when the picker is opened, as it may not be currently visible).
* No event-specific data is sent with this event.
*
* @event module:moonstone/SimpleIntegerPicker~SimpleIntegerPicker#onRebuilt
* @type {Object}
* @public
*/

/**
* {@link module:moonstone/SimpleIntegerPicker~SimpleIntegerPicker} is a [control]{@link module:enyo/Control~Control} that prompts the
* user to make a selection from a range of integer-based options.
*
* The picker may be changed programmatically by calling
* [previous()]{@link module:moonstone/IntegerPicker~IntegerPicker#previous} or
* [next()]{@link module:moonstone/IntegerPicker~IntegerPicker#next}, or by modifying the published property
* [value]{@link module:moonstone/IntegerPicker~IntegerPicker#value}.
*
* @class SimpleIntegerPicker
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/SimpleIntegerPicker~SimpleIntegerPicker.prototype */ {

	/**
	* @private
	*/
	name: 'moon.SimpleIntegerPicker',

	/**
	* @private
	*/
	kind: IntegerPicker,

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
		onSpotlightRight: 'next',
		onSpotlightLeft: 'previous',
		onSpotlightSelect: 'fireSelectEvent'
	},

	/**
	* @lends module:moonstone/SimpleIntegerPicker~SimpleIntegerPicker.prototype
	* @private
	* @lends module:moonstone/SimpleIntegerPicker~SimpleIntegerPicker.prototype
	*/
	published: {

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
	* Number of pixels added to the width of each picker item as padding. Note that this
	* is not a CSS padding value.
	*
	* @type {Number}
	* @default 60
	* @public
	*/
	itemPadding: 60,

	/**
	* Appends unit to content, forming label for display.
	*
	* @see module:moonstone/IntegerPicker~IntegerPicker.labelForValue
	* @private
	* @method
	*/
	labelForValue: function (value) {
		var content = IntegerPicker.prototype.labelForValue.apply(this, arguments);
		return this.unit? content + ' ' + this.unit : content;
	},

	/**
	* @private
	*/
	unitChanged: function(){
		this.valueChanged();
	},

	/**
	* Calculates width of the picker when the first item is rendered.
	*
	* @see module:moonstone/IntegerPicker~IntegerPicker.updateRepeater
	* @private
	* @method
	*/
	updateRepeater: function () {
		IntegerPicker.prototype.updateRepeater.apply(this, arguments);

		if(!this.width) {
			var ib;
			this.$.repeater.performOnRow(this.$.repeater.rowOffset, function() {
				// have to reset to natural width before getting bounds
				this.$.item.setStyle('width: auto');
				ib = this.$.item.getBounds();
			}, this);

			this.width = ib.width + this.itemPadding;
			this.applyStyle('width', dom.unit(this.width, 'rem'));
			this.$.item.setStyle('width: ' + dom.unit(this.width, 'rem'));
		}
	},

	/**
	* @fires module:moonstone/SimpleIntegerPicker~SimpleIntegerPicker#onSelect
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
	* Forces recalculation of the width of the picker.
	*
	* @see module:enyo/UiComponent~UiComponent.reflow
	* @private
	* @method
	*/
	reflow: function () {
		this.width = 0;
		IntegerPicker.prototype.reflow.apply(this, arguments);
	}
});
