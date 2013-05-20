/**
	_moon.AudioPlayback_
*/
enyo.kind({
	name: "moon.AudioPlayback",
	classes: "",
	published: {
		audioFiles: []
	},
	//* @protected
	index: 0,
	tools: [
		{kind: "moon.AudioPlaybackControl", name: "audioPlaybackControl"},
		{kind: "moon.AudioPlaybackDrawer", name: "drawerControl"},
		{name: "client"}
	],
	handlers: {
		onToggleUnderDrawer: "toggleUnderDrawer"
	},
	initComponents: function() {
		this.createChrome(this.tools);
		this.$.drawerControl.createComponents(this.drawerComponents);
		this.inherited(arguments);
	},
	create: function() {
		this.inherited(arguments);
		this.initAudio(this.index);
	},
	rendered: function() {
		this.inherited(arguments);
		this.audioFilesChanged();
		this.$.audioPlaybackControl.updateTrackInfo(this.audioFiles, this.index);
	},
	audioFilesChanged: function() {
		this.$.audioPlaybackControl.updateAudioFiles(this.audioFiles, this.index);
	},
	toggleUnderDrawer: function() {
		
		var v = !this.$.drawerControl.$.drawer.open;
		if (v) {
			// FIXME: Added since we shouldn't call this in rendered(). Seems like overkill after first use
			this.resizeDrawer();
		}
		
		this.$.audioPlaybackControl.addRemoveClass("extended", v);
		this.$.drawerControl.$.drawer.spotlight = v;
		this.$.drawerControl.$.drawer.setOpen(v);
		
		return true;
	},
	calcViewportSize: function() {
		if (window.innerWidth) {
			return {
				width: window.innerWidth,
				height: window.innerHeight
			};
		} else {
			var e = document.documentElement;
			return {
				width: e.offsetWidth,
				height: e.offsetHeight
			};
		}
	},
	resizeDrawer: function(inProps) {
		var a = this.calcViewportSize();
		var b = this.$.audioPlaybackControl.getBounds();
		this.waterfallDown("onResizeDrawer", {
			height: a.height - b.height
		});
	},
	resizeHandler: function() {
		this.inherited(arguments);
		this.resizeDrawer();
	},
	initAudio: function(inIndex) {
		this.$.audioPlaybackControl.setSrc(this.audioFiles[inIndex]);
	},
	//* @public
	togglePlay: function() {
		this.$.audioPlaybackControl.togglePlay();
	},
	next: function() {
		this.$.audioPlaybackControl.playNext();
	},
	previous: function() {
		this.$.audioPlaybackControl.playPrevious();
	},
	seekTo: function(inValue) {
		this.$.audioPlaybackControl.seekTo(inValue);
	},
	playIndex: function(inIndex) {
		this.$.audioPlaybackControl.playIndex(inIndex);
	}
});




