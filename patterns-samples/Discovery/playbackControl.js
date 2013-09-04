enyo.kind({
	name: "Discovery.Sample.Playback",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,
	components: [
		{
			name: "player",
			kind: "Discovery.Components.VideoPlaybackControl",
			src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
			infoComponents: [
				{kind: "moon.VideoInfoBackground", orient: "left", background: true, fit: true, components: [
					{
						kind: "moon.VideoInfoHeader",
						title: "Downton Abbey"
					}
				]}
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

enyo.kind({
	name: "Discovery.Components.VideoPlaybackControl",
	kind: "moon.VideoPlayer",
	autoplay:true,
	create: function() {
		this.inherited(arguments);		
		// ICON 변경
		this.setRewindIcon("$lib/moonstone/images/video-player/icon_skipbackward.png");
		this.setFastForwardIcon("$lib/moonstone/images/video-player/icon_skipforward.png");
		this.$.jumpBack.addRemoveClass("hide", true);
		this.$.jumpForward.addRemoveClass("hide", true);
	},
	// override parent's function
	rewind: function() {
		// this.inherited(arguments);
		this.log("Child call only");
	},
	// override parent's function
	fastForward: function() {
		// this.inherited(arguments);
		this.log("Child call only");
	}
});

enyo.kind({
	name: "Discovery.Components.ImagePlaybackControl",
	// kind: "moon.SlideShow" ???
});