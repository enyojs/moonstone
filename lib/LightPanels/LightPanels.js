var
	kind = require('enyo/kind'),
	LightPanels = require('enyo/LightPanels');

var
	Spotlight = require('spotlight');

var
	LightPanel = require('../LightPanel');

/**
* A light-weight panels implementation that has basic support for side-to-side transitions
* between child components.
*
* @class moon.LightPanels
* @extends enyo.LightPanels
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.LightPanels.prototype */ {

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
	indexChanged: function (previousIndex) {
		var panels = this.getPanels(),
			panelPrev = panels[previousIndex],
			panelNext = panels[this.index];

		if (panelPrev) {
			panelPrev.spotlightDisabled = true;
			if (this._hasSpotlightFocus) {
				Spotlight.unspot();
			}
		}
		if (panelNext) {
			panelNext.spotlightDisabled = false;
		}
		LightPanels.prototype.indexChanged.apply(this, arguments);
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