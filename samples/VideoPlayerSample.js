
enyo.kind({
	name: "moon.sample.VideoPlayerSample",
	classes: "enyo-fit enyo-unselectable",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{
			name: "player",
			kind: "moon.VideoPlayer",	
			src: "http://media.w3.org/2010/05/video/movie_300.mp4",
			components: [
				{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-placeholder.png", ontap: "onTap"},
				{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-placeholder.png"}
			],
			infoComponents: [
				{
					kind: "moon.VideoPlayerInfo", 
					datetime: "June 13 & 2:15", 
					showname: "Voice of Korea", 
					channel: "Mnet - AIR DATE & TIME SLOT", 
					synopsis: "SHORT SYNOPSIS ABOUT THE CURRENT SHOW",
					components: [
						{content: "SUB ENGLISH", classes: "moon-videoplayer-info-icon"},
						{content: "CINEMA", classes: "moon-videoplayer-info-icon"},
						{content: "3D", classes: "moon-videoplayer-info-icon"},
						{content: "REC 00:00", classes: "moon-videoplayer-info-icon moon-videoplayer-info-redicon"}
					]
				}
			]
		}
	],
	onTap: function() {
		this.log("Tapped");
	}
});