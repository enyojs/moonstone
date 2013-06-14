/**
A control that allows you to play video.  This component is an abstraction of HTML 5 Video.

Initialize a video component as follows:

	{kind: "Video", src: "http://www.w3schools.com/html/movie.mp4"}
	
To play a video, do this:

	this.$.video.play();

You can get a reference to the actual HTML 5 Video element via <code>this.$.video.hasNode()</code>.
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
		//* if true, video will automatically start
		autoplay: false,
		//* if true, restart video player from beginning when finished
		loop: false,
		//* (webOS only) if true, stretch the video to fill the entire window
		fitToWindow: false,
		width: 640,
		height: 360
	},
	events: {
		//* inEvent.paused 
		onUpdate: ""
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
		this.autoplayChanged();
		this.loopChanged();
	},
	rendered: function() {
		this.inherited(arguments);

		this.widthChanged();
		this.heightChanged();

		enyo.makeBubble(this, "timeupdate");
		
		// delayed until here because we need the node to be created 
		// to modify this property
		// this.fitToWindowChanged();
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
	widthChanged: function() {
		this.setAttribute("width", this.width + "px");
	},
	heightChanged: function() {
		this.setAttribute("height", this.height + "px");
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
			this.doUpdate({paused: this.node.paused});
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
	}
});
