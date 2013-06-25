/**
	_moon.AudioPlayback_ is meant to be used with <a href="#moon.Drawers">moon.Drawers</a>.
	This extends <a href="#moon.Drawer">moon.Drawer</a> by adding  an audio playback control
	and playlist for the imported audio.

	{kind:"moon.Drawers", drawers:[
		{
			kind: "moon.AudioPlayback",
			handle: {
				kind: "moon.DrawerHandle",
				marquee: true
			}
		}
	],
	components: [
		{content: "Page Content"}
	]}
*/

enyo.kind({
	name: "moon.AudioPlayback",
	kind: "moon.Drawer",
	//* @protected
	classes: "moon-audio-playback",
	open: false,
	controlsOpen: false,
	handlers: {
		onAudioEnd: "audioEnd"
	},
	audioTracks: [],
	index: null,
	controlDrawerComponents:[],
	playheadJob: null,
	queueList: null,
	//* @public
	published: {
		repeat: false
	},
	//* @protected
	audioComponents: [
		{name: "sound", kind: "enyo.Audio"},
		{kind: "FittableColumns", classes: "moon-audio-playback-controls", spotlight: "container", components: [
			{name: "trackIcon", classes: "moon-audio-playback-track-icon"},
			{classes: "moon-audio-play-controls", fit: true, components: [
				{kind: "FittableColumns", classes: "moon-audio-top", components: [
					{classes: "moon-audio-track-info", components: [
						{name: "trackName", content: "Track Name", classes: "moon-audio-playback-track"},
						{name: "artistName", content: "Artist Name", classes: "moon-audio-playback-artist"}
					]},
					{classes: "moon-audio-control-buttons", fit: true, components: [
						{kind: "moon.IconButton", classes: "moon-audio-icon-button left", src: "assets/icon-rew-btn.png", ontap: "playPrevious"},
						{kind: "moon.IconButton", name: "btnPlay", classes: "moon-audio-icon-button left", src: "assets/icon-play-btn.png", ontap: "togglePlay"},
						{kind: "moon.IconButton", classes: "moon-audio-icon-button left", src: "assets/icon-fwd-btn.png", ontap: "playNext"},
						{kind: "moon.IconButton", classes: "moon-audio-icon-button right", src: "assets/icon-album.png", ontap: "toggleTrackDrawer"}
					]}
				]},
				{kind: "FittableColumns", classes: "", components: [
					{name: "timePlayed", classes: "moon-audio-play-time left", content: "0:00"},
					{classes: "moon-audio-slider-container enyo-inline", fit: true, components: [
						{kind: "moon.Slider", name: "slider", classes: "moon-audio-slider", noPopup: true, lockBar: true, onChanging: "sliderChanging", onAnimateFinish: "sliderChanging"}
					]},
					{name: "timeRemaining", classes: "moon-audio-play-time right", content: "0:00"}
				]}
			]}
		]}
	],
	initComponents: function() {
		this.components = [{kind: "moon.AudioPlaybackQueue"}];
		this.inherited(arguments);
		this.components = null;
	},
	create: function() {
		this.inherited(arguments);
		this.$.controlDrawer.createComponents(this.audioComponents, {owner:this});
	},
	rendered: function() {
		this.inherited(arguments);
	},
	toggleTrackDrawer: function() {
		this.$.client.setOpen(!this.$.client.getOpen());
	},
	endPlayheadJob: function() {
		clearInterval(this.playheadJob);
		this.playheadJob = null;
	},
	audioEnd: function() {
		if ((this.index === (this.audioTracks.length-1)) && (!this.repeat)) {
			this.$.btnPlay.applyStyle("background-image", "url(assets/icon-play-btn.png)");
		} else {
			this.playNext();
		}
	},
	updateTrackCount: function() {
		var l = this.audioTracks.length;
		if (l === 1) {
			this.index = 0;
			this.updateTrackIndex(this.index);
		}
	},
	updateTrackIndex: function(inIndex) {
		var a = this.audioTracks[inIndex];
		this.$.trackName.setContent(a.trackName);
		this.$.artistName.setContent(a.artistName);
		this.$.sound.setSrc(a.src);
		this.updatePlayTime("0:00", "0:00");
		this.owner.$.drawers.$.drawerHandle.setContent(a.trackName + " by " + a.artistName);
	},
	updatePlayhead: function() {
		var totalTime = this.$.sound.getDuration();
		var currentTime = this.$.sound.getCurrentTime();
		var playheadPos = (currentTime * 100) / totalTime;
		this.updatePlayTime(this.toReadableTime(currentTime), this.toReadableTime(totalTime));
		this.$.slider.updateKnobPosition(playheadPos);
		this.$.slider.setProgress(playheadPos);
	},
	updatePlayTime: function(inStart, inEnd) {
		this.$.timePlayed.setContent(inStart);
		this.$.timeRemaining.setContent(inEnd);
	},
	toReadableTime: function(inValue) {
		var minutes = Math.floor(inValue / 60).toString();
		var seconds = Math.floor(inValue - minutes * 60).toString();
		if (seconds < 10) {
			seconds = "0" + seconds;
		} else if (seconds.length === 1) {
			seconds += "0";
		}
		return minutes + ":" + seconds;
	},
	sliderChanging: function(inSender, inEvent) {
		var totalTime = this.$.sound.getDuration();
		var currentTime = (totalTime / 100) * inEvent.value;
		this.updatePlayTime(this.toReadableTime(currentTime), this.toReadableTime(totalTime));
		this.$.sound.seekTo(currentTime);
	},
	//* @public
	togglePlay: function() {
		this.$.sound.isPlaying ? this.pause() : this.play();
	},
	play: function() {
		this.$.sound.play();
		if (this.playheadJob === null) {
			this.playheadJob = setInterval(this.bindSafely("updatePlayhead"), 500);
		}
		this.$.btnPlay.applyStyle("background-image", "url(assets/icon-pause-btn.png)");
	},
	pause: function() {
		this.$.sound.pause();
		this.endPlayheadJob();
		this.$.btnPlay.applyStyle("background-image", "url(assets/icon-play-btn.png)");
	},
	playPrevious: function() {
		this.index = (this.index === 0) ? this.audioTracks.length - 1 : this.index - 1;
		this.updateTrackIndex(this.index);
		this.play();
	},
	playNext: function() {
		this.index = (this.audioTracks.length > (this.index + 1)) ? this.index + 1 : 0;
		this.updateTrackIndex(this.index);
		this.play();
	},
	playAtIndex: function(inIndex) {
		this.index = (this.audioTracks.length > inIndex) ? inIndex : 0;
		this.updateTrackIndex(this.index);
		this.play();
	},
	addAudioTrack: function(inSrc, inTrack, inArtist, inAlbum, inDuration) {
		var a = {
			src: inSrc,
			trackName: inTrack,
			artistName: inArtist,
			albumName: inAlbum,
			duration: inDuration
		};
		this.audioTracks[this.audioTracks.length] = a;
		this.updateTrackCount();
		this.waterfall("onAddAudio", {tracks: this.audioTracks});
	}
});


