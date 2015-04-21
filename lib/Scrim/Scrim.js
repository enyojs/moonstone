require('moonstone');

var
	kind = require('enyo/kind'),
	Scrim = require('enyo/Scrim');

/**
* `moon.Scrim` is a Moonstone-styled {@link enyo.Scrim}
*
* @class moon.Scrim
* @extends enyo.Scrim
* @ui
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