/**
	_moon.AudioPlaybackControl_
*/
enyo.kind({
	name: "moon.AudioPlaybackControl",
	classes: "moon-audio-playback-control",
	//* @protected
	spotlight: true,
	handlers: {
		onSpotlightFocused: "focused",
		onPlayerExtended: "playerExtended"
	},
	published: {
		src: "",
		repeat: false
	},
	audioFiles: [],
	index: 0,
	components: [
		{name: "sound", kind: "moon.Sound", onEnd: "audioEnd"},
		// mini view
		{classes: "moon-audio-playback-mini", spotlight: false, components: [
			{name: "trackLabel", content: "Track Name by Artist Name", classes: "moon-audio-playback-label-mini"},
			{name: "sliderContainerMini", classes: "moon-audio-playback-container mini", components: [
				{kind: "moon.AudioPlaybackSlider", name: "sliderMini", classes: "moon-audio-playback-slider mini", value: 0, disabled: true}
			]},
			{name: "playTimeMini", content: "0:00/0:00", classes: "moon-audio-playback-playtime mini"},
			{content: "icons", style: "moon-audio-playback-icons mini"},
			{name: "trackCount", content: "()", classes: "moon-audio-playback-count mini"}
		]},


		// main view
		{classes: "moon-audio-playback-main", components: [
			{name: "trackIcon", classes: "moon-audio-playback-track-icon"},
			{classes: "moon-audio-playback-track-info", components: [
				{name: "trackName", content: "Track Name", classes: "moon-audio-playback-track"},
				{name: "artistName", content: "Artist Name", classes: "moon-audio-playback-artist"}
			]},
			{kind: "moon.IconButton", classes: "moon-audio-playback-icon-button", src: "assets/icon-rew-btn.png", ontap: "playPrevious"},
			{kind: "moon.IconButton", name: "btnPlay", classes: "moon-audio-playback-icon-button", src: "assets/icon-play-btn.png", ontap: "togglePlay"},
			{kind: "moon.IconButton", classes: "moon-audio-playback-icon-button", src: "assets/icon-fwd-btn.png", ontap: "playNext"},
			{name: "sliderContainer", classes: "moon-audio-playback-container", components: [
				{kind: "moon.AudioPlaybackSlider", name: "sliderMain", classes: "moon-audio-playback-slider", value: 0, onChanging: "sliderChanging", onAnimateFinish: "sliderChanging"}
			]},
			{name: "playTimeMain", classes: "moon-audio-playback-playtime main", content: "0:00/0:00"},
			{kind: "moon.IconButton", classes: "moon-audio-playback-icon-button", src: "assets/icon-album.png", ontap: "toggleDrawer"},
			{kind: "moon.ContextualPopupDecorator", style: "vertical-align:top;", components: [
				{kind: "moon.IconButton", classes: "moon-audio-playback-icon-button", src: "assets/icon-list.png"},
				{kind: "moon.ContextualPopup", style: "width:200px;height:200px;", components: [
					{content: "Contextual popup content"}
				]}
			]}
		]}
	],
	rendered: function() {
		this.inherited(arguments);
	},
	focused: function() {
		this.addClass("spotlight");
	},
	toggleDrawer: function() {
		this.bubble("onToggleUnderDrawer");
	},
	_play: function() {
		this.$.sound.play();
		this.$.btnPlay.applyStyle("background-image", "url(assets/icon-pause-btn.png)");
		this.updateTrackInfo(this.audioFiles, this.index);
		this.playheadJob = setInterval(this.bindSafely("updatePlayhead"), 1000);
	},
	_pause: function() {
		this.$.sound.pause();
		this.$.btnPlay.applyStyle("background-image", "url(assets/icon-play-btn.png)");
		clearInterval(this.playheadJob);
		this.playheadJob = null;
	},
	togglePlay: function() {
		if (this.$.sound.isPlaying) {
			this._pause();
		} else {
			this._play();
		}
	},
	playNext: function() {
		if (this.$.sound.isPlaying) {
			this.$.sound.pause();
		} else {
			this.$.btnPlay.applyStyle("background-image", "url(assets/icon-pause-btn.png)");
		}
		if (this.audioFiles.length > (this.index + 1)) {
			this.index++;
		} else {
			this.index = 0;
		}
		this.setSrc(this.audioFiles[this.index]);
		this.$.sound.play();
		this.updateTrackInfo(this.audioFiles, this.index);
	},
	playPrevious: function() {
		if (this.$.sound.isPlaying) {
			this.$.sound.pause();
		} else {
			this.$.btnPlay.applyStyle("background-image", "url(assets/icon-pause-btn.png)");
		}
		if (this.index === 0) {
			this.index = this.audioFiles.length - 1;
		} else {
			this.index--;
		}
		this.setSrc(this.audioFiles[this.index]);
		this.$.sound.play();
		this.updateTrackInfo(this.audioFiles, this.index);
	},
	playIndex: function(inIndex) {
		this.$.sound.pause();
		this.index = inIndex;
		this.setSrc(this.audioFiles[this.index]);
		this.$.sound.play();
		this.updateTrackInfo(this.audioFiles, this.index);
	},
	seekTo: function(inValue) {
		this.$.sound.seekTo(inValue);
	},
	sliderChanging: function(inSender, inEvent) {
		var totalTime = this.$.sound.getDuration();
		var currentTime = (totalTime / 100) * inEvent.value;
		this.updatePlayTime(this.toReadableTime(currentTime) + "/" + this.toReadableTime(totalTime));
		this.seekTo(currentTime);
		this.$.sliderMini.setValue(inEvent.value);
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
	updateDuration: function(inSender, inEvent) {
		var totalTime = this.$.sound.getDuration();
		var s = "0:00" + "/" + this.toReadableTime(totalTime);
		this.updatePlayTime(s);
	},
	updatePlayTime: function(inValue) {
		this.$.playTimeMini.setContent(inValue);
		this.$.playTimeMain.setContent(inValue);
	},
	updateTrackInfo: function(inSender, inIndex) {
		this.updateDuration();

		// update mini view
		this.$.trackLabel.setContent(inSender[inIndex].trackName + " by " + inSender[inIndex].artistName);
		this.$.trackCount.setContent("(" + inSender.length + ")");

		// update main view
		this.$.trackIcon.applyStyle("background-image", "url(" + enyo.path.rewrite(inSender[inIndex].iconSrc) + ")");
		this.$.trackName.setContent(inSender[inIndex].trackName);
		this.$.artistName.setContent(inSender[inIndex].artistName);
	},
	srcChanged: function(inSender, inAudio) {
		this.$.sound.setSrc(inAudio.src);
	},
	updateAudioFiles: function(inAudio, inIndex) {
		this.audioFiles = inAudio;
		this.index = inIndex;
	},
	audioEnd: function() {
		if ((this.index === (this.audioFiles.length-1)) && (!this.repeat)) {
			this.togglePlay();
		} else {
			this.playNext();
		}
	},
	updatePlayhead: function() {
		var totalTime = this.$.sound.getDuration();
		var currentTime = this.$.sound.getCurrentTime();
		var playheadPos = (currentTime * 100) / totalTime;
		this.updatePlayTime(this.toReadableTime(currentTime) + "/" + this.toReadableTime(totalTime));
		this.$.sliderMain.updateKnobPosition(playheadPos);
		this.$.sliderMini.updateKnobPosition(playheadPos);
	}
});


enyo.kind({
	name: "moon.AudioPlaybackDrawer",
	tools: [
		{name: "drawer", kind: "moon.FullScreenDrawer", spotlight: false, components: [
			{name: "client"}
		]}
	],
	initComponents: function() {
		this.createChrome(this.tools);
		this.inherited(arguments);
	}
});
