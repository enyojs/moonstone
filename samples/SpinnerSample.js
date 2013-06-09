enyo.kind({
	name: "moon.sample.SpinnerSample",
	classes: "moon moon-sample-padded enyo-unselectable",
	components: [
		{kind: "moon.Divider", content: "Dark Spinner"},
		{classes: "moon-dark-gray moon-spinner-sample-container", components: [
			{kind: "moon.Spinner"}
		]},
		{kind: "moon.Divider", content: "Light Spinner"},
		{classes: "moon-spinner-sample-container", components: [
			{kind: "moon.Spinner", classes: "moon-light"}
		]}
	]
});
