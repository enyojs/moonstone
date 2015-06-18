require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Panel~Panel} kind.
* @module moonstone/Panel
*/

var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	dom = require('enyo/dom'),
	Control = require('enyo/Control');

var
	FittableLayout = require('layout/FittableLayout'),
	FittableRows = require('layout/FittableRows'),
	FittableRowsLayout = FittableLayout.Rows;

var
	Spotlight = require('spotlight');

var
	options = require('../options'),
	StyleAnimator = require('../StyleAnimator'),
	Header = require('../Header'),
	Marquee = require('../Marquee'),
	MarqueeSupport = Marquee.Support,
	MarqueeItem = Marquee.Item;

/**
* Fires when this [panel]{@link module:moonstone/Panel~Panel} has completed its pre-arrangement transition.
* No additional data is passed with this event.
*
* @event moon.Panel#onPreTransitionComplete
* @type {Object}
* @public
*/

/**
* Fires when this [panel]{@link module:moonstone/Panel~Panel} has completed its post-arrangement transition.
* No additional data is passed with this event.
*
* @event moon.Panel#onPostTransitionComplete
* @type {Object}
* @public
*/

/**
* {@link module:moonstone/Panel~Panel} is the default kind for controls created inside a
* [moon.Panels]{@link module:moonstone/Panels~Panels} container. A `moon.Panels` will typically
* contain several instances of `moon.Panel`.
*
* The built-in features include an embedded {@link module:moonstone/Header~Header} and an
* {@link module:enyo/FittableRows~FittableRows} layout for the main body content.
*
* @class Panel
* @extends module:enyo/Control~Control
* @ui
* @public
*/

