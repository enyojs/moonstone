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

	observers: [
		{path: 'generated', method: 'resetRendered'}
	],

	/**
	* @private
	*/
	openChanged: function () {
		if (this.open && this.renderOnShow && !this.showing && !this.generated) this.show();
		Drawer.prototype.openChanged.apply(this, arguments);
	},

	/**
	* Once the rendered phase completes, mark hasRendered to true. This helps work around
	* {@link module:enyo/Checkbox~Checkbox} firing onActivate events during it's rendered callback
	* that we don't want to interpret as user action.
	*
	* @private
	*/
	rendered: function () {
		Drawer.prototype.rendered.apply(this, arguments);
		this.hasRendered = true;
	},

	/**
	* When generated is set to false, reset hasRendered as well.
	*
	* @private
	*/
	resetRendered: function (was, is) {
		if (!is) this.hasRendered = false;
	}
});
