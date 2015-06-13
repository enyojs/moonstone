require('moonstone');

/**
* Contains the declaration for the {@link moon.MarqueeSupport} mixin and the {@link moon.MarqueeText} &
* {@link moon.MarqueeDecorator} kinds.
* @module moonstone/Marquee
*/

var 
	exports = module.exports = {};

/**
* Fires to queue up a list of child animations.
*
* @event moon.MarqueeSupport#onRequestMarquee
* @type {Object}
* @property {Object} originator - A reference to the originator of this event.
* @property {Boolean} marqueePause - The desired duration in milliseconds that the
* marquee will pause at the end of the animation, before resetting to the beginning.
* @property {Number} marqueeSpeed - The desired speed for the marquee animation,
* in pixels per second.
* @private
*/

/**
* Fires to start marquee animation in a child marquee.
*
* @event moon.MarqueeSupport#onRequestMarqueeStart
* @type {Object}
* @property {Object} originator - A reference to the originator of this event.
* @private
*/

/**
* Fires to halt marquee animation in a child marquee.
*
* @event moon.MarqueeSupport#onRequestMarqueeStop
* @type {Object}
* @property {Object} originator - A reference to the originator of this event.
* @private
*/

/**
* Fires to enable animation in a child marquee. No additional data is sent with this event.
*
* @event moon.MarqueeSupport#onRequestMarqueeEnable
* @type {Object}
* @private
*/

/**
* Fires to disable animation in a child marquee. No additional data is sent with this event.
*
* @event moon.MarqueeSupport#onRequestMarqueeDisable
* @type {Object}
* @private
*/

/**
* Fires when marquee ends. No additional data is sent with this event.
*
* @event moon.MarqueeItem#onMarqueeEnded
* @type {Object}
* @private
*/

/**
* The {@link moon.MarqueeSupport} [mixin]{@glossary mixin} should be used with controls
* that contain multiple marquees whose animation behavior should be synchronized. Calling
* [this.startMarquee()]{@link moon.MarqueeSupport#startMarquee} or
* [this.stopMarquee()]{@link moon.MarqueeSupport#stopMarquee} will start or stop all
* contained marquees.
*
* The following properties, defined on the base kind to which the mixin is applied,
* control the marquee behavior:
*
* [marqueeOnSpotlight]{@link moon.MarqueeSupport#marqueeOnSpotlight}: When `true`, marquee
* starts when control is spotlight focused and ends when it is spotlight blurred.
*
* [marqueeOnHover]{@link moon.MarqueeSupport#marqueeOnHover}: When `true`, marquee runs
* while control is hovered over with the mouse. This property is ignored if
* `marqueeOnSpotlight` is `true`.
*
* [marqueeOnRender]{@link moon.MarqueeSupport#marqueeOnRender}: When `true`, marquee starts
* running as soon as control is rendered, and runs continuously.
*
* [marqueeSpeed]{@link moon.MarqueeSupport#marqueeSpeed}: The speed of the marquee animation,
* in pixels per second.
*
* [marqueeDelay]{@link moon.MarqueeSupport#marqueeDelay}: The delay between spotlight
* focus/hover and the start of the animation. (This is only used when either
* `marqueeOnSpotlight` or `marqueeOnHover` is `true`).
*
* [marqueeOnRenderDelay]{@link moon.MarqueeSupport#marqueeOnRenderDelay}: Used when you want
* the marquee to run on render, after a specified delay.
*
* [marqueePause]{@link moon.MarqueeSupport#marqueePause}: The duration in milliseconds that
* the marquee will pause at the end of the animation, before resetting to the beginning.
*
* @mixin moon.MarqueeSupport
* @definedby module:moonstone/Marquee
* @public
*/
var MarqueeSupport = exports.Support = require('./Support');

/**
* The {@link moon.MarqueeItem} mixin is used to add marquee animation functionality
* to a control.
*
* @mixin moon.MarqueeItem
* @definedby module:moonstone/Marquee
* @public
*/
var MarqueeItem = exports.Item = require('./Item');

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
exports.Text = require('./Text');

/**
* {@link moon.MarqueeDecorator} is a wrapper for {@link moon.MarqueeText} objects.
*
* @class moon.MarqueeDecorator
* @extends enyo.Control
* @mixes moon.MarqueeSupport
* @ui
* @definedby module:moonstone/Marquee
* @public
*/
exports.Decorator = require('./Decorator');
