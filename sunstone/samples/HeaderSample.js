enyo.kind({
	name: "sun.sample.HeaderSample",
	kind: "FittableRows",
	handlers: {onHeaderLeftTapped: "onHeaderLeftTappedFunc"},
	classes: "sun moon enyo-unselectable enyo-fit sun-header-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", fit:true, components: [
			{classes:"moon-hspacing", components: [
				{kind: "sun.Header", content: "Header", iconLeft: true, components: [
					{kind: "sun.IconButton", src: "assets/icon-like.png"}
				]},
				{kind: "sun.Header", content: "Small Header", small: true, titleBelow: "Sub Header", components: [
					{kind: "sun.IconButton", src: "assets/icon-like.png"},
					{kind: "sun.IconButton", src: "assets/icon-like.png"},
					{kind: "sun.IconButton", src: "assets/icon-like.png"},

				]}
			]}
		]}
	],
	onHeaderLeftTappedFunc: function(inSender, inEvent) {
		console.log("onHeaderLeftTapped");
	}
});
