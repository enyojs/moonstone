//* @public
/**
	_moon.Panel_ is the default kind for controls created inside a
	<a href="#moon.Panels">moon.Panels</a> container.  Typically, a _moon.Panels_
	will contain several instances of _moon.Panel_.

	The built-in features of _moon.Panel_ include a header and a FittableRows
	layout for the main body content.
*/

enyo.kind({
	name: "moon.Panel",
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
		allowHtmlHeader: false
	},
	events: {
		//* Fires when this panel has completed its pre-arrangement transition.
		onPreTransitionComplete: "",
		//* Fires when this panel has completed its post-arrangement transition.
		onPostTransitionComplete: ""
	},
	handlers: {
		onScroll: "scroll",
		onPanelsPostTransitionFinished: "panelsTransitionFinishHandler"
	},

	//* @protected
	spotlight: "container",
	fit: true,
	classes: "moon-panel",
	layoutKind: "FittableRowsLayout",
	headerOption: null,
	panelTools : [
		{name: "contentWrapper", kind:"FittableRows", classes: "moon-panel-content-wrapper", components: [
			/* headerTools will be created here */
			{name: "miniHeader", kind: "moon.MarqueeText", classes: "moon-panel-miniheader", content: "Mini header", showing: false},
			{name: "panelBody", kind: "FittableRows", fit: true, classes: "moon-panel-body"}
		]},
		{name: "animator", kind: "StyleAnimator", onStep: "animationStep", onComplete: "animationComplete"}
	],
	headerConfig : {name: "header", kind: "moon.Header", onComplete: "headerAnimationComplete", isChrome: true},
	headerComponents: [],
	isBreadcrumb: false,
	isHeaderCollapsed: false,
	shrinking: false,
	growing: false,

	create: function() {
		this.inherited(arguments);
		// FIXME: Need to determine whether headerComponents was passed on the instance or kind to get the ownership correct
		if (this.headerComponents) {
			var hc = enyo.constructorForKind(this.kind).prototype.headerComponents;
			var hcOwner = (hc == this.headerComponents) ? this : this.getInstanceOwner();
			this.$.header.createComponents(this.headerComponents, {owner: hcOwner});
		}
		this.autoNumberChanged();
		this.titleChanged();
		this.titleAboveChanged();
		this.titleBelowChanged();
		this.subTitleBelowChanged();
		this.smallHeaderChanged();
		this.allowHtmlHeaderChanged();
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
		hc.addBefore = this.$.miniHeader;
		enyo.mixin(hc, this.headerOption);
		this.$.contentWrapper.createComponent(hc, {owner:this});
	},
	//* On reflow, update _this.$.contentWrapper_ bounds
	reflow: function() {
		this.inherited(arguments);
		this.updateWrapperSize();
		this.getInitAnimationValues();
		this.shrinkWidthAnimation = this.createShrinkingWidthAnimation();
		this.shrinkHeightAnimation = this.createShrinkingHeightAnimation();
		this.growWidthAnimation = this.createGrowingWidthAnimation();
		this.growHeightAnimation = this.createGrowingHeightAnimation();
	},
	//* Update _this.$.contentWrapper_ to have the height/width of _this_
	updateWrapperSize: function() {
		var node = this.hasNode();

		if (!node) {
			return;
		}

		this.$.contentWrapper.applyStyle("width", node.offsetWidth + "px");
		this.$.contentWrapper.applyStyle("height", node.offsetHeight + "px");
	},
	//* Forcibly applies layout kind changes to _this.$.panelBody_.
	layoutKindChanged: function() {
		this.$.panelBody.setLayoutKind(this.getLayoutKind());
		this.inherited(arguments);
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
			var n = this.indexInContainer() + 1;
			n = ((n < 10) ? "0" : "") + n;
			this.setTitleAbove(n);
		}
	},
	//* Updates _this.header_ when _title_ changes.
	titleChanged: function() {
		this.$.header.setTitle(this.getTitle());
		this.$.miniHeader.setContent(this.getTitle());
	},
	//* Updates _this.header_ when _titleAbove_ changes.
	titleAboveChanged: function() {
		this.$.header.setTitleAbove(this.getTitleAbove());
	},
	//* Updates _this.header_ when _titleBelow_ changes.
	titleBelowChanged: function() {
		this.$.header.setTitleBelow(this.getTitleBelow());
	},
	//* Updates _this.header_ when _subTitleBelow_ changes.
	subTitleBelowChanged: function() {
		this.$.header.setSubTitleBelow(this.getSubTitleBelow());
	},
	//* Updates _this.header_ when _smallHeader_ changes.
	smallHeaderChanged: function() {
		this.$.header.setSmall(this.getSmallHeader());
	},
	//* Update _allowHtml_ property of header components
	allowHtmlHeaderChanged: function() {

		this.$.header.setAllowHtml(this.allowHtmlHeader);
	},
	//* Updates panel header dynamically.
	getHeader: function() {
		return this.$.header;
	},
	shrinkPanel: function() {
		this.growing = false;
		this.shrinking = true;
		this.showingSmallHeader = false;
		this.shrinkingHeightAnimation();
	},
	growPanel: function() {
		this.growing = true;
		this.shrinking = false;
		this.showingSmallHeader = true;
		this.growingWidthAnimation();
	},
	//* @protected
	getInitAnimationValues: function() {
		var node = this.hasNode();
		this.initialHeight = node.offsetHeight + "px";
		this.initialWidth = node.offsetWidth + "px";
	},
	shrinkingHeightAnimation: function() {
 		this.haltAnimations();
		this.$.animator.play(this.shrinkHeightAnimation.name);
	},
	shrinkingWidthAnimation: function() {
		this.haltAnimations();
		this.$.animator.play(this.shrinkWidthAnimation.name);
	},
	growingHeightAnimation: function() {
 		this.haltAnimations();
		this.$.animator.play(this.growHeightAnimation.name);
	},
	growingWidthAnimation: function() {
		this.haltAnimations();
		this.$.animator.play(this.growWidthAnimation.name);
	},
	haltAnimations: function() {
		this.$.animator.stop();
		this.$.animator.pause(this.growWidthAnimation.name);
		this.$.animator.pause(this.growHeightAnimation.name);
		this.$.animator.pause(this.shrinkWidthAnimation.name);
		this.$.animator.pause(this.shrinkHeightAnimation.name);
	},
	panelsTransitionFinishHandler: function(inSender, inEvent) {
		// run miniHeader marquee when we're collapsed
		if(this.showingSmallHeader) {
			this.$.miniHeader.startMarquee();
		} else {
			this.$.miniHeader.stopMarquee();
			if (inEvent.active == inEvent.index) {
				this.$.header.startMarquee();
			}
		}
		return true;
	},
	preTransitionComplete: function() {
		this.shrinking = false;
		this.isBreadcrumb = true;
		this.doPreTransitionComplete();
	},
	postTransitionComplete: function() {
		this.growing = false;
		this.isBreadcrumb = false;
		this.doPostTransitionComplete();
		this.resized();
	},
	preTransition: function(inFromIndex, inToIndex, options) {
		this.$.header.stopMarquee();
		this.$.miniHeader.stopMarquee();
		
		if (!this.shrinking && options.isBreadcrumb && (!this.isBreadcrumb || this.growing)) {
			this.shrinkPanel();
			return true;
		}
		
		return false;
	},
	postTransition: function(inFromIndex, inToIndex, options) {
		if (!this.growing && !options.isBreadcrumb && (this.isBreadcrumb || this.shrinking)) {
			this.growPanel();
			return true;
		}
		
		return false;
	},
	animationStep: function(inSender, inEvent) {
		if (inEvent.animation.name === "shrinkHeight" && inEvent.animation.percentElapsed >= 75 && !this.showingSmallHeader) {
			this.showSmallHeader();
		} else if (inEvent.animation.name === "growHeight" && inEvent.animation.percentElapsed >= 20 && this.showingSmallHeader) {
			this.hideSmallHeader();
		}
		return true;
	},
	animationComplete: function(inSender, inEvent) {
		switch (inEvent.animation.name) {
			case "shrinkHeight":
				this.shrinkingWidthAnimation();
				return true;
			case "shrinkWidth":
				this.preTransitionComplete();
				return true;
			case "growWidth":
				this.growingHeightAnimation();
				return true;
			case "growHeight":
				this.postTransitionComplete();
				return true;
		}
	},
	showSmallHeader: function() {
		this.$.miniHeader.setShowing(true);
		this.$.header.addClass("hidden-title");
		this.showingSmallHeader = true;
	},
	hideSmallHeader: function() {
		this.$.miniHeader.setShowing(false);
		this.$.header.removeClass("hidden-title");
		this.showingSmallHeader = false;
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
	createGrowingWidthAnimation: function() {
		return this.$.animator.newAnimation({
			name: "growWidth",
			duration: 225,
			timingFunction: "cubic-bezier(.25,.1,.25,1)",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"width"  : "current"
					}
				}],
				100: [{
					control: this,
					properties: {
						"width" : this.initialWidth
					}
				}]
			}
		});
	},
	createGrowingHeightAnimation: function() {
		return this.$.animator.newAnimation({
			name: "growHeight",
			duration: 400,
			timingFunction: "cubic-bezier(.6, -.8, .6, 1.2)",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"height"  : "current"
					}
				}],
				100: [{
					control: this,
					properties: {
						"height" : this.initialHeight
					}
				}]
			}
		});
	},
	createShrinkingWidthAnimation: function() {
		var breadcrumbWidth = (this.container && this.container.layout && this.container.layout.breadcrumbWidth) || 200;
		return this.$.animator.newAnimation({
			name: "shrinkWidth",
			duration: 225,
			timingFunction: "cubic-bezier(.68,.4,.56,.98)",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"width" : "current"
					}
				}],
				100: [{
					control: this,
					properties: {
						"width" : breadcrumbWidth + "px"
					}
				}]
			}
		});
	},
	createShrinkingHeightAnimation: function() {
		return this.$.animator.newAnimation({
			name: "shrinkHeight",
			duration: 500,
			timingFunction: "cubic-bezier(.68, .4, .6, 1.6)",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"height"  : "current"
					}
				}],
				100: [{
					control: this,
					properties: {
						"height"  : "160px",
						"width"   : "300px"
					}
				}]
			}
		});
	}
});
