enyo.kind({
	name: "moon.sample.audio.AudioPlaybackSample",
	classes: "enyo-unselectable moon sample-audio-playback",
	audioFiles: [
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "01-Thunder", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:22", albumImage: ""},
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "02-brobob", artistName: "Brother bob", albumName: "Sound Effects", duration: "0:04", albumImage: ""},
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "03-Thunder", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:22", albumImage: ""},
		{src: "http://enyojs.com/_media/engine.mp3", trackName: "04-Engine", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:04", albumImage: ""},
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "05-Thunder", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:22", albumImage: ""},
		{src: "http://enyojs.com/_media/engine.mp3", trackName: "06-Engine", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:04", albumImage: ""},
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "07-Thunder", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:22", albumImage: ""},
		{src: "http://enyojs.com/_media/engine.mp3", trackName: "08-Engine", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:04", albumImage: ""},
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "09-Thunder", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:22", albumImage: ""},
		{src: "http://enyojs.com/_media/engine.mp3", trackName: "10-Engine", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:04", albumImage: ""}
	],
	handlers: {
		onPlayIndex: "playIndex",
		onIndexChanged: "indexChanged"
	},
	components: [
		{kind:"moon.Drawers", drawers:[
			{
				kind: "moon.AudioPlayback",
				name: "audioPlayback",
				handle: {
					kind: "moon.DrawerHandle",
					marquee: true
				},
				components: [
					{kind: "moon.IconButton", content: "1", ontap: "plusValue"},
					{kind: "moon.IconButton", content: "2", ontap: "plusValue"},
					{kind: "moon.IconButton", content: "3", ontap: "plusValue"}
				],
				plusValue: function (inSender, inEvent) {
					var icon = inEvent.originator;
					icon.setContent( parseInt(icon.content) + 1 );
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
			this.$.audioPlayback.addAudioTrack(a[i].src, a[i].trackName, a[i].artistName, a[i].albumName, a[i].duration, a[i].albumImage);
		}
	},
	indexChanged: function (inSender, inEvent) {
		
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
            {classes: "sample-audio-item-image", components: [
				{classes: "sample-audio-play-icon", ontap: "playIndex", trackIndex: 0, spotlight: true}
            ]},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Thunder"}]},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Sound Effects"}]},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Album"}]},
            {classes: "sample-audio-item-label-right", content: "0:22"}
        ]},
        {classes: "sample-audio-item", components: [
            {classes: "sample-audio-item-image", components: [
				{classes: "sample-audio-play-icon", ontap: "playIndex", trackIndex: 1, spotlight: true}
            ]},
			{style: "display: table-cell; width: 20px;"},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Engine"}]},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Sound Effects"}]},
            {classes: "sample-audio-item-label", components: [{classes: "sample-audio-item-label-content", content: "Album"}]},
            {classes: "sample-audio-item-label-right", content: "0:04"}
        ]}
    ],
    playIndex: function(inSender, inEvent) {
		this.bubble("onPlayIndex", {index: inSender.trackIndex});
    }
});
