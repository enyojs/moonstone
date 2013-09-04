enyo.kind({
	name: "Discovery.Components.PlaybackControl",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,
	components: [
		{
			name: "player",
			kind: "moon.VideoPlayer",
			showPlaybackControls: false,
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
				{name: "sendBackButton", kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-fullscreenbutton.png", ontap: "buttonBack"},
				{name: "thumbNailButton", kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon_shrink.png", ontap: "buttonThumb"}
			]
		}
	],

	buttonBack: function() {
        window.open("http://www.google.com", "width=500, height=500", true);
    },

    buttonThumb: function() {
    	window.open("http://www.naver.com", "width=500, height=500", true);
    }
});

