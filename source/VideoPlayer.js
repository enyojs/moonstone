
/**
	_moon.VideoPlayer_ is a control that wraps an	<a href="#enyo.Video">enyo.Video</a>
	HTML5 video player to provide Moonstone-styled standard transport controls,
	optional app-specific controls, and an information bar for video information
	and player feedback.

	Client components added to the _components_ block are rendered into the video
	player's transport control area, and should generally be limited to instances
	of _moon.IconButton. If more than two are specified, they will be rendered
	into an "overflow" screen, reached by activating a button to the right of the
	controls.

	Example:

		{
			kind: "moon.VideoPlayer",
			src: "http://www.w3schools.com/html/mov_bbb.mp4",
			components: [
				// Custom icons for app-specific features
				{kind: "moon.IconButton", src: "assets/feature1.png", ontap: "feature1"},
				{kind: "moon.IconButton", src: "assets/feature2.png", ontap: "feature2"},
				{kind: "moon.IconButton", src: "assets/feature3.png", ontap: "feature3"}
			]
		}

*/

enyo.kind({
	name: "moon.VideoPlayer",
	kind: "enyo.Control",
	// Fixme: When enyo-fit is used than the background image does not fit to video while dragging.
	classes: "moon-video-player", 
	published: {
		//* HTML5 video source URL
		src: "",
		//* Array for setting multiple sources for the same video
		sources: null,
		//* Video aspect ratio, set as width:height
		aspectRatio: "16:9",
		autoCloseTimeout: 3000,
		duration: 0
	},
	handlers: {
		onRequestTimeChange: "timeChange",
		onSpotlightKeyUp: "showFSControls"
	},
    bindings: [],
	
	//* @protected

	_isPlaying: false,
	_autoCloseTimer: null,
	
	components: [
		{name: "video", kind: "enyo.Video", classes: "moon-video-player-video",
			ontimeupdate: "timeUpdate", onloadedmetadata: "metadataLoaded", onprogress: "_progress"
		},
		//* Fullscreen controls
		{name: "fullscreenControl", classes: "moon-video-fullscreen-control enyo-fit", ontap: "closeControls", onmousemove: "mousemove", components: [
		
			{name: "videoInfoHeader", kind: "FittableColumns", classes: "moon-video-player-header", components: [
				{name: "videoInfo", fit: true, classes: "moon-video-player-info"},
				{name: "feedbackHeader", kind: "moon.VideoFeedback"}
			]},
			
			{name: "playerControl", classes: "moon-video-player-bottom", onSpotlightDown: "onEnterSlider", components: [
				{name: "controls", kind: "FittableColumns", classes: "moon-video-player-controls", components: [
			
					{name: "leftPremiumPlaceHolder", classes: "premium-placeholder"},
				
					{name: "controlsContainer", kind: "Panels", arrangerKind: "CarouselArranger", fit: true, draggable: false, classes: "moon-video-player-controller", components: [
						{name: "trickPlay", kind: "FittableColumns", noStretch: true, classes: "enyo-center", components: [
							{name: "jumpBack",		kind: "moon.IconButton", src: "$lib/moonstone/images/icon-jumpback.png",	onholdpulse: "onHoldPulseBackHandler", ontap: "onjumpBackward"},
							{name: "rewind",		kind: "moon.IconButton", src: "$lib/moonstone/images/icon-rewind.png",		ontap: "rewind"},
							{name: "fsPlayPause", kind: "moon.IconButton", src: "$lib/moonstone/images/icon-play.png",			ontap: "playPause"},
							{name: "fastForward",	kind: "moon.IconButton", src: "$lib/moonstone/images/icon-fastforward.png", ontap: "fastForward"},
							{name: "jumpForward",	kind: "moon.IconButton", src: "$lib/moonstone/images/icon-jumpforward.png", onholdpulse: "onHoldPulseForwardHandler", ontap: "onjumpForward"}
						]},
						{name: "client", layoutKind: "FittableColumnsLayout", classes: "enyo-center", noStretch: true}
					]},
				
					{name: "rightPremiumPlaceHolder", classes: "premium-placeholder", components: [
						{name: "moreButton", kind: "moon.IconButton", src: "$lib/moonstone/images/icon-extend.png", ontap: "moreButtonTapped"}
					]}
				]},
			
				{classes: "moon-video-player-slider-container", onenter: "onEnterSlider", onleave: "onLeaveSlider", onSpotlightUp: "onLeaveSlider", components: [
					{name: "slider", kind: "moon.VideoTransportSlider", popupColor: "#323232", onSeekStart: "sliderSeekStart", onSeek: "sliderSeek", onSeekFinish: "sliderSeekFinish"}
				]}
			]},
		
			{name:"bgScreen", kind: "moon.VideoPauseCanvas", classes: "moon-video-player-screen enyo-fit", showing: false}
		]},
		//* Inline controls
		{classes: "moon-video-inline-control", components: [
			{name: "currPosAnimator", kind: "Animator", onStep: "currPosAnimatorStep", onEnd: "currPosAnimatorComplete"},
			{name: "ilPlayPause", kind: "moon.IconButton", src: "$lib/moonstone/images/icon-play.png", ontap: "playPause", classes: "moon-video-inline-control-play-pause" },
			{classes: "moon-video-inline-control-text", components: [
				{name: "currTime", content: "00:00"},
				{name: "totalTime", content: "00:00"}
			]},
			{name: "progressStatus", classes: "moon-video-inline-control-progress"},
			{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-fullscreenbutton.png", ontap: "toggleFullscreen", classes: "moon-video-inline-control-fullscreen"}
		]}
	],
	
	create: function() {
		this.setupVideoBindings();
		this.inherited(arguments);
		this.createInfoControls();
	},
	setupVideoBindings: function() {
		this.bindings.push({from: ".src", to: "$.video.src"});
		this.bindings.push({from: ".sourceComponents", to: "$.video.sourceComponents"});
	},
	createInfoControls: function() {
		this.$.videoInfo.createComponents(this.infoComponents);
	},
	initComponents: function() {
		this.inherited(arguments);
		this.setupButtonCarousel();
	},
	setupButtonCarousel: function() {
		var components = this.components;
		
		// No components - destroy more button
		if (!components) {
			this.$.moreButton.destroy();
		
		// One or two components - destroy more button and utilize left/right premium placeholders
		} else if (components.length <= 2) {
			this.$.moreButton.destroy();
			this.$.leftPremiumPlaceHolder.createComponent(components[0], {owner: this.owner});
			components.splice(0,1);
			if (components.length == 1) {
				this.$.rightPremiumPlaceHolder.createComponent(components[0], {owner: this.owner});
				components.splice(0,1);
			}
		
		// More than two components - use extra panel, with left premium plaeholder for first component
		} else {
			this.$.leftPremiumPlaceHolder.createComponents(components.splice(0,1), {owner: this.owner});
		}
	},
	
	
	///// Fullscreen controls /////
	

	_holdPulseThreadhold: 400,
	_holding: false,
	_sentHold: false,
	//* If currently in fullscreen, hide the controls on non-button taps
	closeControls: function(inSender, inEvent) {
		if (inEvent.originator === this.$.fullscreenControl) {
			this.hideFSControls();
		}
	},
	//* Set _visible_ to _false_ on mouseleave
	mousemove: function(inSender, inEvent) {
		this.showFSControls();
	},
	//* Set _this.visible_ to true and clear hide job
	showFSControls: function() {
		this.$.fullscreenControl.addClass("visible");
		enyo.job(this.id + "hide", this.bindSafely("hideFSControls"), this.getAutoCloseTimeout());
	},
	//* Set _this.visible_ to false
	hideFSControls: function() {
		this.$.fullscreenControl.removeClass("visible");
		this.resetAutoCloseTimer();
	},
	//* Clear auto-close timer
	resetAutoCloseTimer: function() {
		enyo.job.stop(this.id + "hide");
	},
	//* Toggle play based on _this.playing_
	playPause: function(inSender, inEvent) {
		if (this._isPlaying) {
			this.pause(inSender, inEvent);
		} else {
			this.play(inSender, inEvent);
		}
		return true;
	},
	onHoldPulseBackHandler: function(inSender, inEvent) {
		if (inEvent.holdTime > this._holdPulseThreadhold) {
			if (inSender._sentHold !== true) {
				this.jumpToStart(inSender, inEvent);
				inSender._sentHold = true;
				return true;	
			}
		} else {
			inSender._holding = true;
			inSender._sentHold = false;
		}
	},
	onHoldPulseForwardHandler: function(inSender, inEvent) {
		if (inEvent.holdTime > this._holdPulseThreadhold) {
			if (inSender._sentHold !== true) {
				this.jumpToEnd(inSender, inEvent);
				inSender._sentHold = true;
				return true;	
			}
		} else {
			inSender._holding = true;
			inSender._sentHold = false;
		}
	},
	onjumpBackward: function(inSender, inEvent) {
		if (!inSender._holding) {
			this.jumpBackward(inSender, inEvent);
		}
		inSender._holding = false;
	},
	onjumpForward: function(inSender, inEvent) {
		if (!inSender._holding) {
			this.jumpForward(inSender, inEvent);
		}
		inSender._holding = false;
	},
	sendFeedback: function(inCmd, inSrc, inParam) {
		var playbackRate = this.$.video.getPlaybackRate(),
			inParam = inParam || "";

		this.$.feedbackHeader.feedback({
			command: inCmd,
			imgsrc: inSrc,
			param: inParam,
			playbackRate: playbackRate
		});
	},
	
	////// Slider event handling //////
	
	onEnterSlider: function(inSender, inEvent) {
		this.$.controls.hide();
	},
	onLeaveSlider: function(inSender, inEvent) {
		this.$.controls.show();
	},
	
	//* When seeking starts, pause video
	sliderSeekStart: function(inSender, inEvent) {
		this.pause();
		this.showBGScreen();
		return true;
	},
	//* When seeking completes, play video
	sliderSeekFinish: function(inSender, inEvent) {
		this.play();
		this.hideBGScreen();
		return true;
	},
	//* When seeking, set video time
	sliderSeek: function(inSender, inEvent) {
		var time = this._duration * inEvent.value / 100;
		this.setCurrentTime(time);
		return true;
	},
	//* Programatically update slider position to match _this.currentTime_/_this.duration_
	updateFullscreenPosition: function() {
		if (this.$.slider.dragging) {
			return;
		}
		var percentComplete = Math.round(this._currentTime * 1000 / this._duration) / 10;
		this.$.slider.setValue(percentComplete);
	},
	
	
	
	
	
	////// BG Screen //////
	
	showBGScreen: function() {
		this.$.bgScreen.show();
	},
	hideBGScreen: function() {
		this.$.bgScreen.hide();
	},
	
	
	
	
	///// Inline controls /////
	
	updateInlinePosition: function() {
		var currentTimeFloat = this._currentTime * 1000,
			percentComplete = Math.round(currentTimeFloat / this._duration) / 10,
			currentTimeDate = new Date(currentTimeFloat),
			durationDate = new Date(this._duration * 1000)
		;
		this.$.progressStatus.applyStyle("width", percentComplete + "%");
		this.$.currTime.setContent(this.formatTime(currentTimeDate.getMinutes(), currentTimeDate.getSeconds()));
		this.$.totalTime.setContent("/" + this.formatTime(durationDate.getMinutes(), durationDate.getSeconds()));
	},
	
	//* @public
	
	//* Toggle fullscreen on/off
	toggleFullscreen: function(inSender, inEvent) {
		if (this.isFullscreen()) {
			this.cancelFullscreen();
		} else {
			this.requestFullscreen();
		}
	},
	//* Facade _this.$.video.play_
	play: function(inSender, inEvent) {
		var src = inSender.src;
		this._isPlaying = true;
		this.$.video.play();
		this.updatePlayPauseButtons();
		this.sendFeedback("play", src);
	},
	//* Facade _this.$.video.pause_
	pause: function(inSender, inEvent) {
		var src = inSender.src;
		this._isPlaying = false;
		this.$.video.pause();
		this.updatePlayPauseButtons();
		this.sendFeedback("pause", src);
	},
	//* Facade _this.$.video.rewind_
	rewind: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.rewind();
		this.updatePlayPauseButtons();
		this.sendFeedback("rewind", inSender.src);
	},
	//* Facade _this.$.video.jumpToStart_
	jumpToStart: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.jumpToStart();
		this.updatePlayPauseButtons();
		this.sendFeedback("jumpToStart", inSender.src);
	},
	//* Facade _this.$.video.jumpBackward_
	jumpBackward: function(inSender, inEvent) {
		this._isPlaying = true;
		this.$.video.jumpBackward();
		this.updatePlayPauseButtons();
		this.sendFeedback("jumpBackward", inSender.src);
	},
	//* Facade _this.$.video.fastForward_
	fastForward: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.fastForward();
		this.updatePlayPauseButtons();
		this.sendFeedback("fastForward", inSender.src);
	},
	//* Facade _this.$.video.jumpToEnd_
	jumpToEnd: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.jumpToEnd();
		this.updatePlayPauseButtons();
		this.sendFeedback("jumpToEnd", inSender.src);
	},
	//* Facade _this.$.video.jumpForward_
	jumpForward: function(inSender, inEvent) {
		this._isPlaying = true;
		this.$.video.jumpForward();
		this.updatePlayPauseButtons();
		this.sendFeedback("jumpForward", inSender.src);
	},
	//* Facade _this.$.video.setCurrentTime_
	setCurrentTime: function(inValue) {
		this.$.video.setCurrentTime(inValue);
	},

	//* @protected
	
	//* Updates the video time.
	timeUpdate: function(inSender, inEvent) {
		//* Update _this.duration_ and _this.currentTime_
		if (!inEvent && inEvent.srcElement) {
			return;
		}
		
		this._duration = inEvent.srcElement.duration;
		this._currentTime = inEvent.srcElement.currentTime;
		
		var cur = new Date(this._currentTime * 1000);
	//	this.$.feedback.setContent(this.formatTime(cur.getMinutes(), cur.getSeconds()));
		this.updatePosition();
		
		this.waterfall("onTimeupdate", inEvent);
	},
	//* Called when video successfully loads video metadata
	metadataLoaded: function(inSender, inEvent) {
		this.updateAspectRatio();
		this.resized();
	},
	//* Respond to _onRequestTimeChange_ event by setting current video time
	timeChange: function(inSender, inEvent) {
		this.setCurrentTime(inEvent.value);
	},
	//* Update the height/width based on the video's aspect ratio
	updateAspectRatio: function() {
		var node = this.hasNode(),
			videoAspectRatio = this.$.video.getAspectRatio().split(":"),
			ratio = 1
		;
		
		if (!node) {
			return;
		}
		
		// If height but no width defined, update width based on aspect ratio
		if (node.style.height && !node.style.width) {
			ratio = videoAspectRatio[0] / videoAspectRatio[1];
			this.applyStyle("width", ((parseInt(node.style.height, 10) * ratio)) + "px");
		// If width but no height defined, update height based on aspect ratio
		} else if (node.style.width && !node.style.height) {
			ratio = videoAspectRatio[1] / videoAspectRatio[0];
			this.applyStyle("height", ((parseInt(node.style.width, 10) * ratio)) + "px");
		}
	},
	updatePosition: function() {
		this.updateFullscreenPosition();
		this.updateInlinePosition();
	},
	//* Properly format time
	formatTime: function(inMinutes, inSeconds) {
		inMinutes = this._formatTime(inMinutes);
		inSeconds = this._formatTime(inSeconds);
		return inMinutes + ":" + inSeconds;
	},
	//* Format time helper
	_formatTime: function(inValue) {
		return (inValue) ? (String(inValue).length < 2) ? "0"+inValue : inValue : "00";
	},
	//* Switch play/pause buttons as appropriate
	updatePlayPauseButtons: function() {
		var src = "$lib/moonstone/images/";
		src += this._isPlaying ? "icon-pause.png" : "icon-play.png";
		this.$.fsPlayPause.setSrc(src);
		this.$.ilPlayPause.setSrc(src);
	},
	//* When moreButton is tapped, toggle visibility of player controls and extra functionality
	moreButtonTapped: function(inSender, inEvent) {
		var index = this.$.controlsContainer.getIndex(),
			src = "$lib/moonstone/images/"
		;
		
		if (index === 0) {
			this.$.moreButton.setSrc(src + "icon-shrink.png");
			this.$.controlsContainer.next();
		} else {
			this.$.moreButton.setSrc(src + "icon-extend.png");
			this.$.controlsContainer.previous();
		}
	},

	///////// VIDEO EVENT HANDLERS /////////


	_progress: function(inSender, inEvent) {
		this.$.slider.updateBufferedProgress(inEvent.srcElement);
	}
});


enyo.kind({
	name: "moon.VideoPauseCanvas",
	kind: "enyo.Control",
	tag: "canvas",
	handlers: {
		onTimeupdate: "timeUpdate"
	},
	showingChanged: function() {
		this.inherited(arguments);
		if (!this.showing) {
			this.hasSnapshot = false;
		}
	},
	timeUpdate: function(inSender, inEvent) {
		if (this.showing && !this.hasSnapshot) {
			this.updateBoundsAttributes();
			this.takeSnapshot(inEvent.srcElement);
		}
	},
	takeSnapshot: function(inNode) {
		var node = this.hasNode(),
			bounds = node.getBoundingClientRect(),
			ctx = node.getContext("2d")
		;
		// draw video preview thumbnail
		ctx.drawImage(inNode, 0, 0, bounds.width, bounds.height);
		this.hasSnapshot = true;
	},
	updateBoundsAttributes: function() {
		var bounds = this.getBounds();
		this.setAttribute("width", bounds.width);
		this.setAttribute("height", bounds.height);
	}
});

