/**
* Contains the declaration for {@link module:moonstone/Panels~Panels} and supporting kinds.
* @module moonstone/Panels
*/

require('moonstone');

var
	kind = require('enyo/kind'),
	dispatcher = require('enyo/dispatcher'),
	dom = require('enyo/dom'),
	util = require('enyo/utils'),
	Control = require('enyo/Control'),
	EnyoHistory = require('enyo/History'),
	Signals = require('enyo/Signals'),
	ri = require('enyo/resolution'),
	ViewPreloadSupport = require('enyo/ViewPreloadSupport');

var
	Panels = require('layout/Panels');

var
	Spotlight = require('spotlight');

var
	$L = require('../i18n');

var
	ApplicationCloseButton = require('../ApplicationCloseButton'),
	HistorySupport = require('../HistorySupport'),
	MoonAnimator = require('../MoonAnimator'),
	MoonArranger = require('../MoonArranger'),
	MoonOptions = require('../options'),
	Panel = require('../Panel'),
	StyleAnimator = require('../StyleAnimator');

/**
* {@link module:moonstone/Panels~PanelsHandle} is a helper kind for
* {@link module:moonstone/Panels~Panels}. It implements a spottable handle
* that the user may interact with to hide and show the `moonstone/Panels`
* control.
*
* @class PanelsHandle
* @extends module:enyo/Control~Control
* @ui
* @public
*/
var PanelsHandle = kind(
	/** @lends module:moonstone/Panels~PanelsHandle.prototype */ {

	/**
	* @private
	*/
	name: 'moon.PanelsHandle',

	/**
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

	/**
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
* {@link module:moonstone/Panels~Breadcrumb} is a helper kind for
* {@link module:moonstone/Panels~Panels}. It implements a breadcrumb that
* displays the panel index.
*
* @class Breadcrumb
* @extends module:enyo/Control~Control
* @ui
* @public
*/
var Breadcrumb = kind(
	/** @lends module:moonstone/Panels~Breadcrumb.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Breadcrumb',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	* @lends module:moonstone/Panels~Breadcrumb.prototype
	*/
	published: {
		/*
		* @private
		*/
		index: 0
	},

	/**
	* @private
	*/
	spotlight: true,

	/**
	* @private
	*/
	isOffscreen: false,

	/**
	* @private
	*/
	accessibilityLabel: $L('go to previous'),

	/**
	* @private
	*/
	handlers: {
		ontap: 'tapHandler',
		onSpotlightRight: 'rightHandler'
	},

	/**
	* @private
	*/
	classes: 'moon-panels-breadcrumb',

	/**
	* @private
	*/
	components: [
		{name: 'number', kind: Control, classes: 'moon-panels-breadcrumb-header'}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'index', to: '$.number.content', transform: 'formatNumber'}
	],

	/**
	* @private
	*/
	formatNumber: function (n) {
		var i=n+1;
		return '< ' + ((i < 10) ? '0' : '') + i;
	},

	/**
	* @private
	*/
	tapHandler: function (sender, event) {
		// decorate
		event.breadcrumbTap = true;
		event.index = this.index;
	},

	/**
	* @private
	*/
	rightHandler: function(sender, event) {
		var panels = this.owner;
		if (this.index+1 ==	panels.index) {
			Spotlight.spot(panels.getActive());
			return true;
		}
	},

	/**
	* @private
	*/
	updateSpotability: function () {
		this.spotlightDisabled = this.isOffscreen;
	},

	/**
	* @private
	*/
	updateBreadcrumb: function (info) {
		this.set('isOffscreen', info.isOffscreen);
		this.updateSpotability();
	}
});


