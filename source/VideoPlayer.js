
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
		autoCloseTimeout: 7000,
		//* Video duration
		duration: 0,
		//* When true, automatically start the video when it is rendered
		autoplay: false,
		//* when false, don't show any fullscreen video control overlays (info or transport) based on up/down/ok event, and hide them if currently visible
		autoShowOverlay: true,
		//* When true, the overlay will show based on pointer movement (in addition to up/down/ok)
		shakeAndWake: false,
		//* when false, don't show the top infoComponents based on up event, and hide them if currently visible
		autoShowInfo: true,
		//* when false, don't show the bottom slider/controls based on down event, and hide them if currently visible
		autoShowControls: true,
		//* when true, show top infoComponents (no timeout), when false, show only based on autoShow conditions
		showInfo: false,
		//* When false, start with fullscreen mode, when true, start with inline mode
		inline: false,
		//* Amount of time in seconds to jump (not used when jumpStartEnd is true)
		jumpSec: 30,
		//* When true, the jump buttons jump to the start/end of the video
		jumpStartEnd: false,
		//* When true, automatically hide popups that were opened from VideoPlayer client controls
		autoHidePopups: true,

		//* URL for "jump back" icon
		jumpBackIcon: "$lib/moonstone/images/icon-jumpback.png",
		//* URL for "rewind" icon
		rewindIcon: "$lib/moonstone/images/icon-rewind.png",
		//* URL for "play" icon
		playIcon: "$lib/moonstone/images/icon-play.png",
		//* URL for "pause" icon
		pauseIcon: "$lib/moonstone/images/icon-pause.png",
		//* URL for "fast forward" icon
		fastForwardIcon: "$lib/moonstone/images/icon-fastforward.png",
		//* URL for "jump forward" icon
		jumpForwardIcon: "$lib/moonstone/images/icon-jumpforward.png",
		//* URL for "more controls" icon
		moreControlsIcon: "$lib/moonstone/images/icon-extend.png",
		//* URL for "less controls" icon
		lessControlsIcon: "$lib/moonstone/images/icon-shrink.png"
	},
	handlers: {
		onRequestTimeChange: 'timeChange',
		onRequestToggleFullscreen: 'toggleFullscreen',
		onSpotlightFocus: 'spotlightFocusHandler',
		onSpotlightFocused: 'spotlightFocused',
		onSpotlightUp: 'spotlightUpHandler',
		onSpotlightDown: 'spotlightDownHandler',
		onSpotlightLeft: 'spotlightLeftHandler',
		onSpotlightRight: 'spotlightRightHandler',
		onSpotlightSelect: 'spotlightSelectHandler', 
		onresize: 'resizeHandler'
	},
    bindings: [
		{from: ".jumpBackIcon", 	to:".$.jumpBack.src"},
		{from: ".rewindIcon", 		to:".$.rewind.src"},
		{from: ".fastForwardIcon", 	to:".$.fastForward.src"},
		{from: ".jumpForwardIcon", 	to:".$.jumpForward.src"}
    ],
	
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
		{name: "fullscreenControl", classes: "moon-video-fullscreen-control enyo-fit", ontap: "toggleControls", onmousemove: "mousemove", components: [
		
			{name: "videoInfoHeader", kind: "FittableColumns", noStretch: true, showing: false, classes: "moon-video-player-header", components: [
				{name: "videoInfo", fit: true, classes: "moon-video-player-info"},
				{name: "feedbackHeader", kind: "moon.VideoFeedback"}
			]},
			
			{name: "playerControl", classes: "moon-video-player-bottom", showing: false, components: [
				{name: "controls", kind: "FittableColumns", classes: "moon-video-player-controls", components: [
			
					{name: "leftPremiumPlaceHolder", classes: "premium-placeholder"},
				
					{name: "controlsContainer", kind: "Panels", arrangerKind: "CarouselArranger", fit: true, draggable: false, classes: "moon-video-player-controller", components: [
						{name: "trickPlay", kind: "FittableColumns", noStretch: true, classes: "enyo-center", components: [
							{name: "jumpBack",		kind: "moon.IconButton", classes: "moon-video-player-control-button", onholdpulse: "onHoldPulseBackHandler", ontap: "onjumpBackward"},
							{name: "rewind",		kind: "moon.IconButton", classes: "moon-video-player-control-button", ontap: "rewind"},
							{name: "fsPlayPause",	kind: "moon.IconButton", classes: "moon-video-player-control-button", ontap: "playPause"},
							{name: "fastForward",	kind: "moon.IconButton", classes: "moon-video-player-control-button", ontap: "fastForward"},
							{name: "jumpForward",	kind: "moon.IconButton", classes: "moon-video-player-control-button", onholdpulse: "onHoldPulseForwardHandler", ontap: "onjumpForward"}
						]},
						{name: "client", layoutKind: "FittableColumnsLayout", noStretch: true}
					]},
				
					{name: "rightPremiumPlaceHolder", classes: "premium-placeholder", components: [
						{name: "moreButton", kind: "moon.IconButton", ontap: "moreButtonTapped"}
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
			{name: "ilPlayPause", kind: "moon.IconButton", ontap: "playPause", classes: "moon-video-inline-control-play-pause" },
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
		this.showInfoChanged();
		this.createInfoControls();
		this.inlineChanged();
		this.autoShowInfoChanged();
		this.autoShowControlsChanged();
		this.autoplayChanged();
		this.updateMoreButton();
	},
	resizeHandler: function() {
		this.inherited(arguments);
		var node = this.$.video.hasNode();
		var rect = node.getBoundingClientRect();
		this.applyStyle("width", rect.width + "px");
	},
	setupVideoBindings: function() {
		this.bindings.push({from: ".sourceComponents", to: ".$.video.sourceComponents"});
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
			if (!inComponents || inComponents.length === 0) {
				// No components - destroy more button
				this.$.leftPremiumPlaceHolder.hide();
				this.$.rightPremiumPlaceHolder.hide();		
				this.$.moreButton.hide();			
			} else if (inComponents.length <= 2) {
				// One or two components - destroy more button and utilize left/right premium placeholders
				this.$.moreButton.hide();
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

	playIconChanged: function() {
		this.updatePlayPauseButtons();
	},
	pauseIconChanged: function() {
		this.updatePlayPauseButtons();
	},
	moreControlsIconChanged: function() {
		this.updateMoreButton();
	},
	lessControlsIconChanged: function() {
		this.updateMoreButton();
	},
	autoplayChanged: function() {
		this.$.video.setAutoplay(this.autoplay);
		this._isPlaying = this.autoplay;
		this.updatePlayPauseButtons();
	},
	jumpSecChanged: function() {
		this.$.video.setJumpSec(this.jumpSec);
	},
	autoShowOverlayChanged: function() {
		this.autoShowInfoChanged();
		this.autoShowControlsChanged();
		if (this.autoShowOverlay) {
			this.resetAutoTimeout();
		}
	},
	autoShowInfoChanged: function() {
		if (this.$.videoInfoHeader.getShowing() && !this.autoShowInfo && !this.showInfo) {
			this.$.videoInfoHeader.hide();
		}
		if (this.autoShowInfo) {
			this.resetAutoTimeout();
		}
	},
	autoShowControlsChanged: function() {
		if (this.$.playerControl.getShowing() && !this.autoShowControls) {
			this.$.playerControl.hide();
		}
		if (this.autoShowControls) {
			this.resetAutoTimeout();
		}
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
		if (!this.inline) {
			this.$.inlineControl.canGenerate = false;
			this.showFSControls();
		}
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
			if (inEvent.originator === this && !this.$.playerControl.showing) {
				this.showFSBottomControls();
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
		if (inEvent.originator == this) {
			if (this.isFullscreen() || !this.getInline()) {
				this.showFSInfo();
				this.showFSBottomControls();
				this.resetAutoTimeout();
				return true;
			}
		}
	},
	spotlightFocusHandler: function(inSender, inEvent) {
		// Avoid changing the focus when the overlay is showing
		if ((inEvent.originator == this) && (this.isOverlayShowing())) {
			return true;
		}
	},
	spotlightFocused: function(inSender, inEvent) {
		if (inEvent.originator !== this) { return false; }
		if (enyo.Spotlight.getPointerMode()) { return false; }
		return false;
	},

	
	///// Fullscreen controls /////
	

	_holdPulseThreadhold: 400,
	_holding: false,
	_sentHold: false,

	//* Returns true if any piece of the overlay is showing
	isOverlayShowing: function() {
		return this.$.videoInfoHeader.getShowing() && this.$.playerControl.getShowing();
	},
	//* If currently in fullscreen, hide the controls on non-button taps
	toggleControls: function(inSender, inEvent) {
		if (inEvent.originator === this.$.fullscreenControl) {
			if (this.isOverlayShowing()) {
				this.hideFSControls();
			} else {
				this.showFSControls();
			}
		}
	},
	//* Resets the timeout, or wakes the overlay
	mousemove: function(inSender, inEvent) {
		if (this.isOverlayShowing()) {
			this.resetAutoTimeout();
		} else if (this.shakeAndWake) {
			this.showFSControls();
		}
	},
	//* Sets _this.visible_ to true and clears hide job.
	showFSControls: function(inSender, inEvent) {
		this.showFSInfo();
		this.showFSBottomControls();
		this.resetAutoTimeout();
	},
	hideFSControls: function() {
		this.hideFSInfo();
		this.hideFSBottomControls();
		this.stopJob("autoHide");
	},
	//* Sets _this.visible_ to true and clears hide job.
	showFSBottomControls: function(inSender, inEvent) {
		if (this.autoShowOverlay && this.autoShowControls) {
			this.$.playerControl.setShowing(true);
			this.$.playerControl.resized();
			enyo.Spotlight.spot(this.$.fsPlayPause);
		}
	},
	//* Sets _this.visible_ to false.
	hideFSBottomControls: function() {
		if (this.autoHidePopups) {
			// Hide enyo.Popup-based popups (including moon.Popup)
			this.$.playerControl.waterfall("onRequestHide");
			// Hide moon.ContextualPopups
			this.$.playerControl.waterfall("onRequestHidePopup");
		}
		this.$.playerControl.setShowing(false);
		enyo.Spotlight.spot(this);
	},
	//* Sets _this.visible_ to true and clears hide job.
	showFSInfo: function() {
		if (this.autoShowOverlay && this.autoShowInfo) {
			this.$.videoInfoHeader.setShowing(true);
		}
	},
	//* Sets _this.visible_ to false.
	hideFSInfo: function() {
		if (!this.showInfo) { 
			this.$.videoInfoHeader.setShowing(false);
		}
	},
	resetAutoTimeout: function() {
		this.startJob("autoHide", this.bindSafely("hideFSControls"), this.getAutoCloseTimeout());
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
		if (!this.jumpStartEnd) {
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
		}
	},
	onHoldPulseForwardHandler: function(inSender, inEvent) {
		if (!this.jumpStartEnd) {
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
		}
	},
	onjumpBackward: function(inSender, inEvent) {
		if (this.jumpStartEnd) {
			this.jumpToStart(inSender, inEvent);
		} else {
			if (!inSender._holding) {
				this.jumpBackward(inSender, inEvent);
			}
			inSender._holding = false;
		}
	},
	onjumpForward: function(inSender, inEvent) {
		if (this.jumpStartEnd) {
			this.jumpToEnd(inSender, inEvent);
		} else {
			if (!inSender._holding) {
				this.jumpForward(inSender, inEvent);
			}
			inSender._holding = false;
		}
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
		this.setCurrentTime(inEvent.value);
		return true;
	},
	//* Programatically updates slider position to match _this.currentTime.
	updateFullscreenPosition: function() {
		this.$.slider.setValue(this._currentTime);
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
		}
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
		var src = this._isPlaying ? this.pauseIcon : this.playIcon;
		this.$.fsPlayPause.setSrc(src);
		this.$.ilPlayPause.setSrc(src);
	},
	/**
		When _moreButton_ is tapped, toggles visibility of player controls and
		extra functionality.
	*/
	moreButtonTapped: function(inSender, inEvent) {
		var index = this.$.controlsContainer.getIndex();
		if (index === 0) {
			this.$.moreButton.setSrc(this.lessControlsIcon);
			this.$.controlsContainer.next();
		} else {
			this.$.moreButton.setSrc(this.moreControlsIcon);
			this.$.controlsContainer.previous();
		}
	},
	updateMoreButton: function() {
		var index = this.$.controlsContainer.getIndex();
		if (index === 0) {
			this.$.moreButton.setSrc(this.moreControlsIcon);
		} else {
			this.$.moreButton.setSrc(this.lessControlsIcon);
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
		this.$.slider.setMin(0);
		this.$.slider.setMax(this._duration);
		this.$.slider.setRangeStart(0);
		this.$.slider.setRangeEnd(this._duration);

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
