enyo.kind({
	name: "moon.sample.SpinnerSample",
	classes: "moon moon-sample-padded enyo-unselectable",
	components: [
		{classes: "moon-sample-divider", content: "Dark Spinner"},
		{style:"background:black; border-radius:5px; padding:15px", components: [
			{kind: "moon.Spinner"}
		]},
		{tag: "br"},
		{classes: "moon-sample-divider", content: "Light Spinner"},
		{style:"background:white; border-radius:5px; padding:15px; border-style:solid; border-color:grey", components: [
			{kind: "moon.Spinner", classes: "moon-light"}
		]}
	]
});
