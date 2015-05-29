require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/GridListImageItem~GridListImageItem} kind.
* @module moonstone/GridListImageItem
*/

var
	kind = require('enyo/kind');

var
	GridListImageItem = require('layout/GridListImageItem');

var
	Img = require('../Image'),
	Marquee = require('../Marquee'),
	MarqueeSupport = Marquee.Support,
	MarqueeText = Marquee.Text,
	Overlay = require('../Overlay');

/**
* {@link module:moonstone/GridListImageItem~GridListImageItem} extends {@link module:enyo/GridListImageItem~GridListImageItem}, adding
* Moonstone-specific configuration, styling, decorators, and focus-state management.
*
* You may create an image grid by adding instances of this kind as components of a
* {@link module:moonstone/DataGridList~DataGridList}.
*
* @class GridListImageItem
* @extends module:enyo/GridListImageItem~GridListImageItem
* @mixes module:moonstone/MarqueeSupport~MarqueeSupport
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/GridListImageItem~GridListImageItem.prototype */ {

	/**
	* @private
	*/
	name: 'moon.GridListImageItem',

	/**
	* @private
	*/
	kind: GridListImageItem,

	/**
	* @private
	*/
	mixins: [MarqueeSupport, Overlay.Container],

	/**
	* @private
	*/
	overlayTarget: 'image',

	/**
	* @private
	*/
	spotlight: true,

	/**
	* @private
	*/
	centered: true,

	/**
	* @private
	*/
	classes: 'moon-gridlist-imageitem',

	/**
	* @private
	*/
	componentOverrides: {
		caption: {kind: MarqueeText},
		subCaption: {kind: MarqueeText},
		image: {kind: Img}
	},

	/**
	* @private
	*/
	bindings: [
		{from: '.allowHtml', to: '.$.caption.allowHtml'},
		{from: '.allowHtml', to: '.$.subCaption.allowHtml'}
	],

	/**
	* @private
	*/
	handlers: {
		onSpotlightFocus: 'focused'
	},

	/**
	* @fires module:moonstone/Scroller~Scroller#onRequestScrollIntoView
	* @private
	*/
	focused: function (inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble('onRequestScrollIntoView');
		}
	}
});
