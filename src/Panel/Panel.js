/**
* Contains the declaration for the {@link module:moonstone/Panel~Panel} kind.
* @module moonstone/Panel
*/

require('moonstone');

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
	Header = require('moonstone/Header');

/**
* Fires when this [panel]{@link module:moonstone/Panel~Panel} has completed its pre-arrangement transition.
* No additional data is passed with this event.
*
* @event module:moonstone/Panel~Panel#onPreTransitionComplete
* @type {Object}
* @public
*/

/**
* Fires when this [panel]{@link module:moonstone/Panel~Panel} has completed its post-arrangement transition.
* No additional data is passed with this event.
*
* @event module:moonstone/Panel~Panel#onPostTransitionComplete
* @type {Object}
* @public
*/

/**
* {@link module:moonstone/Panel~Panel} is the default kind for controls
* created inside a {@link module:moonstone/Panels~Panels} container. A
* Panels container will typically contain several instances of Panel.
*
* The built-in features include an embedded {@link module:moonstone/Header~Header}
* and a {@link module:layout/FittableRows~FittableRows} layout for the main body
* content.
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
	handlers: {
		onSpotlightFocus: 'disableSpotlightDummy'
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
	useFlex: true,

	/**
	* @private
	*/
	panelTools : [
		/* header will be created here programmatically in createTools after mixing-in headerOptions */
		{name: 'panelBody', kind: FittableRows, fit: true, classes: 'moon-panel-body'},
		{name: 'spotlightDummy', kind: Control, spotlight: false, style: 'width:0; height:0;'}
	],

	/**
	* @private
	*/
	headerConfig : {name: 'header', kind: Header, isChrome: true},

	/**
	* @private
	*/
	bindings: [
		{from: 'title', to: '$.header.title'},
		{from: 'title', to: '$.breadcrumbText.content'},
		{from: 'titleAbove', to: '$.header.titleAbove'},
		{from: 'titleAbove', to: '$.breadcrumbTitleAbove.content'},
		{from: 'titleBelow', to: '$.header.titleBelow'},
		{from: 'subTitleBelow', to: '$.header.subTitleBelow'},
		{from: 'allowHtmlHeader', to: '$.header.allowHtml'},
		{from: 'allowHtmlHeader', to: '$.breadcrumbText.allowHtml'},
		{from: 'headerBackgroundSrc', to: '$.header.backgroundSrc'},
		{from: 'headerBackgroundPosition', to: '$.header.backgroundPosition'},
		{from: 'titleUpperCase', to: '$.header.titleUpperCase'},
		{from: 'headerType', to: '$.header.type', oneWay: false}
	],

	/**
	* @private
	*/
	headerComponents: [],

	/**
	* @private
	*/
	isOffscreen: false,

	/**
	* @private
	*/
	events: {
		onPanelOnscreen: '',
		onPanelOffscreen: ''
	},

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
		this.headerTypeChanged();
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
		this.createComponent(hc, {owner:this});
	},

	/**
	* On reflow, updates `this.$.contentWrapper` bounds.
	* @private
	*/
	reflow: function () {
		Control.prototype.reflow.apply(this, arguments);
		this.getInitAnimationValues();
		this.updatePanelBodySize();
	},

	/**
	* Updates `this.$.contentWrapper` to have the height/width of `this`.
	* @private
	*/
	updatePanelBodySize: function () {
		var node = this.hasNode();

		if (!node) {
			return;
		}

		this.$.panelBody.applyStyle('height', this.initialHeight + 'px');
	},

	/**
	* Forcibly applies layout kind changes to `this.$.panelBody`.
	* @private
	*/
	layoutKindChanged: function () {
		this.$.panelBody.setLayoutKind(this.layoutKind);
	},

	/**
	* If spottable controls are added to the Panel instance after initial creation, we need to
	* disable the spotlightDummy. Unfortunately, there's no other reliable way to detect when
	* controls are added *anywhere* within a control's component tree so we have to watch for
	* onSpotlightFocus events to disable the spotlightDummy.
	*
	* @private
	*/
	disableSpotlightDummy: function (sender, event) {
		if (this.$.spotlightDummy.spotlight && event.originator !== this && event.originator !== this.$.spotlightDummy) {
			this.$.spotlightDummy.spotlight = false;
		}
	},

	/**
	* @private
	*/
	updateSpotability: function () {
		if (this.isOffscreen) {
			this.spotlightDisabled = true;
		} else {
			this.spotlightDisabled = false;
			this.$.spotlightDummy.spotlight = false;
			if (!Spotlight.isSpottable(this)) {
				// make dummy div spottable if there is no spottable child
				this.$.spotlightDummy.spotlight = true;
			}
		}
	},

	/**
	* @private
	*/
	headerTypeChanged: function () {
		this.$.header.setType(this.headerType);
		this.$.header.adjustTitleWidth();
		if (this.generated) {
			this.resize();
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
	enableMarquees: function () {
		this.$.header.enableMarquee();
	},

	/**
	* @private
	*/
	disableMarquees: function () {
		this.$.header.disableMarquee();
	},

	/**
	* @private
	*/
	startMarqueeAsNeeded: function (info) {
		var onscreen = !info.isOffscreen;
		if (onscreen) {
			this.$.header.enableMarquee();
			this.$.header.startMarquee();
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
		this.set('isOffscreen', info.isOffscreen);
		this.updateSpotability();
		this.disableMarquees();
		this.startMarqueeAsNeeded(info);
	},

	/**
	* Called directly by {@link module:moonstone/Panels~Panels}.
	* @private
	*/
	updatePanel: function (info) {
		if (!info.animate) {
			this.disableMarquees();
		}

		this.set('isOffscreen', info.isOffscreen);
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
	isOffscreenChanged: function () {
		// Tell the children we're on or off screen
		if (this.isOffscreen) {
			this.waterfallDown('onPanelOffscreen');
		} else {
			this.waterfallDown('onPanelOnscreen');
		}
	},

	/**
	* Was protected
	* @private
	*/
	getInitAnimationValues: function () {
		var panelNode = this.hasNode(), headerNode = this.$.header.hasNode(), bodyNode = this.$.panelBody.hasNode(),
			panelPaddingT = parseInt(dom.getComputedStyleValue(panelNode, 'padding-top'), 10),
			panelPaddingB = parseInt(dom.getComputedStyleValue(panelNode, 'padding-bottom'), 10),
			bodyPaddingT = parseInt(dom.getComputedStyleValue(bodyNode, 'padding-top'), 10),
			panelHeight = panelNode.getBoundingClientRect().height,
			headerHeight = headerNode.getBoundingClientRect().height;
		this.initialHeight = panelHeight - headerHeight - (panelPaddingT + panelPaddingB + bodyPaddingT);
	},

	// Accessibility

	/**
	* @private
	*/
	accessibilityRole: 'region',

	/**
	* @private
	*/
	ariaObservers: [
		{path: ['title', 'accessibilityLabel', 'accessibilityHint'], method: function () {
			var content = this.title,
				prefix = this.accessibilityLabel || content || null,
				label = this.accessibilityHint && prefix && (prefix + ' ' + this.accessibilityHint) ||
						this.accessibilityHint ||
						this.accessibilityLabel ||
						prefix ||
						null;

			this.setAriaAttribute('aria-label', label);
		}}
	],

	/**
	* @private
	*/
	accessibilityLive: 'off'
});
