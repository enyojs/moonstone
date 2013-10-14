enyo.kind({
	name: "moon.sample.audio.AudioPlaybackSample",
	classes: "enyo-unselectable moon sample-audio-playback",
	audioFiles: [
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "01-Thunder", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:22", albumImage: "", userQueueAttr : { filePath: "/c/music" }},
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "02-brobob", artistName: "Brother bob", albumName: "Sound Effects", duration: "0:04", albumImage: "", userQueueAttr : { filePath: "/z/music" }},
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "03-Thunder", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:22", albumImage: "", userQueueAttr : { filePath: "/z/music" }},
		{src: "http://enyojs.com/_media/engine.mp3", trackName: "04-Engine", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:04", albumImage: "", userQueueAttr : { filePath: "/z/music" }},
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "05-Thunder", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:22", albumImage: "", userQueueAttr : { filePath: "/z/music" }},
		{src: "http://enyojs.com/_media/engine.mp3", trackName: "06-Engine", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:04", albumImage: "", userQueueAttr : { filePath: "/z/music" }},
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "07-Thunder", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:22", albumImage: "", userQueueAttr : { filePath: "/z/music" }},
		{src: "http://enyojs.com/_media/engine.mp3", trackName: "08-Engine", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:04", albumImage: "", userQueueAttr : { filePath: "/z/music" }},
		{src: "http://enyojs.com/_media/thunder.mp3", trackName: "09-Thunder", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:22", albumImage: "", userQueueAttr : { filePath: "/z/music" }},
		{src: "http://enyojs.com/_media/engine.mp3", trackName: "10-Engine", artistName: "Sound Effects Artist", albumName: "Sound Effects", duration: "0:04", albumImage: "", userQueueAttr : { filePath: "/z/music" }}
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
				// User can customize queue list item.
				userBindedQueueListItem: {
					bindings: [
						{from: ".model.albumImage", to: ".$.userListItem.$.albumArt.src" },
						{from: ".model.trackName", to: ".$.userListItem.$.trackName.content" },
						{from: ".model.artistName", to: ".$.userListItem.$.artistName.content"},
						// User can use their attribute. It is specified at "userQueueAttr".  
						{from: ".model.filePath", to: ".$.userListItem.$.filePath.content", transform: "filePathTransform"}
					],
					components: [
						{kind: "sample.userQueueListItem", name: "userListItem", classes: "enyo-border-box"}
					],
					filePathTransform: function (value) {
						return "(" + value + ")";
					}
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
			this.$.audioPlayback.addAudioTrack(a[i].src, a[i].trackName, a[i].artistName, a[i].albumName, a[i].duration, a[i].albumImage, a[i].userQueueAttr);
		}
	},
	indexChanged: function (inSender, inEvent) {
		
	},
	playIndex: function(inSender, inEvent) {
		this.$.audioPlayback.playAtIndex(inEvent.index);
	}
});

// User can define their list item.
enyo.kind({
	name: "sample.userQueueListItem",
	kind: "moon.AudioListItem",
	components: [
		{name: "albumArt", kind: "Image", classes: "moon-audio-queue-item-albumArt", src: "assets/default-music-sm.png"},
		{components: [
			{name: "artistName", style: "display:inline-block;"},
			{name: "filePath", style: "display:inline-block;"},
			{name: "trackName"}
		]}
	]
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
