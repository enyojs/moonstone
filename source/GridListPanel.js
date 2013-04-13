enyo.kind({
	name : "moon.GridListPanel",
	fit : true,
	realtimeFit : true,
	itemData : [],

	create : function(oSender, oEvent){
		this.inherited(arguments);
	},

	events : {
		onItemClicked : ""
	},

	fadeIn : function(){ 
		this.$.client.applyStyle("visibility","hidden");
		this.$.client.applyStyle("opacity",0);

		setTimeout( enyo.bind(this, function(){ 
			this.$.client.applyStyle("visibility","visible");
			this.$.client.applyStyle("opacity",1);
		}), 300 );
	},

	components : [
		{name : "panel", components : [
			{kind : "FittableRows", classes :"moon moon-sample enyo-fit", components : [
				{name : "header", style:"padding:20px;height:150px", components : [
					{name : "index", style:"font-size:20px", content :""},
					{name : "title", style:"font-size:60px", content :""}
				]},
				{name : "divider", kind : "moon.Divider"},
				{name : "client",  classes : "fade-effect", components : [
					{
						name: "gridlist",
						kind: "moon.GridList",
						onSetupItem: "setupItem",
						components: [
							{name: "item", kind: "moon.GridList.ImageItem", ontap : "itemClickHandler"}
						],
						touch:true,
						fit:true
					}					
				]}
			]}
		]}
	],

	// header setting 
	setHeader : function(pObj){
		this.$.index.setContent("0" + pObj.index);
		this.$.title.setContent(pObj.title);
	},

	// client setting 
	setClient : function(pObj){	
		this.itemData = pObj.data;
		this.$.gridlist.setStyle("height:" + (window.innerHeight- 150) + "px");

		// fade effect
		this.fadeIn();

		// update value
		this.$.gridlist.itemWidth = pObj.width;
		this.$.gridlist.itemHeight = pObj.height;
		this.$.gridlist.itemSpacing = pObj.space;

		// update gridlist
		this.$.gridlist.itemWidthChanged();
		this.$.gridlist.itemHeightChanged();
		this.$.gridlist.itemSpacingChanged();
		this.$.gridlist.show(this.itemData.length);
	},

	// item
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var tItem = this.itemData[i];
		// image
		this.$.item.setSource(tItem.img);
		// caption
		this.$.item.caption = tItem.caption;
		this.$.item.captionChanged();
	},

	itemClickHandler : function(inSender, inEvent){
		this.doItemClicked( { index : inEvent.index });
	}
});