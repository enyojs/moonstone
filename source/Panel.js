enyo.kind({
	name : "moon.Panel",
	fit : true,
	realtimeFit : true,
	spaceHeight : 100,
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

    events: {
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

	create : function(oSender, oEvent){
		this.inherited(arguments);

		if(arguments[0].header){
			this.setHeader( arguments[0].header );
		}
	},
	fadeIn : function(){ 
		this.$.layer.applyStyle("opacity",1.0);
		this.$.space.applyStyle("height","0px");
	},

	fadeOut : function(){ 
		this.$.layer.applyStyle("opacity",.0);
		this.$.space.applyStyle("height", this.spaceHeight + "px");
	},

	components : [
		{name : "panel", components : [
			{kind : "FittableRows", classes :"moon moon-sample enyo-fit", components : [
				// header
				{name : "header", style:"padding:20px;height:150px", components : [	
					{name : "index", style:"font-size:20px", content :""},
					{name : "title", style:"font-size:60px", content :""}
				]},

				// divider
				{ name : "divider", kind : "moon.Divider"},

				// space : this space is using for transition annimation effect
				{ name : "space",
				 	style : "width: 0px; height:" + this.spaceHeight + "px;" + 
				            "-webkit-transition: height .35s ease;",
				},

				// client
				{ name : "client", style : "margin-left : 20px", ontap : "tapHandler",
				  components : [{
				  		name : "layer", 
					 	style : "opacity : .0;" + 
					            "-webkit-transition: opacity .35s ease",
				  }]
				}
			]}
		]}
	],

	tapHandler : function(inSenter, inEvent){
		var tIndex = this.$.layer.children.indexOf(inEvent.originator);
		//this.doTapHandler({index : tIndex })
		this.doTapHandler( inEvent.originator );
	},

	// header setting 
	setHeader : function(pObj){
		this.$.index.setContent("0" + pObj.index);
		this.$.title.setContent(pObj.title);

		this.fadeIn();
	},

	addClient : function(pArray){
		this.fadeOut();

		setTimeout( enyo.bind(this, function(){ 
			// destory
			this.destoryClient();

			// create
			this.$.layer.createComponents(pArray,{owner:this});
			this.$.layer.render();
			this.fadeIn();
		}), 500 );
	},

	destoryClient : function(){
		var tArray = this.$.layer.children;
		for(var i=0;i<tArray.length;i++){
			if(tArray[i].destory) tArray[i].destory();
		}
		this.$.layer.children = [];
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
});