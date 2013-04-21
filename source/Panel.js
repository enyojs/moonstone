enyo.kind({
	name : "moon.Panel",
	kind: "FittableRows",
	fit : true,
	classes: "moon-panel",
	published: {
		index: 0,
		title: "Title",
		titleBelow: ""
    },
	events : {
    	//* This panel has completed it's pre-arrangement transition
		onPreTransitionComplete: "",
		//* This panel has completed it's post-arrangement transition
		onPostTransitionComplete: ""
	},
	panelTools : [
		{name: "header", kind: "moon.Header"},
		{name: "panelBody", fit: true, classes: "moon-panel-body"},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],
	headerComponents: [
		{content: "This is a TEST!"}
	],
	isBreadcrumb: false,
	
	create: function() {
		this.inherited(arguments);
		this.$.header.createComponents(this.headerComponents);
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
	rendered: function() {
		this.inherited(arguments);
		this.setHeader({
			titleAbove: this.getIndex(),
			title: this.getTitle(),
			titleBelow: this.getTitleBelow(),
		});
	},
	titleChanged: function() {
		this.setHeader({
			title: this.getTitle(),
		});
	},
	titleBelowChanged: function() {
		this.setHeader({
			titleBelow: this.getTitleBelow(),
		});
	},
	preTransitionComplete: function() {
		this.isBreadcrumb = true;
		this.doPreTransitionComplete();
	},
	postTransitionComplete: function() {
		this.isBreadcrumb = false;
		this.doPostTransitionComplete();
	},
	setHeader: function(inData) {
		this.$.header.setTitleAbove(inData.titleAbove);
		this.$.header.setTitle(inData.title);
		this.$.header.setTitleBelow(inData.titleBelow);
	},
	/**
		@param thisIndex panel index in this.container
	*/
	preTransition: function(thisIndex, inFromIndex, inToIndex) {
		//var myIndex = this.container.getPanels().indexOf(this);
		var myIndex = thisIndex;
		if (!this.isBreadcrumb && this.container.layout.isBreadcrumb(myIndex, inToIndex)) {
			this.shrinkPanel();
			return true;
		}
		
		return false;
	},
	postTransition: function(thisIndex, inFromIndex, inToIndex) {
		//var myIndex = this.container.getPanels().indexOf(this);
		var myIndex = thisIndex;
		if (this.isBreadcrumb && !this.container.layout.isBreadcrumb(myIndex, inToIndex)) {
			this.growPanel();
			return true;
		}
		
		return false;
	},
	shrinkPanel: function() {
		this.$.animator.newAnimation({
			animationName: "preTransition",
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
						"width"     : "current",
						"min-width" : "current",
						"max-width" : "current"
					}
				}],
				100: [{
					control: this,
					properties: {
						"width" : "200px",
						"min-width" : "200px",
						"max-width" : "200px"
					}
				}]
			}
		});
		
		this.$.header.animateCollapse();
		this.$.animator.play();
	},
	growPanel: function() {
		this.$.animator.newAnimation({
			animationName: "postTransition",
			duration: 800,
			timingFunction: "cubic-bezier(.42, 0, .16, 1.1)",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"width"     : "current",
						"min-width" : "current",
						"max-width" : "current"
					}
				}],
				25: [{
					control: this,
					properties: {
						"width"     : this.width+"px",
						"min-width" : this.width+"px",
						"max-width" : this.width+"px"
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
						"height"  : "auto"
					}
				}]
			}
		});
		
		this.$.header.animateExpand();
		this.$.animator.play();
	},
	animationComplete: function(inSender, inEvent) {
		switch (inEvent.animationName) {
			case "preTransition":
				this.preTransitionComplete();
				break;
			case "postTransition":
				this.postTransitionComplete();
				break;
		}
	}
});