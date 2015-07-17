require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/LabeledTextItem~LabeledTextItem} kind.
* @module moonstone/LabeledTextItem
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

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
		{from: 'text', to: '$.text.content'}
	],

	/**
	* @private
	*/
	components:[
		// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
		{name: 'headerContainer', kind: Control, classes: 'moon-labeledtextitem-header', components: [
			{name: 'header', kind: Marquee.Text, accessibilityDisabled: true}
		]},
		{name: 'text', classes: 'moon-labeledtextitem-text', accessibilityDisabled: true}
	]
});
