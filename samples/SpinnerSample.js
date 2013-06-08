enyo.kind({
	name: "moon.sample.SpinnerSample",
	classes: "moon moon-sample-padded enyo-unselectable",
	components: [
		{kind: "moon.Divider", content: "Dark Spinner"},
		{classes: "moon-dark-gray spinner-container", components: [
			{kind: "moon.Spinner"}
		]},
		{kind: "moon.Divider", content: "Light Spinner"},
		{classes: "spinner-container", components: [
			{kind: "moon.Spinner", classes: "moon-light"}
		]}
	]
});
