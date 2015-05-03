require('moonstone');

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	Img = require('enyo/Image');

var
	Item = require('../Item'),
	LabeledTextItem = require('../LabeledTextItem');

/**
* {@link moon.ImageItem}, which derives from {@link moon.Item}, is a control that combines an
* {@link enyo.Image} with a {@link moon.LabeledTextItem}. By default, the image is displayed to
* the left of the text; to display the image on the right, set
* [imageAlignRight]{@link moon.ImageItem#imageAlignRight} to `true`.
*
* @class moon.ImageItem
* @extends moon.Item
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.ImageItem.prototype */ {

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
	* @lends moon.ImageItem.prototype
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