/**
* {@link module:moonstone/Panels~Panels} extends {@link module:layout/Panels~Panels},
* adding support for 5-way focus (Spotlight) and pre-configured Moonstone panels
* design patterns. By default, controls added to a Panels container are instances
* of {@link module:moonstone/Panel~Panel}.
*
* `moonstone/Panels` introduces the concept of patterns for panel display.
* Set [pattern]{@link module:moonstone/Panels~Panels#pattern} to `'activity'`
* or `'alwaysViewing'` to use one of two patterns designed for apps on Smart TV systems.
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
	mixins : [HistorySupport, ViewPreloadSupport],

	/**
	* @private
	*/
	classes : 'moon-panels enyo-fit',

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
		* The `'alwaysviewing'` pattern uses the {@link module:moonstone/BreadcrumbArranger~BreadcrumbArranger} with
		* semi-transparent panels (depending on the color theme) over the right half
		* of the screen, allowing multiple breadcrumbs to accumulate on the left
		* half of the screen.
		*
		* The `'activity'` pattern  uses the `BreadcrumbArranger` with opaque
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
		* When `true`, an ApplicationCloseButton is added to ActivityPanels arranger's Panel Headers.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		hasCloseButton: true,

		/**
		* When `true`, navigating the panel-stack (forward and backward) by 5-way key is disabled.
		* This feature may be helpful to prevent accidental navigation in "wizard" interface
		* scenarios where the user must take explicit action to advance or regress.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		preventKeyNavigation: false,

		/**
		* When `true`, focus can move from panel to breadcrumb when press left key.
		*
		* @type {Boolean}
		* @default true
		* @deprecated This property will be removed in the future.
		* @public
		*/
		leftKeyToBreadcrumb: true,

		/**
		* When `true`, existing views are cached for reuse; otherwise, they are destroyed.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		cacheViews: false
	},

	/**
	* @private
	*/
	narrowFit: false,

	/**
	* @private
	*/
	fractions: {panel: 1, breadcrumb: 1},

	/**
	* @private
	*/
	handlers: {
		ontap:						'tapped',
		onSpotlightUp:				'spotlightUp',
		onSpotlightDown:			'spotlightDown',
		onSpotlightRight:			'spotlightRight',
		onSpotlightLeft:			'spotlightLeft',
		onSpotlightFocus:			'spotlightFocus',
		onSpotlightContainerLeave:	'onSpotlightPanelLeave',
		onSpotlightContainerEnter:	'onSpotlightPanelEnter',
		onCustomizeCloseButton:		'handleCustomizeCloseButton'
	},

	/**
	* @private
	*/
	applicationTools: [
		{name: 'appClose', kind: ApplicationCloseButton, onSpotlightUp: 'spotlightFromCloseButton', onSpotlightDown: 'spotlightFromCloseButton', onSpotlightRight: 'spotlightFromCloseButton', onSpotlightLeft: 'spotlightFromCloseButton'}
	],

	/**
	* @private
	*/
	handleTools: [
		{name: 'backgroundScrim', kind: Control, classes: 'moon-panels-background-scrim'},
		{name: 'clientWrapper', kind: Control, classes: 'enyo-fill moon-panels-client-wrapper', components: [
			{name: 'scrim', kind: Control, classes: 'moon-panels-panel-scrim'},
			{name: 'breadcrumbs', kind: Control, classes: 'moon-panels-breadcrumbs'},
			{name: 'panelsViewport', kind: Control, classes: 'moon-panels-viewport', components: [
				{name: 'client', kind: Control, tag: null}
			]}
		]},
		{name: 'showHideHandle', kind: PanelsHandle, classes: 'hidden', canGenerate: false, ontap: 'handleTap', onSpotlightLeft: 'handleSpotLeft', onSpotlightRight: 'handleSpotRight', onSpotlightFocused: 'handleFocused', onSpotlightBlur: 'handleBlur', tabIndex: -1},
		{name: 'showHideAnimator', kind: StyleAnimator, onComplete: 'showHideAnimationComplete'}
	],

	/**
	* @private
	*/
	animatorTools: [
		{name: 'animator', kind: MoonAnimator, onStep: 'step', useBezier: true, onEnd: 'animationEnded', configs: {
			panel: {
				forward: { startValue: 0, endValue: 1, delay: 0, duration: 230, bezier: [0.69,0.01,0.97,0.59]},
				backward: { startValue: 0, endValue: 1, delay: 0, duration: 300, bezier: [0.06,0.53,0.38,0.99] }
			},
			breadcrumb: {
				forward: { startValue: 0, endValue: 1, delay: 230, duration: 70, bezier: [0.46,0.28,0.76,0.57] },
				backward: { startValue: 0, endValue: 1, delay: 150, duration: 150, bezier: [0.08,0.51,0.24,0.99] }
			}
		}}
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
	* Default to using `BreadcrumbArranger`.
	*
	* @private
	*/
	arrangerKind: MoonArranger,

	/**
	* Index of panel set in the middle of transition.
	*
	* @private
	*/
	queuedIndex: null,

	/**
	* Flag for blocking consecutive push/pop/replace panel actions to protect
	* create/render/destroy time.
	*
	* @private
	*/
	isModifyingPanels: false,

	/**
	* Flag to indicate if the Panels are currently transitioning to a new index.
	*
	* @private
	*/
	transitioning: false,

	/**
	* Width of breadcrumb.
	*
	* @private
	*/
	breadcrumbWidth: 96,

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
	* Returns list of breadcrumb objects
	*
	* @return {Array} List of breadcrumbs.
	* @public
	*/
	getBreadcrumbs: function () {
		return this.$.breadcrumbs ? this.$.breadcrumbs.children : [];
	},

	/**
	* Returns reference to breadcrumb at the specified index.
	*
	* @public
	*/
	getBreadcrumbForIndex: function (index) {
		var breadcrumbs = this.getBreadcrumbs();
		return breadcrumbs[(index + breadcrumbs.length) % breadcrumbs.length];
	},

	/**
	* Returns maximum number of breadcrumbs that can be fit in the breadcrumb area.
	*
	* @return {Number} Number of breadcrumbs.
	* @public
	*/
	getBreadcrumbMax: function () {
		if (this.pattern == 'activity') return 1;
		// Always viewing pattern is using half screen to show breadcrumbs
		return Math.round(window.innerWidth / 2 / ri.scale(this.breadcrumbWidth));
	},

	/**
	* Returns range of breadcrumb index.
	*
	* @return {Object} Object contains start and end value as a hash. '{start: start, end: end}'
	* @public
	*/
	getBreadcrumbRange: function () {
		/** To support fly weight pattern, we use a concept of a window.
		*	If we are seeing maximum 1 breadcrumb on screen (case of activity pattern),
		*	we arrange 2 breadcrumbs at a time (current and previous) to show animation.
		*	If we move forward from index 2 to 3 (active is 3), the window can be [2, 3].
		*/
		var end = this.index,
			start = end - this.getBreadcrumbs().length;

		// If we move backward from index 4 to 3 (active is 3), the window can be [3, 4].
		if (this.fromIndex > this.toIndex) {
			start = start+1;
			end = end+1;
		}
		return {start: start, end: end};
	},

	/**
	* We just recalculate transition position on pushPanel, because reflow is high cost operation.
	* @private
	*/
	recalcLayout: function () {
		if (this.layout && this.layout.calcTransitionPositions) {
			this.arrangements = [];
			this.layout.calcTransitionPositions();
		} else {
			this.reflow();
		}
	},

	/**
	* Determines the id of the given view.
	*
	* @param {Object} view - The view whose id we will determine.
	* @return {String} The id of the given view.
	* @public
	*/
	getViewId: function (view) {
		return view.id;
	},

	/**
	* Retrieves an array of either cached panels, if found, or creates a new array of panels
	*
	* @param {Object[]} info - The declarative {@glossary kind} definitions.
	* @param {Object} moreInfo - Additional properties to be applied (defaults).
	* @return {Array} List of found or created controls
	* @private
	*/
	createPanels: function (info, moreInfo) {
		var newPanels = [],
			newPanel, idx;

		for (idx = 0; idx < info.length; idx++) {
			newPanel = this.createPanel(info[idx], moreInfo);
			newPanels.push(newPanel);
		}

		return newPanels;
	},

	/**
	* Retrieves a cached panel or, if not found, creates a new panel
	*
	* @param {Object} info - The declarative {@glossary kind} definition.
	* @param {Object} moreInfo - Additional properties to be applied (defaults).
	* @return {Object} - Found or created control
	* @private
	*/
	createPanel: function (info, moreInfo) {
		var panel,
			panelId = this.getViewId(info);

		if (this.cacheViews && panelId) {
			panel = this.restoreView(panelId);
		}

		panel = panel || this.createComponent(info, moreInfo);
		return panel;
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
		var startingPanelCount, lastIndex, panel;

		if (this.transitioning || this.isModifyingPanels) return null;

		this.isModifyingPanels = true;

		startingPanelCount = this.getPanels().length;
		lastIndex = startingPanelCount - 1;
		panel = this.createPanel(info, moreInfo);

		panel.render();
		this.addBreadcrumb(true);
		this.recalcLayout();
		panel.resize();
		this.setIndex(lastIndex+1);

		// when we push the first panel, we need to explicitly let our observers know about this as
		// there would not be a change in actual index value
		if (startingPanelCount === 0) {
			// Accessibility - when we push the first panel, we need to set alert role for reading title.
			if (MoonOptions.accessibility) {
				this.setAlertRole();
			}
			this.notifyObservers('index');
		}

		this.isModifyingPanels = false;

		return panel;
	},

	/**
	* Options for the [Panels.pushPanels()]{@link module:moonstone/Panels~Panels.pushPanels} method.
	*
	* @typedef {Object} module:moonstone/Panels~Panels.pushPanels~options
	* @property {Number} targetIndex - The panel index number to immediately switch to. Leaving
	*	this blank or not setting it will perform the default action, which transitions to the
	*	first of the new panels. Setting this to a negative and other 'out of bounds' values
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
	pushPanels: function (info, commonInfo, options) { // added
		var startingPanelCount, lastIndex, panels, panel;

		if (this.transitioning || this.isModifyingPanels) return null;

		this.isModifyingPanels = true;

		if (!options) options = {};

		startingPanelCount = this.getPanels().length;
		lastIndex = startingPanelCount;
		panels = this.createPanels(info, commonInfo);

		for (panel = 0; panel < panels.length; ++panel) {
			panels[panel].render();
		}
		this.addBreadcrumb(true);
		this.recalcLayout();
		if (options.targetIndex || options.targetIndex === 0) {
			lastIndex = options.targetIndex;
		}
		lastIndex = this.clamp(lastIndex);
		for (panel = 0; panel < panels.length; ++panel) {
			panels[panel].resize();
		}
		// If transition was explicitly set to false, since null or undefined indicate 'never set' or unset
		if (options.transition === false) {
			this.setIndexDirect(lastIndex);
		} else {
			this.setIndex(lastIndex);
		}

		// when we push the first panel, we need to explicitly let our observers know about this as
		// there would not be a change in actual index value
		if (startingPanelCount === 0) {
			// Accessibility - when we push the first panel, we need to set alert role for reading title.
			if (MoonOptions.accessibility) {
				this.setAlertRole();
			}
			this.notifyObservers('index');
		}

		this.isModifyingPanels = false;

		return panels;
	},

	/**
	* Destroys panels whose index is greater than or equal to a specified value.
	*
	* @param {Number} index - Index at which to start removing panels.
	* @param {Number} [direction] - The direction in which we are changing indices. A negative
	*	value signifies that we are moving backwards, and want to remove panels whose indices are
	*	greater than the current index. Conversely, a positive value signifies that we are moving
	*	forwards, and panels whose indices are less than the current index should be removed. To
	*	maintain backwards-compatibility with the existing API, this parameter is optional and, if
	*	not specified, will default to the popOnBack behavior.
	* @public
	*/
	popPanels: function (index, direction) {
		if (this.transitioning || this.isModifyingPanels) return;

		var panels = this.getPanels(),
			i;

		this.isModifyingPanels = true;

		if (direction > 0) {
			for (i = 0; i <= index; ++i) {
				this.removePanel(panels[i], true);
			}
		} else {
			index = index || panels.length - 1;

			for (i = panels.length - 1; i >= index; i--) {
				this.removePanel(panels[i]);
			}
		}

		this.removeBreadcrumb();
		this.recalcLayout();
		this.isModifyingPanels = false;
	},

	/**
	* Removes an individual panel.
	*
	* @param {Object} panel - The panel to remove.
	* @param {Boolean} [preserve] - If {@link module:moonstone/Panels~Panels#cacheViews} is `true`,
	*	this value is used to determine whether or not to preserve the current panel's position in
	*	the component hierarchy and on the screen, when caching.
	* @private
	*/
	removePanel: function (panel, preserve) {
		if (panel) {
			if (this.cacheViews) {
				this.cacheView(panel, preserve);
			} else {
				panel.destroy();
			}
		}
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
		oPanel = this.createPanel(info, moreInfo);
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
	* @private
	*/
	refresh: function () {
		if (this.isMoonAnimatorUsed) {
			for(var k in this.$.animator.configs) {
				this.fractions[k] = 1;
			}
		}
		Panels.prototype.refresh.apply(this, arguments);
	},

	/**
	* @private
	*/
	step: function (sender) {
		if (this.isMoonAnimatorUsed) {
			for(var k in this.$.animator.configs) {
				this.fractions[k] = sender.values[k];
			}
		}
		Panels.prototype.step.apply(this, arguments);
		return true;
	},

	/**
	* @private
	*/
	stepTransition: function () {
		if (!this.hasNode()) return;

		if (this.isMoonAnimatorUsed) {
			this.arrangement = this.arrangement ? this.arrangement : {};
			for(var k in this.$.animator.configs) {
				this.arrangement[k] = this.interpolatesArrangement(this.fractions[k]);
			}
			if (this.layout && this.arrangement.panel && this.arrangement.breadcrumb) {
				this.layout.flowArrangement();
			}
		} else {
			Panels.prototype.stepTransition.apply(this, arguments);
		}
	},

	/**
	* Interpolates between arrangements as needed.
	*
	* @param {Number} [fraction] - A value between 0 to 1.
	* @private
	*/
	interpolatesArrangement: function (fraction) {
		// select correct transition points and normalize fraction.
		var t$ = this.transitionPoints;
		var r = (fraction || 0) * (t$.length-1);
		var i = Math.floor(r);
		r = r - i;
		var s = t$[i], f = t$[i+1];
		// get arrangements and lerp between them
		var s0 = this.fetchArrangement(s);
		var s1 = this.fetchArrangement(f);
		return s0 && s1 ? Panels.lerp(s0, s1, r) : (s0 || s1);
	},

	/**
	* @method
	* @private
	*/
	create: function () {
		Panels.prototype.create.apply(this, arguments);
		this.set('animate', this.animate && MoonOptions.accelerate, true);

		// we need to ensure our handler has the opportunity to modify the flow during
		// initialization
		this.showingChanged();
		// make other panel to spotlightDisabled without the initialPanel;
		this.notifyPanels('initPanel');
	},

	/**
	* @private
	*/
	initComponents: function () {
		this.applyPattern();
		Panels.prototype.initComponents.apply(this, arguments);
		this.isMoonAnimatorUsed = (this.$.animator instanceof MoonAnimator);
		this.addBreadcrumb();
		this.initializeShowHideHandle();
		this.handleShowingChanged();
	},

	/**
	* @private
	*/
	rendered: function () {
		Panels.prototype.rendered.apply(this, arguments);

		this.notifyBreadcrumbs('updateBreadcrumb');

		// Direct hide if not showing and using handle
		if (this.useHandle === true) {
			if (this.showing) {
				this._directShow();
			} else {
				this._directHide();
			}
		}
	},

	/**
	* @private
	*/
	tapped: function (oSender, oEvent) {
		if (oEvent.originator === this.$.showHideHandle || this.pattern === 'none' ||
			this.transitioning === true || this.isModifyingPanels === true) {
			return;
		}

		// If tapped on breadcrambs area (which is located in the left side of panel)
		if (oEvent.originator === this.$.breadcrumbs) {
			if (this.showing && (this.useHandle === true) && this.handleShowing) {
				this.hide();
			}
		} else {
			// If tapped on breadcrumb, go to that panel
			if (oEvent.breadcrumbTap && oEvent.index !== this.getIndex()) {
				this.setIndex(oEvent.index);
			}
		}
	},

	/**
	* This takes action when the CustomizeCloseButton event is received. It accepts several event
	* properties, and in their absence resets each to its original value.
	*
	* Values:
	*   x - (Number|String), positive or negative measurement to offset the X from its natural position.
	*       This value is automatically inverted in RtL mode.
	*   y - (Number|String), positive or negative measurement to offset the X from its natural position.
	*   properties {Object} An object containing key/value pairs to be `set` on the close button.
	*   For example, this can be used to set the `showing` property of the close button. If present
	*   and an object, the `styles` member will be iterated through and each style will be applied
	*   individually and those styles with a `null` value will be removed.
	*
	* Ex:
	*    this.doCustomizeCloseButton({parameters: {showing: false});
	*
	* @private
	*/
	handleCustomizeCloseButton: function (sender, ev) {
		if (this.$.appClose) {
			this.$.appClose.handleCustomizeCloseButton.apply(this.$.appClose, arguments);
		}
	},

	/**
	* Given a direction and starting control, walks up the lineage chain until a suitable control to
	* spot has been found.
	*
	* @param {String} dir - The direction of movement.
	* @param {Object} control - The starting control.
	* @returns {Object} The target that should be spotted.
	* @private
	*/
	getSpotlightTarget: function (dir, control) {
		var ref = control,
			target,
			parent,
			ext;

		// Look at all of the NearestNeighbors up the lineage chain, until we find a good one.
		while (!target) {
			if (!ref || ref instanceof Panel) break;
			parent = Spotlight.getParent(ref);
			// Add app close button as a child of Panel
			if (this.hasCloseButton && parent instanceof Panel) {
				ext = {extraCandidates: this.$.appClose};
			}
			target = Spotlight.NearestNeighbor.getNearestNeighbor(dir, ref, ext);
			ref = parent;
			ext = null;
		}

		return target;
	},

	/**
	* Considers whether or not the application close button should be spotted, and spots
	* accordingly, based on the given movement direction and originating control.
	*
	* @param {String} dir - The direction of movement.
	* @param {Object} orig - The originating control.
	* @returns {Boolean} If `true`, the application close button has been spotted; otherwise,
	*	`false` is returned.
	* @private
	*/
	considerSpottingCloseButton: function (dir, orig) {
		var target;

		target = this.getSpotlightTarget(dir, orig);

		if (target && target.parent instanceof ApplicationCloseButton) {
			Spotlight.spot(target);
			return true;
		}

		return false;
	},

	/**
	* @private
	*/
	spotlightUp: function (sender, ev) {
		return this.considerSpottingCloseButton('UP', ev.originator);
	},

	/**
	* @private
	*/
	spotlightDown: function (sender, ev) {
		return this.considerSpottingCloseButton('DOWN', ev.originator);
	},

	/**
	* @private
	*/
	spotlightLeft: function (sender, ev) {
		if (!this.preventKeyNavigation && !this.leftKeyToBreadcrumb && this.toIndex !== null) {
			this.queuedIndex = this.toIndex - 1;
			//queuedIndex could have out boundary value. It will be managed in setIndex()
		}
		var orig = ev.originator,
			idx = this.getPanelIndex(orig);

		if (this.considerSpottingCloseButton('LEFT', orig)) {
			return true;
		} else if (orig instanceof Panel) {
			if (idx === 0) {
				if (!this.preventKeyNavigation && this.showing && (this.useHandle === true)
						&& this.handleShowing) {
					this.hide();
					return true;
				}
			} else if (!this.leftKeyToBreadcrumb) {
				if (!this.preventKeyNavigation) {
					this.previous();
				} else {
					Spotlight.spot(Spotlight.getLastControl());
				}
				return true;
			} else if (sender instanceof ApplicationCloseButton && this.$.breadcrumbs) {
				Spotlight.spot(this.$.breadcrumbs);
				return true;
			}
		}
	},

	/**
	* @private
	*/
	spotlightRight: function (sender, ev) {
		if (!this.preventKeyNavigation && this.toIndex !== null) {
			this.queuedIndex = this.toIndex + 1;
			//queuedIndex could have out boundary value. It will be managed in setIndex()
		}
		var orig = ev.originator,
			idx = this.getPanelIndex(orig),
			next = this.getPanels()[idx + 1];

		if (this.considerSpottingCloseButton('RIGHT', orig)) {
			return true;
		} else if (next && orig instanceof Panel) {
			if (this.useHandle === true && this.handleShowing && idx == this.index) {
				Spotlight.spot(this.$.showHideHandle);
				return true;
			}
			else {
				if (!this.preventKeyNavigation) {
					this.next();
					return true;
				}
			}
		}
	},

	/**
	* @private
	*/
	spotlightFromCloseButton: function (sender, ev) {
		var p = this.getActive(),
			idx = this.getPanelIndex(p),
			direction = ev.type.substring(11).toUpperCase(),		// Derive direction from type
			target = Spotlight.NearestNeighbor.getNearestNeighbor(direction, ev.originator, {root: p});

		if (target) {
			Spotlight.spot(target);
			return true;
		} else if (direction == 'RIGHT') {
			if (this.useHandle === true && this.handleShowing && idx == this.index) {
				Spotlight.spot(this.$.showHideHandle);
				return true;
			}
		} else if (direction == 'LEFT') {
			this.spotlightLeft(sender, {originator: p});
			return true;
		}
	},

	/**
	* @private
	*/
	spotlightFocus: function (oSender, oEvent) {
		var orig = oEvent.originator;
		var idx = this.getPanelIndex(orig);
		if (orig.owner === this.$.appClose) {
			Spotlight.Container.setLastFocusedChild(this.getActive(), orig);
		}
		if (this.index !== idx && idx !== -1) {
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
			this.set('isHandleFocused', false);
			if (!Spotlight.getPointerMode()) {
				if (!this.showing) {
					this.sendPanelsHiddenSignal();
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
	sendPanelsHiddenSignal: function () {
		Signals.send('onPanelsHidden', {panels: this});
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
		this.set('isHandleFocused', true);
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
		var willAnimate = this.shouldAnimate();

		// Normally this.index cannot be smaller than 0 and larger than panels.length
		// However, if panels uses handle and there is sequential key input during transition
		// then index could have -1. It means that panels will be hidden.
		if (this.toIndex === null || this.useHandle === false) {
			index = this.clamp(index);
		}

		if (index === this.index || this.toIndex != null) {
			return;
		}

		var panels, toPanel;

		// Clear before start
		this.queuedIndex = null;
		this._willMove = null;

		// Set indexes before notify panels
		this.fromIndex = this.index;
		this.toIndex = index;

		// Turn on the close-x so it's ready for the next panel; if hasCloseButton is true
		// and remove spottability of close button during transitions.
		if (this.$.appClose) {
			if (this.hasNode()) this.$.appClose.customizeCloseButton({'spotlight': false});
			this.$.appClose.set('showing', this.hasCloseButton);
		}
		this.notifyPanels('initPanel');
		this.notifyBreadcrumbs('updateBreadcrumb');

		// Ensure any VKB is closed when transitioning panels
		this.blurActiveElementIfHiding(index);

		if (this.cacheViews) {
			panels = this.getPanels();
			toPanel = panels[this.toIndex];

			if (!toPanel.generated) {
				if (this.toIndex < this.fromIndex) toPanel.addBefore = panels[this.fromIndex];
				toPanel.render();
			}
		}

		// If panels will move for this index change, kickoff animation. Otherwise skip it.
		if (willAnimate) {
			Spotlight.mute(this);
			this.startTransition();
			this.addClass('transitioning');
		}

		this._setIndex(this.toIndex);
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
					panelInfo = this.getTransitionInfo(i, index);
					if (panelInfo.isOffscreen) {
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
		if (this._willMove === null) {
			/*jshint -W093 */
			return (this._willMove = this.animate && this.shouldArrange() && this.getAbsoluteShowing());
			/*jshint +W093 */
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
		// Accessibility - Before reading the focused item, it must have a alert role for reading the title,
		// so setAlertRole() must be called before notifyObservers('index', prev, index).
		if (MoonOptions.accessibility) {
			this.setAlertRole();
		}
		this.notifyObservers('index', prev, index);
	},

	/**
	* Called when the arranger animation completes.
	*
	* @private
	*/
	animationEnded: function () {
		if (this.animate) {
			this.removeClass('transitioning');
			this.completed();
		} else {
			Panels.prototype.animationEnded.apply(this, arguments);
		}

		return true;
	},

	/**
	* @private
	*/
	getTransitionInfo: function (inPanelIndex) {
		var to = (this.toIndex || this.toIndex === 0) ? this.toIndex : this.index,
			info = {};
		info.isOffscreen = (inPanelIndex != to);
		info.from = this.fromIndex;
		info.to = this.toIndex;
		info.index = inPanelIndex;
		info.animate = this.animate;
		return info;
	},

	/**
	* @private
	*/
	getBreadcrumbPositionInfo: function (bounds, containerBounds) {
		var right = bounds ? bounds.right : null,
			left = bounds ? bounds.left : null,
			panelEdge = containerBounds ? containerBounds.right : null;

		return {isOffscreen: (right == null || left == null || panelEdge == null || right <= 0 || left >= panelEdge)};
	},

	/**
	* Set index to breadcrumb to display number
	*
	* @private
	*/
	assignBreadcrumbIndex: function() {
		var range = this.getBreadcrumbRange(),
			control, i;

		if (this.pattern != 'none') {
			for (i=range.start; i<range.end; i++) {
				control = this.getBreadcrumbForIndex(i);
				control.set('index', i);
			}
		}
	},

	/**
	* @private
	*/
	addBreadcrumb: function (forceRender) {
		if (this.pattern == 'none' || !this.$.breadcrumbs) return;

		// If we have 1 panel then we don't need breadcrumb.
		// If we have more then 1 panel then we need panel - 1 number of breadcrumbs.
		// But, if we can only see 1 breadcrumb on screen like activity pattern
		// then we need 2 breadcrumbs to show animation.
		var len = Math.max(2, Math.min(this.getPanels().length-1, this.getBreadcrumbMax()+1)),
			defs = [],
			prevLen = this.getBreadcrumbs().length,
			breadcrumbs, i;

		for(i=0; i<len-prevLen; i++) {
			defs[i] = {kind: Breadcrumb};
		}
		this.$.breadcrumbs.createComponents(defs, {owner: this});
		if (forceRender) {
			breadcrumbs = this.getBreadcrumbs();
			for (i=prevLen; i<len; i++) {
				breadcrumbs[i].render();
			}
		}
	},

	/**
	* @private
	*/
	removeBreadcrumb: function () {
		if (this.pattern == 'none' || !this.$.breadcrumbs) return;

		// If we have 1 panel then we don't need breadcrumb.
		// If we have more then 1 panel then we need panel - 1 number of breadcrumbs.
		// But, if we can only see 1 breadcrumb on screen like activity pattern
		// then we need 2 breadcrumbs to show animation.
		var len = Math.max(2, Math.min(this.getPanels().length-1, this.getBreadcrumbMax()+1));

		// If we have more than the number of necessary breadcrumb then destroy.
		while (this.getBreadcrumbs().length > len) {
			this.getBreadcrumbs()[this.getBreadcrumbs().length-1].destroy();
		}
	},

	/**
	* Assign direction property on animator to select proper timing function.
	*
	* @private
	*/
	getDirection: function() {
		return  (this.fromIndex == this.toIndex) ? 'none' :
				(this.fromIndex < this.toIndex) ? 'forward' : 'backward';
	},

	/**
	* @private
	*/
	adjustFirstPanelBeforeTransition: function() {
		var idx = this.index,
			from = this.fromIndex,
			trans = this.transitioning;
		if (this.pattern == 'activity') {
			// Show breadcrumbs if we're landing on any panel besides the first
			this.$.breadcrumbs.set('showing', idx > 0);
			// Adjust viewport to show full-width panel if we're landing on OR transitioning from the first panel
			this.addRemoveClass('first', idx === 0 || (trans && from === 0));
		}
	},

	/**
	* @private
	*/
	adjustFirstPanelAfterTransition: function() {
		// Keep viewport adjusted for full-width panel only if we've landed on the first panel
		if (this.pattern == 'activity' && this.index !== 0) {
			this.removeClass('first');
		}
	},

	/**
	* When index changes, make sure to update the breadcrumbed panel's `spotlight` property
	* (to avoid {@glossary Spotlight} issues).
	*
	* @private
	*/
	indexChanged: function (was) {
		var current, delta, deltaAbs, idx;

		this.adjustFirstPanelBeforeTransition();

		if (this.getPanels().length > 0) {
			this.assignBreadcrumbIndex();

			// Set animation direction to use proper timing function before start animation
			// This direction is only consumed by MoonAnimator.
			this.$.animator.direction = this.getDirection();

			// Push or drop history, based on the direction of the index change
			if (this.allowBackKey) {
				was = was || 0;
				delta = this.index - was;
				deltaAbs = Math.abs(delta);

				if (delta > 0) {
					for (idx = 0; idx < deltaAbs; idx++) {
						this.pushBackHistory(idx + was);
					}
				} else {
					current = EnyoHistory.peek();

					// ensure we have history to drop - if the first history entry's index corresponds
					// to the index prior to our current index, we assume the other entries exist
					if (current && current.index + 1 == was) {
						EnyoHistory.drop(deltaAbs);
					}
				}
			}
		}

		Panels.prototype.indexChanged.apply(this, arguments);
	},

	/**
	* @private
	*/
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
	notifyBreadcrumbs: function (method) {
		if (this.pattern == 'none' || !this.$.breadcrumbs) return;

		var range = this.getBreadcrumbRange(),
			containerBounds = this.$.breadcrumbs.getAbsoluteBounds(),
			control, bounds, info, i;
		for (i=range.start; i<range.end; i++) {
			control = this.getBreadcrumbForIndex(i);
			bounds = control.getAbsoluteBounds();
			info = this.getBreadcrumbPositionInfo(bounds, containerBounds);
			if (control[method]) {
				control[method](info);
			}
		}
	},

	/**
	* @private
	*/
	processPanelsToRemove: function(fromIndex, toIndex) {
		var direction = toIndex < fromIndex ? -1 : 1,
			removeFrom;

		// Remove panels that are no longer on screen
		if (this.cacheViews || (direction < 0 && this.popOnBack)) {
			removeFrom = toIndex - direction;
			this.popPanels(removeFrom, direction);
		}
	},

	processQueuedKey: function() {
		// queuedIndex becomes -1 when left key input is occurred
		// during transition from index 1 to 0.
		// We can hide panels if we use handle.
		if (this.queuedIndex === -1 && this.useHandle) {
			this.hide();
		} else if (this.queuedIndex !== null) {
			this.setIndex(this.queuedIndex);
		}
	},

	/**
	* @private
	*/
	finishTransition: function () {
		var fromIndex = this.fromIndex,
			toIndex = this.toIndex;

		this.adjustFirstPanelAfterTransition();
		this.notifyPanels('transitionFinished');
		this.notifyBreadcrumbs('updateBreadcrumb');
		Panels.prototype.finishTransition.apply(this, arguments);
		this.processPanelsToRemove(fromIndex, toIndex);
		this.processQueuedKey();
		Spotlight.unmute(this);
		Spotlight.spot(this.getActive());
		this.$.appClose && this.$.appClose.customizeCloseButton({'spotlight': true});  // Restore spotlightability of close button.
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
		// Accessibility - Before reading the focused item, it must have a alert role for reading the title,
		// so setAlertRole() must be called before Spotlight.spot
		if (MoonOptions.accessibility) {
			this.setAlertRole();
		}
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

			if (this.$.appClose) this.$.appClose.set('showing', (this.showing && this.hasCloseButton));
		}
		else {
			Panels.prototype.showingChanged.apply(this, arguments);
		}
	},

	/**
	* @private
	*/
	applyPattern: function () {
		if (this.pattern != 'alwaysviewing') {
			this.createChrome(this.applicationTools);
			this.hasCloseButtonChanged();
		}
		switch (this.pattern) {
		case 'alwaysviewing':
		case 'activity':
			this.addClass(this.pattern);
			this.useHandle = (this.useHandle === 'auto') ? (this.pattern == 'activity' ? false : true) : this.useHandle;
			this.createChrome(this.handleTools);
			this.tools = this.animatorTools;
			break;
		default:
			this.useHandle = false;
			this.createChrome([{name: 'client', kind: Control, tag: null}]);
			break;
		}
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
		Signals.send('onPanelsShown', {initialization: init, panels: this});
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
		this.sendPanelsHiddenSignal();
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
	animateChanged: function () {
		this.addRemoveClass('moon-composite', this.animate);
	},

	/**
	* @private
	*/
	backKeyHandler: function (entry) {
		var index = entry.index;

		if (this.transitioning) this.queuedIndex = index;
		else this.setIndex(index);

		return true;
	},

	/**
	* @private
	*/
	hasCloseButtonChanged: function () {
		if (!this.$.appClose) return;
		this.$.appClose.set('showing', (this.showing && this.hasCloseButton));
		this.addRemoveClass('has-close-button', this.hasCloseButton);
	},

	/**
	* @private
	*/
	pushBackHistory: function (index) {
		EnyoHistory.push({
			context: this,
			handler: this.backKeyHandler,
			index: index
		});

		return true;
	},

	// Accessibility

	/**
	* @private
	*/
	ariaObservers: [
		// If panels is hidden and panelsHandle is spotlight blured, also make panelsHandle's dom blur.
		{path: 'isHandleFocused', method: function () {
			if (this.$.showHideHandle && this.$.showHideHandle.hasNode() && !this.isHandleFocused) {
				this.$.showHideHandle.hasNode().blur();
			}
		}}
	],

	/**
	* @private
	*/
	setAlertRole: function () {
		var panels = this.getPanels(),
			active = this.getActive(),
			l = panels.length,
			panel;

		if (this.$.showHideHandle) {
			if (active && active.title) {
				this.$.showHideHandle.set('accessibilityLabel', (this.showing ? $L('Close') : $L('Open')) + ' ' + active.title);
			} else {
				this.$.showHideHandle.set('accessibilityLabel', this.showing ? $L('Close') : $L('Open'));
			}
		}

		while (--l >= 0) {
			panel = panels[l];
			if (panel instanceof Panel && panel.title) {
				panel.set('accessibilityRole', (panel === active) && this.get('showing') ? 'alert' : 'region');
			}
		}
	}

});
