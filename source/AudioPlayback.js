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
	events: {
		//* Fires when audio player's playing index is changed.
		onIndexChanged: ""
	},
	//* @protected
	classes: "moon-audio-playback",
	open: false,
	controlsOpen: false,	
	handlers: {
		onToggleTrackList: "toggleTrackDrawer",
		onAudioTrackAdded: "audioTrackAdded",
		onDeleteSelected: "deleteSelected",
		onTrackOrderChanged: "trackOrderChanged",
		onClickItem: "userClickedFromPlayQueue"
	},
	bindings: [
		{from: ".$.audioPlayer.controller.model.tracks", to: ".$.audioQueue.trackList"}
	],
	controlDrawerComponents:[],
	initComponents: function() {
		this.inherited(arguments);
		this.$.controlDrawer.createComponents([{ name: "audioPlayer", kind: "moon.AudioPlayer" }], {owner:this});
		this.$.client.createComponents([{ name: "audioQueue", kind: "moon.AudioPlaybackQueue" }], {owner:this});
	},
	create: function() {
		this.inherited(arguments);
		
	},
	rendered: function() {
		this.inherited(arguments);
	},
	toggleTrackDrawer: function() {
		this.$.client.setOpen(!this.$.client.getOpen());
	},
	audioTrackAdded: function(inSender, inEvent) {
		this.waterfall("onAddAudio", {track:inEvent.track});
		return true;
	},
	deleteSelected: function(inSender, inEvent) {
		this.waterfall("onTrackDeleted", {selected: inEvent.selected});
		return true;
	},
	trackOrderChanged: function(inSender, inEvent) {
		this.waterfall("onTrackListChanged", {selected: inEvent.tracks});
		return true;
	},
	userClickedFromPlayQueue: function(inSender, inEvent) {
		this.playAtIndex(inEvent.index);
		return true;
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
		this.$.audioPlayer.play();
	},
	pause: function() {
		this.$.audioPlayer.pause();
	},
	playPrevious: function() {
		this.$.audioPlayer.playPrevious();
	},
	playNext: function() {
		this.$.audioPlayer.playNext();
	},
	playAtIndex: function(inIndex) {
		this.$.audioPlayer.playAtIndex(inIndex);
	},
	shuffle: function () {
		this.$.audioPlayer.toggleShuffleState();
	},
	repeat: function () {
		this.$.audioPlayer.changeRepeatState();
	},
	addAudioTrack: function(inSrc, inTrack, inArtist, inAlbum, inDuration, inAlbumImage) {
		this.$.audioPlayer.addAudioTrack(inSrc, inTrack, inArtist, inAlbum, inDuration, inAlbumImage);
	}
});

enyo.kind({
	name: "moon.AudioPlayerController",
	kind: "enyo.ModelController",
	create: function () {
		this.inherited(arguments);
		this.set("model", new moon.AudioPlayerModel());
		this.set("tracks", new enyo.Collection());
	},
	updateTrackValues: function (attrName, value) {
		for (var i = 0, tracks = this.get("tracks"); i < tracks.length; i++) {
			tracks.get(i).set(attrName, value);
		}
	},
	setPlayingIndex: function (idx) {
		this.updateTrackValues("isPlaying", false);
		this.get("tracks").get(idx).set("isPlaying", true);
	},
	setAudioPaused: function () {
		this.updateTrackValues("isPlaying", false);
	},
	removeTracks: function (tracks) {
		this.get("tracks").remove(tracks);
	}
});

enyo.kind({
	name: "moon.AudioPlayerModel",
	kind: "enyo.Model",
	attributes: {
		tracks: null
	}
});

