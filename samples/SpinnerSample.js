enyo.kind({
	name: "moon.sample.SpinnerSample",
	classes: "moon enyo-unselectable enyo-fit",
	kind: "moon.Scroller",
	components: [
		{kind: "moon.Divider", content: "Spinner"},
		{kind: "moon.Spinner"},
		{kind: "moon.Divider", content: "Spinner with Content"},
		{kind: "moon.Spinner", content: "Loading..."},
		{kind: "moon.Divider", content: "Spinner Centered in its Container"},
		{style: "text-align: center", components: [
			{kind: "moon.Spinner", content: "Loading..."}
		]},
		{kind: "moon.Divider", content: "Spinner Centered Horizontally and Vertically in its Container"},
		{classes: "absolute-container", components: [
			{kind: "moon.Spinner", content: "Loading...", center: true}
		]},
		{classes: "moon-1v"},
		{kind: "moon.Divider", content: "Spinner Only Centered Horizontally in its Container"},
		{classes: "absolute-container", components: [
			{kind: "moon.Spinner", content: "Loading...", center: true, middle: false}
		]},
		{classes: "moon-1v"},
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
