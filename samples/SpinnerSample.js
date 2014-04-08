enyo.kind({
	name: "moon.sample.SpinnerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Divider", content: "Spinner"},
		{kind: "moon.Spinner"},
		{kind: "moon.Divider", content: "Spinner with Content"},
		{kind: "moon.Spinner", content: "Loading..."},

		{kind: "moon.Divider", content: "GIF Spinner"},
		{kind: "moon.SpinnerGif"},
		{kind: "moon.Divider", content: "GIF Spinner with Content"},
		{kind: "moon.SpinnerGif", content: "Loading..."}
	]
});
