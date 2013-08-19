enyo.kind({
	name: "sun.sample.HeaderSample",
	kind: "FittableRows",
	handlers: {onHeaderLeftTapped: "onHeaderLeftTappedFunc"},
	classes: "sun moon enyo-unselectable enyo-fit sun-header-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Scroller", fit:true, components: [
			{classes:"", components: [
				{kind: "sun.Header", content: "Header", components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true},
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true},
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true}
				]},
				{kind: "sun.Header", content: "Header", arrowIcon: true, components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true}
				]},
				{kind: "sun.Header", content: "Small Header", titleBelow: "Sub Header", components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true}
				]},
				{kind: "sun.Header", content: "Small Header", titleBelow: "Sub Header", arrowIcon: true, components: [
					{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true}
				]}
			]}
		]}
	],
	onHeaderLeftTappedFunc: function(inSender, inEvent) {
		console.log("onHeaderLeftTapped");
	}
});
