/**
	_moon.Panel_ is the default kind for controls created inside a
	<a href="#moon.Panels">moon.Panels</a> container.  Typically, a _moon.Panels_
	will contain several instances of _moon.Panel_.
	
	The built-in features of _moon.Panel_ include a header and a FittableRows
	layout for the main body content.
*/

enyo.kind({
	//* @public
	name : "moon.Panel",
	kind: "FittableRows",
	published: {
		//* Facade for the header's _title_ property
		title: "",
		//* Facade for the header's _titleAbove_ property
		titleAbove: "",
		//* Facade for the header's _titleBelow_ property
		titleBelow: "",
		//* If true, the header's _titleAbove_ property is automatically populated
		//* with the panel number
		autoNumber: true
    },
	events : {
		//* Fires when this panel has completed its pre-arrangement transition.
		onPreTransitionComplete: "",
		//* Fires when this panel has completed its post-arrangement transition.
		onPostTransitionComplete: ""
	},
	//* @protected
	spotlight: "container",
	fit : true,
	classes: "moon-panel",
	panelTools : [
		{name: "header", kind: "moon.Header"},
		{name: "panelBody", kind: "FittableRows", fit: true, classes: "moon-panel-body"},
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
	
	//* @public
	
	autoNumberChanged: function() {
		if (this.getAutoNumber() == true && this.container) {
			this.setTitleAbove(this.clientIndexInContainer() + 1);
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
				100: [
				{
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
	},
	preTransition: function(inFromIndex, inToIndex) {
		if (this.container && !this.isBreadcrumb && this.container.layout.isBreadcrumb(this.clientIndexInContainer(), inToIndex)) {
			this.shrinkPanel();
			return true;
		}
		return false;
	},
	postTransition: function(inFromIndex, inToIndex) {
		if (this.container && this.isBreadcrumb && !this.container.layout.isBreadcrumb(this.clientIndexInContainer(), inToIndex)) {
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