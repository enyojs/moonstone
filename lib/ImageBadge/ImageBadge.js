require('moonstone');

var
	kind = require('enyo/kind');

var
	Icon = require('../Icon');

/**
* {@link moon.ImageBadge}, which derives from {@link moon.Icon}, is a simple
* control designed for use inside of {@link moon.Image}.
*
* @class moon.ImageBadge
* @extends moon.Icon
* @ui
* @public
*/

module.exports = kind(
	/** @lends moon.ImageBadge.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ImageBadge',

	/**
	* @private
	*/
	kind: Icon,

	/**
	* @private
	*/
	classes: 'moon-image-badge'
});