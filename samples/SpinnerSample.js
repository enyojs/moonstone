enyo.kind({
	name: "moon.sample.SpinnerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Divider", content: "Spinner"},
		{kind: "moon.Spinner"},
		{kind: "moon.Divider", content: "Spinner with Content"},
		{kind: "moon.Spinner", content: "Loading..."}
	]
});
