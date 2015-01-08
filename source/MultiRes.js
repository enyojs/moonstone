(function (enyo, scope) {

	// List of all of the supported keys
	var screenTypes = ['hd', 'fhd', 'uhd'];

	/**
	* The default configurable [options]{@link enyo.Model#options} used in certain API methods
	* of {@link enyo.Model}.
	*
	* @typedef {Object} moon.MultiResSupport~src
	* @property {String} hd=undefined - HD / 720p Resolution image asset source URI/URL
	* @property {String} fhd=undefined - FHD / 1080p Resolution image asset source URI/URL
	* @property {String} uhd=undefined - UHD / 4K Resolution image asset source URI/URL
	*
	* @typedef {String} moon.MultiResSupport~src - Image asset source URI/URL
	*/

	/**
	* A simple mixin to provide a utility function for selecting the ideal image asset from a set
	* of assets, based on various screen resolutions: HD (720p), FHD (1080p), UHD (4k).
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
	* @mixin moon.MultiResSupport
	* @public
	*/

	/** @lends moon.MultiResSupport.prototype */
	moon.MultiResSupport = {

		/**
		* @private
		*/
		name: 'MultiResSupport',

		/**
		* Image src chooser. When provided with a src argument, multiResSrc will choose the best
		* image with respect to the current screen resolution. `src` may be either the traditional
		* string, which will pass straight through, or a hash/object of screen types and their asset
		* sources (keys:screen and values:src). The image sources will be used chosen when the
		* screen resolution is less than or equal to the provided screen types.
		*
		* @param {(String|moon.MultiResSupport~src)} src A string containing a single image src or
		*	a key/value hash/object containing keys representing screen types (hd, fhd, uhd, etc)
		*	and values containing the asset src for that target screen resolution.
		* @returns {String} The choosen src given the string or list provided.
		* @public
		*/
		multiResSrc: function (src) {
			var newSrc;
			if (typeof src != 'string' && src) {
				var screenType = moon.getScreenType();
				newSrc = src.fhd || src.uhd || src.hd;

				// Check each of the available resolutions for matches. Use it if found.
				var i, t;
				for (i = 0; i < screenTypes.length; i++) {
					t = screenTypes[i];
					if (screenType == t && src[t]) newSrc = src[t];
				}

				src = newSrc;
			}
			return src;
		}
	};

})(enyo, this);
