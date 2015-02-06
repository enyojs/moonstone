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
	enyo.ri.defineScreenTypes([
		{name: 'hd',    pxPerRem: 16, height: 720,  width: 1280},
		{name: 'fhd',   pxPerRem: 24, height: 1080, width: 1920, base: true},
		{name: 'uhd',   pxPerRem: 48, height: 2160, width: 3840}
	]);

})(enyo, this);