module.exports = kind(
	/** @lends module:moonstone/Panel~Panel.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Panel',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	* @lends module:moonstone/Panel~Panel.prototype
	*/
	published: {
		/**
		* Facade for the [title]{@link module:moonstone/Header~Header#title} property of the embedded
		* {@link module:moonstone/Header~Header}.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		title: '',

		/**
		* Facade for the [titleAbove]{@link module:moonstone/Header~Header#titleAbove} property of the
		* embedded {@link module:moonstone/Header~Header}.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		titleAbove: '',

		/**
		* Facade for the [titleBelow]{@link module:moonstone/Header~Header#titleBelow} property of the
		* embedded {@link module:moonstone/Header~Header}.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		titleBelow: '',

		/**
		* Facade for the [subTitleBelow]{@link module:moonstone/Header~Header#subTitleBelow} property
		* of the embedded {@link module:moonstone/Header~Header}.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		subTitleBelow: '',

		/**
		* When `true`, the header's [titleAbove]{@link module:moonstone/Header~Header#titleAbove} property
		* is automatically populated with the panel index.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		autoNumber: true,

		/**
		* Facade for the [type]{@link module:moonstone/Header~Header#type} property of the embedded
		* {@link module:moonstone/Header~Header}.
		* Valid values are: `'large'`, `'small'`, and `'medium'`.
		*
		* @type {String}
		* @default 'large'
		* @public
		*/
		headerType: 'large',

		/**
		* Facade for the [small]{@link module:moonstone/Header~Header#small} property of the embedded
		* {@link module:moonstone/Header~Header}. Note that this property will be deprecated soon. Until
		* it is removed, `'smallHeader: true'` refers to the historical header size,
		* which is now equivalent to `type: 'medium'`.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		smallHeader: false,

		/**
		* If `true`, the header collapses when the panel body is scrolled down.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		collapsingHeader: false,

		/**
		* Facade for the [allowHtml]{@link module:enyo/Control~Control#allowHtml} property of the
		* embedded {@link module:moonstone/Header~Header}.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		allowHtmlHeader: false,

		/**
		* Facade for the [backgroundSrc]{@link module:moonstone/Header~Header#backgroundSrc} property
		* of the embedded {@link module:moonstone/Header~Header}.
		*
		* @type {(String|String[]|module:enyo/resolution#selectSrc~src|module:enyo/resolution#selectSrc~src[])}
		* @default null
		* @public
		*/
		headerBackgroundSrc: null,

		/**
		* Facade for the [backgroundPosition]{@link module:moonstone/Header~Header#backgroundPosition}
		* property of the embedded {@link module:moonstone/Header~Header}.
		*
		* @type {(String|String[])}
		* @default 'top right'
		* @public
		*/
		headerBackgroundPosition: 'top right',

		/**
		* An object containing additional settings for the {@link module:moonstone/Header~Header}. Any
		* values specified here will be mixed into the header definition.
		*
		* @type {Object}
		* @default null
		* @public
		*/
		headerOptions: null,

		/**
		* Facade for the [titleUpperCase]{@link module:moonstone/Header~Header#titleUpperCase} property
		* of the embedded {@link module:moonstone/Header~Header}.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		titleUpperCase: true
	},

	/**
	* @private
	*/
	events: {
		/**
		* {@link module:moonstone/Panel~Panel#onPreTransitionComplete}
		*/
		onPreTransitionComplete: '',
		/**
		* {@link module:moonstone/Panel~Panel#onPostTransitionComplete}
		*/
		onPostTransitionComplete: ''
	},

	/**
	* @private
	*/
	handlers: {
		onScroll: 'scroll'
	},

	/**
	* @private
	*/
	spotlight: 'container',

	/**
	* @private
	*/
	classes: 'moon-panel',

	/**
	* @private
	*/
	layoutKind: FittableRowsLayout,

	/**
	* @private
	*/
	headerOption: null, //* Deprecated

	/**
	* @private
	*/
	preventTransform: !options.accelerate,

	/**
	* @private
	*/
	preventAccelerate: !options.accelerate,

	/**
	* @private
	*/
	panelTools : [
		{name: 'breadcrumb', kind: Control, ontap: 'handleBreadcrumbTap', classes: 'moon-panel-breadcrumb', components: [
			{name: 'breadcrumbViewport', kind: Control, classes: 'moon-panel-breadcrumb-viewport', components: [
				{name: 'breadcrumbBackground', kind: Control, classes: 'moon-panel-small-header-wrapper', components: [
					{name: 'breadcrumbTitleAbove', kind: Control, classes: 'moon-super-header-text moon-panel-small-header-title-above'},
					{name: 'breadcrumbText', kind: Control, mixins: [MarqueeSupport, MarqueeItem], classes: 'moon-sub-header-text moon-panel-small-header'}
				]}
			]}
		]},
		{name: 'viewport', kind: Control, classes: 'moon-panel-viewport', onwebkitAnimationEnd: 'animationComplete', components: [
			{name: 'contentWrapper', kind: FittableRows, classes: 'moon-panel-content-wrapper', components: [
				/* header will be created here programmatically in createTools after mixing-in headerOptions */
				{name: 'panelBody', kind: FittableRows, fit: true, classes: 'moon-panel-body'}
			]}
		]},

		{name: 'animator', kind: StyleAnimator, onComplete: 'animationComplete'},
		{name: 'spotlightDummy', kind: Control, spotlight: false, style: 'width:0;height:0;'}
	],

	/**
	* @private
	*/
	headerConfig : {name: 'header', kind: Header, onComplete: 'headerAnimationComplete', isChrome: true},

	/**
	* @private
	*/
	bindings: [
		{from: '.title', to: '.$.header.title'},
		{from: '.title', to: '.$.breadcrumbText.content'},
		{from: '.titleAbove', to: '.$.header.titleAbove'},
		{from: '.titleAbove', to: '.$.breadcrumbTitleAbove.content'},
		{from: '.titleBelow', to: '.$.header.titleBelow'},
		{from: '.subTitleBelow', to: '.$.header.subTitleBelow'},
		{from: '.allowHtmlHeader', to: '.$.header.allowHtml'},
		{from: '.allowHtmlHeader', to: '.$.breadcrumbText.allowHtml'},
		{from: '.headerBackgroundSrc', to: '.$.header.backgroundSrc'},
		{from: '.headerBackgroundPosition', to: '.$.header.backgroundPosition'},
		{from: '.titleUpperCase', to: '.$.header.titleUpperCase'},
		{from: '.headerType', to: '.$.header.type', oneWay: false}
	],

	/**
	* @private
	*/
	headerComponents: [],

	/**
	* @private
	*/
	isBreadcrumb: false,

	/**
	* @private
	*/
	isOffscreen: false,

	/**
	* @private
	*/
	isHeaderCollapsed: false,

	/**
	* @private
	*/
	shrinking: false,

	/**
	* @private
	*/
	growing: false,

	/**
	* Set by {@link module:moonstone/BreadcrumbArranger~BreadcrumbArranger} during {@link module:moonstone/BreadcrumbArranger~BreadcrumbArranger#size}
	* based on the value of {@link module:moonstone/Panels~Panels#animate}.
	*
	* @private
	*/
	animate: !options.accelerate,

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		// FIXME: Need to determine whether headerComponents was passed on the instance or kind to get the ownership correct
		if (this.headerComponents) {
			var owner = this.hasOwnProperty('headerComponents') ? this.getInstanceOwner() : this;
			this.$.header.createComponents(this.headerComponents, {owner: owner});
		}
		this.autoNumberChanged();
		// Note: This line will be deprecated soon. For backward compatiblity, I leave it for a while.
		this.smallHeaderChanged();
		this.headerTypeChanged();
		this.animateChanged();
	},

	/**
	* @private
	*/
	initComponents: function () {
		this.createTools();
		this.controlParentName = 'panelBody';
		this.discoverControlParent();
		Control.prototype.initComponents.apply(this, arguments);
	},

	/**
	* @private
	*/
	createTools: function () {
		// Create everything but the header
		this.createChrome(this.panelTools);
		// Special-handling for header, which can have its options modified by the instance
		var hc = util.clone(this.headerConfig || {});
		hc.addBefore = this.$.panelBody;
		util.mixin(hc, this.headerOptions || this.headerOption);
		this.$.contentWrapper.createComponent(hc, {owner:this});
	},

	/**
	* On reflow, updates `this.$.contentWrapper` bounds.
	* @private
	*/
	reflow: function () {
		Control.prototype.reflow.apply(this, arguments);
		this.getInitAnimationValues();
		this.updateViewportSize();
		this.shrinkAsNeeded();
	},

	/**
	* Updates `this.$.contentWrapper` to have the height/width of `this`.
	* @private
	*/
	updateViewportSize: function () {
		var node = this.hasNode();

		if (!node || this.isBreadcrumb) {
			return;
		}

		this.$.viewport.applyStyle('height', dom.unit(this.initialHeight, 'rem'));
		this.$.viewport.applyStyle('width', dom.unit(this.initialWidth, 'rem'));
		this.$.contentWrapper.applyStyle('height', dom.unit(this.initialHeight, 'rem'));
		this.$.contentWrapper.applyStyle('width', dom.unit(this.initialWidth, 'rem'));
	},

	/**
	* Forcibly applies layout kind changes to `this.$.panelBody`.
	* @private
	*/
	layoutKindChanged: function () {
		this.$.panelBody.setLayoutKind(this.layoutKind);
	},

	/**
	* @private
	*/
	updateSpotability: function () {
		if (this.isOffscreen) {
			this.spotlightDisabled = true;
			this.removeSpottableProps();
			this.removeSpottableBreadcrumbProps();
		} else {
			if (this.isBreadcrumb) {
				this.spotlightDisabled = true;
				this.addSpottableBreadcrumbProps();
			}
			else {
				this.spotlightDisabled = false;
				this.$.spotlightDummy.spotlight = false;
				if (!Spotlight.isSpottable(this)) {
					// make dummy div spottable if there is no spottable child
					this.$.spotlightDummy.spotlight = true;
				}
			}
		}
	},

	/**
	* @private
	*/
	handleBreadcrumbTap: function (sender, event) {
		event.breadcrumbTap = true;
	},

	/**
	* Note: `smallHeader` will be deprecated soon.
	* @private
	*/
	scroll: function (sender, event) {
		if (this.collapsingHeader && ((this.headerType === 'large') || !this.smallHeader)) {
			if (event.originator.y < 0) {
				this.collapseHeader();
			} else {
				this.expandHeader();
			}
		}
	},

	/**
	* @private
	*/
	animateChanged: function () {
		this.addRemoveClass('moon-composite', this.animate);
	},

	/**
	* Note: This method will be deprecated soon.
	* @private
	*/
	smallHeaderChanged: function () {
		this.$.header.setSmall(this.smallHeader);
		if (this.generated) {
			this.$.contentWrapper.resize();
		}
	},

	/**
	* @private
	*/
	headerTypeChanged: function () {
		this.$.header.setType(this.headerType);
		if (this.generated) {
			this.$.contentWrapper.resize();
		}
	},

	/**
	* @private
	*/
	collapseHeader: function () {
		if (!this.isHeaderCollapsed) {
			this.$.header.collapseToSmall();
			this.isHeaderCollapsed = true;
		}
	},

	/**
	* @private
	*/
	expandHeader: function () {
		if (this.isHeaderCollapsed) {
			this.$.header.expandToLarge();
			this.isHeaderCollapsed = false;
		}
	},

	/**
	* Updates [titleAbove]{@link module:moonstone/Panel~Panel#titleAbove} when
	* [autoNumber]{@link module:moonstone/Panel~Panel#autoNumber} changes.
	* @private
	*/
	autoNumberChanged: function () {
		if (this.getAutoNumber() === true && this.container) {
			// This gets the index regardless of whether the panel is client or chome
			var n = this.parent.indexOfChild(this) + 1;
			n = ((n < 10) ? '0' : '') + n;
			this.setTitleAbove(n);
		}
	},

	/**
	* @private
	*/
	generateAutoNumber: function () {
		var adjustedIndex = this.indexInContainer() + 1;
		return (adjustedIndex < 10) ? '0'+ adjustedIndex : adjustedIndex;
	},

	/**
	* @private
	*/
	addSpottableBreadcrumbProps: function () {
		this.$.breadcrumbBackground.set('spotlight', true);
	},

	/**
	* @private
	*/
	removeSpottableBreadcrumbProps: function () {
		this.$.breadcrumbBackground.set('spotlight', false);
		this.$.breadcrumbBackground.removeClass('spotlight');
	},

	/**
	* @private
	*/
	removeSpottableProps: function () {
		this.$.breadcrumbBackground.set('spotlight', false);
	},

	/**
	* @private
	*/
	shrinkAsNeeded: function () {
		if (this.needsToShrink) {
			this.shrink();
			this.needsToShrink = false;
		}
	},

	/**
	* @private
	*/
	enableMarquees: function () {
		this.$.breadcrumbText.enableMarquee();
		this.$.header.enableMarquee();
	},

	/**
	* @private
	*/
	disableMarquees: function () {
		this.$.breadcrumbText.disableMarquee();
		this.$.header.disableMarquee();
	},

	/**
	* @private
	*/
	startMarqueeAsNeeded: function (info) {
		var onscreen = !info.offscreen;
		if (onscreen) {
			if (this.isBreadcrumb) {
				this.$.breadcrumbText.enableMarquee();
				this.$.breadcrumbText.startMarquee();
			}
			else {
				this.$.header.enableMarquee();
				this.$.header.startMarquee();
			}
		}
	},

	/**
	* @private
	*/
	getHeader: function () {
		return this.$.header;
	},

	/**
	* Called directly by {@link module:moonstone/Panels~Panels}.
	* @private
	*/
	initPanel: function (info) {
		this.set('isBreadcrumb', info.breadcrumb);
		this.set('isOffscreen', info.offscreen);
		this.updateSpotability();
		if (this.isBreadcrumb) {
			this.needsToShrink = true;
		}
		this.disableMarquees();
		this.startMarqueeAsNeeded(info);
	},

	/**
	* Called directly by {@link module:moonstone/Panels~Panels}.
	* @private
	*/
	preTransition: function (info) {
		this.disableMarquees();
		this.addClass('transitioning');
		if (!this.shrinking && info.breadcrumb && (!this.isBreadcrumb || this.growing)) {
			this.shrinkAnimation();
			return true;
		}

		return false;
	},

	/**
	* Called directly by {@link module:moonstone/Panels~Panels}.
	* @private
	*/
	postTransition: function (info) {
		this.removeClass('transitioning');

		if (!this.growing && !info.breadcrumb && (this.isBreadcrumb || this.shrinking) && this.hasClass('shrunk')) {
            //only grow if it has been shrunk before
			this.growAnimation();
			return true;
		}

		return false;
	},

	/**
	* Called directly by {@link module:moonstone/Panels~Panels}.
	* @private
	*/
	updatePanel: function (info) {
		if (!info.animate) {
			this.disableMarquees();
		}

        if (this.isBreadcrumb && !info.breadcrumb) {
            this.grow();
        }

        if (!this.isBreadcrumb && info.breadcrumb) {
            this.shrink();
        }

		this.set('isBreadcrumb', info.breadcrumb);
		this.set('isOffscreen', info.offscreen);
		this.updateSpotability();
		this.startMarqueeAsNeeded(info);
	},

	/**
	* Called directly on the panel by {@link module:moonstone/Panels~Panels} when the panel has completed a
	* transition. You may override this function in a panel subkind to perform
	* post-transition work (e.g., loading data for the panel).
	*
	* @param {Object} info - Information from the [Panels]{@link module:moonstone/Panels~Panels} component.
	* Additional information may be supplied by the arranger, such as breadcrumb and
	* offscreen status.
	* @param {Number} info.from - The index the parent Panels was moving from for this transition.
	* @param {Number} info.to - The index the parent Panels was moving to for this transition.
	* @param {Number} info.index - The current index of this [panel]{@link module:moonstone/Panel~Panel}.
	* @param {Boolean} info.animate - Whether the parent Panels is set to animate.
	* @public
	*/
	transitionFinished: function (info) {
		this.updatePanel(info);
	},

	/**
	* @private
	*/
	shrinkAnimation: function () {
		this.growing = false;
		this.shrinking = true;
		this.addClass('shrunken');
		this.addClass('shrinking');
	},

	/**
	* @private
	*/
	shrink: function () {
		this.addClass('shrunken');
	},

	/**
	* @private
	*/
	growAnimation: function () {
		this.growing = true;
		this.shrinking = false;
		this.addClass('growing');
		this.removeClass('shrunken');
	},

	/**
	* @private
	*/
	grow: function () {
		this.removeClass('shrunken');
	},

	/**
	* Was protected
	* @private
	*/
	getInitAnimationValues: function () {
		var node = this.hasNode(),
			paddingT = parseInt(dom.getComputedStyleValue(node, 'padding-top'), 10),
			paddingR = parseInt(dom.getComputedStyleValue(node, 'padding-right'), 10),
			paddingB = parseInt(dom.getComputedStyleValue(node, 'padding-bottom'), 10),
			paddingL = parseInt(dom.getComputedStyleValue(node, 'padding-left'), 10);
		this.initialHeight = node.offsetHeight - paddingT - paddingB;
		this.initialWidth = node.offsetWidth   - paddingR - paddingL;
	},

	/**
	* @private
	*/
	haltAnimations: function () {
		this.removeClass('growing');
		this.removeClass('shrinking');
	},

	/**
	* @private
	*/
	preTransitionComplete: function () {
		this.shrinking = false;
		this.doPreTransitionComplete();
	},

	/**
	* @private
	*/
	postTransitionComplete: function () {
		this.growing = false;
		this.doPostTransitionComplete();
	},

	/**
	* @private
	*/
	animationComplete: function (sender, event) {
		if (this.shrinking) {
			this.removeClass('shrinking');
			this.preTransitionComplete();
			return true;
		}
		if (this.growing) {
			this.removeClass('growing');
			this.postTransitionComplete();
			return true;
		}
	},

	/**
	* @private
	*/
	headerAnimationComplete: function (sender, event) {
		if (event.animation) {
			switch (event.animation.name) {
			case 'collapseToSmall':
			case 'expandToLarge':
				// FIXME: It would be better to call this during the animation so it resizes
				// smoothly, but that's not possible with CSS transitions; it will jump now
				this.resize();
				return true;	// We stop header animation event bubble up here.
			}
		}
	}
});
