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
		//* if true, show controls for starting and stopping video playback
		showControls: false,
		//* if true, video will automatically start
		autoplay: false,
		//* if true, restart video playback from beginning when finished
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
	//* @protected
	tag: "video",
	defaultStep: 1,
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
			this.clearStep();
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
			this.clearStep();
			this._cancelRequest();
			this.node.pause();
		}
	},
	//* Return current playback position in the video (in seconds)
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
	//* Set current playback position in the video (in seconds)
	setCurrentTime: function(inTime) {
		if ((typeof inTime === 'number') && this.hasNode()) {
			this.node.currentTime = inTime;
		}
	},
	getDuration: function() {
		if (this.hasNode()) {
			return this.node.duration;
		}
		return 0;
	},
	jumpStart: function() {
		if (this.hasNode()) {
			this.pause();
			this.clearStep();
			this._cancelRequest();
			this.node.currentTime = 0;
		}
	},
	jumpBack: function() {
		if (this.hasNode()) {
			this.clearStep();
			this._cancelRequest();
			this.node.currentTime-=30;
		}
	},
	rewind: function() {
		if (this.hasNode()) {
			if (this.step && this.step < 4) {
				this.step *= 2;
			} else {
				this.clearStep();
			}
			this.node.pause();
			this._cancelRequest();
			this._requestRewind();
		}
	},
	fastForward: function() {
		if (this.hasNode()) {
			if (this.step && this.step < 4) {
				this.step *= 2;
			} else {
				this.clearStep();
			}
			this.node.pause();
			this._cancelRequest();
			this._requestFastForward();
		}
	},
	jumpForward: function() {
		if (this.hasNode()) {
			this.clearStep();
			this._cancelRequest();
			this.node.currentTime+=30;
		}
	},
	jumpEnd: function() {
		if (this.hasNode()) {
			this.pause();
			this.clearStep();
			this._cancelRequest();
			this.node.currentTime = this.node.duration;
			
		}
	},
	_requestRewind: function() {
		this.job = enyo.requestAnimationFrame(enyo.bind(this, this._rewind));
	},
	_rewind: function() {
		if (this.node.currentTime > 0) {
			this.node.currentTime -= this.step;
			this._requestRewind();
		} else {
			this.clearStep();
			this._cancelRequest();
		}
	},
	_cancelRequest: function() {
		enyo.cancelRequestAnimationFrame(this.job);
	},
	_requestFastForward: function() {
		this.job = enyo.requestAnimationFrame(enyo.bind(this, this._fastForward));
	},
	_fastForward: function() {
		if (this.node.currentTime < this.node.duration) {
			this.node.currentTime += this.step;
			this._requestFastForward();
		} else {
			this.clearStep();
			this._cancelRequest();
		}
	},
	clearStep: function() {
		this.step = this.defaultStep;
	}
});
