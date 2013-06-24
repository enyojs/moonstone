enyo.kind({
	name: "moon.sample.InputHeaderSample",
	classes: "moon enyo-unselectable enyo-fit moon-hspacing",
	components: [
		{kind: "enyo.Spotlight"},
		// {kind: "moon.InputHeader", classes:"moon-10h"},
		{kind: "moon.InputHeader", titleAbove: "02", titleBelow: "Sub Header", classes:"moon-10h"},
		{kind: "moon.InputHeader", content: "Captioned Header", titleAbove: "02", titleBelow: "Sub Header", classes:"moon-10h"}
	]
});
