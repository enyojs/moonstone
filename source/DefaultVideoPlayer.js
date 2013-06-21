enyo.kind({
	name: "moon.DefaultVideoPlayer",
	kind: "moon.VideoPlayer",
	//* Info options for the player controls that are unique to this video player
	infoOptions: {
		videoChannel: "Mnet - Air date & time slot",
		videoSubtitleLanguage: "English",
		videoDisplayMode: "Cinema",
		video3d: true,
		videoTimeRecorded: "00:00"
	},
	playerControls: [
		{kind: "moon.VideoControl.Fullscreen", components: [
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
		]},
		{kind: "moon.VideoControl.Inline"}
	]
});
