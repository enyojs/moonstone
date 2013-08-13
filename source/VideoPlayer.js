
/**
	_moon.VideoPlayer_ is a control that wraps an	<a href="#enyo.Video">enyo.Video</a>
	HTML5 video player to provide Moonstone-styled standard transport controls,
	optional app-specific controls, and an information bar for video information
	and player feedback.

	Client components added to the _components_ block are rendered into the video
	player's transport control area, and should generally be limited to instances
	of <a href="#moon.IconButton">moon.IconButton</a>. If more than two are
	specified, they will be rendered into an "overflow" screen, reached by
	activating a button to the right of the controls.

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
	spotlight: true,
	// Fixme: When enyo-fit is used than the background image does not fit to video while dragging.
	classes: "moon-video-player enyo-unselectable", 
	published: {
		//* URL of HTML5 video
		src: "",
		//* Array for setting multiple sources for the same video
		sources: null,
		//* Video aspect ratio, specified as _"width:height"_
		aspectRatio: "16:9",
		//* Control buttons is hided automatically in this time amount
		autoCloseTimeout: 3000,
		//* Video duration
		duration: 0,
		//* when false, don't show any fullscreen video control overlays (info or transport) based on up/down/ok event, and hide them if currently visible
		autoShowOverlay: false,
		//* when false, don't show the top infoComponents based on up event, and hide them if currently visible
		autoShowInfo: true,
		//* when false, don't show the bottom slider/controls based on down event, and hide them if currently visible
		autoShowControls: true,
		//* when true, show top infoComponents (no timeout), when false, show only based on autoShow conditions
		showInfo: false,
		//* When false, start with fullscreen mode, when true, start with inline mode
		inline: false
	},
	handlers: {
		onRequestTimeChange: 'timeChange',
		onRequestToggleFullscreen: 'toggleFullscreen',
		onSpotlightFocused: 'spotlightFocused',
		onSpotlightUp: 'spotlightUpHandler',
		onSpotlightDown: 'spotlightDownHandler',
		onSpotlightLeft: 'spotlightLeftHandler',
		onSpotlightRight: 'spotlightRightHandler',
		onSpotlightSelect: 'spotlightSelectHandler', 
		onresize: 'resizeHandler'
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
		{name: "fullscreenControl", classes: "moon-video-fullscreen-control enyo-fit", components: [
		
			{name: "videoInfoHeader", kind: "FittableColumns", noStretch: true, showing: false, classes: "moon-video-player-header", components: [
				{name: "videoInfo", fit: true, classes: "moon-video-player-info"},
				{name: "feedbackHeader", kind: "moon.VideoFeedback"}
			]},
			
			{name: "playerControl", classes: "moon-video-player-bottom", showing: false, components: [
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
			
				{classes: "moon-video-player-slider-container", onenter: "onEnterSlider", onleave: "onLeaveSlider", components: [
					{name: "slider", kind: "moon.VideoTransportSlider", classes: "moon-videoplayer-sample-slider",
						knobClasses: "moon-videoplayer-sample-knob", barClasses: "moon-videoplayer-sample-progressbar", bgBarClasses: "moon-videoplayer-sample-bgprogressbar",
						onSeekStart: "sliderSeekStart", onSeek: "sliderSeek", onSeekFinish: "sliderSeekFinish", onChanging: "resetAutoTimeout"
					}
				]}
			]}
		]},
		//* Inline controls
		{name: "inlineControl", classes: "moon-video-inline-control", components: [
			{name: "currPosAnimator", kind: "Animator", onStep: "currPosAnimatorStep", onEnd: "currPosAnimatorComplete"},
			{name: "ilPlayPause", kind: "moon.IconButton", src: "$lib/moonstone/images/icon-play.png", ontap: "playPause", classes: "moon-video-inline-control-play-pause" },
			{classes: "moon-video-inline-control-text", components: [
				{name: "currTime", content: "00:00"},
				{name: "totalTime", content: "00:00"}
			]},
			{name: "progressStatus", classes: "moon-video-inline-control-progress"},
			{kind: "moon.VideoFullscreenToggleButton", classes: "moon-video-inline-control-fullscreen"}
		]},
		{kind: "enyo.Signals", onFullscreenChange: "fullscreenChanged"}
	],
	
	create: function() {
		this.setupVideoBindings();
		this.inherited(arguments);
		this.createInfoControls();
		this.inlineChanged();
		this.showInfoChanged();
		this.autoShowInfoChanged();
		this.autoShowControlsChanged();
	},
	resizeHandler: function() {
		this.inherited(arguments);
		var node = this.$.video.hasNode();
		var rect = node.getBoundingClientRect();
		this.applyStyle("width", rect.width + "px");
	},
	setupVideoBindings: function() {
		this.bindings.push({from: ".sourceComponents", to: "$.video.sourceComponents"});
	},
	//* Overrides default _enyo.Control_ behavior.
	setSrc: function(inSrc) {
		this.src = inSrc;
		this.srcChanged();
	},
	//* Overrides default _enyo.Control_ behavior.
	getSrc: function() {
		return this.src;
	},
	srcChanged: function() {
		this.pause();
		this.$.video.setSrc(this.getSrc());
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

	autoShowOverlayChanged: function() {
		this.autoShowInfoChanged();
		this.autoShowControlsChanged();
	},
	autoShowInfoChanged: function() {
		this.$.videoInfoHeader.setShowing((this.autoShowOverlay && this.autoShowInfo));
	},
	autoShowControlsChanged: function() {
		this.$.playerControl.setShowing((this.autoShowOverlay && this.autoShowControls));;
	},
	showInfoChanged: function() {
		this.$.videoInfoHeader.setShowing(this.showInfo);
	},
	inlineChanged: function() {
		// Force fullscreen
		this.addRemoveClass("enyo-fullscreen enyo-fit", !this.inline);
		// show hide controls visibility
		this.$.inlineControl.setShowing(this.inline);
		this.$.fullscreenControl.setShowing(!this.inline);
		// show hide full screen button on fullscreen control
		this.$.leftPremiumPlaceHolder.setShowing(this.inline);
	},
	spotlightUpHandler: function(inSender, inEvent) {
		if (this.isFullscreen() || !this.getInline()) {
			this.resetAutoTimeout();
			if (inEvent.originator !== this.$.slider) {
				this.showFSInfo();
			}
		}
	},
	spotlightDownHandler: function(inSender, inEvent) {
		if (this.isFullscreen() || !this.getInline()) {
			this.resetAutoTimeout();
			this.log(inEvent.originator.id)
			if (inEvent.originator === this && !this.$.playerControl.showing) {
				this.showFSBottomControls();
				enyo.Spotlight.spot(enyo.Spotlight.getChildren(this)[0]);
				return true;
			}
		}
	},
	spotlightLeftHandler: function(inSender, inEvent) {
		if (this.isFullscreen() || !this.getInline()) {
			this.resetAutoTimeout();
			if (!this.$.playerControl.showing) {
				return true;
			}
		}
	},
	spotlightRightHandler: function(inSender, inEvent) {
		if (this.isFullscreen() || !this.getInline()) {
			this.resetAutoTimeout();
			if (!this.$.playerControl.showing) {
				return true;
			}
		}
	},
	spotlightSelectHandler: function(inSender, inEvent) {
		if (inEvent.originator !== this) { return false; }
		if (this.isFullscreen() || !this.getInline()) {
			if (inEvent.originator === this) {
				this.showFSInfo();
				this.showFSBottomControls();
			}
			this.resetAutoTimeout();
			if (!this.$.playerControl.showing) {
				return true;
			}
		}
	},
	spotlightFocused: function(inSender, inEvent) {
		if (inEvent.originator !== this) { return false; }
		if (enyo.Spotlight.getPointerMode()) { return false; }
		// This is not described in UX document. But I think it should.
		this.hideFSControls();
		return false;
	},

	
	///// Fullscreen controls /////
	

	_holdPulseThreadhold: 400,
	_holding: false,
	_sentHold: false,
	//* Sets _this.visible_ to true and clears hide job.
	showFSControls: function(inSender, inEvent) {
		this.showFSInfo();
		this.showFSBottomControls();
	},
	hideFSControls: function() {
		this.hideFSInfo();
		this.hideFSBottomControls();
	},
	//* Sets _this.visible_ to true and clears hide job.
	showFSBottomControls: function(inSender, inEvent) {
		if (this.autoShowOverlay && this.autoShowControls) {
			this.$.playerControl.setShowing(true);
			this.$.playerControl.resized();
		}
	},
	//* Sets _this.visible_ to false.
	hideFSBottomControls: function() {
		this.$.playerControl.setShowing(false);
		enyo.Spotlight.spot(this);
		enyo.job.stop(this.id + "bottom_hide");
	},
	//* Sets _this.visible_ to true and clears hide job.
	showFSInfo: function() {
		if (this.autoShowOverlay && this.autoShowInfo) {
			this.$.videoInfoHeader.setShowing(true);
		}
	},
	//* Sets _this.visible_ to false.
	hideFSInfo: function() {
		if (this.showInfo) { return true; }
		this.$.videoInfoHeader.setShowing(false);
		enyo.job.stop(this.id + "info_hide");
	},
	resetAutoTimeout: function() {
		this.resetFSInfoTimeout();
		this.resetFSBottomTimeout();
	},
	resetFSInfoTimeout: function() {
		enyo.job(this.id + "info_hide", this.bindSafely("hideFSInfo"), this.getAutoCloseTimeout());
	},
	resetFSBottomTimeout: function() {
		enyo.job(this.id + "bottom_hide", this.bindSafely("hideFSBottomControls"), this.getAutoCloseTimeout());
	},
	//* Toggles play/pause state based on _this.playing_.
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
	
	//* When seeking starts, pause video.
	sliderSeekStart: function(inSender, inEvent) {
		this.pause();
		return true;
	},
	//* When seeking completes, play video.
	sliderSeekFinish: function(inSender, inEvent) {
		this.play();
		return true;
	},
	//* When seeking, set video time.
	sliderSeek: function(inSender, inEvent) {
		var time = this._duration * inEvent.value / 100;
		this.setCurrentTime(time);
		return true;
	},
	//* Programatically updates slider position to match _this.currentTime_/_this.duration_.
	updateFullscreenPosition: function() {
		if (this.$.slider.dragging) {
			return;
		}
		var percentComplete = Math.round(this._currentTime * 1000 / this._duration) / 10;
		this.$.slider.setValue(percentComplete);
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
	
	//* Toggles fullscreen state.
	toggleFullscreen: function(inSender, inEvent) {
		// Fixme: Fullscreen state change stops transition animation. 
		//      And it breaks full screen button's transition behavior.
		if (this.isFullscreen()) {
			this.cancelFullscreen();
		} else {
			this.requestFullscreen();
		}
	},
	fullscreenChanged: function(inSender, inEvent) {
		this.$.inlineControl.setShowing(!this.isFullscreen());
		this.$.fullscreenControl.setShowing(this.isFullscreen());
		if (this.isFullscreen()) {
			this.showFSControls();
			this.resetFSInfoTimeout();
			this.resetFSBottomTimeout();
		}
		enyo.Spotlight.spot(enyo.Spotlight.getChildren(this)[0]);
		this.resized();
	},
	//* Facades _this.$.video.play()_.
	play: function(inSender, inEvent) {
		this.currTimeSync = true;
		this._isPlaying = true;
		this.$.video.play();
		this.updatePlayPauseButtons();
	},
	//* Facades _this.$.video.pause()_.
	pause: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.pause();
		this.updatePlayPauseButtons();
	},
	//* Facades _this.$.video.rewind()_.
	rewind: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.rewind();
		this.updatePlayPauseButtons();
	},
	//* Facades _this.$.video.jumpToStart()_.
	jumpToStart: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.jumpToStart();
		this.updatePlayPauseButtons();
		this.sendFeedback("jumpToStart");
	},
	//* Facades _this.$.video.jumpBackward()_.
	jumpBackward: function(inSender, inEvent) {
		this._isPlaying = true;
		this.$.video.jumpBackward();
		this.updatePlayPauseButtons();
	},
	//* Facades _this.$.video.fastForward()_.
	fastForward: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.fastForward();
		this.updatePlayPauseButtons();
	},
	//* Facades _this.$.video.jumpToEnd()_.
	jumpToEnd: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.jumpToEnd();
		this.updatePlayPauseButtons();
		this.sendFeedback("jumpToEnd");
	},
	//* Facades _this.$.video.jumpForward()_.
	jumpForward: function(inSender, inEvent) {
		this._isPlaying = true;
		this.$.video.jumpForward();
		this.updatePlayPauseButtons();
	},
	//* Facades _this.$.video.setCurrentTime()_.
	setCurrentTime: function(inValue) {
		this.$.video.setCurrentTime(inValue);
	},

	//* @protected
	//* Responds to _onRequestTimeChange_ event by setting current video time.
	timeChange: function(inSender, inEvent) {
		this.setCurrentTime(inEvent.value);
	},
	//* Updates the height/width based on the video's aspect ratio.
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
	//* Properly formats time.
	formatTime: function(inMinutes, inSeconds) {
		inMinutes = this._formatTime(inMinutes);
		inSeconds = this._formatTime(inSeconds);
		return inMinutes + ":" + inSeconds;
	},
	//* Format time helper
	_formatTime: function(inValue) {
		return (inValue) ? (String(inValue).length < 2) ? "0"+inValue : inValue : "00";
	},
	//* Switches play/pause buttons as appropriate.
	updatePlayPauseButtons: function() {
		var src = "$lib/moonstone/images/";
		src += this._isPlaying ? "icon-pause.png" : "icon-play.png";
		this.$.fsPlayPause.setSrc(src);
		this.$.ilPlayPause.setSrc(src);
	},
	/**
		When _moreButton_ is tapped, toggles visibility of player controls and
		extra functionality.
	*/
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
	//* Called when video successfully loads video metadata.
	metadataLoaded: function(inSender, inEvent) {
		this.updateAspectRatio();
		this.resized();

		this._duration = inEvent.duration;
		this._currentTime = inEvent.currentTime;
		
		this.updatePosition();
		
		this.waterfall("onTimeupdate", inEvent);
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