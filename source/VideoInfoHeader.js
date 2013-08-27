/**
	_moon.VideoInfoHeader_ is a control that displays various information about a
	video. It is designed to be used within the _infoComponents_ block of a
	<a href="#moon.VideoPlayer">moon.VideoPlayer</a>.

	Example:

		{
			kind: "moon.VideoInfoHeader",
			aboveTitle: new Date(),
			title: "Breaking Bad - Live Free Or Die",
			subTitle: "AMC (301) 7:00 PM - 8:00 PM",
			description: "As Walt deals with the aftermath of the Casa Tranquila explosion, Hank works to wrap up his investigation of Gus' empire.",
			components: [
				{content: "3D"},
				{content: "Live"},
				{content: "REC 08:22", classes: "moon-video-player-info-redicon"}
			]
		}
*/
enyo.kind({
	name: "moon.VideoInfoHeader",
	kind: "enyo.Control",
	classes: "moon-video-info-header",
	mixins: ["moon.MarqueeSupport"],
	marqueeOnSpotlight: false,
	published: {
		title: "",
		subTitle: "",
		subSubTitle: "",
		description: ""
	},
	components: [
		{kind: "moon.MarqueeText", name: "title", classes: "moon-header-font moon-video-player-info-title"},
		{kind: "enyo.Control", name: "subTitle", classes: "moon-video-player-info-subtitle"},
		{kind: "enyo.Control", name: "subSubTitle", classes: "moon-video-player-info-subsubtitle"},
		{kind: "enyo.Control", name: "description", classes: "moon-video-player-info-description"},
		{kind: "enyo.Control", name: "client", classes: "moon-video-player-info-client"}
	],
	bindings: [
		{from: ".title",		to: ".$.title.content"},
		{from: ".subTitle",		to: ".$.subTitle.content"},
		{from: ".subSubTitle",	to: ".$.subSubTitle.content"},
		{from: ".description",	to: ".$.description.content"}
	]
});
