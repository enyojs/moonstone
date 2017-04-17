/**
* Contains the declaration for the {@link module:moonstone/LightPanels~LightPanels} kind.
* @wip
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
* A lightweight panels implementation that has basic support for side-to-side transitions
* between child components.
*
* @class LightPanels
* @extends module:enyo/LightPanels~LightPanels
* @wip
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
	defaultKind: LightPanel,

	/**
	* @private
	*/
	addChild: function (control) {
		LightPanels.prototype.addChild.apply(this, arguments);
		if (control.parent === this.$.client) control.spotlightDisabled = true;
	},

	/**
	* @private
	*/
	setupTransitions: function (was) {
		this.updateSpottability(was, this.index);
		LightPanels.prototype.setupTransitions.apply(this, arguments);
	},

	/**
	* @private
	*/
	updateSpottability: function (from, to) {
		var panels = this.getPanels(),
			panelPrev = panels[from],
			panelNext = panels[to];

		if (panelPrev) panelPrev.spotlightDisabled = true;
		if (panelNext) panelNext.spotlightDisabled = false;
	},

	// Accessibility

	ariaObservers: [
		{path: 'index', method: function () {
			var panels = this.getPanels(),
				active = panels[this.index],
				l = panels.length,
				panel;

			while (--l >= 0) {
				panel = panels[l];
				if (panel instanceof LightPanel && panel.title) {
					panel.set('accessibilityRole', panel === active ? 'alert' : 'region');
				}
			}
		}}
	]

});

/**
* The {@link module:moonstone/LightPanels~LightPanel} kind export.
* @public
*/
module.exports.Panel = LightPanel;
module.exports.Direction = LightPanels.Direction;
module.exports.Orientation = LightPanels.Orientation;
