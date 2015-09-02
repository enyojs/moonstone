/**
* Contains the declaration for the {@link module:moonstone/LightPanels~LightPanels} kind.
* @module moonstone/LightPanels
*/

var
	kind = require('enyo/kind'),
	LightPanels = require('enyo/LightPanels'),
	options = require('enyo/options');

var
	LightPanel = require('./LightPanel'),
	LightPanelsAccessibilitySupport = require('./LightPanelsAccessibilitySupport');

/**
* A light-weight panels implementation that has basic support for side-to-side transitions
* between child components.
*
* @class LightPanels
* @extends module:enyo/LightPanels~LightPanels
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/LightPanels~LightPanels.prototype */ {

	/**
	* @private
	*/
	name: 'moon.LightPanels',

	/**
	* @private
	*/
	kind: LightPanels,

	/**
	* @private
	*/
	mixins: options.accessibility ? [LightPanelsAccessibilitySupport] : null,

	/**
	* @private
	*/
	classes: 'moon-light-panels',

	/**
	* @private
	*/
	defaultKind: LightPanel

});

module.exports.Panel = LightPanel;
module.exports.Direction = LightPanels.Direction;
module.exports.Orientation = LightPanels.Orientation;