enyo.kind({
	name: "moon.sample.HeaderSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-header-sample",
	components: [
		{kind: "moon.Scroller", fit:true, components: [
			{kind: "moon.Header", name:"bigHeader", content: "Header Header Header", titleAbove: "02", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", classes:"moon-10h", components: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png", ontap:"likeBig"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png", ontap:"shareBig"}
			]},
			{style:"height:20px;"},
			{kind: "moon.Header", name:"smallHeader", content: "Small Header", small: true, titleAbove: "03", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", classes:"moon-10h", components: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png", ontap:"likeSmall"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png", ontap:"shareSmall"}
			]},
			{style:"height:20px;"},
			{kind: "moon.Header", content: "Varied Alignment", titleAbove: "02", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", classes:"moon-10h", components: [
				{kind: "moon.Button", small:true, content:"Left", classes:"moon-header-left"},
				{kind: "moon.Button", small:true, content:"aligned", classes:"moon-header-left"},
				{kind: "moon.Button", small:true, content:"Right"},
				{kind: "moon.Button", small:true, content:"Aligned"}
			]},
			{style:"height:20px;"},
			{kind: "moon.Header", name:"switchHeader", content: "Switch Input", placeholder:"Input Mode", titleAbove: "03", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", classes:"moon-10h", components: [
				{kind: "moon.Button", small:true, content:"Switch Mode", ontap : "switchMode"}
			]}
		]}
	],
	likeBig: function(inSender, inEvent) {
		this.$.bigHeader.setSubTitleBelow("Thanks for liking Enyo.");
	},
	shareBig: function(inSender, inEvent) {
		this.$.bigHeader.setSubTitleBelow("Please share Enyo.");
	},
	likeSmall: function(inSender, inEvent) {
		this.$.smallHeader.setSubTitleBelow("Thanks for liking Enyo.");
	},
	shareSmall: function(inSender, inEvent) {
		this.$.smallHeader.setSubTitleBelow("Please share Enyo.");
	},
	switchMode: function(inSender, inEvent) {
		this.$.switchHeader.setInputMode(!this.$.switchHeader.getInputMode());
	}
});
