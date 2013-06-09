enyo.kind({
	name: "moon.sample.HeaderSample",
	classes: "moon enyo-unselectable moon-hspacing",
	components: [
		{kind: "moon.Header", content: "Simple Header", classes:"moon-10h"},
		{kind: "moon.Header", content: "Captioned Header", titleAbove: "02", titleBelow: "Sub Header", classes:"moon-10h"}
	]
});
