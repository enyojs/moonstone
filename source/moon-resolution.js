(function(enyo, scope) {

	var baseScreenType = 'fhd',
		riRatio,
		screenType,
		screenTypeObject,
		oldScreenType;

	var getScreenTypeObject = function (type, ignoreCache) {
		type = type || screenType;
		if (screenTypeObject && screenTypeObject.name == type) {
			return screenTypeObject;
		}
		var types = scope.moon.ri.screenTypes;
		return types.filter(function (elem) {
			return (type == elem.name);
		})[0];
	};

	/**
	* @private
	*/
	scope.moon = scope.moon || {};

	/**
	* @namespace moon.ri
	*/
	scope.moon.ri = {
		/**
		* A hash-store of all of our detectable screen types in incrementing sizes.
		*
		* @public
		*/
		screenTypes: [
			{name: 'hd',      pxPerRem: 16, width: 1280, height: 720,  aspectRatioName: 'hdtv'},
			{name: 'fhd',     pxPerRem: 24, width: 1920, height: 1080, aspectRatioName: 'hdtv', base: true},
			{name: 'uw-uxga', pxPerRem: 24, width: 2560, height: 1080, aspectRatioName: 'cinema'},
			{name: 'uhd',     pxPerRem: 48, width: 3840, height: 2160, aspectRatioName: 'hdtv'}
		],

		/**
		* Fetches the best-matching screen type name for the current screen size. The "best" screen type
		* is determined by the screen type name that is the closest to the screen resolution without
		* going over. ("The Price is Right" style.)
		*
		* @param {Object} [rez] - Optional measurement scheme. Must have "height" and "width" properties.
		* @returns {String} Screen type, like "fhd", "uhd", etc.
		* @name moon.$L
		* @public
		*/
		getScreenType: function (rez) {
			rez = rez || {
				height: scope.innerHeight,
				width: scope.innerWidth
			};
			var i,
				types = this.screenTypes,
				bestMatch = types[types.length - 1].name;

			// loop thorugh resolutions
			for (i = types.length - 1; i >= 0; i--) {
				// find the one that matches our current size or is smaller. default to the first.
				if (rez.width <= types[i].width) {
					bestMatch = types[i].name;
				}
			}
			// return the name of the resolution if we find one.
			return bestMatch;
		},

		updateScreenTypeOnBody: function (type) {
			type = type || screenType;
			if (oldScreenType) {
				enyo.dom.removeClass(document.body, 'moon-res-' + oldScreenType.toLowerCase());
				enyo.dom.removeClass(document.body, 'enyo-res-' + oldScreenType.toLowerCase());
				var oldScrObj = getScreenTypeObject(oldScreenType);
				if (oldScrObj.aspectRatioName) {
					enyo.dom.removeClass(document.body, 'enyo-aspect-ratio-' + oldScrObj.aspectRatioName.toLowerCase());
				}
			}
			if (type) {
				enyo.dom.addBodyClass('moon-res-' + type.toLowerCase());
				enyo.dom.addBodyClass('enyo-res-' + type.toLowerCase());
				var scrObj = getScreenTypeObject(type);
				if (scrObj.aspectRatioName) {
					enyo.dom.addBodyClass('enyo-aspect-ratio-' + scrObj.aspectRatioName.toLowerCase());
				}
				return type;
			}
		},

		getRiRatio: function (type) {
			type = type || screenType;
			if (type) {
				return this.getUnitToPixelFactors(type) / this.getUnitToPixelFactors(baseScreenType);
			}
			return 1;
		},

		getUnitToPixelFactors: function (type) {
			type = type || screenType;
			if (type) {
				return getScreenTypeObject(type).pxPerRem;
			}
			return 1;
		},

		/**
		* Calculates the aspect ratio of the screen type provided. If none is provided the current
		* screen type is used.
		*
		* @param {String} type Screen type to get the aspect ratio of. Providing nothing uses the
		*	current screen type.
		* @returns {Number} The calculated screen ratio (1.333, 1.777, 2.333, etc)
		* @public
		*/
		getAspectRatio: function (type) {
			var scrObj = getScreenTypeObject(type);
			if (scrObj.width && scrObj.height) {
				return (scrObj.width / scrObj.height);
			}
			return 1;
		},

		/**
		* Returns the name of the aspect ration given the screen type or the default screen type if
		* none is proided.
		*
		* @param {String} type Screen type to get the aspect ratio of. Providing nothing uses the
		*	current screen type.
		* @returns {String} The name of the type of screen ratio
		* @public
		*/
		getAspectRatioName: function (type) {
			var scrObj = getScreenTypeObject(type);
			 return scrObj.aspectRatioName || 'standard';
		},

		scale: function (px) {
			return (riRatio || this.getRiRatio()) * px;
		},

		/**
		* The default configurable [options]{@link enyo.Model#options} used in certain API methods of
		* {@link enyo.Model}.
		*
		* @typedef {Object} moon.ri.selectSrc~src
		* @property {String} hd - HD / 720p Resolution image asset source URI/URL
		* @property {String} fhd - FHD / 1080p Resolution image asset source URI/URL
		* @property {String} uhd - UHD / 4K Resolution image asset source URI/URL
		*
		* @typedef {String} moon.ri.selectSrc~src - Image asset source URI/URL
		*/

		/**
		* Image src chooser. A simple utility method to select the ideal image asset from a set of
		* assets, based on various screen resolutions: HD (720p), FHD (1080p), UHD (4k). When provided
		* with a src argument, multiResSrc will choose the best image with respect to the current screen
		* resolution. `src` may be either the traditional string, which will pass straight through, or a
		* hash/object of screen types and their asset sources (keys:screen and values:src). The image
		* sources will be used chosen when the screen resolution is less than or equal to the provided
		* screen types.
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
		* @param {(String|moon.ri.selectSrc~src)} src A string containing a single image src or a
		*	key/value hash/object containing keys representing screen types (hd, fhd, uhd, etc) and
		*	values containing the asset src for that target screen resolution.
		* @returns {String} The choosen src given the string or list provided.
		* @public
		*/
		selectSrc: function (src) {
			if (typeof src != 'string' && src) {
				var i, t,
					newSrc = src.fhd || src.uhd || src.hd,
					types = this.screenTypes;

				// loop through resolutions
				for (i = types.length - 1; i >= 0; i--) {
					t = types[i].name;
					if (screenType == t && src[t]) newSrc = src[t];
				}

				src = newSrc;
			}
			return src;
		},

		init: function () {
			oldScreenType = screenType;
			screenType = this.getScreenType();
			screenTypeObject = getScreenTypeObject();
			this.updateScreenTypeOnBody();
			enyo.dom.unitToPixelFactors.rem = scope.moon.getUnitToPixelFactors();
			riRatio = this.getRiRatio();
		}
	};

	// Aliased for 2.5-gordon
	scope.moon.getScreenType             = scope.moon.ri.getScreenType;
	scope.moon.updateScreenTypeOnBody    = scope.moon.ri.updateScreenTypeOnBody;
	scope.moon.getRiRatio                = scope.moon.ri.getRiRatio;
	scope.moon.getUnitToPixelFactors     = scope.moon.ri.getUnitToPixelFactors;
	scope.moon.riScale                   = scope.moon.ri.scale;

	// This will need to be re-run any time the screen size changes, so all the values can be re-cached.
	scope.moon.ri.init();

})(enyo, this);
