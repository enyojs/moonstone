(function(enyo, scope) {
	/**
	* Instantiates and loads [iLib]{@link ilib} and its resources.
	*
	* @private
	*/
	scope.moon = scope.moon || {};
	/**
	* A hash-store of all of our detectable screen types in incrementing sizes.
	*
	* @public
	*/

	// Screen types in incrementing sizes
	scope.moon.screenTypes = [
		{name: 'hd',    height: 720, width: 1280},
		{name: 'fhd',   height: 1080, width: 1920},
		{name: 'uhd',   height: 2160, width: 3840}
	];

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
	scope.moon.getScreenType = function (rez) {
		rez = rez || {
			height: scope.innerHeight,
			width: scope.innerWidth
		};
		var types = this.screenTypes,
			bestMatch = types[types.length - 1].name;

		// loop thorugh resolutions
		for (var i = types.length - 1; i >= 0; i--) {
			// find the one that matches our current size or is smaller. default to the first.
			if (rez.width <= types[i].width) {
				bestMatch = types[i].name;
			}
		}
		// return the name of the resolution if we find one.
		return bestMatch;
	};

})(enyo, this);
