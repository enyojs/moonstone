//* @public
/**
	_moon.Panel_ is the default kind for controls created inside a
	[moon.Panels](#moon.Panels) container. A _moon.Panels_ will typically contain
	several instances of _moon.Panel_.

	The built-in features of _moon.Panel_ include a header and a FittableRows
	layout for the main body content.
*/

enyo.kind({
	name: "moon.Panel",
	//* @public
	published: {
		//* Facade for the header's _title_ property
		title: "",
		//* Facade for the header's _titleAbove_ property
		titleAbove: "",
		//* Facade for the header's _titleBelow_ property
		titleBelow: "",
		//* Facade for the header's _subTitleBelow_ property
		subTitleBelow: "",
		/**
			If true, the header's _titleAbove_ property is automatically populated
			with the panel index
		*/
		autoNumber: true,
		//* Facade for the header's _small_ property
		smallHeader: false,
		//* If true, the header collapses when the panel body is scrolled down
		collapsingHeader: false,
		//* Title's _allowHtml_ property
		allowHtmlHeader: false,
		//* URL of a background image for the header
		headerBackgroundSrc: null,
		//* Position properties for the header's background image
		headerBackgroundPosition: "top right",
		//* Header options
		headerOptions: null
	},
	events: {
		//* Fires when this panel has completed its pre-arrangement transition.
		onPreTransitionComplete: "",
		//* Fires when this panel has completed its post-arrangement transition.
		onPostTransitionComplete: ""
	},
	//* @protected
	handlers: {
		onScroll: "scroll"
	},

	//* @protected
	spotlight: "container",
	classes: "moon-panel",
	layoutKind: "FittableRowsLayout",
	headerOption: null, //* Deprecated
	panelTools : [
		{name: "breadcrumb", ontap: "handleBreadcrumbTap", classes: "moon-panel-breadcrumb", components: [
			{name: "breadcrumbViewport", classes: "moon-panel-breadcrumb-viewport", components: [
				{name: "breadcrumbBackground", classes: "moon-panel-mini-header-wrapper", components: [
					{name: "breadcrumbTitleAbove", classes: "moon-super-header-text moon-panel-mini-header-title-above"},
					{name: "breadcrumbText", mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"], classes: "moon-sub-header-text moon-panel-mini-header"}
				]}
			]}
		]},
		{name: "viewport", classes: "moon-panel-viewport", components: [
			{name: "contentWrapper", kind:"FittableRows", classes: "moon-panel-content-wrapper", components: [
				/* header will be created here programmatically in createTools after mixing-in headerOptions */
				{name: "panelBody", kind: "FittableRows", fit: true, classes: "moon-panel-body"}
			]}
		]},

		{name: "animator", kind: "enyo.StyleAnimator", onComplete: "animationComplete"}
	],
	headerConfig : {name: "header", kind: "moon.Header", onComplete: "headerAnimationComplete", isChrome: true},
	bindings: [
		{from: ".title", to: ".$.header.title"},
		{from: ".title", to: ".$.breadcrumbText.content"},
		{from: ".titleAbove", to: ".$.header.titleAbove"},
		{from: ".titleAbove", to: ".$.breadcrumbTitleAbove.content"},
		{from: ".titleBelow", to: ".$.header.titleBelow"},
		{from: ".subTitleBelow", to: ".$.header.subTitleBelow"},
		{from: ".smallHeader", to: ".$.header.small"},
		{from: ".allowHtmlHeader", to: ".$.header.allowHtml"},
		{from: ".headerBackgroundSrc", to: ".$.header.backgroundSrc"},
		{from: ".headerBackgroundPosition", to: ".$.header.backgroundPosition"}
	],

	headerComponents: [],
	isBreadcrumb: false,
	isOffscreen: false,
	isHeaderCollapsed: false,
	shrinking: false,
	growing: false,

	create: function() {
		this.inherited(arguments);
		// FIXME: Need to determine whether headerComponents was passed on the instance or kind to get the ownership correct
		if (this.headerComponents) {
			var owner = this.hasOwnProperty("headerComponents") ? this.getInstanceOwner() : this;
			this.$.header.createComponents(this.headerComponents, {owner: owner});
		}
		this.autoNumberChanged();
	},
	initComponents: function() {
		this.createTools();
		this.controlParentName = "panelBody";
		this.discoverControlParent();
		this.inherited(arguments);
	},
	createTools: function() {
		// Create everything but the header
		this.createChrome(this.panelTools);
		// Special-handling for header, which can have its options modified by the instance
		var hc = enyo.clone(this.headerConfig || {});
		hc.addBefore = this.$.panelBody;
		enyo.mixin(hc, this.headerOptions || this.headerOption);
		this.$.contentWrapper.createComponent(hc, {owner:this});
	},
	//* On reflow, updates _this.$.contentWrapper_ bounds.
	reflow: function() {
		this.inherited(arguments);
		this.getInitAnimationValues();
		this.updateViewportSize();
		this.createShrinkAnimation();
		this.createGrowAnimation();
		this.shrinkAsNeeded();
	},
	//* Updates _this.$.contentWrapper_ to have the height/width of _this_.
	updateViewportSize: function() {
		var node = this.hasNode();

		if (!node || this.isBreadcrumb) {
			return;
		}

		this.$.viewport.applyStyle("height", this.initialHeight + "px");
		this.$.viewport.applyStyle("width", this.initialWidth + "px");
		this.$.contentWrapper.applyStyle("height", this.initialHeight + "px");
		this.$.contentWrapper.applyStyle("width", this.initialWidth + "px");
	},
	//* Forcibly applies layout kind changes to _this.$.panelBody_.
	layoutKindChanged: function() {
		this.$.panelBody.setLayoutKind(this.getLayoutKind());
	},
	//* Updates spottability.
	updatesSpottability: function() {
		if (this.isBreadcrumb && !this.isOffscreen) {
			this.addSpottableBreadcrumbProps();
		} else {
			this.removeSpottableBreadcrumbProps();
		}
	},
	handleBreadcrumbTap: function(inSender, inEvent) {
		inEvent.breadcrumbTap = true;
	},
	scroll: function(inSender, inEvent) {
		if (this.collapsingHeader && !this.smallHeader) {
			if (inEvent.originator.y < 0) {
				this.collapseHeader();
			} else {
				this.expandHeader();
			}
		}
	},
	collapseHeader: function() {
		if (!this.isHeaderCollapsed) {
			this.$.header.collapseToSmall();
			this.isHeaderCollapsed = true;
		}
	},
	expandHeader: function() {
		if (this.isHeaderCollapsed) {
			this.$.header.expandToLarge();
			this.isHeaderCollapsed = false;
		}
	},
	//* Updates _this.titleAbove_ when _this.autoNumber_ changes.
	autoNumberChanged: function() {
		if (this.getAutoNumber() === true && this.container) {
			// This gets the index regardless of whether the panel is client or chome
			var n = this.parent.indexOfChild(this) + 1;
			n = ((n < 10) ? "0" : "") + n;
			this.setTitleAbove(n);
		}
	},
	generateAutoNumber: function() {
		var adjustedIndex = this.indexInContainer() + 1;
		return (adjustedIndex < 10) ? "0"+ adjustedIndex : adjustedIndex;
	},
	addSpottableBreadcrumbProps: function() {
		this.$.breadcrumbBackground.set("spotlight", true);
		this.spotlightDisabled = true;
	},	
	removeSpottableBreadcrumbProps: function() {
		this.$.breadcrumbBackground.set("spotlight", false);
		this.$.breadcrumbBackground.removeClass("spotlight");
		this.spotlightDisabled = false;
	},
	shrinkAsNeeded: function() {
		if (this.needsToShrink) {
			this.shrink();
			this.needsToShrink = false;
		}
	},
	enableMarquees: function() {
		this.$.breadcrumbText.enableMarquee();
		this.$.header.enableMarquee();
	},
	disableMarquees: function() {
		this.$.breadcrumbText.disableMarquee();
		this.$.header.disableMarquee();
	},
	startMarqueeAsNeeded: function(inInfo) {
		var onscreen = !inInfo.offscreen;
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
	//* Updates panel header dynamically.
	getHeader: function() {
		return this.$.header;
	},
	// Called directly by moon.Panels
	initPanel: function(inInfo) {
		this.set("isBreadcrumb", inInfo.breadcrumb);
		this.set("isOffscreen", inInfo.offscreen);
		this.updatesSpottability();
		if (this.isBreadcrumb) {
			this.needsToShrink = true;
		}
		this.disableMarquees();
		this.startMarqueeAsNeeded(inInfo);
	},
	// Called directly by moon.Panels
	preTransition: function(inInfo) {
		this.disableMarquees();

		if (!this.shrinking && inInfo.breadcrumb && (!this.isBreadcrumb || this.growing)) {
			this.shrinkAnimation();
			return true;
		}

		return false;
	},
	// Called directly by moon.Panels
	postTransition: function(inInfo) {
		if (!this.growing && !inInfo.breadcrumb && (this.isBreadcrumb || this.shrinking)) {
			this.growAnimation();
			return true;
		}

		return false;
	},
	// Called directly by moon.Panels
	updatePanel: function(inInfo) {
		if (!inInfo.animate) {
			this.disableMarquees();

			if (this.isBreadcrumb === true && inInfo.breadcrumb === false) {
				this.grow();
			}
			if (this.isBreadcrumb === false && inInfo.breadcrumb === true) {
				this.shrink();
			}
		}
		this.set("isBreadcrumb", inInfo.breadcrumb);
		this.set("isOffscreen", inInfo.offscreen);
		this.updatesSpottability();
		this.startMarqueeAsNeeded(inInfo);
	},
	//* @public
	/**
		The `transitionFinished` method is called directly on the panel by `moon.Panels` when the
		panel has completed a transition.  You can override this function in a panel sub-kind to
		perform post-transition work such as loading data for the panel, for example.  The `inInfo`
		argument carries the following information, which can be used to determine the context for
		the transition:
		- inInfo.from: the index the parent panels was moving from for this transition
		- inInfo.to: the index the parent panels was moving from for this transition
		- inInfo.index: the current index of this panel
		- inInfo.animate: whether the parent panels is set to animate or not
		- plus any additional information provided by the selected arranger, such as breadcrumb and
			offscreen status, for example
	*/
	transitionFinished: function(inInfo) {
		this.updatePanel(inInfo);
	},
	//* @protected
	shrinkAnimation: function() {
		this.growing = false;
		this.shrinking = true;
		this.haltAnimations();
		this.$.animator.play("shrink");
	},
	shrink: function() {
		this.$.animator.jumpToEnd("shrink");
	},
	growAnimation: function() {
		this.growing = true;
		this.shrinking = false;
		this.haltAnimations();
		this.$.animator.play("grow");			
	},
	grow: function() {
		this.$.animator.jumpToEnd("grow");
	},
	//* @protected
	getInitAnimationValues: function() {
		var node = this.hasNode(),
			paddingT = parseInt(enyo.dom.getComputedStyleValue(node, "padding-top"), 10),
			paddingR = parseInt(enyo.dom.getComputedStyleValue(node, "padding-right"), 10),
			paddingB = parseInt(enyo.dom.getComputedStyleValue(node, "padding-bottom"), 10),
			paddingL = parseInt(enyo.dom.getComputedStyleValue(node, "padding-left"), 10);
		this.initialHeight = node.offsetHeight - paddingT - paddingB;
		this.initialWidth = node.offsetWidth   - paddingR - paddingL;
	},
	haltAnimations: function() {
		this.$.animator.stop();
		this.$.animator.pause("grow");
		this.$.animator.pause("shrink");
	},
	preTransitionComplete: function() {
		this.shrinking = false;
		this.doPreTransitionComplete();
	},
	postTransitionComplete: function() {
		this.growing = false;
		this.doPostTransitionComplete();
		this.resized();
	},
	animationComplete: function(inSender, inEvent) {
		switch (inEvent.animation.name) {
		case "shrink":
			this.preTransitionComplete();
			return true;
		case "grow":
			this.postTransitionComplete();
			return true;
		}
	},
	headerAnimationComplete: function(inSender, inEvent) {
		switch (inEvent.animation.name) {
		case "collapseToSmall":
		case "expandToLarge":
			// FIXME: It would be better to call this during the animation so it resizes
			// smoothly, but that's not possible with CSS transitions; it will jump now
			this.resized();
			break;
		}
	},
	createGrowAnimation: function() {
		this.$.animator.newAnimation({
			name: "grow",
			duration: 400,
			timingFunction: "cubic-bezier(.25,.1,.25,1)",
			keyframes: {
				0: [
					{control: this.$.viewport, properties: {"height"  : "0px"}},
					{control: this.$.breadcrumbViewport, properties: { "height": "current" }}
				],
				50: [
					{control: this.$.breadcrumbViewport, properties: { "height": "0px" }}
				],
				100: [
					{control: this.$.viewport, properties: {"height" : this.initialHeight + "px"}}
				]
			}
		});
	},
	createShrinkAnimation: function() {
		this.$.animator.newAnimation({
			name: "shrink",
			duration: 500,
			timingFunction: "cubic-bezier(.25,.1,.25,1)",
			keyframes: {
				0: [
					{control: this.$.viewport, properties: { "height"  : "current" }}
				],
				50: [
					{control: this.$.breadcrumbViewport, properties: { "height": "current" }}
				],
				100: [
					{control: this.$.viewport, properties: { "height"  : "0px" }},
					{control: this.$.breadcrumbViewport, properties: { "height": "370px" }}
				]
			}
		});
	}
});
