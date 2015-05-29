require('moonstone');

var
	kind = require('enyo/kind');

var
	Icon = require('../Icon');

/**
* {@link module:moonstone/ImageBadge~ImageBadge}, which derives from {@link module:moonstone/Icon~Icon}, is a simple
* control designed for use inside of {@link module:moonstone/Image~Image}.
*
* @class ImageBadge
* @extends module:moonstone/Icon~Icon
* @ui
* @public
*/

module.exports = kind(
	/** @lends module:moonstone/ImageBadge~ImageBadge.prototype */ {

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
