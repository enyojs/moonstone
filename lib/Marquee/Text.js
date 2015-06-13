require('moonstone');

/**
* Contains the declaration for the {@link moon.MarqueeSupport} mixin and the {@link moon.MarqueeText} &
* {@link moon.MarqueeDecorator} kinds.
* @module moonstone/Marquee
*/

var 
	kind = require('enyo/kind');
	
var 
	Control = require('enyo/Control');

var 
	MarqueeItem = require('./Item');
/**
* {@link moon.MarqueeText} is a basic text control that supports marquee animation.
* When `moon.MarqueeText` objects are used inside a
* [moon.MarqueeDecorator]{@link moon.MarqueeDecorator}, the decorator synchronizes
* their start times; the user may start a marquee programmatically by calling
* [startMarquee()]{@link moon.MarqueeSupport#startMarquee}.
*
* ```
* enyo.kind({
* 	name: 'moon.Header',
* 	mixins: ['moon.MarqueeSupport'],
* 	marqueeSpeed: 100,
* 	components: [
* 		{kind: 'moon.MarqueeText', content: 'longText+longText'},
* 		{kind: 'moon.MarqueeText', content: 'longText'}
* 	],
* 	rendered: function () {
* 		this.startMarquee();
* 	}
* });
* ```
*
* To add the marquee feature to a kind, simply use the
* [MarqueeSupport]{@link moon.MarqueeSupport} mixin:
*
* ```
* enyo.kind({
* 	name: 'moon.MarqueeButton',
* 	kind: 'enyo.Button',
* 	mixins: ['moon.MarqueeSupport'],
* 	components: [
* 		{kind:'moon.MarqueeText'}
* 	],
* 	contentChanged: function () {
* 		this.$.marqueeText.setContent(this.content);
* 	}
* });
* ```
*
* @namespace moon
* @class moon.MarqueeText
* @extends enyo.Control
* @mixes moon.MarqueeItem
* @ui
* @definedby module:moonstone/Marquee
* @public
*/
module.exports = kind(
	/** @lends moon.MarqueeText.prototype */ {

	/**
	* @private
	*/
	name: 'moon.MarqueeText',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	mixins: [MarqueeItem],

	/**
	* @private
	* @lends moon.MarqueeText.prototype
	*/
	published: {

		/**
		* The speed of the marquee animation, in pixels per second.
		*
		* @type {Number}
		* @default 60
		* @public
		*/
		marqueeSpeed: 60,

		/**
		* The duration in milliseconds that the marquee will pause at the end of the
		* animation, before resetting to the beginning.
		*
		* @type {Number}
		* @default 1000
		* @public
		*/
		marqueePause: 1000,

		/**
		* When `true`, marqueeing will not occur.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		disabled: false,

		/**
		* When `true`, text is centered; otherwise, it is left-aligned.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		centered: false,

		/**
		* When `true`, element wraps instead of marqueeing.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		wrapInsteadOfMarquee: false
	}
});