enyo.kind({
	name: "moon.AudioPlayer",
	events: {
		//* Fires when playing index is changed.
		onIndexChanged: "",
		//* Fires when user clicks track list icon.
		onToggleTrackList: "",
		//* Fires when new audio track is added.
		onAudioTrackAdded: "",
		//* Fires when new audio track is paused.
		onAudioPaused: ""
	},
	handlers: {
		onTrackDeleted: "trackDeleted",
		onTrackListChanged: "trackListChanged"
	},
	published: {
		//* repeat playback features. available values are "NONE", "ONE", "ALL".
		repeat: "NONE",
		//* shuffle playback features.
		shuffle: false
	},
	playheadJob: null,
	create: function () {
		this.inherited(arguments);
		this.set("controller", new moon.AudioPlayerController());
		this.tracks = this.controller.get("tracks");
	},
	components: [
		{name: "audio", kind: "enyo.Audio", onEnded: "audioEnd"},
		{kind: "FittableColumns", noStretch:true, classes: "moon-audio-playback-controls", spotlight: "container", components: [
			{name: "trackIcon", kind: "Image", classes: "moon-audio-playback-track-icon"},
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
						{kind: "moon.IconButton", classes: "moon-audio-icon-button shuffle-button right", name: "btnShuffle", ontap: "toggleShuffleState"},
						{kind: "moon.IconButton", classes: "moon-audio-icon-button repeat-button none right", name: "btnRepeat", ontap: "changeRepeatState"},
						{kind: "moon.IconButton", classes: "moon-audio-icon-button right", src: "../assets/icon-album.png", ontap: "toggleTrackList"}
					]}
				]}
			]}
		]},
		{kind: "FittableColumns", classes: "", components: [
			{classes: "moon-audio-slider-container enyo-inline", fit: true, components: [
				{name: "slider", kind: "moon.VideoTransportSlider", audioPlayerSupport: true, onSeekStart: "sliderChanging", onSeek: "sliderChanging", onSeekFinish: "sliderChanging"}
			]}
		]}
	],
	endPlayheadJob: function() {
		clearInterval(this.playheadJob);
		this.playheadJob = null;
	},
	toggleTrackList: function () {
		this.doToggleTrackList();
	},
	trackDeleted: function (inSender, inEvent) {
		this.updateTrackIndex(0);
	},
	trackListChanged: function (inSender, inEvent) {
		this.updateTrackIndex(0);
	},
	audioEnd: function() {
		if (this.getShuffle()) {
			switch (this.getRepeat()) {
			case "NONE" :
				if ((this.tracks.length - 1) <= this.randomIndex) {
					this.$.btnPlay.applyStyle("background-image", "url(assets/icon-play-btn.png)");
					this.lastControlCommand = "PLAY";
					this.endPlayheadJob();
					return true;
				} else {
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
				if( this.index === (this.tracks.length - 1) ){	//last music
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
		if (this.tracks.length === 1) {
			this.index = 0;
			this.updateTrackIndex(this.index);
		}
	},
	updateTrackIndex: function(inIndex) {
		var track = this.tracks.get(inIndex);
		this.$.trackName.setContent(track.get("trackName"));
		this.$.artistName.setContent(track.get("artistName"));
		this.$.audio.setSrc(track.get("src"));
		this.updatePlayTime("0:00", "0:00");
		//this.$.trackIcon.applyStyle("background-image", "url(" + track.get("albumImage") + ")");
		this.$.trackIcon.setSrc(track.get("albumImage"));

		// moon.Drawer needs a method for updating marquee content
		//this.owner.$.drawers.$.drawerHandle.setContent(a.trackName + " by " + a.artistName);
	},
	updatePlayhead: function() {
		var duration = this.$.audio.getDuration(), 
			totalTime = isNaN(duration) ? 0 : duration,
			currentTime = this.$.audio.getCurrentTime(),
			playheadPos = (currentTime * 100) / totalTime;
/*		this.$.slider.setMin(0);
		this.$.slider.setMax(this.$.audio.getDuration());*/
		this.$.slider.setValue(playheadPos);
		this.updatePlayTime(this.toReadableTime(currentTime), this.toReadableTime(totalTime));
		//this.$.slider.setProgress(playheadPos);

		this.waterfall("onTimeupdate", {"currentTime": currentTime, "duration": duration});
	},
	updatePlayTime: function(inStart, inEnd) {
		//this.$.timePlayed.setContent(inStart);
		this.$.slider.$.beginTickText.setContent(inStart);
		this.$.slider.$.endTickText.setContent(inEnd);
		//this.$.timeRemaining.setContent(inEnd);
	},
	toReadableTime: function(inValue) {
		var minutes = Math.floor(inValue / 60).toString(),
			seconds = Math.floor(inValue - minutes * 60).toString();
		if (seconds < 10) {
			seconds = "0" + seconds;
		} else if (seconds.length === 1) {
			seconds += "0";
		}
		return minutes + ":" + seconds;
	},
	sliderChanging: function(inSender, inEvent) {
		var totalTime = this.$.audio.getDuration(),
			currentTime = (totalTime / 100) * inEvent.value;
		this.updatePlayTime(this.toReadableTime(currentTime), this.toReadableTime(totalTime));
		this.$.audio.seekTo(currentTime);
	},
	changeRepeatState: function() {
		var result = "";

		switch (this.getRepeat()) {
		case "NONE" :
			result = this.setRepeat("ONE");
			//this.$.btnRepeat.setContent("1");
			//this.$.btnRepeat.setSrc("assets/repeat-one.png");
			break;
		case "ONE" :
			result = this.setRepeat("ALL");
			//this.$.btnRepeat.setContent("all");
			//this.$.btnRepeat.setSrc("assets/repeat-on.png");
			break;
		case "ALL" :
			result = this.setRepeat("NONE");
			//this.$.btnRepeat.setContent("R");
			//this.$.btnRepeat.setSrc("assets/repeat-n-f.png");
			break;
		}

		this.$.btnRepeat.addRemoveClass("one", this.getRepeat() === "ONE");
		this.$.btnRepeat.addRemoveClass("all", this.getRepeat() === "ALL");
		this.$.btnRepeat.addRemoveClass("none", this.getRepeat() === "NONE");
	},
	toggleShuffleState: function() {		
		this.setShuffle(!this.shuffle);
		this.$.btnShuffle.addRemoveClass("on", this.shuffle);

		if (this.shuffle) {
			this.createRandomPlaylist();
		}
	},
	//* Make randomized playlist.
	createRandomPlaylist: function() {
		this.randomPlayList = [];
		for(var i = 0, len = this.tracks.length ; i < len ; i++) {
			this.randomPlayList[i] = i;
		}
		this.shuffleArray(this.randomPlayList);
		this.randomIndex = -1;
	},
	//* Make shuffle array for shuffle features.
	shuffleArray: function(inArray) {
		var len = inArray.length;
		if (len == 1) {
			return inArray;
		}

		var i = Math.floor(len * 1.5),
			index1,
			index2,
			temp;

		while (i > 0) {
			index1 = Math.floor(Math.random() * len);
			index2 = Math.floor(Math.random() * len);
			if (index1 == index2) {
				continue;
			}

			temp = inArray[index1];
			inArray[index1] = inArray[index2];
			inArray[index2] = temp;
			i--;
		}
		return inArray;
	},
	getNextIndexForShuffle: function() {
		if ((this.randomIndex + 1) >= this.tracks.length) {
			this.randomPlayList = this.addShuffleArray(this.randomPlayList);
		}

		return this.randomPlayList[++this.randomIndex];
	},
	getPreviousIndexForShuffle: function() {
		var index = 0;

		if ((this.randomIndex - 1) < 0) {
			index = this.randomPlayList[0];
		} else {
			index = this.randomPlayList[--this.randomIndex];
		}
		this.randomPlayList = this.shuffleArrayWithinRange(this.randomPlayList, this.randomIndex + 1);

		return index;
	},
	//* If there are no next shuffle playlist, add shuffle playlist. 
	addShuffleArray: function(inShuffleArray) {
		var len = this.tracks.length,
			sparePlayList = [];

		for (var i = 0 ; i < len ; i++) {
			sparePlayList[i] = i;
		}

		this.shuffleArray(sparePlayList);

		return inShuffleArray.concat(sparePlayList);
	},
	//* shuffle array within range
	shuffleArrayWithinRange: function(inShuffleListArr, inStartNum) {
		var shuffleLength = inShuffleListArr.length;

		if (inStartNum < 0 || inStartNum > (shuffleLength - 1)) { 
			return false; 
		} else if (shuffleLength == 1) { 
			return inShuffleListArr; 
		} else if ((shuffleLength - 1 ) == inStartNum) { 
			return inShuffleListArr;
		}

		var shuffleList = inShuffleListArr.slice(inStartNum),
			len = shuffleList.length,
			i = Math.floor(len * 1.5),
			temp,
			index1,
			index2;

		while (i > 0) {
			index1 = Math.floor(Math.random() * len);
			index2 = Math.floor(Math.random() * len);
			if(index1 == index2) {continue;}
			temp = shuffleList[index1];
			shuffleList[index1] = shuffleList[index2];
			shuffleList[index2] = temp;
			i--;
		}

		return inShuffleListArr.slice(0, inStartNum).concat(shuffleList);
	},
	setIndex: function(inIndex) {
		inIndex = inIndex || 0;
		var previous = this.index;
		this.index = inIndex;
		this.controller.setPlayingIndex(this.index);
		this.doIndexChanged({"previous": previous, "current": this.index});
	},
	recomposeAudioTag: function() {
		if (this.$.audio) {
			var audioParent = this.$.audio.parent;
			this.$.audio.destroy();
			audioParent.createComponent({name: "audio", kind: "enyo.Audio", onEnded: "audioEnd"}, {owner: this});
			this.$.audio.render();
		}
	},
	sendFeedback: function(inMessage, inParams, inShowLeft, inShowRight, inPersistShowing) {
		inParams = inParams || {};
		if (inMessage === "Play" && !this.lastControlCommand) {
			inMessage = "";
		}
		this.$.slider.feedback(inMessage, inParams, inShowLeft, inShowRight, inPersistShowing);
	},
	//* @public
	togglePlay: function() {
		if (this.$.audio.getPaused()) {
			this.setIndex(this.inIndex);
			this.play();
		} else {
			this.pause();
		}
	},
	play: function() {
		this.$.audio.play();
		if (this.playheadJob === null) {
			this.playheadJob = setInterval(this.bindSafely("updatePlayhead"), 50);
		}
		this.$.btnPlay.applyStyle("background-image", "url(assets/icon-pause-btn.png)");
		this.sendFeedback("Play");
		this.lastControlCommand = "PLAY";
	},
	pause: function() {
		this.$.audio.pause();
		this.doAudioPaused();
		this.endPlayheadJob();
		this.$.btnPlay.applyStyle("background-image", "url(assets/icon-play-btn.png)");
		this.controller.setAudioPaused();
		this.sendFeedback("Pause");
	},
	playPrevious: function() {
		this.recomposeAudioTag();

		if (this.shuffle) {
			if (this.getRepeat() === "NONE") {
				this.setIndex(this.getPreviousIndexForShuffle());
			} else if( this.getRepeat() === "ONE" ) {
				this.setIndex(this.getPreviousIndexForShuffle());
			} else if( this.getRepeat() === "ALL" ) {
				this.setIndex(this.getPreviousIndexForShuffle());
			}
		} else {
			if (this.getRepeat() === "NONE") {
				this.setIndex((this.index === 0) ? this.tracks.length - 1 : this.index - 1);
			} else if (this.getRepeat() === "ONE") {
				this.setIndex((this.index === 0) ? this.tracks.length - 1 : this.index - 1);
			} else if (this.getRepeat() === "ALL") {
				this.setIndex((this.index === 0) ? this.tracks.length - 1 : this.index - 1);
			}
		}

		this.updateTrackIndex(this.index);
		this.waterfall("onRefreshPlaylist", {tracks: this.tracks});

		if (this.lastControlCommand === "PLAY") {
			this.play();
		}
	},
	playNext: function() {
		this.recomposeAudioTag();

		if (this.shuffle) {
			if (this.getRepeat() === "NONE") {
				this.setIndex(this.getNextIndexForShuffle());
			} else if( this.getRepeat() === "ONE" ) {
				this.setIndex(this.getNextIndexForShuffle());
			} else if( this.getRepeat() === "ALL" ) {
				this.setIndex(this.getNextIndexForShuffle());
			}
		} else {
			if (this.getRepeat() === "NONE") {
				this.setIndex((this.tracks.length > (this.index + 1)) ? this.index + 1 : 0);
			} else if (this.getRepeat() === "ONE") {
				this.setIndex((this.tracks.length > (this.index + 1)) ? this.index + 1 : 0);
			} else if (this.getRepeat() === "ALL") {
				this.setIndex((this.tracks.length > (this.index + 1)) ? this.index + 1 : 0);
			}
		}

		this.updateTrackIndex(this.index);
		this.waterfall("onRefreshPlaylist", {tracks: this.tracks});

		if (this.lastControlCommand === "PLAY") {
			this.play();
		}
	},
	playAtIndex: function(inIndex) {
		this.setIndex((this.tracks.length > inIndex) ? inIndex : 0);
		this.updateTrackIndex(this.index);
		this.play();
	},
	addAudioTrack: function(inSrc, inTrack, inArtist, inAlbum, inDuration, inAlbumImage) {
		var track = {
			src: inSrc,
			trackName: inTrack,
			artistName: inArtist,
			albumName: inAlbum,
			isPlaying: false,
			isSelected: false,
			duration: inDuration,			
			albumImage: inAlbumImage,
			id: this.tracks.length
		};
		this.tracks.add(track);
		this.updateTrackCount();
		this.doAudioTrackAdded({"track": track});
	}
});

enyo.kind({
	//* @protected
	name: "moon.AudioPlaybackQueue",
	kind: "FittableRows",
	classes: "enyo-fit moon-audio-playback-queue",
	moveMode: false,
	deleteMode: false,
	events: {
		//* Fires when audio track is deleted from queue list.
		onDeleteSelected: "",
		//* Fires when audio player's playing index is changed.
		onTrackOrderChanged: "",
		//* Fires when user clicked item.
		onClickItem: ""
	},
	handlers: {
		onAddAudio: "addAudio"
	},
	bindings: [
		{ from: ".trackList", to: ".$.list.controller" },
		{ from: ".deleteMode", to: ".$.multiDeleteButton.showing" },
		{ from: ".deleteMode", to: ".$.selectAll.showing" },
		{ from: ".deleteMode", to: ".$.deselectAll.showing" },
		{ from: ".deleteMode", to: ".$.cancel.showing" },
		{ from: ".deleteMode", to: ".$.list.multipleSelection" },
		{ from: ".moveMode", to: ".$.list.multipleSelection" }
	],
	components: [
		{
			kind: "moon.Header", name: "queueHeader", title: "Music Queue", titleBelow: "2 Tracks",
			components: [
				{name: "selectAll", kind: "moon.Button", content: "Select All", classes: "moon-header-left", ontap: "selectAll", showing: false},
				{name: "deselectAll", kind: "moon.Button", content: "Deselect All", classes: "moon-header-left", ontap: "deselectAll", showing: false},
				{name: "multiDeleteButton", kind: "moon.Button", showing: false, classes: "moon-header-left", content: "Delete Selected", ontap: "deleteSelected"},
				{name: "cancel", kind: "moon.Button", content: "Cancel", classes: "moon-header-left", ontap: "updateDeleteMode", showing: false},
				{name: "confirmDel", kind: "moon.Button", content: $L("Delete"), ontap: "onConfirmDel", showing: false},
				{name: "moveBtn", kind: "moon.Button", content: "ordering list", ontap: "updateMoveMode"},
				{name: "deleteBtn", kind: "moon.Button", content: "delete", ontap: "updateDeleteMode"}
			]
		},
		{
			kind: "moon.DataList",
			name: "list",
			classes: "moon-audio-queue-list enyo-unselectable",
			fit: true,
			multipleSelection: false,
			ontap: "selectItem",
			components: [
				{
					bindings: [
						{from: ".model.albumImage", to: ".$.audioListItem.albumArt" },
						{from: ".model.trackName", to: ".$.audioListItem.trackName" },
						{from: ".model.artistName", to: ".$.audioListItem.artistName"},
						{from: ".model.isPlaying", to: ".$.audioListItem.playingMark"}
					],
					components: [
						{name: "audioListItem", classes: "enyo-border-box", kind: "moon.AudioListItem"}
					]
				}
			]
		}
	],
	create: function() {
		this.inherited(arguments);
		this.parent.applyStyle("height", "100%");
	},
	deleteSelected: function () {
		var selected = this.$.list.get("selected");
		this.$.list.controller.remove(selected);
		this.doDeleteSelected({ "selected": selected });
	},
	rendered: function() {
		this.inherited(arguments);
	},
	selectAll: function () {
		this.$.list.selectAll();
	},
	deselectAll: function () {
		this.$.list.deselectAll();
	},
	selectItem: function (inSerder, inEvent) {
		if (!this.moveMode && !this.deleteMode) {
			this.doClickItem({ index: this.$.list.get("selected").get("id") });
			return;
		}

		if (this.moveMode) {
			this.changeTrackOrder();
		}
	},
	updateDeleteMode: function (inSender, inEvent) {
		if (inEvent.originator.disabled) {
			return;
		}
		this.set("deleteMode", !this.deleteMode);
		this.$.deleteBtn.setDisabled(this.get("deleteMode"));
		this.$.moveBtn.setDisabled(this.get("deleteMode"));

		this.$.list.addRemoveClass("editMode", this.get("deleteMode"));

		this.$.list.deselectAll();
	},
	updateMoveMode: function (inSender, inEvent) {
		if (inEvent.originator.disabled) {
			return;
		}
		this.set("moveMode", !this.moveMode);
		this.$.deleteBtn.setDisabled(this.get("moveMode"));
		this.$.list.addRemoveClass("editMode", this.get("moveMode"));
		this.$.list.deselectAll();
	},
	changeTrackOrder: function () {
		var selected = this.$.list.get("selected");
		if (selected && selected.length === 2) {
			var newArray = [],
				from = selected[0],
				to = selected[1],
				fromIndex = from.get("id"),
				toIndex = to.get("id");
			for (var i = 0, id, models = this.$.list.controller; i < models.length; i++) {
				id = models.get(i).get("id");
				if (id === fromIndex) {
					newArray.push(to);
					continue;
				} else if (id === toIndex) {
					newArray.push(from);
					continue;
				}
				newArray.push(models.get(i));
			}

			from.set("isSelected", false);
			to.set("isSelected", false);
			this.$.list.deselectAll();
			this.$.list.controller.reset(newArray);
		}
		this.doTrackOrderChanged({tracks: this.$.list.controller.get("tracks")});
	},
	addAudio: function(inSender, inEvent) {
		this.$.queueHeader.setTitleBelow(this.$.list.length + " Tracks");
	}
});

/*enyo.kind({
	name: "testBinding",
	kind: enyo.Binding,
	transform: function (value) {
		debugger;
		return value;
	}
});*/

enyo.kind({
	name: "moon.AudioListItem",
	classes: "moon-audio-queue-item",
	playingMark: null,
	bindings: [
		{from: ".albumArt", to: ".$.albumArt.src", transform: "checkAlbumArt"},
		{from: ".trackName", to: ".$.trackName.content"},
		{from: ".artistName", to: ".$.artistName.content"}/*,
		{from: ".playingMark", to: ".$.playingMark.showing"}*/
	],	
	components: [
		{name: "albumArt", kind: "Image", classes: "moon-audio-queue-item-albumArt", src: "assets/default-music-sm.png"},
		{components: [
			{name: "trackName"},
			{name: "artistName"}
		]}/*,
		{name:"playingMark", kind: "Image", classes: "moon-audio-item-playmark", src: "assets/playing_mark.png"},
		{name:"selectMark", classes: "moon-audio-item-selectmark moon-checkbox"}*/
	],
	checkAlbumArt: function (value) {
		return value;
	},
	playingMarkChanged: function () {
		this.addRemoveClass("playing", this.playingMark);
	}
});