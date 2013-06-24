enyo.kind({
	name: "moon.sample.HeaderSample",
	classes: "moon enyo-unselectable enyo-fit moon-hspacing",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", classes: "enyo-fit", components: [
			{kind: "moon.Header", content: "Simple Header", classes:"moon-10h"},
			{kind: "moon.Header", content: "Captioned Header", titleAbove: "02", titleBelow: "Sub Header", classes:"moon-10h"},
			{kind: "moon.Header", content: "Small Header", small: true, titleAbove: "03", titleBelow: "Sub Header", classes:"moon-10h"},
		]}
	]
});
