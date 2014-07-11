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
		//* Facade for the header's _type_ property. You can choose among large, small and mini
		headerType: "large",
		//* Facade for the header's _small_ property
		// Note: This property will be deprecated soon. For backward compatiblity, I leave it for a while.
		// And until it is removed, "small" refers to the historical size, which is now "medium"
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
		headerOptions: null,
		//* When true, the title text will be converted to locale-safe uppercasing
		titleUpperCase: true
	},
	events: {
		//* Fires when this panel has completed its pre-arrangement transition.
		onPreTransitionComplete: "",
		//* Fires when this panel has completed its post-arrangement transition.
		onPostTransitionComplete: ""
	},
	//* @protected
	handlers: {
		onScroll: "scroll",
		onListActionOpenChanged: "handleListActionsOpenChanged"
	},

	//* @protected
	spotlight: "container",
	classes: "moon-panel",
	layoutKind: "FittableRowsLayout",
	headerOption: null, //* Deprecated
	panelTools : [
		{name: "breadcrumb", ontap: "handleBreadcrumbTap", classes: "moon-panel-breadcrumb", components: [
			{name: "breadcrumbViewport", classes: "moon-panel-breadcrumb-viewport", components: [
				{name: "breadcrumbBackground", classes: "moon-panel-small-header-wrapper", components: [
					{name: "breadcrumbTitleAbove", classes: "moon-super-header-text moon-panel-small-header-title-above"},
					{name: "breadcrumbText", mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"], classes: "moon-sub-header-text moon-panel-small-header"}
				]}
			]}
		]},
		{name: "viewport", classes: "moon-panel-viewport", onwebkitAnimationEnd: "animationComplete", components: [
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
		{from: ".allowHtmlHeader", to: ".$.header.allowHtml"},
		{from: ".allowHtmlHeader", to: ".$.breadcrumbText.allowHtml"},
		{from: ".headerBackgroundSrc", to: ".$.header.backgroundSrc"},
		{from: ".headerBackgroundPosition", to: ".$.header.backgroundPosition"},
		{from: ".titleUpperCase", to: ".$.header.titleUpperCase"},
		{from: ".headerType", to: ".$.header.type", oneWay: false},
		{from: ".initialHeight", to: ".$.header.standardListActionHeight"}
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
		// Note: This line will be deprecated soon. For backward compatiblity, I leave it for a while.
		this.smallHeaderChanged();
		this.headerTypeChanged();
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
			}
		}
	},
	handleBreadcrumbTap: function(inSender, inEvent) {
		inEvent.breadcrumbTap = true;
	},
	// Block spot on panel body when listActions is opened
	handleListActionsOpenChanged: function(inSender, inEvent) {
		this.$.panelBody.spotlightDisabled = inEvent.open;
	},
	// Note: smallHeader will be deprecated soon. For backward compatiblity, I leave it for a while.
	scroll: function(inSender, inEvent) {
		if (this.collapsingHeader && ((this.headerType === "large") || !this.smallHeader)) {
			if (inEvent.originator.y < 0) {
				this.collapseHeader();
			} else {
				this.expandHeader();
			}
		}
	},
	// Note: This method will be deprecated soon. For backward compatiblity, I leave it for a while.
	smallHeaderChanged: function() {
		this.$.header.setSmall(this.smallHeader);
		if (this.generated) {
			this.$.contentWrapper.resize();
		}
	},
	headerTypeChanged: function() {
		this.$.header.setType(this.headerType);
		if (this.generated) {
			this.$.contentWrapper.resize();
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
	},	
	removeSpottableBreadcrumbProps: function() {
		this.$.breadcrumbBackground.set("spotlight", false);
		this.$.breadcrumbBackground.removeClass("spotlight");
	},
	removeSpottableProps: function() {
		this.$.breadcrumbBackground.set("spotlight", false);
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
		Called directly on the panel by _moon.Panels_ when the panel has completed a
		transition. You may override this function in a panel subkind to perform
		post-transition work (e.g., loading data for the panel).

		The _inInfo_ argument contains the following information, which may be used
		to determine the context for the transition:

		- inInfo.from: the index the parent Panels was moving from for this transition
		- inInfo.to: the index the parent Panels was moving to for this transition
		- inInfo.index: the current index of this panel
		- inInfo.animate: whether the parent Panels is set to animate or not
		- any additional information provided by the selected arranger, such as
			breadcrumb and offscreen status
	*/
	transitionFinished: function(inInfo) {
		this.updatePanel(inInfo);
	},
	//* @protected
	shrinkAnimation: function() {
		this.growing = false;
		this.shrinking = true;
		this.addClass("shrunken");
		this.addClass("shrinking");
	},
	shrink: function() {
		this.addClass("shrunken");
	},
	growAnimation: function() {
		this.growing = true;
		this.shrinking = false;
		this.addClass("growing");	
		this.removeClass("shrunken");
	},
	grow: function() {
		this.removeClass("shrunken");
	},
	//* @protected
	getInitAnimationValues: function() {
		var node = this.hasNode(),
			paddingT = parseInt(enyo.dom.getComputedStyleValue(node, "padding-top"), 10),
			paddingR = parseInt(enyo.dom.getComputedStyleValue(node, "padding-right"), 10),
			paddingB = parseInt(enyo.dom.getComputedStyleValue(node, "padding-bottom"), 10),
			paddingL = parseInt(enyo.dom.getComputedStyleValue(node, "padding-left"), 10);
		this.set("initialHeight", node.offsetHeight - paddingT - paddingB);
		this.set("initialWidth", node.offsetWidth   - paddingR - paddingL);
	},
	haltAnimations: function() {
		this.removeClass("growing");
		this.removeClass("shrinking");
	},
	preTransitionComplete: function() {
		this.shrinking = false;
		this.doPreTransitionComplete();
	},
	postTransitionComplete: function() {
		this.growing = false;
		this.doPostTransitionComplete();
	},
	animationComplete: function(inSender, inEvent) {
		if (this.shrinking) {
			this.removeClass("shrinking");
			this.preTransitionComplete();
			return true;
		}
		if (this.growing) {
			this.removeClass("growing");
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
			this.resize();
			break;
		}
	}
});
