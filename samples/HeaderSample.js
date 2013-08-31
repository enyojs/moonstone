enyo.kind({
	name: "moon.sample.HeaderSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-header-sample",
	components: [
		{kind: "moon.Scroller", fit:true, components: [
			{kind: "moon.Header", content: "Header", titleAbove: "02", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", classes:"moon-10h", components: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
			]},
			{style:"height:20px;"},
			{kind: "moon.Header", content: "Small Header", small: true, titleAbove: "03", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", classes:"moon-10h", components: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
			]},
			{style:"height:20px;"},
			{kind: "moon.Header", content: "Varied Alignment", titleAbove: "02", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", classes:"moon-10h", components: [
				{kind: "moon.Button", small:true, content:"Left", classes:"moon-header-left"},
				{kind: "moon.Button", small:true, content:"aligned", classes:"moon-header-left"},
				{kind: "moon.Button", small:true, content:"Right"},
				{kind: "moon.Button", small:true, content:"Aligned"}
			]}
		]}
	]
});
