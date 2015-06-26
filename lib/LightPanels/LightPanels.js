/**
* Contains the declaration for the {@link module:moonstone/LightPanels~LightPanels} kind.
* @module moonstone/LightPanels
*/

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
	defaultKind: LightPanel,

	/**
	* @private
	*/
	handlers: {
		onSpotlightContainerEnter: 'enter',
		onSpotlightContainerLeave: 'leave'
	},

	/**
	* Changes to the specific index, accepting a number of additional options.
	*
	* @param {Number} to - The index of the panel we wish to transition to.
	* @param {module:enyo/LightPanels~UpdateIndexOptions} [opts] - Additional options to be used
	*	when updating the panel index.
	* @param {Number} [from] - If known, the index we are transitioning from.
	* @public
	*/
	updateIndex: function (to, opts, from) {
		from = from != null ? from : this.index;

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

		LightPanels.prototype.updateIndex.apply(this, arguments);
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
