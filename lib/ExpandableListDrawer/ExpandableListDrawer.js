var
	kind = require('enyo/kind'),
	Drawer = require('enyo/Drawer');

var
	options = require('../options');

/**
* @class moon.ExpandableListDrawer
* @extends enyo.Control
* @ui
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