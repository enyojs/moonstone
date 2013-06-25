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
		/**
			If true, the header's _titleAbove_ property is automatically populated
			with the panel index
		*/
		autoNumber: true,
		//* Facade for the header's _small_ property
		smallHeader: false,
		//* If true, collapse the header when the panel body is scrolled down
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
		onScrollStop: "scrollStop"
	},

	//* @protected
	spotlight: "container",
	fit : true,
	classes: "moon-panel",
	layoutKind: "FittableRowsLayout",
	panelTools : [
		{name: "header", kind: "moon.Header"},
		{name: "panelBody", fit: true, classes: "moon-panel-body"},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],
	headerComponents: [],
	isBreadcrumb: false,

	create: function() {
		this.inherited(arguments);
		this.$.header.createComponents(this.headerComponents);
		this.autoNumberChanged();
		this.titleChanged();
		this.titleAboveChanged();
		this.titleBelowChanged();
		this.smallHeaderChanged();
	},
	initComponents: function() {
		this.createTools();
		this.controlParentName = "panelBody";
		this.discoverControlParent();
		this.inherited(arguments);
	},
	createTools: function() {
		this.createComponents(this.panelTools);
	},
	//* Force layout kind changes to apply to _this.$.panelBody_
	layoutKindChanged: function() {
		this.$.panelBody.setLayoutKind(this.getLayoutKind());
		this.layoutKind = "FittableRowsLayout";
		this.inherited(arguments);
	},
	
	scroll: function(inSender, inEvent) {
		if (this.collapsingHeader && !this.smallHeader) {
			if (inEvent.originator.y < 0) {
				this.collapseHeader(inEvent.originator.y);
			} else {
				this.expandHeader(inEvent.originator.y);
			}
		}
		
		this.resized();
	},
	scrollStop: function(inSender, inEvent) {
		if (this.collapsingHeader && !this.smallHeader) {
			this.resized();
		}
	},
	collapseHeader: function(inY) {
		var height = (this.smallHeader) ? 180 : 270,
			currentHeight = this.$.header.getBounds().height
		;
		
		if (currentHeight !== height) {
			// this.$.header.applyStyle("height", height+"px");
			this.$.header.collapseToSmall();
		}
	},
	expandHeader: function(inY) {
		var height = (this.smallHeader) ? 250 : 400;
			currentHeight = this.$.header.getBounds().height
		;
		
		if (currentHeight !== height) {
			this.$.header.expandToLarge();
			//this.$.header.applyStyle("height", height+"px");
		}
	},

	//* @public

	autoNumberChanged: function() {
		if (this.getAutoNumber() === true && this.container) {
			this.setTitleAbove(this.indexInContainer() + 1);
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
	//* Updates _this.header_ when _smallHeader_ changes.
	smallHeaderChanged: function() {
		this.$.header.setSmall(this.getSmallHeader());
	},
	//* Get _this.header_ to update panel header dynamically.
	getHeader: function() {
		return this.$.header;
	},
	shrinkPanel: function() {
		this.$.animator.newAnimation({
			name: "preTransition",
			duration: 800,
			timingFunction: "cubic-bezier(.42, 0, .16, 1.1)",
			keyframes: {
				0: [{
					control: this.$.panelBody,
					properties: {
						"height" : "current"
					}
				}],
				25: [{
					control: this.$.panelBody,
					properties: {
						"opacity" : "1"
					}
				}],
				50: [{
					control: this.$.panelBody,
					properties: {
						"height"  : "0px",
						"opacity" : "0"
					}
				},
				{
					control: this,
					properties: {
						"width" : "current"
					}
				}],
				100: [{
					control: this,
					properties: {
						"width" : "200px"
					}
				}]
			}
		});

		this.$.header.animateCollapse();
		this.$.animator.play("preTransition");
	},
	growPanel: function() {
		this.$.animator.newAnimation({
			name: "postTransition",
			duration: 800,
			timingFunction: "cubic-bezier(.42, 0, .16, 1.1)",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"width" : "current"
					}
				}],
				25: [{
					control: this,
					properties: {
						"width" : this.actualWidth+"px"
					}
				},
				{
					control: this.$.panelBody,
					properties: {
						"height"  : "current",
						"opacity" : "current"
					}
				}],
				75: [{
					control: this.$.panelBody,
					properties: {
						"opacity" : "1"
					}
				}],
				100: [{
					control: this.$.panelBody,
					properties: {
						"height" : "auto"
					}
				}]
			}
		});

		this.$.header.animateExpand();
		this.$.animator.play("postTransition");
	},

	//* @protected

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
		if (this.container && !this.isBreadcrumb && options.isBreadcrumb) {
			this.shrinkPanel();
			return true;
		}
		return false;
	},
	postTransition: function(inFromIndex, inToIndex, options) {
		if (this.container && this.isBreadcrumb && !options.isBreadcrumb) {
			this.growPanel();
			return true;
		}
		return false;
	},
	animationComplete: function(inSender, inEvent) {
		switch (inEvent.animation.name) {
			case "preTransition":
				this.preTransitionComplete();
				break;
			case "postTransition":
				this.postTransitionComplete();
				break;
		}
	}
});
