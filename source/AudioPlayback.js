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
		repeat: "NONE", //"NONE", "ONE", "ALL"
		// add by youngMok.
		shuffle: false
	},
	events: {
		onIndexChanged: ""
	},
	//* @protected
	audioComponents: [
		{name: "audio", kind: "enyo.Audio", onEnded: "audioEnd"},
		{kind: "FittableColumns", classes: "moon-audio-playback-controls", spotlight: "container", components: [
			{name: "trackIcon", classes: "moon-audio-playback-track-icon"},
			{classes: "moon-audio-play-controls", fit: true, components: [
				{kind: "FittableColumns", classes: "moon-audio-top", components: [
					{classes: "moon-audio-track-info", components: [
						{name: "trackName", content: "Track Name", classes: "moon-audio-playback-track"},
						{name: "artistName", content: "Artist Name", classes: "moon-audio-playback-artist"}
					]},
					{classes: "moon-audio-control-buttons", fit: true, components: [
						// _src_ property will need to be updated with images from UX
						{kind: "moon.IconButton", classes: "moon-audio-icon-button left", src: "assets/icon-rew-btn.png", ontap: "playPrevious"},
						{kind: "moon.IconButton", name: "btnPlay", classes: "moon-audio-icon-button left", src: "assets/icon-play-btn.png", ontap: "togglePlay"},
						{kind: "moon.IconButton", classes: "moon-audio-icon-button left", src: "assets/icon-fwd-btn.png", ontap: "playNext"},
						// by youngMok
						{kind: "moon.IconButton", classes: "moon-audio-icon-button right", name: "btnShuffle", content: "S", ontap: "toggleShuffleState"},
						{kind: "moon.IconButton", classes: "moon-audio-icon-button right", name: "btnRepeat", content: "R", ontap: "changeRepeatState"},
						{kind: "moon.IconButton", classes: "moon-audio-icon-button right", src: "../assets/icon-album.png", ontap: "toggleTrackDrawer"}
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
	// modify by youngMok
	audioEnd: function() {
		/*if ((this.index === (this.audioTracks.length-1)) && (!this.repeat)) {
			this.$.btnPlay.applyStyle("background-image", "url(assets/icon-play-btn.png)");
		} else {
			this.playNext();
		}*/
		if (this.getShuffle()) {
			switch (this.getRepeat()) {
			case "NONE" :
				if( (this.audioTracks.length - 1) <= this.randomIndex ) {
					this.$.btnPlay.applyStyle("background-image", "url(assets/icon-play-btn.png)");
					this.lastControlCommand = "PLAY";
					this.endPlayheadJob();
					return true;
				}
				else {
					this.setIndex(this.getNextIndexForShuffle());
					this.updateTrackIndex(this.index);
					this.play();
				}
				break;
			case "ONE" :
				this.play();
				break;
			case "ALL" :
				this.setIndex(this.getNextIndexForShuffle());
				this.updateTrackIndex(this.index);
				this.play();
				break;
			}
		} else {
			switch (this.getRepeat()) {
			case "NONE" :
				if( this.index === (this.audioTracks.length-1) ){	//last music
					this.$.btnPlay.applyStyle("background-image", "url(assets/icon-play-btn.png)");
					this.lastControlCommand = "PLAY";
					this.endPlayheadJob();
					return true;
				}
				else {
					this.playNext();
				}
				break;
			case "ONE" :
				this.play();
				break;
			case "ALL" :
				this.playNext();
				break;
			}
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
		this.$.audio.setSrc(a.src);
		this.updatePlayTime("0:00", "0:00");
		this.$.trackIcon.applyStyle("background-image", "url(../assets/default-music.png)");
		// moon.Drawer needs a method for updating marquee content
		this.owner.$.drawers.$.drawerHandle.setContent(a.trackName + " by " + a.artistName);
	},
	updatePlayhead: function() {
		var duration = this.$.audio.getDuration();
		var totalTime = isNaN(duration) ? 0 : duration;
		var currentTime = this.$.audio.getCurrentTime();
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
		var totalTime = this.$.audio.getDuration();
		var currentTime = (totalTime / 100) * inEvent.value;
		this.updatePlayTime(this.toReadableTime(currentTime), this.toReadableTime(totalTime));
		this.$.audio.seekTo(currentTime);
	},
	// add by youngMok.
	changeRepeatState: function() {
		var result = "";
		switch (this.getRepeat()) {
			case "NONE" :
				result = this.setRepeat("ONE");
				this.$.btnRepeat.setContent("1");

				break;
			case "ONE" :
				result = this.setRepeat("ALL");
				this.$.btnRepeat.setContent("all");
				break;
			case "ALL" :
				result = this.setRepeat("NONE");
				this.$.btnRepeat.setContent("R");
				break;
		}
	},
	toggleShuffleState: function() {
		if (this.shuffle) {
			this.setShuffle(false);
			this.$.btnShuffle.setContent("S");
		} else {
			this.createRandomPlaylist();
			this.setShuffle(true);
			this.$.btnShuffle.setContent("S on");
		}
	},
	/*
		Make randomized playlist.
	*/
	createRandomPlaylist: function() {
		this.randomPlayList = [];
		for(var i = 0, len = this.audioTracks.length ; i < len ; i++) {
			this.randomPlayList[i] = i;
		}
		this.shuffleArray(this.randomPlayList);
		this.randomIndex = -1;
	},
	/*
		Make shuffle array for shuffle features.
	*/
	shuffleArray: function(inArray) {
		var len = inArray.length;
		if(len == 1) {
			return inArray;
		}

		var i = Math.floor(len * 1.5);
		while(i > 0) {
			var index1 = Math.floor(Math.random() * len);
			var index2 = Math.floor(Math.random() * len);
			if(index1 == index2) continue;

			var temp = inArray[index1];
			inArray[index1] = inArray[index2];
			inArray[index2] = temp;
			i--;
		}
		return inArray;
	},
	getNextIndexForShuffle: function() {
		if( (this.randomIndex + 1) >= this.audioTracks.length ) {
			this.randomPlayList = this.addShuffleArray(this.randomPlayList);
		}

		return this.randomPlayList[++this.randomIndex];
	},
	getPreviousIndexForShuffle: function() {
		var index = 0;

		if( (this.randomIndex - 1) < 0 ) {
			index = this.randomPlayList[0];
		}
		else {
			index = this.randomPlayList[--this.randomIndex];
		}
		this.randomPlayList = this.shuffleArrayWithinRange(this.randomPlayList, this.randomIndex + 1);

		return index;
	},
	/*
		If there are no next shuffle playlist, add shuffle playlist. 
	*/
	addShuffleArray: function(inShuffleArray) {
		var len = this.audioTracks.length;
		var sparePlayList = new Array();
		for(var i = 0 ; i < len ; i++){
			sparePlayList[i] = i;
		}
		this.shuffleArray(sparePlayList);

		return inShuffleArray.concat(sparePlayList);
	},
	/*
		shuffle array within range
	*/
	shuffleArrayWithinRange: function(inShuffleListArr, inStartNum) {
		if(inStartNum < 0 || inStartNum > (inShuffleListArr.length - 1)) return false;
		if(inShuffleListArr.length == 1) return inShuffleListArr;
		if((inShuffleListArr.length - 1 ) == inStartNum) return inShuffleListArr;

		var shuffleList = inShuffleListArr.slice(inStartNum);

		var len = shuffleList.length;
		var i = Math.floor(len * 1.5);
		while(i > 0)
		{
			var index1 = Math.floor(Math.random() * len);
			var index2 = Math.floor(Math.random() * len);
			if(index1 == index2) continue;
			var temp = shuffleList[index1];
			shuffleList[index1] = shuffleList[index2];
			shuffleList[index2] = temp;
			i--;
		}

		return inShuffleListArr.slice(0, inStartNum).concat(shuffleList);
	},
	setIndex: function(inIndex) {
		var previous = this.index;
		this.index = inIndex;
		this.indexChanged(previous, inIndex);
	},
	indexChanged: function(previous, current) {
		if(previous !== current) {
			this.doIndexChanged({"previous": previous, "current": current});
		}
	},
	recomposeAudioTag: function() {
		if(this.$.audio){
			var audioParent = this.$.audio.parent;
			this.$.audio.destroy();
			audioParent.createComponent({name: "audio", kind: "enyo.Audio", onEnded: "audioEnd"}, {owner: this});
			this.$.audio.render();
		}
	},
	//* @public
	togglePlay: function() {
		if (this.$.audio.getPaused()) {
			this.play();
		} else {
			this.pause();
		}
	},
	play: function() {
		this.$.audio.play();
		if (this.playheadJob === null) {
			this.playheadJob = setInterval(this.bindSafely("updatePlayhead"), 500);
		}
		this.$.btnPlay.applyStyle("background-image", "url(assets/icon-pause-btn.png)");
		this.lastControlCommand = "PLAY";
	},
	pause: function() {
		this.$.audio.pause();
		this.endPlayheadJob();
		this.$.btnPlay.applyStyle("background-image", "url(assets/icon-play-btn.png)");
	},
	playPrevious: function() {
		/*this.index = (this.index === 0) ? this.audioTracks.length - 1 : this.index - 1;
		this.updateTrackIndex(this.index);
		this.play();*/
		this.recomposeAudioTag();

		this.audioTracks[this.index].playingMark = false;

		if(this.shuffle){
			if( this.getRepeat() === "NONE" ) {
				this.setIndex(this.getPreviousIndexForShuffle());
			}
			else if( this.getRepeat() === "ONE" ) {
				this.setIndex(this.getPreviousIndexForShuffle());
			}
			else if( this.getRepeat() === "ALL" ) {
				this.setIndex(this.getPreviousIndexForShuffle());
			}
		}
		else{
			if( this.getRepeat() === "NONE" ) {
				this.setIndex((this.index === 0) ? this.audioTracks.length - 1 : this.index - 1);
			}
			else if( this.getRepeat() === "ONE" ) {
				this.setIndex((this.index === 0) ? this.audioTracks.length - 1 : this.index - 1);
			}
			else if( this.getRepeat() === "ALL" ) {
				this.setIndex((this.index === 0) ? this.audioTracks.length - 1 : this.index - 1);
			}
		}

		this.updateTrackIndex(this.index);
		this.audioTracks[this.index].playingMark = true;
		this.waterfall("onRefreshPlaylist", {tracks: this.audioTracks});

		if( this.lastControlCommand === "PLAY" ) {
			this.play();
		}
	},
	playNext: function() {
		/*this.index = (this.audioTracks.length > (this.index + 1)) ? this.index + 1 : 0;
		this.updateTrackIndex(this.index);
		this.play();*/
		this.recomposeAudioTag();

		this.audioTracks[this.index].playingMark = false;

		if(this.shuffle){
			if( this.getRepeat() === "NONE" ) {
				this.setIndex(this.getNextIndexForShuffle());
			}
			else if( this.getRepeat() === "ONE" ) {
				this.setIndex(this.getNextIndexForShuffle());
			}
			else if( this.getRepeat() === "ALL" ) {
				this.setIndex(this.getNextIndexForShuffle());
			}
		}
		else{
			if( this.getRepeat() === "NONE" ) {
				this.setIndex((this.audioTracks.length > (this.index + 1)) ? this.index + 1 : 0);
			}
			else if( this.getRepeat() === "ONE" ) {
				this.setIndex((this.audioTracks.length > (this.index + 1)) ? this.index + 1 : 0);
			}
			else if( this.getRepeat() === "ALL" ) {
				this.setIndex((this.audioTracks.length > (this.index + 1)) ? this.index + 1 : 0);
			}
		}

		this.updateTrackIndex(this.index);
		this.audioTracks[this.index].playingMark = true;
		this.waterfall("onRefreshPlaylist", {tracks: this.audioTracks});

		if( this.lastControlCommand === "PLAY") {
			this.play();
		}
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
		{name: "albumArt", kind: "Image", classes: "moon-audio-queue-album-art", src: "assets/default-music-sm.png"},
		{components: [
			{name: "trackName"},
			{name: "artistName"}
		]}
	],
	setTrack: function(inAudio) {
		this.$.trackName.setContent(inAudio.trackName);
		this.$.artistName.setContent(inAudio.artistName + " - " + inAudio.albumName);
		this.$.albumArt.setSrc(inAudio.src);
	},
	setSelected: function(inSelected) {
		this.addRemoveClass("moon-audio-queue-list-selected", inSelected);
	},
	removeTap: function(inSender, inEvent) {
		this.doRemove(inEvent);
		return true;
	}
});