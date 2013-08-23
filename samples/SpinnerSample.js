enyo.kind({
	name: "moon.sample.SpinnerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Divider", content: "Dark Spinner"},
		{classes: "moon-neutral moon-spinner-sample-container", components: [
			{kind: "moon.Spinner"}
		]},
		{kind: "moon.Divider", content: "Light Spinner"},
		{classes: "moon-spinner-sample-container", components: [
			{kind: "moon.Spinner", classes: "moon-light"}
		]}
	]
});
