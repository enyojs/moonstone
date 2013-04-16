enyo.kind({
	name : "moon.Panel",
	fit : true,
	realtimeFit : true,
	
	published: {
		/**
			_transitionReady_ indicates that this object is ready to transit.
			If this object does not have any transition or it has and conducted already, 
			true value will be assigned.
			Otherhand, if this object has some transition and conducted yet, false will be assinged.
			Default value is null.
		*/
		transitionReady: null
    },
    
	create : function(oSender, oEvent){
		this.inherited(arguments);
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
	},
	
	handlers: {
    	onTransitionFinish: "finishPreTransition"
    },

	tapHandler : function(inSenter, inEvent){
		this.doTapHandler( inEvent.originator );
	},
	
	exit : function(){
		this.$.option.applyStyle( "visibility" , "hidden");
		this.log();
		this.ani();
	},

	components : [
		{ 
	    	name : "header",
			style : "width:400px;height:150px;top:25px;left:25px;position:absolute;overflow:hidden;",
			components : [
				{ name : "index", content : "", style : "font-size:20px;text-decoration:underline;"},
				{ name : "title", content : "", style : "font-size:60px;font-weight:bold;"}
			]

		},

		{
			name : "option",
			ontap : "tapHandler",
			style : "position:absolute;top:176px;left:25px;width:700px;height:50px;margin:0px;"
		},

		{
			name : "line",
			tag : "hr",
			style : "width:700px;top:230px;left:25px;position:absolute;margin:0px;border:0;height:5px;background-color:gray;"
		},

		{ 
			name : "client",
			style : "top:250px;left:25px;position:absolute;width:1000px; height:800px; overflow:hidden;",
			ontap : "tapHandler"
		},

		{
			name : "smallTitle",  style : "height:30px;position:absolute;left:25px;top:50px;overflow:hidden;",

			components : [	
				{ name : "smallText", content : "", style : "position:relative;font-size:25px;top:25px;font-weight:bold;"}
			]
		}
	],

	setHeader : function(pObj){
		this.$.index.setContent(pObj.index);
		this.$.title.setContent(pObj.title);
		this.$.smallText.setContent(pObj.title);
	},
	
	/**	
		If this object has internal transition, set transitionReady as false to notify that
		it is not prepared to be transited by arranger.
	*/
	startPreTransition: function() {
		this.setTransitionReady(false);
		this.firePreTransitionStart();
	},

	firePreTransitionStart: function() {
		this.doPreTransitionStart();
	},

	finishPreTransition: function() {
		if (this.transitionReady != null) {
			this.setTransitionReady(true);		
			this.firePreTransitionFinish();
		}
	},

	firePreTransitionFinish: function() {
		this.doPreTransitionFinish();
	},

	transition: function() {
		this.log();
		if (this.transitionReady) {
			return false;
		}         
		/**
			If you have some transition,
			You should remove following comment out before doing transition.
		*/
			this.startPreTransition();
			this.ani();
				//do some work here.
			return true;
	},

	ani : function(){
		var animation = new StyleAnimation({
			duration: 800,
			timingFunction: "cubic-bezier(.42, 0, .16, 1.1)",
			keyframes: {
				0:  [
					{
						control: this.$.header,
						properties: {
							"height" : "auto",
						}
					},
					{
						control: this.$.line,
						properties: {
							"width": "auto",
							"top" : "auto"
						}
					},
					{
						control: this.$.client,
						properties: {
							"width": "auto",
							"height" : "auto",
							"top" : "auto"
						}
					},
					{
						control: this.$.client,
						properties: {
							"height" : "auto"
						}
					},
					{
						control: this.$.smallText,
						properties: {
							"top" : "auto"
						}
					}
				],

				40 :[
					{
						control: this.$.client,
						properties: {
							"height": "0px"
						}
					},
	
				],

				60: [
					{
						control: this.$.header,
						properties: {
							"height": "20px"
						}
					},
					{
						control: this.$.line,
						properties: {
							"top" : "44px"
						}
					},
					{
						control: this.$.client,
						properties: {
							"top" : "64px"
						}
					},
					{
						control: this.$.client,
						properties: {
							"top" : "64px"
						}
					},
					{
						control: this.$.smallText,
						properties: {
							"top": "0px"
						}
					}


					],
				80: [{
					control: this.$.line,
					properties: {
						"width": "700px",
					}
				}],

				130: [{
					control: this.$.line,
					properties: {
						"width": "0px",
					}
				}],

				400: [{
					control: this.$.client,
					properties: {

					}
				}]
			}
		}).play();
	}
});