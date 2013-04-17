enyo.kind({
	name : "moon.Panel",
	fit : true,
	realtimeFit : true,
	style: "overflow:hidden;",
	published: {
		/**
			_transitionReady_ indicates that this object is ready to transit.
			If this object does not have any transition or it has and conducted already, 
			true value will be assigned.
			Otherhand, if this object has some transition and conducted yet, false will be assinged.
			Default value is null.
		*/
		transitionReady: null,
		title: "Title"
    },
	events : {
		onTapHandler : "",
    	/**	
    		Notify that this object will transit.
    	*/
    	onPreTransitionStart: "",
    	/**	
    		Notify that this object just finished its transition
    	*/
    	onPreTransitionFinish: "",
		onPreTransitionComplete: "",
		onPostTransitionComplete: ""
	},
	components : [
		{name : "header", kind: "moon.Header", content : "header", titleAbove: "test", style: "padding: 0px 0px 0px 20px;display:block;"},
		{name : "client", content : "client", style : "overflow:hidden;", ontap : "tapHandler"},
		{name : "smallTitle",  style : "height:30px;position:absolute;left:25px;top:50px;overflow:hidden;", components : [	
			{name : "smallText", content : "", style : "position:relative;font-size:25px;top:25px;font-weight:bold;"}
		]}
	],
	isBreadcrumb: false,
	
	rendered: function() {
		this.inherited(arguments);
		this.titleChanged();
	},
	titleChanged: function() {
		this.setHeader({index: this.container.getPanels().indexOf(this), title: this.getTitle()});
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
					control: this.$.client,
					properties: {
						"height" : "current"
					}
				}],
				25: [{
					control: this.$.client,
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
					control: this.$.client,
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
	preTransitionComplete: function() {
		this.isBreadcrumb = true;
		this.doPreTransitionComplete();
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
					control: this.$.client,
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
					control: this.$.client,
					properties: {
						"opacity" : "1"
					}
				}],
				100: [
				{
					control: this.$.client,
					properties: {
						"height"  : "auto"
					}
				}]
			}
		}).play();
	},
	postTransitionComplete: function() {
		this.isBreadcrumb = false;
		this.doPostTransitionComplete();
	},
	setHeader : function(pObj) {
		this.$.header.setTitleAbove(pObj.index);
		this.$.header.setTitle(pObj.title);
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
	}
});