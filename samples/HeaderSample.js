enyo.kind({
	name: "moon.sample.HeaderSample",
	classes: "moon enyo-unselectable",
	fit: true,
	style: "padding: 20px;",
	layoutKind: "enyo.FittableRowsLayout",
	components: [
		{kind: "moon.Header", content: "Simple Header"},
		{kind: "moon.Header", content: "Captioned Header", titleAbove: "02", titleBelow: "Sub Header"}
	]
});