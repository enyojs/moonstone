(function (enyo, scope) {
	/**
	* {@link moon.ImageMultiRes} is a direct replacement to {@link enyo.Image}
	*
	* Adds support for multi-resolution images. If you are developing assets for specific screen
	* sizes, HD (720p), FHD (1080p), UHD (4k), you may provide specific image assets in a
	* hash/object format to the `src` property, instead of the usual string. The image sources will
	* be used automatically when the screen resolution is less than or equal to those screen types.
	*
	* ```
	* // Take advantage of the multi-rez mode
	* {kind: 'moon.Image', src: {
	* 	'hd': 'http://lorempixel.com/64/64/city/1/',
	* 	'fhd': 'http://lorempixel.com/128/128/city/1/',
	* 	'uhd': 'http://lorempixel.com/256/256/city/1/'
	* }, alt: 'Multi-rez'},
	* // Standard string `src`
	* {kind: 'moon.Image', src: http://lorempixel.com/128/128/city/1/', alt: 'Large'},
	* ```
	*
	* @class moon.ImageMultiRes
	* @extends enyo.Image
	* @ui
	* @public
	*/

	enyo.kind(
		/** @lends moon.ImageMultiRes.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ImageMultiRes',

		/**
		* @private
		*/
		kind: 'enyo.Image',

		/**
		* @private
		*/
		classes: 'moon-image',

		/**
		* @private
		*/
		mixins: ['moon.MultiResSupport'],

		srcChanged: function () {
			this.src = this.multiResSrc(this.src);
			this.inherited(arguments);
		}
	});

})(enyo, this);