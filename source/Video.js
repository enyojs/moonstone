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
		aspectRatio: null
	},
	handlers: {
		//* Catch video _loadedmetadata_ event
		onloadedmetadata: "metadataLoaded",
		//* Decorate _timeupdate_ event
		onTimeupdate: "decorateTimeUpdate"
	},
	tag: "video",
	//* @protected
	_defaultStep: 0.2,
	_direction: "",
	_playerrate: 1,
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
	isPaused: function() {
		if (this.hasNode()) {
			return this.node.paused;
		}
	},
	//* Play the video
	play: function() {
		if (this.hasNode()) {
			this._clearStep();
			this._cancelRequest();
			if (!this.node.paused) {
				this.node.pause();
			} else {
				this.node.play();
			}
			// this.doUpdate({paused: this.node.paused});
		}
	},
	//* Pause the video
	pause: function() {
		if (this.hasNode()) {
			this._clearStep();
			this._cancelRequest();
			this.node.pause();
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
	//* Jump to the beginning
	jumpToStart: function() {
		if (this.hasNode()) {
			this._cancelRequest();
			this._clearStep();
			this.node.currentTime = 0;
			this.node.pause();
		}
	},
	//* Jump backward n sec
	jumpBack: function() {
		if (this.hasNode()) {
			if (this.holdJumpToStart == true) {
				this.holdJumpToStart = false;
				this.jumpToStart();
			} else {
				this._cancelRequest();
				this._clearStep();
				this.node.currentTime -= 30;
				if (this.isPaused() == true || this._direction != "") {
					this.play();
				}
			}
		}
	},
	//* Move backward by 4x, 15x, 60x, 300x of speed
	rewind: function() {
		if (this.hasNode()) {
			if (this.step && this.step < 4) {
				this.step *= 2;
			} else {
				this._clearStep();
			}
			this.node.pause();
			this._cancelRequest();
			this._requestRewind();
		}
	},
	//* Move forward by 4x, 15x, 60x, 300x of speed
	fastForward: function() {
		if (this.hasNode()) {

			// Fixme : _playerrate should work for FF and Rewind
			// switch (this._playerrate) {
			// 	case 2:
			// 	this._playerrate = 4; break;
			// 	case 4:
			// 	this._playerrate = 16; break;
			// 	case 16:
			// 	this._playerrate = 60; break;
			// 	case 60:
			// 	this._playerrate = 300; break;
			// 	default:
			// 	this._playerrate = 2;
			// }
			// this.node.playerRate = this._playerrate;

			if (this.step && this.step < 4) {
				this.step *= 2;
			} else {
				this._clearStep();
			}
			this.node.pause();
			this._cancelRequest();
			this._requestFastForward();
		}
	},
	//* Jump Forward n sec
	jumpForward: function() {
		if (this.hasNode()) {
			if (this.holdJumpToEnd == true) {
				this.holdJumpToEnd = false;
				this.jumpToEnd();
			} else {
				this._cancelRequest();
				this._clearStep();
				this.node.currentTime += 30;
				if (this.isPaused() == true || this._direction != "") {
					this.play();
				}
			}
		}
	},
	//* Jump to the end of video
	jumpToEnd: function() {
		if (this.hasNode()) {
			this._cancelRequest();
			this._clearStep();
			this.node.pause();
			this.node.currentTime = this.node.duration;
		}
	},
	//* @protected
	_requestRewind: function() {
		this.job = enyo.requestAnimationFrame(enyo.bind(this, this._rewind));
	},
	_rewind: function() {
		if (this.node.currentTime > 0) {
			this.node.currentTime -= this.step;
			this._requestRewind();
			this._direction = "rewind";
		} else {
			this._cancelRequest();
			this._clearStep();
		}
	},
	_cancelRequest: function() {
		enyo.cancelRequestAnimationFrame(this.job);
		this.job = null;
		this._direction = "";
	},
	_requestFastForward: function() {
		this.job = enyo.requestAnimationFrame(enyo.bind(this, this._fastForward));
	},
	_fastForward: function() {
		if (this.node.currentTime < this.node.duration) {
			this.node.currentTime += this.step;
			this._requestFastForward();
			this._direction = "forward";
		} else {
			this._clearStep();
			this._cancelRequest();
			this._direction = "";
		}
	},
	_clearStep: function() {
		this.step = this._defaultStep;
		this.node.playerRate = this._playerrate = 1;
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

