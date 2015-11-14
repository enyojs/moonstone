require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/LabeledTextItem~LabeledTextItem} kind.
* @module moonstone/LabeledTextItem
*/

var
	kind = require('enyo/kind');

var
	Item = require('../Item'),
	Marquee = require('../Marquee');

/**
* {@link module:moonstone/LabeledTextItem~LabeledTextItem}, which extends {@link module:moonstone/Item~Item}, is a
* [control]{@link module:enyo/Control~Control} that combines text content with a text label and
* marquees it.
*
* @class LabeledTextItem
* @extends module:moonstone/Item~Item
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/LabeledTextItem~LabeledTextItem.prototype */ {

	/**
	* @private
	*/
	name: 'moon.LabeledTextItem',

	/**
	* @private
	*/
	kind: Item,

	/**
	* @private
	*/
	mixins: [Marquee.Support],

	/**
	* @private
	*/
	classes: 'moon-labeledtextitem',

	/**
	* @private
	* @lends module:moonstone/LabeledTextItem~LabeledTextItem.prototype
	*/
	published: {

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
		text: ''
	},

	/**
	* @private
	*/
	bindings: [
		{from: 'label', to: '$.header.content'},

		// Accessibility
		{from: '_accessibilityText', to: '$.text.accessibilityLabel'}
	],

	/**
	* @private
	*/
	components:[
		{name: 'header', kind: Marquee.Text, classes: 'moon-labeledtextitem-header'},
		{name: 'text', classes: 'moon-labeledtextitem-text'}
	],

	/**
	* @private
	*/
	create: function () {
		Item.prototype.create.apply(this, arguments);
		this.textChanged();
	},

	/**
	/* @private
	*/
	textChanged: function () {
		var validValue = this.text || this.text === 0;
		this.addRemoveClass('with-text', validValue);
		this.$.text.set('content', this.text);
		if (validValue) this.$.text.detectTextDirectionality(this.text);
	},

	// Accessibility

	/**
	* @private
	*/
	_accessibilityText: '',

	/**
	* @private
	*/
	ariaObservers: [
		{path: ['label', 'text', 'accessibilityHint', 'accessibilityLabel'], method: function () {
			var text = this._accessibilityText ? this._accessibilityText : this.text,
				content = this.label + ' ' + text ,
				prefix = this.accessibilityLabel || content || null,
				label = this.accessibilityHint && prefix && (prefix + ' ' + this.accessibilityHint) ||
						this.accessibilityHint ||
						this.accessibilityLabel ||
						null;

				this.setAriaAttribute('aria-label', label);
		}}
	]
});
