enyo.kind({
	name: "moon.sample.HeaderSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-header-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", fit:true, components: [
			{classes:"moon-hspacing", components: [
				{kind: "moon.Header", content: "Header", titleAbove: "02", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", classes:"moon-10h", components: [
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
				]},
				{kind: "moon.Header", content: "Small Header", small: true, titleAbove: "03", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", classes:"moon-10h", components: [
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
				]}
			]}
		]}
	]
});
