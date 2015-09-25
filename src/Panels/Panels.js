require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Panels~Panels} kind.
* @module moonstone/Panels
*/

var
	kind = require('enyo/kind'),
	dispatcher = require('enyo/dispatcher'),
	dom = require('enyo/dom'),
	util = require('enyo/utils'),
	Control = require('enyo/Control'),
	EnyoHistory = require('enyo/History'),
	Img = require('enyo/Image'),
	Signals = require('enyo/Signals');

var
	Panels = require('layout/Panels');

var
	Spotlight = require('spotlight');

var
	options = require('../options'),
	BreadcrumbArranger = require('../BreadcrumbArranger'),
	Panel = require('../Panel'),
	StyleAnimator = require('../StyleAnimator'),
	HistorySupport = require('../HistorySupport');

/**
* `moon.PanelsHandle` is a helper kind for {@link module:moonstone/Panels~Panels} which implements a spottable
*  handle that the user can interact with to hide and show the `moon.Panels` control.
*
* @class PanelsHandle
* @extends module:enyo/Control~Control
* @ui
* @public
*/
var PanelsHandle = kind(
	/** @lends module:moonstone/PanelsHandle~PanelsHandle.prototype */ {

	/**
	* @private
	*/
	name: 'moon.PanelsHandle',

	/*
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	mixins: [HistorySupport],

	/*
	* @private
	*/
	classes: 'moon-panels-handle',

	/**
	* @private
	*/
	handlers: {
		ontap: 'handleTap'
	},

	/**
	* @private
	*/
	handleTap: function () {
		if (!EnyoHistory.isProcessing()) {
			this.pushBackHistory();
		}
	},

	/**
	* @private
	*/
	backKeyHandler: function () {
		this.bubble('ontap');
		return true;
	},

	/*
	* We override getAbsoluteShowing so that the handle's spottability is not dependent on the
	* showing state of its parent, the {@link module:moonstone/Panels~Panels} control.
	*
	* @private
	*/
	getAbsoluteShowing: function (ignoreBounds) {
		var bounds = !ignoreBounds ? this.getBounds() : null;

		if (!this.generated || this.destroyed || !this.showing || (bounds &&
			bounds.height === 0 && bounds.width === 0)) {
			return false;
		}

		return true;
	}
});

