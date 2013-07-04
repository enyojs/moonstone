
enyo.kind({
	name: "moon.sample.VideoPlayerSample",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{name: "player", kind: "moon.VideoPlayer",
			sourceComponents: [
				{src: "http://media.w3.org/2010/05/sintel/trailer.mp4",  type: "video/mp4"},
				{src: "http://media.w3.org/2010/05/sintel/trailer.webm", type: "video/webm"},
				{src: "http://media.w3.org/2010/05/sintel/trailer.ogv",  type: "video/ogg"}
			],
			infoComponents: [
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
			],
			components: [
				{kind: "moon.VideoFullscreenToggleButton"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"}
			]
		}
	]
});
