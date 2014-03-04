enyo.kind({
	name: "moon.sample.HeaderSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-header-sample",
	components: [
		{kind: "moon.Scroller", fit:true, components: [
			{kind: "moon.Header", name:"bigHeader", content: "Header", titleAbove: "02", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", components: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png", ontap:"likeBig"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png", ontap:"shareBig"}
			]},
			{style:"height:20px;"},
			{kind: "moon.Header", name:"smallHeader", content: "Small Header", small: true, titleAbove: "03", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", components: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png", ontap:"likeSmall"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png", ontap:"shareSmall"}
			]},
			{style:"height:20px;"},
			{kind: "moon.Header", name:"sizeChangingHeader", content: "Size-Changing Header", small: false, titleAbove: "03", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", components: [
				{kind: "moon.Button", small:true, content:"Grow/Shrink", ontap: "changeHeaderSize"}
			]},
			{style:"height:20px;"},
			{kind: "moon.Header", content: "Header 헤더 ヘッダ ylätunniste כותרת رأس Kopfzeile", titleAbove: "02", titleBelow: "Header 헤더 ヘッダ ylätunniste כותרת رأس Kopfzeile Header 헤더 ヘッダ ylätunniste כותרת رأس Kopfzeile Header 헤더 ヘッダ ylätunniste כותרת رأس Kopfzeile", subTitleBelow: "Titles will truncate/marquee"},
			{kind: "moon.Header", content: "Varied Alignment", titleAbove: "02", titleBelow: "Panel actions can be positioned on left or right", components: [
				{kind: "moon.Button", small:true, content:"Left", classes:"moon-header-left"},
				{kind: "moon.Button", small:true, content:"aligned", classes:"moon-header-left"},
				{kind: "moon.Button", small:true, content:"Right"},
				{kind: "moon.Button", small:true, content:"Aligned"}
			]},
			{style:"height:20px;"},
			{kind: "moon.Header", name:"switchHeader", content: "Static Title", placeholder:"Type Here", titleAbove: "03", titleBelow: "Header title can be changed to an input", subTitleBelow:"Press 'Switch Mode' button, which sets 'inputMode:true'", components: [
				{kind: "moon.Button", small:true, content:"Switch Mode", ontap : "switchMode"}
			]},
			{kind: "moon.Header", name:"imageHeader", content: "Header with Image", titleAbove: "02", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", fullBleedBackground:true, backgroundSrc: "http://lorempixel.com/g/1920/360/abstract/2/", components: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png", classes:"moon-header-left"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
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
	changeHeaderSize: function(inSender, inEvent) {
		this.$.sizeChangingHeader.setSmall(!this.$.sizeChangingHeader.getSmall());
	},
	switchMode: function(inSender, inEvent) {
		this.$.switchHeader.setInputMode(!this.$.switchHeader.getInputMode());
	}
});
