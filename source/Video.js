/**
	_enyo.Video_ is a control that allows you to play video. It is an
	abstraction of HTML 5 Video.

	Initialize a video component as follows:

		{kind: "Video", src: "http://www.w3schools.com/html/movie.mp4"}
	
	To play a video, call `this.$.video.play()`.

	To get a reference to the actual HTML 5 Video element, call
	`this.$.video.hasNode()`.
*/
enyo.kind({
	name: "enyo.Video",
	kind: enyo.Control,
	published: {
		//* control command like jumpToStart, jumpBackward, rewind, play, pause, fastForward, jumpForward, jumpToEnd
		command: "",
		//* source URL of the video file, can be relative to the application's HTML file
		src: "",
		//* source of image file to show when video isn't available
		poster: "",
		//* if true, show controls for starting and stopping video player
		showControls: false,
		/**
			This value determines if/how the video object should preload. Possible values:
				auto: preload the video data as soon as possible.
				metadata: preload only the video metadata.
				none: do not preload any video data.
		*/
		preload: "metadata",
		//* if true, video will automatically start
		autoplay: false,
		//* if true, restart video player from beginning when finished
		loop: false,
		//* (webOS only) if true, stretch the video to fill the entire window
		fitToWindow: false,
		//* Video aspect ratio in the format _width:height_
		aspectRatio: null,
		//* jump forward or backward time in seconds
		jumpSec: 30
	},
	handlers: {
		//* Catch video _loadedmetadata_ event
		onloadedmetadata: "metadataLoaded",
		//* Decorate _timeupdate_ event
		onTimeupdate: "decorateTimeUpdate"
	},
	tag: "video",
	//* @protected
	_playbackRateHash: {
		fastForward: [4, 15, 60, 300],
		rewind: [-4, -15, -60, -300],
		slowForward: [1/15, 1/4],
		slowRewind: [-1/4, -1]
	},
	_playbackRateArray: null,
	_speedIndex: 0,
	_playbackRate: 1,

	create: function() {
		this.inherited(arguments);
		this.srcChanged();
		this.posterChanged();
		this.showControlsChanged();
		this.preloadChanged();
		this.autoplayChanged();
		this.loopChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.hookupVideoEvents();
	},
	srcChanged: function() {
		if (this.src === "") {return;}
		var path = enyo.path.rewrite(this.src);
		this.setAttribute("src", path);
		// HTML5 spec says that if you change src after page is loaded, 
		// you need to call load() to load the new data
		if (this.hasNode()) {
			this.node.load();	// not called
		}
	},
	posterChanged: function() {
		if (this.poster) {
			var path = enyo.path.rewrite(this.poster);
			this.setAttribute("poster", path);
		}
		else {
			this.setAttribute("poster", null);
		}
	},
	showControlsChanged: function() {
		this.setAttribute("controls", this.showControls ? "controls" : null);
	},
	preloadChanged: function() {
		this.setAttribute("preload", this.preload ? this.preload : null);
	},
	autoplayChanged: function() {
		this.setAttribute("autoplay", this.autoplay ? "autoplay" : null);
	},
	loopChanged: function() {
		this.setAttribute("loop", this.loop ? "loop" : null);
	},
	fitToWindowChanged: function() { 
		if (!this.hasNode()) {
			return;
		}
	},
	//* @public
	setCommand: function(inNew) {
		var inOld = this.cmd;
		this.cmd = inNew;

		if (!this.hasNode()) {return;}

		if (inOld != "play" && inNew == "play") {
			this.setPlaybackRate(1);
			this.node.play();
		}
		if (inOld != "pause" && inNew == "pause") {
			if (inOld == "play") {
				this.setPlaybackRate(1);
				this.node.pause();
			} else {
				// to fix playbutton while doing other than play
				this.setCmd("play");
			}
		}
		if (inNew == "fastForward") {
			switch (inOld) {
			case "pause":
				this.selectPlaybackRateArray("slowForward");
				this._speedIndex = 0;
				this.node.play();
				break;
			case "fastForward":
				this._speedIndex++;
				break;
			default:
				this.selectPlaybackRateArray("fastForward");
				this._speedIndex = 0;
			}
			this._playbackRate = this.clampPlaybackRate(this._speedIndex);
			this.setPlaybackRate(this._playbackRate);
		}
		if (inNew == "rewind") {
			switch (inOld) {
			case "pause":
				this.selectPlaybackRateArray("slowRewind");
				this._speedIndex = 0;
				this.node.play();
				break;
			case "rewind":
				this._speedIndex++;
				break;
			default:
				this.selectPlaybackRateArray("rewind");
				this._speedIndex = 0;
			}
			this._playbackRate = this.clampPlaybackRate(this._speedIndex);
			this.setPlaybackRate(this._playbackRate);
		}
		if (inNew == "jumpBackward") {
			this.setPlaybackRate(1);
			this.node.currentTime -= this.jumpSec;
			// to fix playbutton while doing other than play
			if (inOld == "play") {
				this.setCmd("play");
			}
		}
		if (inNew == "jumpForward") {
			this.setPlaybackRate(1);
			this.node.currentTime += this.jumpSec;
			// to fix playbutton while doing other than play
			if (inOld == "play") {
				this.setCmd("play");
			}
		}
		if (inNew == "jumpToStart") {
			this.setPlaybackRate(1);
			this.node.pause();
			this.node.currentTime = 0;
		}
		if (inNew == "jumpToEnd") {
			this.setPlaybackRate(1);
			this.node.pause();
			this.node.currentTime = this.node.duration;
		}
	},
	selectPlaybackRateArray: function(cmd) {
		this._playbackRateArray = this._playbackRateHash[cmd];
	},
	clampPlaybackRate: function(index) {
		if (!this._playbackRateArray) {return;}
		return this._playbackRateArray[index % this._playbackRateArray.length];
	},
	setPlaybackRate: function(playbackRate) {
		if (this.hasNode()) {
			this.log(playbackRate);
			// Do playbackRate if platform support otherwise try moving currentTime tric
			this.node.playbackRate = playbackRate;
		}
	},
	isPaused: function() {
		if (this.hasNode()) {
			return this.node.paused;
		}
	},
	
	//* Return current player position in the video (in seconds)
	getCurrentTime: function() {
		if (this.hasNode()) {
			return this.node.currentTime;
		}
		return 0;
	},
	//* Return buffered time ranges
	getBufferedTimeRange: function() {
		if (this.hasNode()) {
			return this.node.buffered;
		}
		return 0;
	},
	//* Set current player position in the video (in seconds)
	setCurrentTime: function(inTime) {
		if ((typeof inTime === 'number') && this.hasNode()) {
			this.node.currentTime = inTime;
		}
	},
	//* Get play duration in the video (in seconds)
	getDuration: function() {
		if (this.hasNode()) {
			return this.node.duration;
		}
		return 0;
	},
	//* When we get the video metadata, update _this.aspectRatio_
	metadataLoaded: function(inSender, inEvent) {
		var node = this.hasNode();
		if (!node || !node.videoWidth || !node.videoHeight) {
			return;
		}
		this.setAspectRatio(node.videoWidth/node.videoHeight+":1");
	},
	decorateTimeUpdate: function(inSender, inEvent) {
		// this.log(inSender, inEvent);
		//TODO - make this work
	},
	//* Add all html5 video events
	hookupVideoEvents: function() {
		enyo.makeBubble(this,
			"loadstart",
			"emptied",
			"canplaythrough",
			"ended",
			"ratechange",
			"progress",
			"stalled",
			"playing",
			"durationchange",
			"volumechange",
			"suspend",
			"loadedmetadata",
			"waiting",
			"timeupdate",
			"abort",
			"loadeddata",
			"seeking",
			"play",
			"error",
			"canplay",
			"seeked",
			"pause"
		);
	}
});