/**
* {@link module:moonstone/Panels~Panels} extends {@link module:layout/Panels~Panels}, adding support for 5-way focus
* (Spotlight) and pre-configured Moonstone panels design patterns. By default,
* controls added to a `moonstone/Panels` are instances of {@link module:moonstone/Panel~Panel}.
*
* `moonstone/Panels` introduces the concept of patterns for panel display. Set
* [pattern]{@link module:moonstone/Panels~Panels#pattern} to `'activity'` or `'alwaysViewing'`
* to use one of two patterns designed for apps on Smart TV systems.
*
* @class Panels
* @extends module:layout/Panels~Panels
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Panels~Panels.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Panels',

	/**
	* @private
	*/
	kind : Panels,

	/**
	* @private
	*/
	mixins : [HistorySupport],

	/**
	* @private
	*/
	classes : 'moon-panels',

	/**
	* @private
	*/
	spotlightDecorate : false,

	/**
	* @private
	* @lends module:moonstone/Panels~Panels.prototype
	*/
	published: {
		/**
		* A convenience property for configuring {@link module:moonstone/Panels~Panels} according to a
		* particular design pattern.  Valid values are `'none'` (default), `'activity'`,
		* and `'alwaysviewing'`. Note that this property may only be set at creation
		* time, and should not be changed at runtime.
		*
		* The `'alwaysviewing'` pattern uses the {@link module:moonstone/BreadcrumbArranger~BreadcrumbArranger},
		* with semi-transparent panels (depending on the color theme) over the right
		* half of the screen, allowing multiple breadcrumbs to accumulate on the left
		* half of the screen.
		*
		* The `'activity'` pattern  uses the `moonstone/BreadcrumbArranger` with opaque
		* panels over the full screen and only one breadcrumb showing onscreen.
		*
		* The `'none'` pattern should be used when selecting other arrangers, such as
		* {@link module:layout/CarouselArranger~CarouselArranger} or {@link module:layout/CardArranger~CardArranger}.
		*
		* @type {String}
		* @default 'none'
		* @public
		*/
		pattern: 'none',

		/**
		* When [useHandle]{@link module:moonstone/Panels~Panels#useHandle} is used, it is automatically
		* hidden after this amount of time (in milliseconds).
		*
		* @type {Number}
		* @default 4000
		* @public
		*/
		autoHideTimeout: 4000,

		/**
		* When `true`, a handle is created to allow the user to control the showing
		* state of the panels using animation. When `false`, no handle is created and
		* panels may only be hidden/shown programmatically with no animation.
		* When `'auto'` (the default), `useHandle` is set to `true` if the
		* [pattern]{@link module:moonstone/Panels~Panels#pattern} is `'alwaysviewing'` and to `false` if
		* the `pattern` is `'activity'`. Note that this property may only be set at
		* creation time, and should not be changed at runtime. This property
		* only has an effect when using the `'activity'` or `'alwaysviewing'` pattern.
		*
		* @type {String|Boolean}
		* @default 'auto'
		* @public
		*/
		useHandle: 'auto',

		/**
		* Dynamically controls whether the handle is showing.
		* When `true` (the default), the handle is shown and panels may be shown by
		* activating the handle and hidden by re-activating the handle or by tapping
		* outside the panel area. When `false`, the handle is hidden and panels may
		* only be shown or hidden programmatically using the
		* [showing]{@link module:enyo/Control~Control#showing} property or the
		* [show()]{@link module:enyo/Control~Control#show}/[hide()]{@link module:enyo/Control~Control#hide} API.
		* This property only has an effect when [useHandle]{@link module:moonstone/Panels~Panels#useHandle}
		* is `true` (or `'auto'`, resulting in `true`).
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		handleShowing: true,

		/**
		* When `true`, panels are automatically popped when the user moves back.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		popOnBack: false,

		/**
		* The source of the image used for branding in the lower left region of the Panels
		* (only applies to Panels using the `'activity'` pattern).
		*
		* @type {String|module:enyo/resolution#selectSrc~src}
		* @default ''
		* @public
		*/
		brandingSrc: ''
	},

	/**
	* @private
	*/
	narrowFit: false,

	/**
	* Hierachical stack.
	* When we call setIndex or pushPanel, new object is pushed to this stack.
	* When we call popPanel or back key handler, lasted object is removed.
	* To save memory, it is initiated when this.allowBackKey is true.
	*
	* @type {Array}
	* @default null
	* @private
	*/
	panelStack: null,

	/**
	* @private
	*/
	handlers: {
		ontap:						'tapped',

		onSpotlightRight:			'spotlightRight',
		onSpotlightLeft:			'spotlightLeft',
		onSpotlightUp:				'spotlightUp',
		onSpotlightDown:			'spotlightDown',
		onSpotlightFocus:			'spotlightFocus',
		onSpotlightContainerLeave:	'onSpotlightPanelLeave',
		onSpotlightContainerEnter:	'onSpotlightPanelEnter',

		onPreTransitionComplete:	'preTransitionComplete',
		onPostTransitionComplete:	'postTransitionComplete'
	},

	/**
	* @private
	*/
	handleTools: [
		{name: 'backgroundScrim', kind: Control, classes: 'moon-panels-background-scrim'},
		{name: 'clientWrapper', kind: Control, classes: 'enyo-fill enyo-arranger moon-panels-client', accessibilityPreventScroll: true, components: [
			{name: 'scrim', kind: Control, classes: 'moon-panels-panel-scrim', components: [
				{name: 'branding', kind: Img, sizing: 'contain', classes: 'moon-panels-branding'}
			]},
			{name: 'client', kind: Control, tag: null}
		]},
		{name: 'showHideHandle', kind: PanelsHandle, classes: 'hidden', canGenerate: false, ontap: 'handleTap', onSpotlightLeft: 'handleSpotLeft', onSpotlightRight: 'handleSpotRight', onSpotlightFocused: 'handleFocused', onSpotlightBlur: 'handleBlur', tabIndex: -1},
		{name: 'showHideAnimator', kind: StyleAnimator, onComplete: 'showHideAnimationComplete'}
	],

	/**
	* @private
	*/
	defaultKind: Panel,

	/**
	* When `false`, dragging is disabled.
	*
	* @private
	*/
	draggable: false,

	/**
	* Value may be between `0` and `1`, inclusive.
	*
	* @private
	*/
	panelCoverRatio: 1,

	/**
	* Will be `true` for 'activity' pattern, and `false` for 'alwaysviewing' pattern.
	*
	* @private
	*/
	showFirstBreadcrumb: false,

	/**
	* Default to using `moon.BreadcrumbArranger`.
	*
	* @private
	*/
	arrangerKind: BreadcrumbArranger,

	/**
	* Index of panel set in the middle of transition.
	*
	* @private
	*/
	queuedIndex: null,

	/**
	* Flag for initial transition.
	*
	* @private
	*/
	_initialTransition: true,

	/**
	* Flag for blocking consecutive push/pop/replace panel actions to protect
	* create/render/destroy time.
	*
	* @private
	*/
	isModifyingPanels: false,

	/**
	* Flag to indicate if the Panels are currently transitioning to a new index
	*
	* @private
	*/
	transitioning: false,

	/**
	* Checks the state of panel transitions.
	*
	* @return {Boolean} `true` if a transition between panels is currently in progress;
	* otherwise, `false`.
	* @public
	*/
	inTransition: function () {
		return this.transitioning;
	},

	/**
	* Creates a panel on top of the stack and increments index to select that component.
	*
	* @param {Object} info - The declarative {@glossary kind} definition.
	* @param {Object} moreInfo - Additional properties to be applied (defaults).
	* @return {Object} The instance of the panel that was created on top of the stack.
	* @public
	*/
	pushPanel: function (info, moreInfo) { // added
		if (this.transitioning || this.isModifyingPanels) {return null;}
		this.isModifyingPanels = true;
		var lastIndex = this.getPanels().length - 1,
			oPanel = this.createComponent(info, moreInfo);
		oPanel.render();
		this.reflow();
		oPanel.show();
		oPanel.resize();
		this.setIndex(lastIndex+1);
		this.isModifyingPanels = false;
		return oPanel;
	},

	/**
	* Options for the [moon.Panels.pushPanels()]{@link module:moonstone/Panels~Panels.pushPanels} method.
	*
	* @typedef {Object} moon.Panels.pushPanels~options
	* @property {Number} targetIndex - The panel index number to immediately switch to. Leaving
	*	this blank or not setting it will perform the default action, which transitions to the
	*	first of the new panels. Setting this to a negative and other "out of bounds" values
	*	work in conjunction with the `wrap: true` property. Negative values count backward from
	*	the end, while indices greater than the total Panels' panel length wrap around and start
	*	counting again from the beginning.
	* @property {Boolean} transition - Whether to transition or jump directly to the next panel.
	* @public
	*/

	/**
	* Creates multiple panels on top of the stack and updates index to select the last one
	* created. Supports an optional `options` object as the third parameter.
	*
	* @param {Object[]} info - The declarative {@glossary kind} definitions.
	* @param {Object} commonInfo - Additional properties to be applied (defaults).
	* @param {Object} options - Additional options for pushPanels.
	* @return {null|Object[]} Array of the panels that were created on top of the stack, or
	*	`null` if panels could not be created.
	* @public
	*/
	pushPanels: function(info, commonInfo, options) { // added
		if (this.transitioning || this.isModifyingPanels) { return null; }
		this.isModifyingPanels = true;

		if (!options) { options = {}; }
		var lastIndex = this.getPanels().length,
			oPanels = this.createComponents(info, commonInfo),
			nPanel;

		for (nPanel = 0; nPanel < oPanels.length; ++nPanel) {
			oPanels[nPanel].render();
		}
		this.reflow();
		if (options.targetIndex || options.targetIndex === 0) {
			lastIndex = options.targetIndex;
		}
		lastIndex = this.clamp(lastIndex);
		this.getPanels()[lastIndex].show();
		for (nPanel = 0; nPanel < oPanels.length; ++nPanel) {
			oPanels[nPanel].resize();
		}

		// If transition was explicitly set to false, since null or undefined indicate "never set" or unset
		if (options.transition === false) {
			this.setIndexDirect(lastIndex);
		} else {
			this.setIndex(lastIndex);
		}

		this.isModifyingPanels = false;
		return oPanels;
	},

	/**
	* Destroys panels whose index is greater than or equal to a specified value.
	*
	* @param {Number} index - Index at which to start destroying panels.
	* @public
	*/
	popPanels: function (index) {
		if (this.transitioning || this.isModifyingPanels) {return;}
		this.isModifyingPanels = true;
		var panels = this.getPanels();
		index = index || panels.length - 1;

		while (panels.length > index && index >= 0) {
			panels[panels.length - 1].destroy();
		}
		this.isModifyingPanels = false;
	},

	/**
	* Destroys specified panel and creates new panel in-place without transition effect.
	*
	* @param {Number} index - Index of panel to destroy.
	* @param {Object} info - The declarative {@glossary kind} definition.
	* @param {Object} moreInfo - Additional properties to be applied (defaults).
	* @public
	*/
	replacePanel: function (index, info, moreInfo) {
		if (this.transitioning || this.isModifyingPanels) {return;}
		this.isModifyingPanels = true;
		var oPanel = null;

		if (this.getPanels().length > index) {
			this.getPanels()[index].destroy();
			if (this.getPanels().length > index) {
				moreInfo = util.mixin({addBefore: this.getPanels()[index]}, moreInfo);
			}
		}
		oPanel = this.createComponent(info, moreInfo);
		oPanel.render();
		this.resize();
		this.isModifyingPanels = false;
	},

	/**
	* Finds and returns the panel index of the passed-in control. Returns `-1` if
	* panel is not found.
	*
	* @param {Object} oControl - A control to look for.
	* @return {Number} Panel index of control, or `-1` if panel is not found.
	* @public
	*/
	getPanelIndex: function (oControl) {
		var oPanel = null;

		while (oControl && oControl.parent) {
			// Parent of a panel can be a client or a panels.
			if (oControl.parent === this.$.client || oControl.parent === this) {
				oPanel = oControl;
				break;
			}
			oControl = oControl.parent;
		}

		if (oPanel) {
			for (var n=0; n<this.getPanels().length; n++) {
				if (this.getPanels()[n] == oPanel) {
					return n;
				}
			}
		}

		return -1;
	},

	/**
	* Returns `true` if the passed-in control is a child panel of this Panels instance.
	*
	* @param {Object} control - A panel control.
	* @return {Boolean} `true` if the specified control is a child panel of this Panels
	* instance.
	* @public
	*/
	isPanel: function (control) {
		for (var n=0; n<this.getPanels().length; n++) {
			if (this.getPanels()[n] == control) {
				return true;
			}
		}
	},

	/**
	* @method
	* @private
	*/
	create: function () {
		Panels.prototype.create.apply(this, arguments);
		this.set('animate', this.animate && options.accelerate, true);

		// we need to ensure our handler has the opportunity to modify the flow during
		// initialization
		this.showingChanged();
		this.brandingSrcChanged();
	},

	/**
	* @private
	*/
	initComponents: function () {
		this.applyPattern();
		Panels.prototype.initComponents.apply(this, arguments);
		this.initializeShowHideHandle();
		this.handleShowingChanged();
		this.allowBackKeyChanged();
	},

	/**
	* @private
	*/
	rendered: function () {
		Panels.prototype.rendered.apply(this, arguments);

		// Direct hide if not showing and using handle
		if (this.useHandle === true) {
			if (this.showing) {
				this._directShow();
			} else {
				this._directHide();
			}
		}
		this.displayBranding();
	},

	/**
	* @private
	*/
	tapped: function (oSender, oEvent) {
		if (oEvent.originator === this.$.showHideHandle || this.pattern === 'none' ||
			this.transitioning === true || this.isModifyingPanels === true) {
			return;
		}

		if (this.shouldHide(oEvent)) {
			if (this.showing && (this.useHandle === true) && this.handleShowing) {
				this.hide();
			}
		} else {
			var n = (oEvent.breadcrumbTap) ? this.getPanelIndex(oEvent.originator) : -1;
			// If tapped on not current panel (breadcrumb), go to that panel
			if (n >= 0 && n !== this.getIndex()) {
				this.setIndex(n);
			}
		}
	},

	/**
	* @private
	*/
	shouldHide: function (oEvent) {
		return (oEvent.originator === this.$.clientWrapper || (oEvent.originator instanceof Panel && this.isPanel(oEvent.originator)));
	},

	/**
	* @private
	*/
	spotlightLeft: function (oSender, oEvent) {
		if (this.toIndex !== null) {
			this.queuedIndex = this.toIndex - 1;
			//queuedIndex could have out boundary value. It will be managed in setIndex()
		}
		var orig = oEvent.originator,
			idx;
		// Don't allow left-movement from a breadcrumb
		if (orig.name === 'breadcrumbBackground') {
			return true;
		}
		if (orig instanceof Panel) {
			idx = this.getPanelIndex(orig);
			if (idx === 0) {
				if (this.showing && (this.useHandle === true) && this.handleShowing) {
					this.hide();
					return true;
				}
			}
			else {
				this.previous();
				return true;
			}
		}
	},

	/**
	* @private
	*/
	spotlightRight: function (oSender, oEvent) {
		if (this.toIndex !== null) {
			this.queuedIndex = this.toIndex + 1;
			//queuedIndex could have out boundary value. It will be managed in setIndex()
		}
		var orig = oEvent.originator,
			idx = this.getPanelIndex(orig),
			next = this.getPanels()[idx + 1];
		if (orig.name === 'breadcrumbBackground') {
			// Upon pressing right from a pointer-focused breadcrumb, just jump
			// to the current panel to keep focus visible
			Spotlight.spot(next);
			return true;
		}
		if (next && orig instanceof Panel) {
			if (this.useHandle === true && this.handleShowing && next.isOffscreen) {
				Spotlight.spot(this.$.showHideHandle);
			}
			else {
				this.next();
			}
			return true;
		}
	},

	/**
	* @private
	*/
	spotlightDown: function (oSender, oEvent) {
		if (oEvent.originator.name === 'breadcrumbBackground') { return true; }
	},

	/**
	* @private
	*/
	spotlightFocus: function (oSender, oEvent) {
		var orig = oEvent.originator;
		var idx = this.getPanelIndex(orig);
		if (this.index !== idx && idx !== -1 && orig.name !== 'breadcrumbBackground') {
			this.setIndex(idx);
		}
	},

	/**
	* Responds to tap on show/hide handle.
	*
	* @private
	*/
	handleTap: function () {
		this.setShowing(!this.showing);
	},

	/**
	* @private
	*/
	handleSpotLeft: function () {
		if (this.showing) {
			Spotlight.spot(this.getActive());
		} else {
			Spotlight.unspot();
		}
		return true;
	},

	/**
	* @private
	*/
	handleSpotRight: function (sender, event) {
		if (this.showing) {
			return true;
		}
	},

	/**
	* @private
	*/
	handleBlur: function (sender, event) {
		if (this.isHandleFocused) {
			this.isHandleFocused = false;
			if (!Spotlight.getPointerMode()) {
				if (!this.showing) {
					this.panelsHiddenAsync();
				}
			}
		}
		this.resetHandleAutoHide();
		if (!this.showing) {
			Signals.send('onPanelsHandleBlurred');
		}
	},

	/**
	* @private
	*/
	panelsHiddenAsync: function () {
		util.asyncMethod(Signals, 'send', 'onPanelsHidden');
	},

	/**
	* @private
	*/
	resetHandleAutoHide: function (sender, event) {
		this.startJob('autoHide', 'stashHandle', this.getAutoHideTimeout());
	},

	/**
	* @private
	*/
	stopHandleAutoHide: function (sender, event) {
		this.stopJob('autoHide');
	},

	/**
	* @private
	*/
	stashHandle: function () {
		this.$.showHideHandle.addRemoveClass('stashed', !this.showing);
	},

	/**
	* @private
	*/
	unstashHandle: function () {
		this.stopHandleAutoHide();
		this.$.showHideHandle.removeClass('stashed');
	},

	/**
	* @private
	*/
	handleFocused: function () {
		this.unstashHandle();
		this.startJob('autoHide', 'handleSpotLeft', this.getAutoHideTimeout());
		this.isHandleFocused = true;
		Signals.send('onPanelsHandleFocused');
	},

	/**
	* @private
	*/
	handleShowingChanged: function () {
		//* show handle only when useHandle is true
		if (this.useHandle !== true) { return; }
		this.$.showHideHandle.addRemoveClass('hidden', !this.handleShowing);
		this.$.showHideHandle.spotlight = this.handleShowing;
	},

	/**
	* Called when focus enters one of the panels. If currently hiding and
	* `this.useHandle` is `true`, shows handle.
	*
	* @private
	*/
	onSpotlightPanelEnter: function () {
		if (!this.showing && (this.useHandle === true) && this.handleShowing ) {
			Spotlight.spot(this.$.showHideHandle);
			return true;
		}
	},

	/**
	* Sets the index of the active panel, possibly transitioning the panel into view.
	*
	* @param {number} index - Index of the panel to make active.
	* @public
	*/
	setIndex: function (index) {
		// Normally this.index cannot be smaller than 0 and larger than panels.length
		// However, if panels uses handle and there is sequential key input during transition
		// then index could have -1. It means that panels will be hidden.
		if (this.toIndex === null || this.useHandle === false) {
			index = this.clamp(index);
		}

		if (index === this.index) {
			return;
		}

		if (this.toIndex !== null) {
			return;
		}

		this.notifyPanels('initPanel');
		this.fromIndex = this.index;
		this.toIndex = index;

		this.queuedIndex = null;
		this._willMove = null;

		// Ensure any VKB is closed when transitioning panels
		this.blurActiveElementIfHiding(index);

		// If panels will move for this index change, kickoff animation. Otherwise skip it.
		if (this.shouldAnimate()) {
			Spotlight.mute(this);
			// if back key feature is enabled and setIndex is not called from back key handler
			if (this.allowBackKey && !EnyoHistory.isProcessing()) {
				this.panelStack.push(this.index);
				this.pushBackHistory();
			}

			this.startTransition();
			this.triggerPreTransitions();
		} else {
			this._setIndex(this.toIndex);
		}
	},

	/**
	* @private
	*/
	blurActiveElementIfHiding: function (index) {
		var activeElement = document.activeElement,
			activeComponent = activeElement ? dispatcher.$[activeElement.id] : null,
			panels = this.getPanels(),
			panel,
			panelInfo;
		if (activeComponent) {
			for (var i = 0; i < panels.length; i++) {
				panel = panels[i];
				if (activeComponent.isDescendantOf(panel)) {
					panelInfo = this.getPanelInfo(i, index);
					if (panelInfo.offscreen) {
						document.activeElement.blur();
					}
					break;
				}
			}
		}
	},

	/**
	* Returns `true` if the panels should animate in the transition from `fromIndex` to
	* `toIndex`.
	*
	* @private
	*/
	shouldAnimate: function () {
		if (this._willMove == null) {
			return (this._willMove = this.animate && this.shouldArrange());
		}
		else {
			return this._willMove;
		}
	},

	/**
	* Returns `true` if any panels will move in the transition from `fromIndex` to `toIndex`.
	*
	* @private
	*/
	shouldArrange: function () {
		return this.layout.shouldArrange ? this.layout.shouldArrange(this.fromIndex, this.toIndex) : true;
	},

	/**
	*
	* @private
	*/
	_setIndex: function (index) {
		var prev = this.get('index');
		this.index = this.clamp(index);
		this.notifyObservers('index', prev, index);
	},

	/**
	* Called when the arranger animation completes.
	*
	* @private
	*/
	animationEnded: function () {
		if (this.animate) {
			this.triggerPostTransitions();
		} else {
			Panels.prototype.animationEnded.apply(this, arguments);
		}

		return true;
	},

	/**
	* @private
	*/
	getPanelInfo: function (inPanelIndex, inActiveIndex) {
		return this.layout.getPanelInfo && this.layout.getPanelInfo(inPanelIndex, inActiveIndex) || {};
	},

	/**
	* @private
	*/
	getTransitionInfo: function (inPanelIndex) {
		var to = (this.toIndex || this.toIndex === 0) ? this.toIndex : this.index;
		var info = this.getPanelInfo(inPanelIndex, to);
		info.from = this.fromIndex;
		info.to = this.toIndex;
		info.index = inPanelIndex;
		info.animate = this.animate;
		return info;
	},

	/**
	* If any panel has a pre-transition, pushes the panel's index to `preTransitionWaitList`.
	*
	* @private
	*/
	triggerPreTransitions: function () {
		var panels = this.getPanels(),
			info;

		this.preTransitionWaitlist = [];

		for(var i = 0, panel; (panel = panels[i]); i++) {
			info = this.getTransitionInfo(i);
			if (panel.preTransition && panel.preTransition(info)) {
				this.preTransitionWaitlist.push(i);
			}
		}

		if (this.preTransitionWaitlist.length === 0) {
			this._setIndex(this.toIndex);
		}
	},

	/**
	* @private
	*/
	preTransitionComplete: function (sender, event) {
		var index = this.getPanels().indexOf(event.originator);

		for (var i = 0; i < this.preTransitionWaitlist.length; i++) {
			if (this.preTransitionWaitlist[i] === index) {
				this.preTransitionWaitlist.splice(i,1);
				break;
			}
		}

		if (this.preTransitionWaitlist.length === 0) {
			this._setIndex(this.toIndex);
		}

		return true;
	},

	/**
	* @private
	*/
	triggerPostTransitions: function () {
		var panels = this.getPanels(),
			info;

		this.postTransitionWaitlist = [];

		for(var i = 0, panel; (panel = panels[i]); i++) {
			info = this.getTransitionInfo(i);
			if (panel.postTransition && panel.postTransition(info)) {
				this.postTransitionWaitlist.push(i);
			}
		}

		if (this.postTransitionWaitlist.length === 0) {
			this.completed();
			return true;
		}
	},

	/**
	* @private
	*/
	postTransitionComplete: function (sender, event) {
		var index = this.getPanels().indexOf(event.originator);

		for (var i = 0; i < this.postTransitionWaitlist.length; i++) {
			if (this.postTransitionWaitlist[i] === index) {
				this.postTransitionWaitlist.splice(i,1);
				break;
			}
		}

		if (this.postTransitionWaitlist.length === 0) {
			this.completed();
		}

		return true;
	},

	/**
	* When index changes, make sure to update the breadcrumbed panel's `spotlight` property
	* (to avoid {@glossary Spotlight} issues).
	*
	* @private
	*/
	indexChanged: function () {
		var activePanel = this.getActive();

		if (activePanel && activePanel.isBreadcrumb) {
			activePanel.removeSpottableBreadcrumbProps();
		}

		Panels.prototype.indexChanged.apply(this, arguments);

		this.displayBranding();
	},

	notifyPanels: function (method) {
		var panels = this.getPanels(),
			panel, info, i;
		for (i = 0; (panel = panels[i]); i++) {
			info = this.getTransitionInfo(i);
			if (panel[method]) {
				panel[method](info);
			}
		}
	},

	/**
	* @private
	*/
	finishTransition: function () {
		var panels = this.getPanels(),
			toIndex = this.toIndex,
			fromIndex = this.fromIndex,
			i, panel, info, popFrom;

		this.notifyPanels('transitionFinished');
		Panels.prototype.finishTransition.apply(this, arguments);

		// Automatically pop off panels that are no longer on screen
		if (this.popOnBack && (toIndex < fromIndex)) {
			popFrom = toIndex + 1;
			for (i = 0; (panel = panels[i]); i++) {
				info = this.getTransitionInfo(i);
				// If a panel is onscreen, don't pop it
				if ((i > toIndex) && !info.offscreen) {
					popFrom++;
				}
			}

			this.popPanels(popFrom);
		}

		// queuedIndex becomes -1 when left key input is occurred
		// during transition from index 1 to 0.
		// We can hide panels if we use handle.
		if (this.queuedIndex === -1 && this.useHandle) {
			this.hide();
		} else if (this.queuedIndex !== null) {
			this.setIndex(this.queuedIndex);
		}

		Spotlight.unmute(this);
		// Spot the active panel
		Spotlight.spot(this.getActive());
	},

	/**
	* Override the default `getShowing()` behavior to avoid setting `this.showing` based on the
	* CSS `display` property.
	*
	* @private
	*/
	getShowing: function () {
		return this.showing;
	},

	/**
	* @private
	*/
	showingChanged: function (inOldValue) {
		if (this.$.backgroundScrim) {
			this.$.backgroundScrim.addRemoveClass('visible', this.showing);
		}
		if (this.useHandle === true) {
			if (this.showing) {
				this.unstashHandle();
				this._show();
				Spotlight.spot(this.getActive());
			}
			else {
				// in this case, our display flag will have been set to none so we need to clear
				// that even though the showing flag will remain false
				this.applyStyle('display', null);
				this.resetHandleAutoHide();
				this._hide();
			}
			this.sendShowingChangedEvent(inOldValue);
		}
		else {
			Panels.prototype.showingChanged.apply(this, arguments);
		}
	},

	/**
	* @private
	*/
	applyPattern: function () {
		switch (this.pattern) {
		case 'alwaysviewing':
			this.applyAlwaysViewingPattern();
			break;
		case 'activity':
			this.applyActivityPattern();
			break;
		default:
			this.useHandle = false;
			break;
		}
	},

	/**
	* @private
	*/
	applyAlwaysViewingPattern: function () {
		this.setArrangerKind(BreadcrumbArranger);
		this.addClass('always-viewing');
		this.panelCoverRatio = 0.5;
		this.useHandle = (this.useHandle === 'auto') ? true : this.useHandle;
		this.createChrome(this.handleTools);
		this.breadcrumbGap = 20;
	},

	/**
	* @private
	*/
	applyActivityPattern: function () {
		this.setArrangerKind(BreadcrumbArranger);
		this.addClass('activity');
		this.showFirstBreadcrumb = true;
		this.useHandle = (this.useHandle === 'auto') ? false : this.useHandle;
		this.createChrome(this.handleTools);
		this.breadcrumbGap = 0;
	},

	/**
	* @private
	*/
	initializeShowHideHandle: function () {
		if (this.useHandle === true) {
			this.$.showHideHandle.canGenerate = true;
			this.$.showHideHandle.spotlight = true;
		}
	},

	/**
	* Shows panels with transition from right.
	*
	* @private
	*/
	_show: function () {
		var init = false;
		if (!this.hasNode()) {
			init = true;
		} else {
			this.$.showHideHandle.addClass('right');
			this.applyShowAnimation();
		}
		Signals.send('onPanelsShown', {initialization: init});
	},

	/**
	* Hides panels with transition to right.
	*
	* @private
	*/
	_hide: function () {
		if (!this.hasNode()) {
			return;
		}
		this.$.showHideHandle.removeClass('right');
		this.applyHideAnimation();
		this.panelsHiddenAsync();
	},

	/**
	* Sets show state without animation.
	*
	* @private
	*/
	_directShow: function () {
		this.$.showHideHandle.addClass('right');
		if (this.handleShowing) {
			this.$.showHideHandle.removeClass('hidden');
		}
		this.applyShowAnimation(true);
	},

	/**
	* Sets hide state without animation.
	*
	* @private
	*/
	_directHide: function () {
		this.$.showHideHandle.addClass('hidden');
		this.$.showHideHandle.removeClass('right');
		this.applyHideAnimation(true);
		this.hideAnimationComplete();
	},

	/**
	* @private
	*/
	applyShowAnimation: function (direct) {
		this.$.clientWrapper.applyStyle('transition', direct ? null : 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)');
		this.$.clientWrapper.applyStyle('-webkit-transition', direct ? null : '-webkit-transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)');
		dom.transform(this.$.clientWrapper, {translateX: 0});
	},

	/**
	* @private
	*/
	applyHideAnimation: function (direct) {
		this.$.clientWrapper.applyStyle('transition', direct ? null : 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)');
		this.$.clientWrapper.applyStyle('-webkit-transition', direct ? null : '-webkit-transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)');
		dom.transform(this.$.clientWrapper, {translateX: '100%'});
	},

	/**
	* @private
	*/
	getOffscreenXPosition: function () {
		return this.$.clientWrapper.getBounds().width;
	},

	/**
	* Hide/show animation complete.
	*
	* @private
	*/
	showHideAnimationComplete: function (sender, event) {
		switch (event.animation.name) {
		case 'show':
			this.showAnimationComplete();
			return true;
		case 'hide':
			this.hideAnimationComplete();
			return true;
		}
	},

	/**
	* @private
	*/
	showAnimationComplete: function () {
		if (this.handleShowing) {
			this.$.showHideHandle.removeClass('hidden');
		}
	},

	/**
	* @private
	*/
	hideAnimationComplete: function () {
		if (this.handleShowing) {
			this.$.showHideHandle.removeClass('hidden');
		}
	},

	/**
	* @private
	*/
	displayBranding: function () {
		if (this.$.branding) {
			if (this.pattern == 'activity' && this.getPanelInfo(0, this.index).breadcrumb) {
				this.$.branding.show();
			} else {
				this.$.branding.hide();
			}
		}
	},

	/**
	* @private
	*/
	brandingSrcChanged: function () {
		if (this.$.branding) {
			this.$.branding.set('src', this.brandingSrc);
		}
	},

	/**
	* @private
	*/
	animateChanged: function () {
		this.addRemoveClass('moon-composite', this.animate);
	},

	/**
	* @private
	*/
	backKeyHandler: function () {
		if (this.panelStack.length) {
			this.setIndex(this.panelStack.pop());
		}
		return true;
	},

	/**
	* @private
	*/
	allowBackKeyChanged: function () {
		if (this.allowBackKey) {
			//initialize stack
			this.panelStack = [];
		} else if(this.panelStack) {
			this.panelStack = null;
		}
	},

	// Accessibility

	ariaObservers: [
		{path: 'index', method: function () {
			var panels = this.getPanels(),
				active = this.getActive(),
				l = panels.length,
				panel;

			while (--l >= 0) {
				panel = panels[l];
				panel.set('accessibilityRole', panel === active ? 'alert' : 'region');
			}
		}}
	]

});
