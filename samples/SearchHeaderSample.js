enyo.kind({
	name: "moon.sample.SearchHeaderSample",
	classes: "moon enyo-unselectable enyo-fit moon-hspacing",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.SearchHeader", classes:"moon-10h"},
		{kind: "moon.SearchHeader", titleAbove: "02", titleBelow: "Sub Header", classes:"moon-10h"},
		{kind: "moon.SearchHeader", content: "Captioned Header", titleAbove: "02", titleBelow: "Sub Header", classes:"moon-10h"}
	]
});
