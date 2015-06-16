require('moonstone');

/**
* Contains the declaration for the {@link moon.ExpandableListDrawer} kind.
* @module moonstone/ExpandableListDrawer
*/

var
	kind = require('enyo/kind'),
	Drawer = require('enyo/Drawer');

var
	options = require('../options');

/**
* @namespace moon 
* @class moon.ExpandableListDrawer
* @extends enyo.Control
* @ui
* @definedby module:moonstone/ExpandableListDrawer
* @public
*/
module.exports = kind(
	/** @lends moon.ExpandableListDrawer.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ExpandableListDrawer',

	/**
	* @private
	*/
	kind: Drawer,

	/**
	* @private
	*/
	open: false,

	/**
	* @private
	*/
	renderOnShow: options.renderOnShow && options.renderOnShow.expandableListDrawer,

	/**
	* @private
	*/
	openChanged: function () {
		if (this.open && this.renderOnShow && !this.showing && !this.generated) this.show();
		Drawer.prototype.openChanged.apply(this, arguments);
	}
});
