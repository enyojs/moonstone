enyo.kind({
	name: "sun.sample.SpinnerSample",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "sun.Divider", content: "Dark Spinner"},
		{classes: "moon-dark-gray sun-spinner-sample-container", components: [
			{kind: "sun.Spinner"}
		]},
		
		{kind: "sun.Divider", content: "Light Spinner"},
		{classes: "sun-spinner-sample-container", components: [
			{kind: "sun.Spinner", classes: "moon-light"}
		]}
	]
});
