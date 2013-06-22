
enyo.kind({
	name: "moon.sample.VideoPlayerSample",
	classes: "enyo-fit enyo-unselectable moon moon-video-player-sample",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{name: "player", kind: "moon.VideoPlayer",
			videoDateTime: new Date(),
			videoTitle: "Voice of Korea",
			videoDescription: "Description about the current show",
			videoChannel: "Mnet - Air date & time slot",
			videoSubtitleLanguage: "English",
			videoDisplayMode: "Cinema",
			videoTimeRecorded: "00:00",
			video3d: true,
			src: "http://media.w3.org/2010/05/video/movie_300.ogv",
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