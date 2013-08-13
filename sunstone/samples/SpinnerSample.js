enyo.kind({
	name: "sun.sample.SpinnerSample",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Divider", content: "Dark Spinner"},
		{classes: "moon-dark-gray sun-spinner-sample-container", components: [
			{kind: "sun.Spinner"}
		]},
		
		{kind: "moon.Divider", content: "Light Spinner"},
		{classes: "sun-spinner-sample-container", components: [
			{kind: "sun.Spinner", classes: "moon-light"}
		]}
	]
});
