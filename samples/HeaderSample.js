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
			{classes: "moon-1v"},
			{kind: "moon.Header", name:"smallHeader", content: "Small Header", small: true, titleAbove: "03", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", components: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png", ontap:"likeSmall"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png", ontap:"shareSmall"}
			]},
			{classes: "moon-1v"},
			{kind: "moon.Header", content: "Varied Alignment", titleAbove: "02", titleBelow: "Panel actions can be positioned on left or right", components: [
				{kind: "moon.Button", small:true, content:"Left", classes:"moon-header-left"},
				{kind: "moon.Button", small:true, content:"aligned", classes:"moon-header-left"},
				{kind: "moon.Button", small:true, content:"Right"},
				{kind: "moon.Button", small:true, content:"Aligned"}
			]},
			{classes: "moon-1v"},
			{kind: "moon.Header", name:"switchHeader", content: "Static Title", placeholder:"Type Here", titleAbove: "03", titleBelow: "Header title can be changed to an input", subTitleBelow:"Press 'Switch Mode' button, which sets 'inputMode:true'", components: [
				{kind: "moon.Button", small:true, content:"Switch Mode", ontap: "switchMode", header: "switchHeader"}
			]},
			{classes: "moon-1v"},
			{kind: "moon.Header", name:"imageHeader", content: "Header with Image", titleAbove: "02", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", fullBleedBackground:true, backgroundSrc: "http://lorempixel.com/g/1920/360/abstract/2/", components: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png", classes:"moon-header-left"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
			]},
			{classes: "moon-1v"},
			{kind: "moon.Header", name:"marqueeHeader", content: "Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style='text-transform:none'>j p q g</span>", allowHtml:true, titleAbove: "02", titleBelow: "Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style='text-transform:none'>j p q g</span> Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style='text-transform:none'>j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style='text-transform:none'>j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style='text-transform:none'>j p q g</span>", subTitleBelow: "Titles will truncate/marquee", components: [
				{kind: "moon.Button", small:true, content:"Switch Mode", ontap: "switchMode", header: "marqueeHeader"}
			]},
			{classes: "moon-1v"},
			{kind: "moon.Header", name:"marqueeHeaderSmall", small:true, content: "Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style='text-transform:none'>j p q g</span>", allowHtml:true, titleAbove: "02", titleBelow: "Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style='text-transform:none'>j p q g</span> Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style='text-transform:none'>j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style='text-transform:none'>j p q g</span>   Header   헤더    ヘッダ    ylätunniste    כותרת    رأس    Kopfzeile  ẫ Ẫ گ Ů <span style='text-transform:none'>j p q g</span>", subTitleBelow: "Titles will truncate/marquee", components: [
				{kind: "moon.Button", small:true, content:"Switch Mode", ontap: "switchMode", header: "marqueeHeaderSmall"}
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
		var header = this.$[inSender.header];
		header.setInputMode(!header.getInputMode());
	}
});
