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

MoonScrim.scrim = new Scrim.ScrimSingleton('moon.scrim', {floating: true, classes: 'moon-scrim moon-scrim-translucent'});
MoonScrim.scrimTransparent = new Scrim.ScrimSingleton('moon.scrimTransparent', {floating: true, classes: 'moon-scrim moon-scrim-transparent'});