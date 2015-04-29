require('moonstone');

var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	Control = require('enyo/Control');

var
	Marquee = require('../Marquee'),
	MarqueeItem = Marquee.Item,
	MarqueeSupport = Marquee.Support;

/**
* {@link moon.Divider} is a simply styled component that may be used as a separator
* between groups of components.
*
* @class moon.Divider
* @mixes moon.MarqueeSupport
* @mixes moon.MarqueeItem
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.Divider.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Divider',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'moon-divider moon-divider-text',

	/**
	* @private
	*/
	mixins: [MarqueeSupport, MarqueeItem],

	/**
	* @private
	*/
	marqueeOnSpotlight: false,

	/**
	* @private
	*/
	marqueeOnRender: true,

	/**
	* @private
	*/
	contentChanged: function () {
		this.content = this.content.split(' ').map(utils.cap).join(' ');
		Control.prototype.contentChanged.apply(this, arguments);
	}
});