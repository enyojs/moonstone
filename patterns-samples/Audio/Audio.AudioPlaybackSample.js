enyo.kind({
	name: "moon.sample.audio.AudioPlaybackSample",
	classes: "enyo-unselectable moon sample-audio-playback",
	audioFiles: [
		{src: "http://www.universal-soundbank.com/mp3/sounds/700.mp3", trackName: "Thunderstorm", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:15"},
		{src: "http://www.universal-soundbank.com/mp3/sounds/9051.mp3", trackName: "Rainfall", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "1:09"}
	],
	handlers: {
		onPlayIndex: "playIndex"
	},
	components: [
		{kind: "enyo.Spotlight"},
		{kind:"moon.Drawers", drawers:[
			{
				kind: "moon.AudioPlayback",
				name: "audioPlayback",
				handle: {
					kind: "moon.DrawerHandle",
					marquee: true
				}
			}
		],
		components: [
			{kind: "moon.sample.audioPlayback.pageContent"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.setupAudioTracks();
	},
	rendered: function() {
		this.inherited(arguments);
	},
	setupAudioTracks: function() {
		var a = this.audioFiles;
		var len = a.length;
		for (var i=0; i<len; i++) {
			this.$.audioPlayback.addAudioTrack(a[i].src, a[i].trackName, a[i].artistName, a[i].albumName, a[i].duration);
		}
	},
	playIndex: function(inSender, inEvent) {
		this.$.audioPlayback.playAtIndex(inEvent.index);
	}
});


enyo.kind({
    name: "moon.sample.audioPlayback.pageContent",
    kind: "moon.Panel",
	classes: "moon",
    title: "Browse Tracks",
    titleAbove: "02",
    titleBelow: "2 Tracks",
    headerComponents: [
		{components: [
			{kind: "moon.IconButton", src: "../assets/icon-album.png"},
			{kind: "moon.IconButton", src: "../assets/icon-list.png"}
		]}
    ],
    components: [
        {classes: "sample-audio-item", components: [
            {classes: "sample-audio-item-image", style: "background-image: url(../assets/default-music.png);", components: [
				{classes: "sample-audio-play-icon", ontap: "playIndex", trackIndex: 0, spotlight: true}
            ]},
			{style: "display: table-cell; width: 20px;"},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Thunderstorm"}]},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Sound Effects"}]},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Album"}]},
            {classes: "sample-audio-item-label-right", content: "0:15"}
        ]},
        {classes: "sample-audio-item", components: [
            {classes: "sample-audio-item-image", style: "background-image: url(../assets/default-music.png);", components: [
				{classes: "sample-audio-play-icon", ontap: "playIndex", trackIndex: 1, spotlight: true}
            ]},
			{style: "display: table-cell; width: 20px;"},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Rainfall"}]},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Sound Effects"}]},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Album"}]},
            {classes: "sample-audio-item-label-right", content: "1:09"}
        ]}
    ],
    playIndex: function(inSender, inEvent) {
		this.bubble("onPlayIndex", {index: inSender.trackIndex});
    }
});