enyo.kind({
	//* @protected
	name: "moon.AudioPlaybackQueue",
	kind: "FittableRows",
	classes: "enyo-fit moon-audio-playback-queue",
    handlers: {
    	onAddAudio: "addAudio"
    },
    components: [
    	{kind: "moon.Header", name: "queueHeader", title: "Music Queue", titleBelow: "2 Tracks"},
		{
			kind: "moon.List",
			name: "list",
			classes: "list-sample-contacts-list enyo-unselectable",
			fit: true,
			multiSelect: false,
			onSetupItem: "setupItem",
			components: [
				{name: "item", kind: "moon.AudioListItem", classes: "moon-audio-queue-list enyo-border-box", onRemove: "removeTap"}
			]
		}
    ],
    tracks: [],
    create: function() {
		this.inherited(arguments);
		this.parent.applyStyle("height", "100%");
    },
    rendered: function() {
		this.inherited(arguments);
    },
    addAudio: function(inSender, inEvent) {
		var i = this.$.list.getCount() + 1;
		this.tracks = inEvent.tracks;
		this.$.list.setCount( i );
		this.$.list.reset();
		this.$.queueHeader.setTitleBelow(i + " Tracks");
    },
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var t = this.tracks[i];
		var item = {artistName: t.artistName, trackName: t.trackName, src: "", albumName: t.albumName, duration: t.duration};
		this.$.item.setTrack(item);
		this.$.item.setSelected(inSender.isSelected(i));
		return true;
	}
});

enyo.kind({
	name: "moon.AudioListItem",
	events: {
		onRemove: ""
	},
	components: [
		{name: "albumArt", kind: "Image", classes: "moon-audio-queue-album-art"},
		{components: [
			{name: "trackName"},
			{name: "artistName"}
		]}
		//{name: "remove", kind: "moon.IconButton", classes: "audio-queue-list-remove", src: "assets/remove-icon.png", ontap: "removeTap", spotlight: false}
	],
	setTrack: function(inAudio) {
		this.$.trackName.setContent(inAudio.trackName);
		this.$.artistName.setContent(inAudio.artistName + " - " + inAudio.albumName);
		this.$.albumArt.setSrc(inAudio.src);
	},
	setSelected: function(inSelected) {
		this.addRemoveClass("moon-audio-queue-list-selected", inSelected);
		//this.$.remove.applyStyle("display", inSelected ? "inline-block" : "none");
	},
	removeTap: function(inSender, inEvent) {
		this.doRemove(inEvent);
		return true;
	}
});