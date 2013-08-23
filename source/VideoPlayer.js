
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
		//* When false, remove the progress bar and any additional controls will drop down
		showProgressBar: true,
		//* When true, hides playback controls whenever mouse is hover over slider
		hideButtonsOnSlider: true,


		//* URL for "jump back" icon
		jumpBackIcon: "$lib/moonstone/images/icon_skipbackward.png",
		//* URL for "rewind" icon
		rewindIcon: "$lib/moonstone/images/icon_backward.png",
		//* URL for "play" icon
		playIcon: "$lib/moonstone/images/icon_play.png",
		//* URL for "pause" icon
		pauseIcon: "$lib/moonstone/images/icon_pause.png",
		//* URL for "fast forward" icon
		fastForwardIcon: "$lib/moonstone/images/icon_forward.png",
		//* URL for "jump forward" icon
		jumpForwardIcon: "$lib/moonstone/images/icon_skipforward.png",
		//* URL for "more controls" icon
		moreControlsIcon: "$lib/moonstone/images/icon_extend.png",
		//* URL for "less controls" icon
		lessControlsIcon: "$lib/moonstone/images/icon_shrink.png",
		//* URL for "inline-play" icon
		inlinePlayIcon: "$lib/moonstone/images/icon_small_play.png",
		//* URL for "inline-pause" icon
		inlinePauseIcon: "$lib/moonstone/images/icon_small_pause.png",
		//* URL for "inline-fullscreen" icon
		inlineFullscreenIcon: "$lib/moonstone/images/icon_small_fullscreen.png"
	},
	handlers: {
		onRequestTimeChange: 'timeChange',
		onRequestToggleFullscreen: 'toggleFullscreen',
		onSpotlightFocus: 'spotlightFocusHandler',
		onSpotlightFocused: 'spotlightFocused',
		onSpotlightUp: 'spotlightUpHandler',
		onSpotlightKeyUp: 'resetAutoTimeout',
		onSpotlightDown: 'spotlightDownHandler',
		onSpotlightLeft: 'spotlightLeftHandler',
		onSpotlightRight: 'spotlightRightHandler',
		onSpotlightSelect: 'spotlightSelectHandler', 
		onresize: 'resizeHandler'
	},
    bindings: [
		{from: ".sourceComponents",			to: ".$.video.sourceComponents"},
		{from: ".jumpBackIcon",				to:".$.jumpBack.src"},
		{from: ".rewindIcon",				to:".$.rewind.src"},
		{from: ".fastForwardIcon",			to:".$.fastForward.src"},
		{from: ".jumpForwardIcon",			to:".$.jumpForward.src"},
		{from: ".inlineFullscreenIcon",		to:".$.ilFullscreen.src"},
		{from: ".constrainToBgProgress",	to:".$.slider.constrainToBgProgress"},
		{from: ".elasticEffect",			to:".$.slider.elasticEffect"}
    ],
	
	//* @protected

	_isPlaying: false,
	_autoCloseTimer: null,
	_currentTime: 0,
	
	components: [
		{name: "video", kind: "enyo.Video", classes: "moon-video-player-video",
			ontimeupdate: "timeUpdate", onloadedmetadata: "metadataLoaded", onprogress: "_progress", onPlay: "_play", onpause: "_pause", onStart: "_start", onended: "_stop",
			onFastforward: "_fastforward", onSlowforward: "_slowforward", onRewind: "_rewind", onSlowrewind: "_slowrewind",
			onJumpForward: "_jumpForward", onJumpBackward: "_jumpBackward", onratechange: "playbackRateChange"
		},
		//* Fullscreen controls
		{name: "fullscreenControl", classes: "moon-video-fullscreen-control enyo-fit", ontap: "toggleControls", onmousemove: "mousemove", components: [
		
			{name: "videoInfoHeader", kind: "FittableColumns", showing: false, classes: "moon-video-player-header"},
			
			{name: "playerControl", classes: "moon-video-player-bottom", showing: false, components: [
				{name: "controls", kind: "FittableColumns", classes: "moon-video-player-controls", onSpotlightUp: "preventUpEvent", onSpotlightDown: "preventDownEvent", components: [
			
					{name: "leftPremiumPlaceHolder", classes: "moon-video-player-premium-placeholder-left"},
				
					{name: "controlsContainer", kind: "Panels", arrangerKind: "CarouselArranger", fit: true, draggable: false, classes: "moon-video-player-controls-container", components: [
						{name: "trickPlay", kind: "FittableColumns", noStretch: true, classes: "enyo-center moon-video-player-control-buttons", components: [
							{name: "jumpBack",		kind: "moon.IconButton", classes: "moon-video-player-control-button", onholdpulse: "onHoldPulseBackHandler", ontap: "onjumpBackward"},
							{name: "rewind",		kind: "moon.IconButton", classes: "moon-video-player-control-button", ontap: "rewind"},
							{name: "fsPlayPause",	kind: "moon.IconButton", classes: "moon-video-player-control-button", ontap: "playPause"},
							{name: "fastForward",	kind: "moon.IconButton", classes: "moon-video-player-control-button", ontap: "fastForward"},
							{name: "jumpForward",	kind: "moon.IconButton", classes: "moon-video-player-control-button", onholdpulse: "onHoldPulseForwardHandler", ontap: "onjumpForward", defaultSpotlightRight: "moreButton"}
						]},
						{name: "client", layoutKind: "FittableColumnsLayout", classes: "moon-video-player-more-controls", noStretch: true}
					]},
				
					{name: "rightPremiumPlaceHolder", classes: "moon-video-player-premium-placeholder-right", components: [
						{name: "moreButton", kind: "moon.IconButton", ontap: "moreButtonTapped", defaultSpotlightRight: "moreButton"}
					]}
				]},
			
				{name: "sliderContainer", classes: "moon-video-player-slider-container", components: [
					{name: "slider", kind: "moon.VideoTransportSlider", onSeekStart: "sliderSeekStart", onSeek: "sliderSeek", onSeekFinish: "sliderSeekFinish", 
						onenter: "onEnterSlider", onleave: "onLeaveSlider"
					}
				]}
			]}
		]},
		//* Inline controls
		{name: "inlineControl", classes: "moon-video-inline-control", components: [
			{name: "currPosAnimator", kind: "Animator", onStep: "currPosAnimatorStep", onEnd: "currPosAnimatorComplete"},
			{name: "bgProgressStatus", classes: "moon-video-inline-control-bgprogress"},
			{name: "progressStatus", classes: "moon-video-inline-control-progress"},
			{classes: "moon-video-inline-control-text", components: [
				{name: "currTime", content: "00:00"},
				{name: "totalTime", content: "00:00"}
			]},
			{name: "ilPlayPause", kind: "moon.IconButton", ontap: "playPause", classes: "moon-video-inline-control-play-pause" },
			{name: "ilFullscreen", kind: "moon.VideoFullscreenToggleButton", classes: "moon-video-inline-control-fullscreen"}
		]},
		{kind: "enyo.Signals", onFullscreenChange: "fullscreenChanged"}
	],
	create: function() {
		this.inherited(arguments);
		this.createInfoControls();
		this.showInfoChanged();
		this.inlineChanged();
		this.autoShowInfoChanged();
		this.autoShowControlsChanged();
		this.autoplayChanged();
		this.updateMoreButton();
		this.showProgressBarChanged();
	},
	showProgressBarChanged: function(inOld) {
		this.$.sliderContainer.setShowing(this.showProgressBar);
	},
	resizeHandler: function() {
		this.inherited(arguments);
		var node = this.$.video.hasNode();
		var rect = node.getBoundingClientRect();
		this.applyStyle("width", rect.width + "px");
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
		this.$.videoInfoHeader.createComponents(this.infoComponents);
	},
	createClientComponents: function(inComponents) {
		var componentOption = {name: "leftPremium", defaultSpotlightLeft: "leftPremium", owner: this.owner};
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
				this.$.leftPremiumPlaceHolder.createComponent(inComponents.shift(), componentOption);
				if (inComponents.length == 1) {
					this.$.rightPremiumPlaceHolder.createComponent(inComponents.shift(), componentOption);
				}
			} else {
				// More than two components - use extra panel, with left premium plaeholder for first component
				this.$.leftPremiumPlaceHolder.createComponent(inComponents.shift(), componentOption);
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
	inlinePlayIconChanged: function() {
		this.updatePlayPauseButtons();
	},
	inlinePauseIconChanged: function() {
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
	},
	preventUpEvent: function(inSender, inEvent) {
		this.showFSInfo();
		return true;
	},
	preventDownEvent: function(inSender, inEvent) {
		return true;
	},
	showScrim: function(show) {
		this.$.fullscreenControl.addRemoveClass('scrim', show);
	},
	spotlightUpHandler: function(inSender, inEvent) {
		if (this.isFullscreen() || !this.getInline()) {
			if (inEvent.originator !== this.$.slider) {
				this.showFSInfo();
			}
		}
	},
	spotlightDownHandler: function(inSender, inEvent) {
		if (this.isFullscreen() || !this.getInline()) {
			if (inEvent.originator === this && !this.$.playerControl.showing) {
				this.showFSBottomControls();
				return true;
			}
		}
	},
	spotlightLeftHandler: function(inSender, inEvent) {
		if (this.isFullscreen() || !this.getInline()) {
			if (!this.$.playerControl.showing) {
				return true;
			}
		}
	},
	spotlightRightHandler: function(inSender, inEvent) {
		if (this.isFullscreen() || !this.getInline()) {
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
			this.showScrim(true);
			this.$.playerControl.setShowing(true);
			this.$.playerControl.resized();
			this.$.controlsContainer.setIndex(0);
			enyo.Spotlight.spot(this.$.fsPlayPause);
			// if (this.autoplay) {
				this.$.slider.showKnobStatus();
				this.sendFeedback("Pause");
				this.updateFullscreenPosition();
			// }
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
		this.showScrim(false);
		this.$.playerControl.setShowing(false);
		enyo.Spotlight.spot(this);
	},
	//* Sets _this.visible_ to true and clears hide job.
	showFSInfo: function() {
		if (this.autoShowOverlay && this.autoShowInfo) {
			this.$.videoInfoHeader.setShowing(true);
			//* Fittable remembers the width when it is set showing(false), so we need to resize when it is showing(true) here.
			this.$.videoInfoHeader.resized();
		}
	},
	//* Sets _this.visible_ to false.
	hideFSInfo: function() {
		if (!this.showInfo) { 
			this.$.videoInfoHeader.setShowing(false);
		}
	},
	resetAutoTimeout: function() {
		
		if (this.isFullscreen() || !this.getInline()) {
			this.log();
			this.startJob("autoHide", this.bindSafely("hideFSControls"), this.getAutoCloseTimeout());
		}
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
	onEnterSlider: function(inSender, inEvent) {
		if (this.hideButtonsOnSlider) {
			this.$.controls.setShowing(false);
		}
	},
	onLeaveSlider: function(inSender, inEvent) {
		if (this.hideButtonsOnSlider) {
			this.$.controls.setShowing(true);
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
		this.$.slider.feedback(inMessage, inParams, inShowLeft, inShowRight, inPersistShowing);
	},
	
	////// Slider event handling //////
	
	//* When seeking starts, pause video.
	sliderSeekStart: function(inSender, inEvent) {
		this.pause();
		return true;
	},
	//* When seeking completes, play video.
	sliderSeekFinish: function(inSender, inEvent) {
		if (inEvent.value < this.duration) {
			this.play();
		}
		return true;
	},
	//* When seeking, set video time.
	sliderSeek: function(inSender, inEvent) {
		this.setCurrentTime(inEvent.value);
		return true;
	},
	//* Programatically updates slider position to match _this.currentTime_/_this.duration_.
	updateFullscreenPosition: function() {
		if (this.$.slider.dragging) {
			return;
		}
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

	//* @private
	_zoom: '100%',
	
	//* @public
	
	//* Toggles fullscreen state.
	toggleFullscreen: function(inSender, inEvent) {
		// Fixme: Fullscreen state change stops transition animation. 
		//      And it breaks full screen button's transition behavior.
		if (this.isFullscreen()) {
			this.cancelFullscreen();
		} else {
			//* Fixed: chrome has bug that do not return proper body width when it is not at zoom 1 in full screen mode
			//* Fallback routine: detect current browser zoom and set css zoom as the reverse.
			this._zoom = document.body.style.zoom;
			document.body.style.zoom = window.innerWidth / window.outerWidth * 100 + "%";
			this.requestFullscreen();
		}
	},
	fullscreenChanged: function(inSender, inEvent) {
		this.$.inlineControl.setShowing(!this.isFullscreen());
		this.$.fullscreenControl.setShowing(this.isFullscreen());
		if (this.isFullscreen()) {
			this.showFSControls();
		} else {
			document.body.style.zoom = this._zoom;
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
		if ( this.$.video.isPaused() ) {
			//* Make video able to go futher than the buffer
			this.$.video.play();
		}
		this.$.video.jumpToStart();
		this.updatePlayPauseButtons();
		//this.sendFeedback("jumpToStart");
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
		if ( this.$.video.isPaused() ) {
			//* Make video able to go futher than the buffer
			this.$.video.play();
		}
		this.$.video.jumpToEnd();
		this.updatePlayPauseButtons();
		//this.sendFeedback("jumpToEnd");
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
		this.$.fsPlayPause.setSrc(this._isPlaying ? this.pauseIcon : this.playIcon);
		this.$.ilPlayPause.setSrc(this._isPlaying ? this.inlinePauseIcon : this.inlinePlayIcon);
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
		// WIP : initialize slider 
		this.$.slider.setMin(0);
		this.$.slider.setMax(this._duration);
		this.updatePosition();
		
		this.waterfall("onTimeupdate", inEvent);
	},
	_getBufferedProgress: function(inNode) {
		var bufferData = inNode.buffered,
			numberOfBuffers = bufferData.length,
			highestBufferPoint = 0,
			duration = inNode.duration || 0,
			endPoint = 0,
			i
		;
		
		if (duration === 0) {
			return;
		}
		
		// Find furthest along buffer end point and use that (only supporting one buffer range for now)
		for (i = 0; i < numberOfBuffers; i++) {
			endPoint = bufferData.end(i);
			highestBufferPoint = (endPoint > highestBufferPoint) ? endPoint : highestBufferPoint;
		}
		return highestBufferPoint;
	},
	_progress: function(inSender, inEvent) {
		this._bufferedPercentage = this._getBufferedProgress(inEvent.srcElement);
		if (this.isFullscreen() || !this.getInline()) {
			this.$.slider.setBgProgress(this._bufferedPercentage); 
		} else {
			this.$.bgProgressStatus.applyStyle("width", this._bufferedPercentage*100/inEvent.srcElement.duration + "%");
		}
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
	_start: function(inSender, inEvent) {
		this.sendFeedback("Pause");
	},
	_stop: function(inSender, inEvent) {
		this.pause();
		this.updatePlayPauseButtons();
		this.sendFeedback("Stop");
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
		this.sendFeedback("JumpBackward", {jumpSize: inEvent.jumpSize}, false);
	}
});
