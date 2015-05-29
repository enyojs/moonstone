require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ImageItem~ImageItem} kind.
* @module moonstone/ImageItem
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	Img = require('enyo/Image');

var
	Item = require('../Item'),
	LabeledTextItem = require('../LabeledTextItem');

/**
* {@link module:moonstone/ImageItem~ImageItem}, which derives from {@link module:moonstone/Item~Item}, is a control that combines an
* {@link module:enyo/Image~Image} with a {@link module:moonstone/LabeledTextItem~LabeledTextItem}. By default, the image is displayed to
* the left of the text; to display the image on the right, set
* [imageAlignRight]{@link module:moonstone/ImageItem~ImageItem#imageAlignRight} to `true`.
*
* @class ImageItem
* @extends module:moonstone/Item~Item
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/ImageItem~ImageItem.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ImageItem',

	/**
	* @private
	*/
	classes: 'moon-imageitem',

	/**
	* @private
	*/
	kind: Item,

	/**
	* @private
	*/
	components:[
		{name: 'image', kind: Img},
		{name: 'textItem', kind: LabeledTextItem, spotlight: false}
	],

	/**
	* @private
	* @lends module:moonstone/ImageItem~ImageItem.prototype
	*/
	published: {

		/**
		* The absolute URL path to the image.
		*
		* @type {String|moon.ri.selectSrc~src}
		* @default ''
		* @public
		*/
		source: '',

		/**
		* The label to be displayed along with the text.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		label: '',

		/**
		* The text to be displayed in the item.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		text: '',

		/**
		* Set to `true` to align image to right of text.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		imageAlignRight: false
	},

	/**
	* @private
	*/
	bindings: [
		{from: 'allowHtml', to: '$.textItem.allowHtml'},
		{from: 'source', to: '$.image.src'}
	],

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.labelChanged();
		this.textChanged();
		this.imageAlignRightChanged();
	},

	/**
	* @private
	*/
	labelChanged: function () {
		this.$.textItem.setLabel(this.label);
	},

	/**
	* @private
	*/
	textChanged: function () {
		this.$.textItem.setText(this.text);
	},

	/**
	* @private
	*/
	imageAlignRightChanged: function () {
		this.addRemoveClass('align-right', this.imageAlignRight);
	}
});
