require('moonstone');

var
	kind = require('enyo/kind');

var
	Item = require('../Item');

/**
* {@link moon.LabeledTextItem}, which extends {@link moon.Item}, is a
* [control]{@link enyo.Control} that combines text content with a text label.
*
* @class moon.LabeledTextItem
* @extends moon.Item
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.LabeledTextItem.prototype */ {

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
	classes: 'moon-labeledtextitem',

	/**
	* @private
	*/
	components:[
		{name: 'label', classes: 'label'},
		{name: 'text', classes: 'text'}
	],

	/**
	* @private
	*/
	create: function() {
		Item.prototype.create.apply(this, arguments);
		this.labelChanged();
		this.textChanged();
	},
	
	/**
	* @private
	* @lends moon.LabeledTextItem.prototype
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
		{from: '.allowHtml', to: '.$.label.allowHtml'},
		{from: '.allowHtml', to: '.$.text.allowHtml'}
	],

	/**
	* @private
	*/
	labelChanged: function() {
		this.$.label.setContent(this.label);
	},
	
	/**
	* @private
	*/
	textChanged: function() {
		this.$.text.setContent(this.text);
	}
});