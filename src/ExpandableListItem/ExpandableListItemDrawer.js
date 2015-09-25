/**
* Contains the declaration for the {@link module:moonstone/ExpandableListItem~ExpandableListItemDrawer} kind.
* @module moonstone/ExpandableListItem
*/

var
	kind = require('enyo/kind'),
	Drawer = require('enyo/Drawer');

var
	options = require('../options');

/**
* @class ExpandableListItemDrawer
* @extends module:enyo/Drawer~Drawer
* @ui
* @private
*/
module.exports = kind(
	/** @lends module:moonstone/ExpandableListItem~ExpandableListItemDrawer.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ExpandableListItemDrawer',

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
	spotlight: 'container',

	/**
	* @private
	*/
	spotlightRememberFocus: false,

	/**
	* @private
	*/
	renderOnShow: options.renderOnShow && options.renderOnShow.expandableListDrawer,

	/**
	* @private
	*/
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
	},

	// Accessibility

	/**
	* @private
	*/	
	ariaObservers: [
		{from: 'open', method: function () {
			this.setAriaAttribute('aria-hidden', this.open ? null : 'true');
		}}
	]
});
