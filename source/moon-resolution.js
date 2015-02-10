(function(enyo, scope) {
	// Aliased for early builds of 2.6-pre.1
	scope.moon = scope.moon || {};
	scope.moon.ri 						= enyo.ri;
	// Aliased for 2.5-gordon
	scope.moon.getScreenType            = enyo.ri.getScreenType;
	scope.moon.updateScreenTypeOnBody   = enyo.ri.updateScreenTypeOnBody;
	scope.moon.getRiRatio               = enyo.ri.getRiRatio;
	scope.moon.getUnitToPixelFactors    = enyo.ri.getUnitToPixelFactors;
	scope.moon.riScale                  = enyo.ri.scale;

	// Define all supported screen types in order of smallest to largest
	// Names based on  display resolutions: http://en.wikipedia.org/wiki/Graphics_display_resolution
	// Aspect ratios from: http://en.wikipedia.org/wiki/Aspect_ratio_(image)
	enyo.ri.defineScreenTypes([
		{name: 'hd',      pxPerRem: 16, width: 1280, height: 720,  aspectRatioName: 'hdtv'},
		{name: 'fhd',     pxPerRem: 24, width: 1920, height: 1080, aspectRatioName: 'hdtv', base: true},
		{name: 'uw-uxga', pxPerRem: 24, width: 2560, height: 1080, aspectRatioName: 'cinema'},
		{name: 'uhd',     pxPerRem: 48, width: 3840, height: 2160, aspectRatioName: 'hdtv'}
	]);

})(enyo, this);
