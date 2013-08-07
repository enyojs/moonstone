//* @public
/**
	_moon.Panel_ is the default kind for controls created inside a
	<a href="#moon.Panels">moon.Panels</a> container.  Typically, a _moon.Panels_
	will contain several instances of _moon.Panel_.

	The built-in features of _moon.Panel_ include a header and a FittableRows
	layout for the main body content.
*/

enyo.kind({
	name : "moon.Panel",
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
		collapsingHeader: false
	},
	events : {
		//* Fires when this panel has completed its pre-arrangement transition.
		onPreTransitionComplete: "",
		//* Fires when this panel has completed its post-arrangement transition.
		onPostTransitionComplete: ""
	},
	handlers: {
		onScroll: "scroll",
		onPanelsPostTransitionFinished: "panelsTransitionFinishHandler",
	},

	//* @protected
	spotlight: "container",
	fit : true,
	classes: "moon-panel",
	layoutKind: "FittableRowsLayout",
	headerOption: null,
	panelTools : [
		{name: "contentWrapper", classes: "moon-panel-content-wrapper", components: [
			{name: "header", kind: "moon.Header", onComplete: "headerAnimationComplete"},
			{name: "panelBody", fit: true, classes: "moon-panel-body"}
		]},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],
	headerComponents: [],
	isBreadcrumb: false,
	isCollapsed: false,

	create: function() {
		this.inherited(arguments);
		this.$.header.createComponents(this.headerComponents, {owner: this});
		this.autoNumberChanged();
		this.titleChanged();
		this.titleAboveChanged();
		this.titleBelowChanged();
		this.subTitleBelowChanged();
		this.smallHeaderChanged();
	},
	initComponents: function() {
		this.createTools();
		this.controlParentName = "panelBody";
		this.discoverControlParent();
		this.inherited(arguments);
	},
	createTools: function() {
		var $pts = enyo.clone(this.get("panelTools"));
		var $h = enyo.clone(this.get("headerOption") || {});
		enyo.mixin($pts[0], $h);
		this.createComponents(this.panelTools);
	},
	//* On reflow, update _this.$.contentWrapper_ bounds
	reflow: function() {
		this.inherited(arguments);
		this.updateWrapperSize();
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
		this.layoutKind = "FittableRowsLayout";
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
		if (!this.isCollapsed) {
			this.$.header.collapseToSmall();
			this.isCollapsed = true;
		}
	},
	expandHeader: function() {
		if (this.isCollapsed) {
			this.$.header.expandToLarge();
			this.isCollapsed = false;
		}
	},

	//* @public

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
	//* Updates panel header dynamically.
	getHeader: function() {
		return this.$.header;
	},
	shrinkPanel: function() {
		this.getInitAnimationValues();
		this.shrinkingHeightAnimation();
	},
	growPanel: function() {
		this.growingWidthAnimation();
	},
	//* @protected
	getInitAnimationValues: function() {
		var node = this.hasNode();
		this.initialHeight = node.offsetHeight + "px";
		this.initialWidth = node.offsetWidth + "px";
	},
	shrinkingHeightAnimation: function() {
		this.$.animator.newAnimation({
			name: "shrinkHeight",
			duration: 500,
			timingFunction: "cubic-bezier(.68, .4, .6, 1.6)",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"height" : "current"
					}
				}],
				100: [{
					control: this,
					properties: {
						"height"  : "160px"
					}
				}]
			}
		});
		this.$.animator.play("shrinkHeight");
	},
	shrinkingWidthAnimation: function() {
		var breadcrumbWidth = (this.container.layout && this.container.layout.breadcrumbWidth) || 200;
		this.$.animator.newAnimation({
			name: "shrinkWidth",
			duration: 300,
			timingFunction: "cubic-bezier(.68, .4, .6, 1.2)",
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
		this.$.animator.play("shrinkWidth");
	},
	growingHeightAnimation: function() {
		this.$.animator.newAnimation({
			name: "growHeight",
			duration: 300,
			timingFunction: "cubic-bezier(0.25, -0.1, .83, .67)",
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
		this.$.animator.play("growHeight");
	},
	growingWidthAnimation: function() {
		this.$.animator.newAnimation({
			name: "growWidth",
			duration: 300,
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
		this.$.animator.play("growWidth");
	},
	panelsTransitionFinishHandler: function(inSender, inEvent) {
		if(inEvent.active >= inEvent.index) {
			this.$.header.startMarquee();
		} else {
			this.$.header.stopMarquee();
		}
	},
	preTransitionComplete: function() {
		this.isBreadcrumb = true;
		this.doPreTransitionComplete();
	},
	postTransitionComplete: function() {
		this.isBreadcrumb = false;
		this.doPostTransitionComplete();
		this.resized();
	},
	preTransition: function(inFromIndex, inToIndex, options) {
		this.$.header.stopMarquee();
		if (inFromIndex < inToIndex && this.container && !this.isBreadcrumb && options.isBreadcrumb) {
			this.shrinkPanel();
			return true;
		}
		return false;
	},
	postTransition: function(inFromIndex, inToIndex, options) {
		if (inFromIndex > inToIndex && this.container && this.isBreadcrumb && !options.isBreadcrumb) {
			this.growPanel();
			return true;
		}
		return false;
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
	headerAnimationComplete: function(inSender, inEvent) {
		switch (inEvent.animation.name) {
		case "collapseToSmall":
		case "expandToLarge":
			// FIXME: It would be better to call this during the animation so it resizes
			// smoothly, but that's not possible with CSS transitions; it will jump now
			this.resized();
			break;
		}
	}
});
