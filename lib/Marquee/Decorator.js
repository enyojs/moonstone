require('moonstone');

/**
* Contains the declaration for the {@link moon.MarqueeSupport} mixin and the {@link moon.MarqueeText} &
* {@link moon.MarqueeDecorator} kinds.
* @module moonstone/Marquee
*/

var 
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var 
	MarqueeSupport = require('./Support');

module.exports = kind(
	/** @lends moon.MarqueeDecorator.prototype */ {

	/**
	* @private
	*/
	name: 'moon.MarqueeDecorator',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	mixins: [MarqueeSupport],

	/**
	* @private
	*/
	style: 'overflow: hidden;'
});
