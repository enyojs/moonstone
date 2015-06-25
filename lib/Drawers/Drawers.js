require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Drawers~Drawers} kind.
* @module moonstone/Drawers
*/

var
	kind = require('enyo/kind'),
	dispatcher = require('enyo/dispatcher'),
	Animator = require('enyo/Animator'),
	Control = require('enyo/Control'),
	Drawer = require('enyo/Drawer'),
	dom = require('enyo/dom'),
	Spotlight = require('spotlight');

var
	options = require('../options'),
	Icon = require('../Icon'),
	Item = require('../Item'),
	MoonHistory = require('../History'),
	HistorySupport = MoonHistory.HistorySupport;

var
	MoonDrawer = require('./Drawer');

/**
* {@link module:moonstone/Drawers~Drawers} is a container kind designed to hold a set of {@link module:moonstone/Drawer~Drawer}
* objects and client content. The [drawers]{@link module:moonstone/Drawers~Drawers#drawers} property accepts
* an array of Drawer controls. The associated handles are positioned in their own small
* drawer, centered at the top of the "dresser" (the region containing the array of Drawer
* controls and the activator nub).
*
* When a handle is selected, it opens the corresponding Drawer object's main drawer or
* control drawer, depending on how the Drawer object is configured. The control's child
* components may be of any kind.
*
* ```
* {
*	kind: 'moon.Drawers',
*	drawers: [
*		{
*			name: 'musicDrawer',
*			kind: 'moon.Drawer',
*			handle: {kind: 'moon.DrawerHandle', content: 'Handle'},
*			components: [
*				{content: 'Drawer Content'}
*			],
*			controlDrawerComponents: [
*				{content: 'Controls'}
*			]
*		}
*	],
*	components: [
*		{content: 'Content Area'}
*	]
* }
* ```
*
* @class Drawers
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Drawers~Drawers.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Drawers',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	mixins : [HistorySupport],

	/**
	* @private
	*/
	classes: 'moon-drawers enyo-fit',

	/**
	* @private
	* @lends module:moonstone/Drawers~Drawers.prototype
	*/
	published: {

		/**
		* Populate with an array of {@link module:moonstone/Drawer~Drawer} components.
		*
		* @type {Object[]}
		* @default null
		* @public
		*/
		drawers: null,

		/**
		* When using a font-based icon, the name of the icon to be used.
		* The following icon names are valid:
		*
		* 'drawer'
		* 'arrowlargeup'
		* 'arrowlargedown'
		* 'arrowlargeleft'
		* 'arrowlargeright'
		* 'arrowsmallup'
		* 'arrowsmalldown'
		* 'arrowsmallleft'
		* 'arrowsmallright'
		* 'closex'
		* 'check'
		* 'search'
		*
		* @type {String}
		* @default ''
		* @public
		*/
		icon: '',

		/**
		* URL specifying path to icon image.
		*
		* @type {String|module:enyo/resolution#selectSrc~src}
		* @default ''
		* @public
		*/
		src: ''
	},

	/**
	* Default icon displayed on drawer handle when open
	*
	* @type {String}
	* @default 'arrowsmalldown'
	* @private
	*/
	iconClosed: 'arrowsmalldown',

	/**
	* Default icon displayed on drawer handle when closed
	*
	* @type {String}
	* @default 'arrowsmallup'
	* @private
	*/
	iconOpen: 'arrowsmallup',

	/**
	* Cached value of the top position of the client area. Used for non-accelerated animation.
	*
	* @type {Number}
	* @default 0
	* @private
	*/
	clientTop: 0,

	/**
	* @private
	*/
	handlers: {
		//* Handlers to update the activator when the state of the contained drawers changes
		onActivate: 'drawerActivated',
		onDeactivate: 'drawerDeactivated',
		onSpotlightDown: 'spotDown',
		onSpotlightUp: 'spotUp'
	},

	/**
	* @private
	*/
	components: [
		{name: 'activator', kind: Control, classes: 'moon-drawers-activator', spotlight: true, ontap: 'activatorTapped', components: [
			{name: 'activatorIcon', kind: Icon, classes: 'moon-drawers-activator-icon', small: false}
		]},
		{name: 'handleContainer', kind: Drawer, classes: 'moon-drawers-handle-container', resizeContainer: false, open: false, spotlightDisabled: true, components: [
			{name: 'handles', kind: Control, classes: 'moon-neutral moon-drawers-handles'}
		]},
		{name: 'drawers', kind: Control, classes: 'moon-drawers-drawer-container'},
		{name: 'client', kind: Control, classes: 'moon-drawers-client'}
	],

	/**
	* @private
	*/
	eventsToCapture: {
		ontap: 'captureTapSelect',
		onSpotlightFocus: 'captureSpotFocus',
		onSpotlightSelect: 'captureTapSelect'
	},

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.drawers = this.$.drawers.createComponents(this.drawers, {kind: MoonDrawer, owner: this.owner});
		if (!options.accelerate) this.createComponent({name: 'animator', kind: Animator, onStep: 'animationStep'});
		this.setupHandles();
		this.updateActivator();
	},

	/**
	* @private
	*/
	rendered: function () {
		Control.prototype.rendered.apply(this, arguments);
		this.updateDrawerHeight();
	},

	/**
	* @private
	*/
	destroy: function () {
		var i,
			c$ = this.drawers;
		dispatcher.release(this.$.handleContainer);
		for (i = 0; i < c$.length; i++) {
			dispatcher.release(c$[i]);
		}
		Control.prototype.destroy.apply(this, arguments);
	},

	/**
	* @private
	*/
	srcChanged: function () {
		this.updateActivator();
	},

	/**
	* @private
	*/
	iconChanged: function () {
		this.updateActivator();
	},

	/**
	* @private
	*/
	setupHandles: function () {
		var i, len, handle,
			def = {kind: Item, owner: this},
			tap = this.bindSafely(this.handleTapped);

		for (i = 0, len = this.drawers.length; i < len; i++) {
			handle = this.$.handles.createComponent(this.drawers[i].handle || {}, def);
			handle.addClass('moon-drawers-handle');
			handle.tap = tap;
		}
	},

	/**
	* Updates the icon and styling of the activator for the state of the drawer
	*
	* @param {Boolean} open Drawer state
	* @private
	*/
	updateActivator: function (open) {
		var icon, src;

		if (open) {
			src = '';
			icon = this.iconOpen;
		} else {
			src = this.src;
			icon = (src && !icon) ? '' : (this.icon || this.iconClosed);
		}

		this.$.activator.addRemoveClass('open', open);
		this.$.activatorIcon.set('src', src);
		this.$.activatorIcon.set('icon', icon);
	},

	/**
	* Inform each drawer of the total available height
	*
	* @private
	*/
	updateDrawerHeight: function () {
		var dh = document.body.getBoundingClientRect().height,
			drawer, i;
		for (i = this.drawers.length - 1; i >= 0; --i) {
			drawer = this.drawers[i];
			if (drawer instanceof MoonDrawer) drawer.set('fullHeight', dh);
		}
	},

	/**
	* @private
	*/
	activatorTapped: function () {
		var handles;
		if (this.isDrawerOpen()) {
			this.closeDrawers();
		} else {
			handles = this.$.handles.getControls();
			if (handles.length == 1) {
				this.openDrawer(handles[0]);
				this.updateActivator(true);
			} else if (this.$.handleContainer.getOpen()) {
				this.closeHandleContainer();
			} else {
				this.openHandleContainer();
			}
		}
	},

	/**
	* @private
	*/
	openHandleContainer: function () {
		this.$.handleContainer.spotlightDisabled = false;
		this.$.handleContainer.setOpen(true);
		this.updateActivator(true);
		dispatcher.capture(this.$.handleContainer, this.eventsToCapture, this);
		if (this.allowBackKey) {
			this.pushBackHistory();
		}
	},

	/**
	* @private
	*/
	closeHandleContainer: function () {
		dispatcher.release(this.$.handleContainer);
		this.$.handleContainer.spotlightDisabled = true;
		this.$.handleContainer.setOpen(false);
		this.updateActivator(this.isDrawerOpen());
	},

	/**
	* @private
	*/
	handleTapped: function (sender, ev) {
		this.openDrawer(ev.originator);
		return true;
	},

	/**
	* @private
	*/
	openDrawer: function (handle) {
		var drawer,
			handles = this.$.handles.getControls();
		for (var index = 0; index < handles.length; ++index) {
			if (handle.isDescendantOf(handles[index])) {
				drawer = this.$.drawers.getControls()[index];
				drawer.show();
				drawer.toggleDrawer();
				this.closeHandleContainer();
				dispatcher.capture(drawer, this.eventsToCapture, this);
				return;
			}
		}
	},

	/**
	* @private
	*/
	isDrawerOpen: function () {
		var drawers = this.$.drawers.getControls();
		for (var index = 0; index < drawers.length; ++index) {
			if (drawers[index].get('open') || drawers[index].get('controlsOpen')) {
				return true;
			}
		}
		return false;
	},

	/**
	* @private
	*/
	closeDrawers: function () {
		var drawers = this.$.drawers.getControls();
		for (var index = 0; index < drawers.length; ++index) {
			var drawer = drawers[index];
			if (drawer.get('open') || drawer.get('controlsOpen')) {
				dispatcher.release(drawer);
				drawer.set('open', false);
				drawer.set('controlsOpen', false);
			}
		}
		this.$.client.spotlightDisabled = false;
		this.updateActivator(false);
		Spotlight.setPointerMode(false);
                Spotlight.spot(this.$.activator);
	},

	/**
	* @private
	*/
	captureSpotFocus: function (sender, ev) {
		// Only close drawers on 5-way focus in the client (not pointer focus)
		if (ev.dir && ev.dispatchTarget.isDescendantOf(this.$.client)) {
			this.closeDrawers();
			this.closeHandleContainer();
		}
	},

	/**
	* @private
	*/
	captureTapSelect: function (sender, ev) {
		// Any tap or select in the client area closes the dresser/drawer
		if (ev.dispatchTarget.isDescendantOf(this.$.client)) {
			this.closeDrawers();
			this.closeHandleContainer();
		}
	},

	/**
	* Animates the position of the client area when a drawer is opened or closed
	*
	* @private
	*/
	animate: function (height) {
		if (options.accelerate) {
			dom.transformValue(this.$.client, 'translateY', height + 'px');
		} else {
			this.$.animator.play({
				startValue: this.clientTop,
				endValue: height
			});
		}
	},

	/**
	* When `!options.accelerate`, this handles {@link enyo/Animator#event:onStep} to update the
	* position of the client area
	*
	* @private
	*/
	animationStep: function (sender, event) {
		// cache the last top value to be reused by animate() as the startValue
		this.clientTop = sender.value;
		this.$.client.setBounds({top: this.clientTop + 'px'});
	},

	/**
	* @private
	*/
	drawerActivated: function (sender, ev) {
		var drawer = ev.originator instanceof MoonDrawer ? ev.originator : null;
		if (drawer) {
			this.updateActivator(true);
			// show/hide() is expensive. Use spotlightDisabled feature instead
			this.$.client.spotlightDisabled = drawer.open;
			this.animate(ev.height);
		}
	},

	/**
	* @private
	*/
	drawerDeactivated: function (sender, ev) {
		var drawer = ev.originator instanceof MoonDrawer ? ev.originator : null;
		if (drawer) {
			if (!drawer.open && !drawer.controlsOpen) this.updateActivator(false);
			// show/hide() is expensive. Use spotlightDisabled feature instead
			this.$.client.spotlightDisabled = drawer.open;
			this.animate(ev.height);
		}
	},

	/**
	* @private
	*/
	handleResize: function () {
		Control.prototype.handleResize.apply(this, arguments);
		this.updateDrawerHeight();
		this.updateActivator(false);
	},

	/**
	* @private
	*/
	backKeyHandler: function () {
		this.closeHandleContainer();
		return true;
	}
});

module.exports.Drawer = MoonDrawer;
