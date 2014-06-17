enyo.kind({
	name: "moon.sample.SpinnerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Divider", content: "Spinner"},
		{kind: "moon.Spinner"},
		{kind: "moon.Divider", content: "Spinner with Content"},
		{kind: "moon.Spinner", content: "Loading..."},
		{kind: "moon.Divider", content: "Spinner Centered in its Container"},
		{style: "text-align: center", components: [
			{kind: "moon.Spinner", content: "Loading..."}
		]},
		{kind: "moon.Divider", content: "Spinner with Looooong Content"},
		{kind: "moon.Spinner", content: "Loading so much content... This might take some arbitrary amount of time. Could be long, could be short. Who knows?"},
		{kind: "moon.Divider", content: "Spinner with Components Inside"},
		{kind: "moon.Spinner", components: [
			{kind: "moon.Icon", icon: "fullscreen"},
			{content: "Fullscreen mode is loading"},
			{kind: "moon.Icon", icon: "exitfullscreen"}
		]}
	]
});
