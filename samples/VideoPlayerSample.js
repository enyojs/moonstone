
enyo.kind({
	name: "moon.sample.VideoPlayerSample",
	classes: "enyo-fit enyo-unselectable moon",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{name: "player", kind: "moon.VideoPlayer", style: "width: 600px;",
			src: "http://media.w3.org/2010/05/video/movie_300.ogv",
			videoDateTime: new Date(),
			videoTitle: "Voice of Korea",
			videoChannel: "Mnet - Air date & time slot",
			videoDescription: "Description about the current show",
			videoSubtitleLanguage: "English",
			videoDisplayMode: "Cinema",
			video3d: true,
			videoTimeRecorded: "00:00",
			components: [
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
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