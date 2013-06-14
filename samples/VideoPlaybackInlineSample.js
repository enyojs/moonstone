enyo.kind({
	name: "moon.sample.VideoPlaybackInlineSample",
	classes: "moon enyo-fit enyo-unselectable",
	layoutKind: "FittableRowsLayout",
	fit: true,
	handlers: {
		onPlay: "goPlay",
		onPause: "goPause",
		onFullScreen: "goFullScreen"
	},
	components: [
	{kind: "enyo.Spotlight"},
		{
			name: "vidPlayer",
			kind: "moon.VideoPlayback", 		
			jumpIncrement: "20%",
			src: "http://www.w3schools.com/html/mov_bbb.mp4",
			components: [
				{kind: "moon.BoxIconButton", src: "assets/icon-Premium-Placeholder.png", ontap: "onTap"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"}
			],
			infoComponents: [
				{
					kind: "moon.VideoPlayerInfo", 
					datetime: "CURRENT DATE & TIME", 
					showname: "SHOW NAME", 
					channel: "CHANNEL - AIR DATE & TIME SLOT", 
					synopsys: "SHORT SYNOPSYS ABOUT THE CURRENT SHOW",
					components: [
						{content: "SUB ENGLISH", classes: "moon-videoplayer-info-icon"},
						{content: "CINEMA", classes: "moon-videoplayer-info-icon"},
						{content: "3D", classes: "moon-videoplayer-info-icon"},
						{content: "REC 00:00", classes: "moon-videoplayer-info-icon moon-videoplayer-info-redicon"}
					]
				}
			]
		},
		{
			name: "inlineVideo",
			kind: "moon.VideoPlaybackInline"
		}
	],
	bindings: [
		{
			from: ".$.vidPlayer.currentPosition",
			to: ".$.inlineVideo.currentPosition",
		},
		{
			from: ".$.vidPlayer.currentTime",
			to: ".$.inlineVideo.currentTime",
		},
		{
			from: ".$.vidPlayer.duration",
			to: ".$.inlineVideo.duration",
		},
		{
			from: ".$.vidPlayer.paused",
			to: ".$.inlineVideo.paused",
		}
	],
	goPlay: function(inSender, inEvent) {
		this.$.vidPlayer.playpauseHandler(inSender, inEvent);
	},
	goPause: function(inSender, inEvent) {
		this.$.vidPlayer.playpauseHandler(inSender, inEvent);
	},
	goFullScreen: function(inSender, inEvent) {
		var p = this.$.vidPlayer.$.controls;
		p.setShowing(!p.getShowing());
	}
});