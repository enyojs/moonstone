require('moonstone');

/**
* Contains the declaration for the {@link moon.Scrim} kind.
* @module moonstone/Scrim
*/

var
	kind = require('enyo/kind'),
	Scrim = require('enyo/Scrim');

/**
* `moon.Scrim` is a Moonstone-styled {@link enyo.Scrim}
*
* @namespace moon
* @class moon.Scrim
* @extends enyo.Scrim
* @ui
* @definedby module:moonstone/Scrim
* @public
*/
var MoonScrim = module.exports = kind(
	/** @lends  moon.Scrim.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Scrim',

	/**
	* @private
	*/
	kind: Scrim,

	/**
	* @private
	*/
	classes: 'moon-scrim'
});

new Scrim.ScrimSingleton(MoonScrim, 'scrim', {floating: true, classes: 'moon-scrim moon-scrim-translucent'});
new Scrim.ScrimSingleton(MoonScrim, 'scrimTransparent', {floating: true, classes: 'moon-scrim moon-scrim-transparent'});
