require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ExpandableListDrawer~ExpandableListDrawer} kind.
* @module moonstone/ExpandableListDrawer
*/

var
	kind = require('enyo/kind'),
	Drawer = require('enyo/Drawer');

var
	options = require('../options');

/**
* @class ExpandableListDrawer
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/ExpandableListDrawer~ExpandableListDrawer.prototype */ {

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
