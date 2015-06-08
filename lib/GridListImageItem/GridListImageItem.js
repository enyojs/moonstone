require('moonstone');

/**
* Contains the declaration for the {@link moon.GridListImageItem} kind.
* @module moonstone/GridListImageItem
*/

var
	kind = require('enyo/kind'),
	Image = require('enyo/Image');

var
	GridListImageItem = require('layout/GridListImageItem');

var
	Img = require('../Image'),
	Marquee = require('../Marquee'),
	MarqueeSupport = Marquee.Support,
	MarqueeText = Marquee.Text,
	Overlay = require('../Overlay');

/**
* {@link moon.GridListImageItem} extends {@link enyo.GridListImageItem}, adding
* Moonstone-specific configuration, styling, decorators, and focus-state management.
*
* You may create an image grid by adding instances of this kind as components of a
* {@link moon.DataGridList}.
*
* @namespace moon
* @class moon.GridListImageItem
* @extends enyo.GridListImageItem
* @mixes moon.MarqueeSupport
* @ui
* @definedby module:moonstone/GridListImageItem
* @public
*/
module.exports = kind(
	/** @lends moon.GridListImageItem.prototype */ {

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
	placeholder: Image.placeholder,

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
	* @fires moon.Scroller#onRequestScrollIntoView
	* @private
	*/
	focused: function (inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble('onRequestScrollIntoView');
		}
	}
});
