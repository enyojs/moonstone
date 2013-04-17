enyo.kind({
	name : "moon.Panel",
	kind: "FittableRows",
	fit : true,
	classes: "moon-panel",
	published: {
		title: "Title"
    },
	events : {
    	//* This panel has completed it's pre-arrangement transition
		onPreTransitionComplete: "",
		//* This panel has completed it's post-arrangement transition
		onPostTransitionComplete: ""
	},
	panelTools : [
		{name: "header", kind: "moon.Header"},
		{name: "panelBody", fit: true, classes: "moon-panel-body"}
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
		this.titleChanged();
	},
	titleChanged: function() {
		this.setHeader({index: this.container.getPanels().indexOf(this), title: this.getTitle()});
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
		this.$.header.setTitleAbove(inData.index);
		this.$.header.setTitle(inData.title);
	},
	preTransition: function(inFromIndex, inToIndex) {
		var myIndex = this.container.getPanels().indexOf(this);
		if (!this.isBreadcrumb && this.container.layout.isBreadcrumb(myIndex, inToIndex)) {
			this.shrinkPanel();
			return true;
		}
		
		return false;
	},
	postTransition: function(inFromIndex, inToIndex) {
		var myIndex = this.container.getPanels().indexOf(this);
		
		if (this.isBreadcrumb && !this.container.layout.isBreadcrumb(myIndex, inToIndex)) {
			this.growPanel();
			return true;
		}
		
		return false;
	},
	shrinkPanel: function() {
		var animation = new StyleAnimation({
			duration: 800,
			timingFunction: "cubic-bezier(.42, 0, .16, 1.1)",
			onComplete: enyo.bind(this, function() {
				this.preTransitionComplete();
			}),
			keyframes: {
				0: [{
					control: this.$.header,
					properties: {
						"height" : "current"
					}
				},
				{
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
					control: this.$.header,
					properties: {
						"height" : "95px",
						"width"  : "current"
					}
				},
				{
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
				},
				{
					control: this.$.header,
					properties: {
						"width" : "200px"
					}
				}]
			}
		}).play();
	},
	growPanel: function() {
		var animation = new StyleAnimation({
			duration: 800,
			timingFunction: "cubic-bezier(.42, 0, .16, 1.1)",
			onComplete: enyo.bind(this, function() {
				this.postTransitionComplete();
			}),
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
					control: this.$.header,
					properties: {
						"height" : "current"
					}
				},
				{
					control: this.$.panelBody,
					properties: {
						"height"  : "current",
						"opacity" : "current"
					}
				}],
				50: [{
					control: this.$.header,
					properties: {
						"height" : "current",
						"width"  : "auto"
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
		}).play();
	}
});