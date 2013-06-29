
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
	classes: "moon-video-player enyo-unselectable", 
	published: {
		//* HTML5 video source URL
		src: "",
		//* Array for setting multiple sources for the same video
		sources: null,
		//* Video aspect ratio, set as width:height
		aspectRatio: "16:9",
		autoCloseTimeout: 3000,
		duration: 0,
		//* Full Screen
		fullScreen: false
	},
	handlers: {
		onRequestTimeChange: "timeChange",
		onSpotlightKeyUp: "showFSControls",
		onRequestToggleFullscreen: "toggleFullscreen",
		onresize: "resizeHandler"
	},
    bindings: [],
	
	//* @protected

	_isPlaying: false,
	_autoCloseTimer: null,
	
	components: [
		{name: "video", kind: "enyo.Video", classes: "moon-video-player-video",
			ontimeupdate: "timeUpdate", onloadedmetadata: "metadataLoaded", onprogress: "_progress", onPlay: "_play", onpause: "_pause",
			onFastforward: "_fastforward", onSlowforward: "_slowforward", onRewind: "_rewind", onSlowrewind: "_slowrewind",
			onJumpForward: "_jumpForward", onJumpBackward: "_jumpBackward", onratechange: "playbackRateChange"
		},
		//* Fullscreen controls
		{name: "fullscreenControl", classes: "moon-video-fullscreen-control enyo-fit", ontap: "closeControls", onmousemove: "mousemove", components: [
		
			{name: "videoInfoHeader", kind: "FittableColumns", noStretch: true, classes: "moon-video-player-header", components: [
				{name: "videoInfo", fit: true, classes: "moon-video-player-info"},
				{name: "feedbackHeader", kind: "moon.VideoFeedback"}
			]},
			
			{name: "playerControl", classes: "moon-video-player-bottom", onSpotlightDown: "onEnterSlider", components: [
				{name: "controls", kind: "FittableColumns", classes: "moon-video-player-controls", components: [
			
					{name: "leftPremiumPlaceHolder", classes: "premium-placeholder"},
				
					{name: "controlsContainer", kind: "Panels", arrangerKind: "CarouselArranger", fit: true, draggable: false, classes: "moon-video-player-controller", components: [
						{name: "trickPlay", kind: "FittableColumns", noStretch: true, classes: "enyo-center", components: [
							{name: "jumpBack",		kind: "moon.IconButton", src: "$lib/moonstone/images/icon-jumpback.png",	classes: "moon-video-player-control-button", onholdpulse: "onHoldPulseBackHandler", ontap: "onjumpBackward"},
							{name: "rewind",		kind: "moon.IconButton", src: "$lib/moonstone/images/icon-rewind.png",		classes: "moon-video-player-control-button", ontap: "rewind"},
							{name: "fsPlayPause", kind: "moon.IconButton", src: "$lib/moonstone/images/icon-play.png",			classes: "moon-video-player-control-button", ontap: "playPause"},
							{name: "fastForward",	kind: "moon.IconButton", src: "$lib/moonstone/images/icon-fastforward.png", classes: "moon-video-player-control-button", ontap: "fastForward"},
							{name: "jumpForward",	kind: "moon.IconButton", src: "$lib/moonstone/images/icon-jumpforward.png", classes: "moon-video-player-control-button", onholdpulse: "onHoldPulseForwardHandler", ontap: "onjumpForward"}
						]},
						{name: "client", layoutKind: "FittableColumnsLayout", classes: "enyo-center", noStretch: true}
					]},
				
					{name: "rightPremiumPlaceHolder", classes: "premium-placeholder", components: [
						{name: "moreButton", kind: "moon.IconButton", src: "$lib/moonstone/images/icon-extend.png", ontap: "moreButtonTapped"}
					]}
				]},
			
				{classes: "moon-video-player-slider-container", onenter: "onEnterSlider", onleave: "onLeaveSlider", onSpotlightUp: "onLeaveSlider", components: [
					{name: "slider", kind: "moon.VideoTransportSlider", classes: "moon-videoplayer-sample-slider",
						knobClasses: "moon-videoplayer-sample-knob", barClasses: "moon-videoplayer-sample-progressbar", bgBarClasses: "moon-videoplayer-sample-bgprogressbar",
						onSeekStart: "sliderSeekStart", onSeek: "sliderSeek", onSeekFinish: "sliderSeekFinish"
					}
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
			{kind: "moon.VideoFullscreenToggleButton", classes: "moon-video-inline-control-fullscreen"}
		]}
	],
	
	create: function() {
		this.setupVideoBindings();
		this.inherited(arguments);
		this.createInfoControls();
	},
	resizeHandler: function() {
		var node = this.$.video.hasNode();
		var rect = node.getBoundingClientRect();
		this.applyStyle("width", rect.width + "px");
	},
	setupVideoBindings: function() {
		this.bindings.push({from: ".src", to: "$.video.src"});
		this.bindings.push({from: ".sourceComponents", to: "$.video.sourceComponents"});
	},
	createInfoControls: function() {
		this.$.videoInfo.createComponents(this.infoComponents);
	},
	createClientComponents: function(inComponents) {
		if (!this._buttonsSetup) {
			this._buttonsSetup = true;
			if (!inComponents) {
				// No components - destroy more button
				this.$.moreButton.destroy();			
			} else if (inComponents.length <= 2) {
				// One or two components - destroy more button and utilize left/right premium placeholders
				this.$.moreButton.destroy();
				this.$.leftPremiumPlaceHolder.createComponent(inComponents.shift(), {owner: this.owner});
				if (inComponents.length == 1) {
					this.$.rightPremiumPlaceHolder.createComponent(inComponents.shift(), {owner: this.owner});
				}
			} else {
				// More than two components - use extra panel, with left premium plaeholder for first component
				this.$.leftPremiumPlaceHolder.createComponent(inComponents.shift(), {owner: this.owner});
			}
			// Create the rest of the components in the client (panels)
			this.createComponents(inComponents, {owner: this.getInstanceOwner()});
		} else {
			this.inherited(arguments);
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
	sendFeedback: function(inMessage, inParams, inShowLeft, inShowRight, inPersistShowing) {
		inParams = inParams || {};
		this.$.feedbackHeader.feedback(inMessage, inParams, inShowLeft, inShowRight, inPersistShowing);
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
	//	if (this.isFullscreen()) {
		if (this.fullScreen) {
			this.cancelFullscreen();
		} else {
			this.requestFullscreen();
		}
		this.fullScreen = !this.fullScreen;
		if(this._isPlaying)this.play(); // FIXME LATER
	},
	cancelFullscreen: function() {
		var appBody = document.body;
		var appNode = appBody.firstChild;
		appBody.style.backgroundColor = this.BgColor;
		appNode.style.opacity = this.appOpacity;
		this.inherited(arguments);
	},
	requestFullscreen: function() {
		var appBody = document.body;
		this.BgColor = appBody.style.backgroundColor;
		appBody.style.backgroundColor = "#000000";
		var appNode = appBody.firstChild;
		this.appOpacity = appNode.style.opacity;
		appNode.style.opacity = 0;
		this.inherited(arguments);
	},
	//* Facade _this.$.video.play_
	play: function(inSender, inEvent) {
		this._isPlaying = true;
		this.$.video.play();
		this.updatePlayPauseButtons();
	},
	//* Facade _this.$.video.pause_
	pause: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.pause();
		this.updatePlayPauseButtons();
	},
	//* Facade _this.$.video.rewind_
	rewind: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.rewind();
		this.updatePlayPauseButtons();
	},
	//* Facade _this.$.video.jumpToStart_
	jumpToStart: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.jumpToStart();
		this.updatePlayPauseButtons();
		this.sendFeedback("jumpToStart");
	},
	//* Facade _this.$.video.jumpBackward_
	jumpBackward: function(inSender, inEvent) {
		this._isPlaying = true;
		this.$.video.jumpBackward();
		this.updatePlayPauseButtons();
	},
	//* Facade _this.$.video.fastForward_
	fastForward: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.fastForward();
		this.updatePlayPauseButtons();
	},
	//* Facade _this.$.video.jumpToEnd_
	jumpToEnd: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.jumpToEnd();
		this.updatePlayPauseButtons();
		this.sendFeedback("jumpToEnd");
	},
	//* Facade _this.$.video.jumpForward_
	jumpForward: function(inSender, inEvent) {
		this._isPlaying = true;
		this.$.video.jumpForward();
		this.updatePlayPauseButtons();
	},
	//* Facade _this.$.video.setCurrentTime_
	setCurrentTime: function(inValue) {
		this.$.video.setCurrentTime(inValue);
	},

	//* @protected
	
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
	//* Video Source Change
	sourceComponentsSelect: function(nIndex) {
		(this.headAttached)? this.sourceComponents.shift():this.headAttached = true;
		this.sourceComponents.unshift(this.sourceComponents[nIndex]);
		this.$.video.sourceComponentsChanged();
		if(this._isPlaying)this.pause(); // FIXME LATER
		return this.sourceComponents[0]; 
	},
	///////// VIDEO EVENT HANDLERS /////////

	//* Updates the video time.
	timeUpdate: function(inSender, inEvent) {
		//* Update _this.duration_ and _this.currentTime_
		if (!inEvent && inEvent.srcElement) {
			return;
		}
		
		this._duration = inEvent.duration;
		this._currentTime = inEvent.currentTime;
		
		this.updatePosition();
		
		this.waterfall("onTimeupdate", inEvent);
	},
	//* Called when video successfully loads video metadata
	metadataLoaded: function(inSender, inEvent) {
		this.updateAspectRatio();
		this.resized();
	},
	_progress: function(inSender, inEvent) {
		this.$.slider.updateBufferedProgress(inEvent.srcElement);
	},
	_play: function(inSender, inEvent) {
		this.sendFeedback("Play");
	},
	_pause: function(inSender, inEvent) {
		// Don't send pause feedback if we are rewinding
		if (inEvent.srcElement.playbackRate < 0) {
			return;
		}
		
		this.sendFeedback("Pause", {}, true);
	},
	_fastforward: function(inSender, inEvent) {
		this.sendFeedback("Fastforward", {playbackRate: inEvent.playbackRate}, true);
	},
	_slowforward: function(inSender, inEvent) {
		this.sendFeedback("Slowforward", {playbackRate: inEvent.playbackRate}, true);
	},
	_rewind: function(inSender, inEvent) {
		this.sendFeedback("Rewind", {playbackRate: inEvent.playbackRate}, true);
	},
	_slowrewind: function(inSender, inEvent) {
		this.sendFeedback("Slowrewind", {playbackRate: inEvent.playbackRate}, true);
	},
	_jumpForward: function(inSender, inEvent) {
		this.sendFeedback("JumpForward", {jumpSize: inEvent.jumpSize}, false);
	},
	_jumpBackward: function(inSender, inEvent) {
		this.sendFeedback("JumpBackward", {jumpSize: inEvent.jumpSize}, true);
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

