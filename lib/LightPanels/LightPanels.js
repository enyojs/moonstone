/**
* Contains the declaration for the {@link module:moonstone/LightPanels~LightPanels} kind.
* @module moonstone/LightPanels
*/

var
	kind = require('enyo/kind'),
	LightPanels = require('enyo/LightPanels'),
	options = require('enyo/options');

var
	Spotlight = require('spotlight');

var
	LightPanel = require('../LightPanel'),
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
	defaultKind: LightPanel,

	/**
	* @private
	*/
	handlers: {
		onSpotlightContainerEnter: 'enter',
		onSpotlightContainerLeave: 'leave'
	},

	/**
	* @private
	*/
	animateTo: function (index) {
		this.updateSpottability(this.index, index);
		LightPanels.prototype.animateTo.apply(this, arguments);
	},

	/**
	* @private
	*/
	indexChanged: function (was, is) {
		this.updateSpottability(was, is);
		LightPanels.prototype.indexChanged.apply(this, arguments);
	},

	/**
	* @private
	*/
	updateSpottability: function (from, to) {
		var panels = this.getPanels(),
			panelPrev = panels[from],
			panelNext = panels[to];

		if (panelPrev) {
			panelPrev.spotlightDisabled = true;
			if (this._hasSpotlightFocus) {
				Spotlight.unspot();
			}
		}
		if (panelNext) {
			panelNext.spotlightDisabled = false;
		}
	},

	/**
	* @private
	*/
	enter: function () {
		this._hasSpotlightFocus = true;
	},

	/**
	* @private
	*/
	leave: function () {
		this._hasSpotlightFocus = false;
	}

});
