/**
	_moon.VideoInfoHeader_ is a control that displays various information about a
	video. It is designed to be used within the _infoComponents_ block of a
	[moon.VideoPlayer](#moon.VideoPlayer).

	Example:

		{
			kind: "moon.VideoInfoHeader",
			aboveTitle: new Date(),
			title: "Breaking Bad - Live Free Or Die",
			subTitle: "AMC (301) 7:00 PM - 8:00 PM",
			description: "As Walt deals with the aftermath of the Casa Tranquila explosion, "
				+ "Hank works to wrap up his investigation of Gus' empire.",
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
	//* @protected
	classes: "moon-video-info-header",
	mixins: ["moon.MarqueeSupport"],
	marqueeOnSpotlight: false,
	marqueeOnRender: true,
	//* @public
	published: {
		//* Title of the VideoInfoHeader
		title: "",
		//* Subtitle of the VideoInfoHeader
		subTitle: "",
		//* VideoInfoHeader text below subtitle
		subSubTitle: "",
		//* Main content of the VideoInfoHeader
		description: ""
	},
	//* @protected
	components: [
		{kind: "moon.MarqueeText", name: "title", classes: "moon-header-font moon-video-player-info-title"},
		{name: "subTitle", classes: "moon-video-player-info-subtitle"},
		{name: "subtitleDivider", classes: "moon-video-player-subtitle-divider"},	
		{name: "subSubTitle", classes: "moon-video-player-info-subsubtitle"},
		{name: "client", classes: "moon-video-player-info-client"},
		{components: [
			{name: "description", classes: "moon-video-player-info-description"}
		]}
	],
	bindings: [
		{from: ".title",		to: ".$.title.content"},
		{from: ".subTitle",		to: ".$.subTitle.content"},
		{from: ".subSubTitle",	to: ".$.subSubTitle.content"},
		{from: ".subtitleDivider",	to: ".$.subtitleDivider.content"},
		{from: ".description",	to: ".$.description.content"},
		{from: ".client",	to: ".$.client.content"}
	]
});
