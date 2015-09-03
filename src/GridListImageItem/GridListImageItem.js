require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/GridListImageItem~GridListImageItem} kind.
* @module moonstone/GridListImageItem
*/

var
	kind = require('enyo/kind'),
	EnyoImage = require('enyo/Image');

var
	GridListImageItem = require('layout/GridListImageItem');

var
	Img = require('../Image'),
	Marquee = require('../Marquee'),
	MarqueeSupport = Marquee.Support,
	MarqueeText = Marquee.Text,
	Overlay = require('../Overlay');

/**
* {@link module:moonstone/GridListImageItem~GridListImageItem} extends {@link module:layout/GridListImageItem~GridListImageItem}, adding
* Moonstone-specific configuration, styling, decorators, and focus-state management.
*
* You may create an image grid by adding instances of this kind as components of a
* {@link module:moonstone/DataGridList~DataGridList}.
*
* @class GridListImageItem
* @extends module:layout/GridListImageItem~GridListImageItem
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
	* Placeholder image used while [source]{@link module:moonstone/GridListImageItem~GridListImageItem#source} is loaded
	*
	* @see module:enyo/Image~Image#placeholder
	* @type {String}
	* @default module:enyo/Image~Image#placeholder
	* @public
	*/
	placeholder: EnyoImage.placeholder,

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
		onSpotlightFocused: 'focused'
	},

	/**
	* @fires module:moonstone/Scroller~Scroller#onRequestScrollIntoView
	* @private
	*/
	focused: function (inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble('onRequestScrollIntoView');
		}
	},

	// Accessibility

	/**
	* @private
	*/
	ariaObservers: [
		{path: ['caption', 'subCaption', 'accessibilityHint', 'accessibilityLabel'], method: function () {
			var content = this.caption + ' ' + this.subCaption,
				prefix = this.accessibilityLabel || content || null,
				label = this.accessibilityHint && prefix && (prefix + ' ' + this.accessibilityHint) ||
						this.accessibilityHint ||
						this.accessibilityLabel ||
						null;

				this.setAriaAttribute('aria-label', label);
		}}
	]
});
