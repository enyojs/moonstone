require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Item~Item} kind.
* @module moonstone/Item
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	options = require('enyo/options');

var
	Marquee = require('../Marquee'),
	MarqueeSupport = Marquee.Support,
	MarqueeItem = Marquee.Item,
	ItemAccessibilitySupport = require('./ItemAccessibilitySupport');

/**
* {@link module:moonstone/Item~Item} is a focusable Moonstone-styled control that can display
* simple text or a set of controls.
*
* @class Item
* @extends module:enyo/Control~Control
* @mixes module:moonstone/MarqueeSupport~MarqueeSupport
* @mixes module:moonstone/MarqueeItem~MarqueeItem
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Item~Item.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Item',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'moon-item',

	/**
	* @private
	*/
	mixins: options.accessibility ? [ItemAccessibilitySupport, MarqueeSupport, MarqueeItem] : [MarqueeSupport, MarqueeItem],

	/**
	* @private
	*/
	spotlight: true,

	/**
	* @private
	*/
	handlers: {
		onSpotlightFocused: 'spotlightFocused'
	},

	/**
	* @private
	* @lends module:moonstone/Item~Item.prototype
	*/
	published: {

		/**
		* If `true`, the control is shown as disabled and does not generate tap events.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		disabled: false
	},

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.disabledChanged();
		if (this.children.length) {
			this.addClass('allow-wrap');
		}
	},

	/**
	* @private
	*/
	disabledChanged: function (inOld) {
		this.addRemoveClass('disabled', this.disabled);
	},

	/**
	* @fires module:moonstone/Scroller~Scroller#onRequestScrollIntoView
	* @private
	*/
	spotlightFocused: function (inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble('onRequestScrollIntoView');
		}
	},

	/**
	* @private
	*/
	tap: function () {
		return this.disabled;
	}
});
