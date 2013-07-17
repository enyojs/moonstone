enyo.kind({
	name: "moon.sample.InputHeaderSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", fit: true, components: [
			{classes:"moon-hspacing", components: [
				{kind: "moon.InputHeader", titleAbove: "02", titleBelow: "Sub Header", subTitleBelow: "Sub-sub Header", classes:"moon-10h", components: [
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
				]},
				{kind: "moon.InputHeader", content: "Captioned Header", small: true, titleAbove: "02", titleBelow: "Sub Header", subTitleBelow: "Sub-sub Header", classes:"moon-10h", components: [
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
				]}
			]}
		]}
	]
});
