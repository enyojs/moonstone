require('moonstone');

/**
* Contains the declaration for the {@link moon.Drawer} and {@link moon.FullScreenDrawer} kinds.
* @module moonstone/Drawer
*/

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	utils = require('enyo/utils'),
	Animator = require('enyo/Animator'),
	Control = require('enyo/Control');

var
	FittableRows = require('layout/FittableRows');

var
	Spotlight = require('spotlight');

var
	options = require('../options'),
	MoonHistory = require('../History'),
	HistorySupport = MoonHistory.HistorySupport;

/**
* Fires when either the main drawer or the control drawer is activated. No event-specific
* data is sent with this event.
*
* @event moon.Drawer#onActivate
* @type {Object}
* @public
*/

/**
* Fires when either the main drawer or the control drawer is deactivated. No event-specific
* data is sent with this event.
*
* @event moon.Drawer#onDeactivate
* @type {Object}
* @public
*/

/**
* Fires when either the main drawer or the control drawer completes it animation. No event-specific
* data is sent with this event.
*
* @event moon.Drawer#onDrawerAnimationEnd
* @type {Object}
* @public
*/

/**
* {@link moon.Drawer}, a control designed for use with {@link moon.Drawers},
* consists of two drawers and a handle.
* The main drawer is populated with any child components that are specified in
* the constructor; the optional second drawer (control drawer) is populated
* with components passed into the
* [controlDrawerComponents]{@link moon.Drawer#controlDrawerComponents} property.
*
* If the second drawer has no components, the main drawer will take up the full
* height of the containing view; otherwise, its height will be equal to the
* height of the containing view minus the height of the `controlDrawerComponents`.
*
* A call to [toggleDrawer()]{@link moon.Drawer#toggleDrawer} will open or close
* the control drawer if `controlDrawerComponents` is non-empty; otherwise, it will
* open or close the main drawer.
*
* The control's child components may be of any kind.
*
* ```
*		{
*			name: 'musicDrawer',
*			kind: 'moon.Drawer',
*			handle: {name: 'handleButton', content: 'Handle'},
*			components: [
*				{content: 'Drawer Content'}
*			],
*			controlDrawerComponents: [
*				{content: 'Controls'}
*			]
*		}
* ```
*
* @class moon.Drawer
* @extends enyo.Control
* @ui
* @definedby module:moonstone/Drawers
* @public
*/
var MoonDrawer = module.exports = kind(
	/** @lends moon.Drawer.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Drawer',

	/**
	* @private
	*/
	kind: FittableRows,

	/**
	* @private
	*/
	mixins: [HistorySupport],

	/**
	* @private
	*/
	classes: 'moon-drawer moon-neutral enyo-fit',

	/**
	* Components that are to be placed in the control drawer.
	*
	* @type {Object}
	* @default null
	* @public
	*/
	controlDrawerComponents: null,

	/**
	* Control that acts a "handle" for the drawer.
	*
	* @type {Object}
	* @default null
	* @public
	*/
	handle: null,

	/**
	* Visibility state of the main drawer.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	open: false,

	/**
	* Visibility state of the control drawer.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	controlsOpen: false,

	/**
	* Available height for a fully displayed drawer
	*
	* @type {Number}
	* @default 0
	* @public
	*/
	fullHeight: 0,

	/**
	* @private
	*/
	events: {

		/**
		* {@link moon.Drawer#onActivate}
		*/
		onActivate: '',

		/**
		* {@link moon.Drawer#onDeactivate}
		*/
		onDeactivate: '',

		/**
		* {@link moon.Drawer#onDrawerAnimationEnd}
		*/
		onDrawerAnimationEnd: ''
	},

	/**
	* @private
	*/
	handlers: {
		ontransitionend: 'transitionEnded',
		onwebkittransitionend: 'transitionEnded'
	},

	/**
	* @private
	*/
	components: [
		{name: 'client', kind: Control, fit: true, classes: 'moon-drawer-client', spotlightDisabled: true},
		{name: 'controlDrawer', kind: Control, classes: 'moon-drawer-partial-client', spotlightDisabled: true}
	],

	/**
	* @private
	*/
	initComponents: function () {
		FittableRows.prototype.initComponents.apply(this, arguments);
		this.$.controlDrawer.createComponents(this.controlDrawerComponents, {owner: this.owner});
		if (!options.accelerate) this.createComponent({name: 'animator', kind: Animator, onStep: 'animationStep', onEnd: 'animationComplete'});
	},

	/**
	* @private
	*/
	reflow: function () {
		FittableRows.prototype.reflow.apply(this, arguments);
		this.calcDrawerHeight();
		this.updatePosition();
	},

	/**
	* If [controlDrawerComponents]{@link moon.Drawer#controlDrawerComponents} is
	* non-empty, toggles the visibility state of the control drawer; otherwise,
	* toggles the visibility state of the main drawer.
	*
	* @public
	*/
	toggleDrawer: function () {
		if (this.controlDrawerComponents == null) {
			this.set('open', !this.open);
		} else {
			this.set('controlsOpen', !this.controlsOpen);
		}
		return true;
	},

	/**
	* @fires moon.Drawer#onActivate
	* @fires moon.Drawer#onDeactivate
	* @private
	*/
	openChanged: function () {
		if (this.open) {
			this.showAndUpdatePosition();
			this.doActivate({height: this.fullHeight});
			this.$.client.spotlightDisabled = false;
			Spotlight.spot(this.$.client);
			if (this.allowBackKey) {
				this.pushBackHistory();
			}
		} else {
			this.$.client.spotlightDisabled = true;
			this.doDeactivate({height: this.controlsOpen ? this.controlDrawerHeight : 0});
		}
		this.animatePosition();
	},

	/**
	* @fires moon.Drawer#onActivate
	* @fires moon.Drawer#onDeactivate
	* @private
	*/
	controlsOpenChanged: function () {
		if (this.controlsOpen) {
			this.showAndUpdatePosition();
			this.doActivate({height: this.controlDrawerHeight});
			this.$.controlDrawer.spotlightDisabled = false;
			Spotlight.spot(this.$.controlDrawer);
			if (this.allowBackKey) {
				this.pushBackHistory();
			}
		} else {
			this.$.controlDrawer.spotlightDisabled = true;
			this.doDeactivate({height: 0});
		}
		this.animatePosition();
	},

	showAndUpdatePosition: function () {
		if (this.renderOnShow == true && !this.hasNode()) {
			this.show();
			this.calcDrawerHeight();
			this.updatePosition();
		}
	},

	/**
	* @protected
	*/
	fullHeightChanged: function (was, is) {
		this.applyStyle('height', is + 'px');
		this.reflow();
		if (options.accelerate) {
			// first remove the class, so changes in fullHeight during resize aren't animated
			this.removeClass('moon-drawer-rendered');
			// then defer adding the rendered class so the initial transform isn't animated
			utils.asyncMethod(this, 'addClass', 'moon-drawer-rendered');
		}
	},

	/**
	* @private
	*/
	calcDrawerHeight: function () {
		var clientHeight = this.fullHeight,
			controlDrawerNode = this.$.controlDrawer.hasNode();
		if (this.controlDrawerComponents != null && !this.controlDrawerHeight) {
			this.controlDrawerHeight = this.controlDrawerHeight || (controlDrawerNode && controlDrawerNode.getBoundingClientRect().height) || 0;
			clientHeight -= this.controlDrawerHeight;
		}
		return clientHeight;
	},

	/**
	* @private
	*/
	calcTopPosition: function () {
		var top = this.fullHeight;
		if (this.open) {
			top = 0;
		} else if (this.controlsOpen) {
			top = this.fullHeight - this.controlDrawerHeight;
		}

		return -top;
	},

	/**
	* Updates the drawer position without animation. This does not prevent CSS transitions if used.
	*
	* @private
	*/
	updatePosition: function () {
		var top = this.calcTopPosition();
		this.updateTop(top);
	},

	/**
	* Called after {@link moon.Drawer#open} or {@link moon.Drawer#controlsOpen) changes to animate
	* the drawers position.
	*
	* @private
	*/
	animatePosition: function () {
		var bounds,
			top = this.calcTopPosition();

		// not accelerated and drawer has been rendered
		if (options.accelerate) {
			this.updateTop(top);
		} else {
			bounds = this.getBounds();
			this.$.animator.play({
				startValue: bounds.top,
				endValue: top
			});
		}
	},

	/**
	* @private
	*/
	animationStep: function (sender, event) {
		this.updateTop(sender.value);
	},

	/**
	* @private
	*/
	animationComplete: function (sender, event) {
		this.doDrawerAnimationEnd();
	},

	/**
	* Updates the top position of the drawer, either by CSS transform or CSS position
	*
	* @param  {Number} top Position where negative values push the drawer offscreen
	* @private
	*/
	updateTop: function (top) {
		if (options.accelerate) {
			dom.transformValue(this, 'translateY', top + 'px');
		} else {
			this.setBounds({
				top: top + 'px'
			});
		}
	},

	/**
	* Handles the ontransitionend event to fire the onDrawerAnimationEnd event
	*
	* @private
	*/
	transitionEnded: function (sender, event) {
		if (event.originator === this) this.doDrawerAnimationEnd();
	},

	/**
	* @private
	*/
	backKeyHandler: function () {
		if (this.open) {
			this.set('open', false);
		} else if (this.controlsOpen) {
			this.set('controlsOpen', false);
		}
		return true;
	},

	/**
	* @deprecated Backwards compatibility
	* @public
	*/
	setOpen: function (open) { this.set('open', open); },

	/**
	* @deprecated Backwards compatibility
	* @public
	*/
	getOpen: function () { return this.open; },

	/**
	* @deprecated Backwards compatibility
	* @public
	*/
	setControlsOpen: function (controlsOpen) { this.set('controlsOpen', controlsOpen); },

	/**
	* @deprecated Backwards compatibility
	* @public
	*/
	getControlsOpen: function () { return this.controlsOpen; }
});