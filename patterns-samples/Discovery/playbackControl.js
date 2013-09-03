enyo.kind({
	name: "Discovery.Components.PlaybackControl",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,
	components: [
		{
			name: "player",
			kind: "moon.VideoPlayer",
			rewindIcon: "$lib/moonstone/images/video-player/icon_skipbackward.png", 
			fastForwardIcon: "$lib/moonstone/images/video-player/icon_skipforward.png",
			jumpBackIcon: "hidden",
			jumpForwardIcon: "hidden",
			src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
			autoplay:true,
			infoComponents: [
				{kind: "moon.VideoInfoBackground", orient: "left", background: true, fit: true, components: [
					{
						kind: "moon.VideoInfoHeader",
						title: "Downton Abbey",
					}
				]},
			],
			components: [
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-fullscreenbutton.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon_shrink.png"}
			]
		}
	]
});