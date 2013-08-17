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
	published: {
		title: "",
		subTitle: "",
		rating: "",
		description: ""
	},
	components: [
		{kind: "enyo.Control", name: "title", classes: "moon-header-font moon-video-player-info-showname"},
		{kind: "enyo.Control", name: "subTitle", classes: "moon-video-player-info-channel"},
		{kind: "enyo.Control", name: "rating", classes: "moon-video-player-rating-info"},
		{kind: "enyo.Control", name: "description", classes: "moon-video-player-info-synopsys"},
		{kind: "enyo.Control", name: "client", classes: "moon-video-player-settings-info"}
	],
	bindings: [],
	create: function() {
		this.inherited(arguments);
		this.setupBindings();
	},
	setupBindings: function() {
		this.bindings.push({from: ".title",			to: ".$.title.content"});
		this.bindings.push({from: ".subTitle",		to: ".$.subTitle.content"});
		this.bindings.push({from: ".rating",		to: ".$.rating.content"});
		this.bindings.push({from: ".description",	to: ".$.description.content"});
	}
});
