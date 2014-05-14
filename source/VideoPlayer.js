
/**
	_moon.VideoPlayer_ is an HTML5 video player control.  It wraps an
	[enyo.Video](#enyo.Video) object to provide Moonstone-styled standard
	transport controls, optional app-specific controls, and an information bar for
	displaying video information and player feedback.

	All of the standard HTML5 media events bubbled from _enyo.Video_ will also
	bubble from this control.

	Client components added to the _components_ block are rendered into the video
	player's transport control area, and should generally be limited to instances
	of [moon.IconButton](#moon.IconButton). If more than two client components are
	specified, they will be rendered into an "overflow" screen, reached by
	activating a button to the right of the controls.

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
	//* @protected
	spotlight: true,
	// Fixme: When enyo-fit is used than the background image does not fit to video while dragging.
	classes: "moon-video-player enyo-unselectable",
	//* @public
	events: {
		/**
			Fires when _disablePlaybackControls_ is true and the user taps one of the
			controls; may be handled to re-enable the controls, if desired.
		*/
		onPlaybackControlsTapped: ""
	},
	published: {
		//* URL of HTML5 video
		src: "",
		//* Array for setting multiple sources for the same video
		sources: null,
		/**
			When true, the video player is resized after metadata is loaded, based on
			the _aspectRatio_ contained in the metadata. This applies only to inline
			mode--i.e., when _inline: true_.
		*/
		autoResize: false,
		/**
			Video aspect ratio, specified as _"width:height"_, or _"none"_.  When an
			aspect ratio is specified at render time, the player's height or width
			will be updated to respect the ratio, depending on whether _fixedHeight_
			is true or false. If _autoResize_ is true, the _aspectRatio_ will be
			updated based on the metadata for the current video and the player will be
			resized accordingly.  This applies only to inline mode.
		*/
		aspectRatio: "16:9",
		/**
			When true, the width will be adjusted at render time based on the observed
			height and the aspect ratio. When false (the default), the height will be
			adjusted at render time based on the observed width and the aspect ratio.
			This property is ignored if _aspectRatio_ is _"none"_ or a falsy value. In
			addition, this applies only to inline mode.
		*/
		fixedHeight: false,
		/**
			Amount of time (in milliseconds) after which control buttons are
			automatically hidden
		*/
		autoCloseTimeout: 7000,
		//* Duration of the video
		duration: 0,
		//* When true, playback starts automatically when video is loaded
		autoplay: false,
		/**
			When false, fullscreen video control overlays (info or transport) are not
			shown or hidden automatically in response to _up/down_ events
		*/
		autoShowOverlay: true,
		/**
			When true, the overlay will be shown in response to pointer movement (in
			addition to _up/down_ events)
		*/
		shakeAndWake: false,
		/**
			When false, the top _infoComponents_ are not automatically shown or hidden
			in response to _up_ events
		*/
		autoShowInfo: true,
		/**
			When false, the bottom slider/controls are not automatically shown or
			hidden in response to _down_ events
		*/
		autoShowControls: true,
		/**
			When true, the top _infoComponents_ are shown with no timeout; when false,
			they are shown based on _autoShow_ property values
		*/
		showInfo: false,
		/**
			When false, the player starts in fullscreen mode; when true, it starts in
			inline mode
		*/
		inline: false,
		/**
			Amount of time (in seconds) to jump in response to jump buttons. This
			value is ignored when _jumpStartEnd_ is true.
		*/
		jumpSec: 30,
		/**
			When true, the jump forward and jump back buttons jump to the start and
			end of the video, respectively
		*/
		jumpStartEnd: false,
		/**
			When true, popups opened from VideoPlayer client controls are
			automatically hidden
		*/
		autoHidePopups: true,
		/**
			When false, the progress bar is removed and any additional controls are
			moved downward
		*/
		showProgressBar: true,
		/**
			When false, the transport controls are removed, but the icon button area
			is kept
		*/
		showPlaybackControls: true,
		//* When true, playback controls are hidden when the slider is hovered over
		hideButtonsOnSlider: true,
		/**
			When true, the slider is disabled and will not be enabled when video data
			has loaded
		*/
		disableSlider: false,
		//* When false, the jump forward and jump back buttons are hidden
		showJumpControls: true, 
		//* When true, the fast-forward and rewind buttons are visible
		showFFRewindControls: false,
		/**
			When true, the slider and playback controls are disabled.  If the user
			taps the controls, an _onPlaybackControlsTapped_ event will be bubbled.
		*/
		disablePlaybackControls: false,
		/**
			When true, playback controls are only active when the video player has a
			valid source URL and no errors occur during video loading
		*/
		disablePlaybackControlsOnUnload: true,
		//* When false, the Play/Pause control is hidden
		showPlayPauseControl: true,
		//* When false, the video element is hidden
		showVideo: true,
		/**
			When true, a spinner is automatically shown when video is in play state
			but is still loading/buffering
		*/
		autoShowSpinner: true,

		//* @protected
		//* Base URL for icons
		iconPath: "$lib/moonstone/images/video-player/",

		//* Icon image files
		jumpBackIcon: "icon_skipbackward.png",
		rewindIcon: "icon_backward.png",
		playIcon: "icon_play.png",
		pauseIcon: "icon_pause.png",
		fastForwardIcon: "icon_forward.png",
		jumpForwardIcon: "icon_skipforward.png",
		moreControlsIcon: "icon_extend.png",
		lessControlsIcon: "icon_shrink.png",
		inlinePlayIcon: "icon_small_play.png",
		inlinePauseIcon: "icon_small_pause.png",
		inlineFullscreenIcon: "icon_small_fullscreen.png",

		//* Default hash of playback states and their associated playback rates
		// playbackRateHash: {
		//		fastForward: ["2", "4", "8", "16"],
		//		rewind: ["-2", "-4", "-8", "-16"],
		//		slowForward: ["1/4", "1/2"],
		//		slowRewind: ["-1/2", "-1"]
		//	}
		playbackRateHash: {
			fastForward: ["2", "4", "8", "16"],
			rewind: ["-2", "-4", "-8", "-16"],
			slowForward: ["1/4", "1/2", "1"],
			slowRewind: ["-1/2", "-1"]
		},
		//* @public
		/**
			Source of image file to show when video isn't available or user has not
			yet tapped the play button
		*/
		poster: "",
		/**
			When false, video player doesn't response to remote controller
		*/
		handleRemoteControlKey: true
			
	},
	//* @protected
	handlers: {
		onRequestTimeChange: 'timeChange',
		onRequestToggleFullscreen: 'toggleFullscreen',
		onSpotlightUp: 'spotlightUpHandler',
		onSpotlightKeyUp: 'resetAutoTimeout',
		onSpotlightDown: 'spotlightDownHandler',
		onSpotlightKeyDown: 'spotlightKeyDownHandler',
		onresize: 'resizeHandler'
	},
    bindings: [
		{from: ".sourceComponents",			to:".$.video.sourceComponents"},
		{from: ".playbackRateHash",			to:".$.video.playbackRateHash"},
		{from: ".poster",					to:".$.video.poster"},
		{from: ".jumpBackIcon",				to:".$.jumpBack.src", transform: "transformIconSrc"},
		{from: ".rewindIcon",				to:".$.rewind.src", transform: "transformIconSrc"},
		{from: ".fastForwardIcon",			to:".$.fastForward.src", transform: "transformIconSrc"},
		{from: ".jumpForwardIcon",			to:".$.jumpForward.src", transform: "transformIconSrc"},
		{from: ".inlineFullscreenIcon",		to:".$.ilFullscreen.src", transform: "transformIconSrc"},
		{from: ".constrainToBgProgress",	to:".$.slider.constrainToBgProgress"},
		{from: ".elasticEffect",			to:".$.slider.elasticEffect"},
		{from: ".showJumpControls",			to:".$.jumpForward.showing"},
		{from: ".showJumpControls",			to:".$.jumpBack.showing"},
		{from: ".showFFRewindControls",		to:".$.fastForward.showing"},
		{from: ".showFFRewindControls",		to:".$.rewind.showing"},
		{from: ".showPlayPauseControl",		to:".$.fsPlayPause.showing"},
		{from: ".showVideo",				to:".$.videoContainer.showing"}
    ],
	
	_isPlaying: false,
	_canPlay: false,
	_autoCloseTimer: null,
	_currentTime: 0,
	
	components: [
		{kind: "enyo.Signals", onPanelsShown: "panelsShown", onPanelsHidden: "panelsHidden", onPanelsHandleFocused: "panelsHandleFocused", onPanelsHandleBlurred: "panelsHandleBlurred", onFullscreenChange: "fullscreenChanged", onkeyup:"remoteKeyHandler"},
		{name: "videoContainer", classes: "moon-video-player-container", components: [
			{name: "video", kind: "enyo.Video", classes: "moon-video-player-video",
				ontimeupdate: "timeUpdate", onloadedmetadata: "metadataLoaded", durationchange: "durationUpdate", onloadeddata: "dataloaded", onprogress: "_progress", onPlay: "_play", onpause: "_pause", onStart: "_start",  onended: "_stop",
				onFastforward: "_fastforward", onSlowforward: "_slowforward", onRewind: "_rewind", onSlowrewind: "_slowrewind",
				onJumpForward: "_jumpForward", onJumpBackward: "_jumpBackward", onratechange: "playbackRateChange", ontap: "videoTapped", oncanplay: "_setCanPlay", onwaiting: "_waiting", onerror: "_error"
			},
			{name: "spinner", kind: "moon.Spinner", classes: "moon-video-player-spinner"}
		]},

		//* Fullscreen controls
		{name: "fullscreenControl", classes: "moon-video-fullscreen-control enyo-fit scrim", onmousemove: "mousemove", components: [
		
			{name: "videoInfoHeaderClient", showing: false, classes: "moon-video-player-header"},
			
			{name: "playerControl", classes: "moon-video-player-bottom", showing: false, components: [
				{name: "controls", kind: "FittableColumns", rtl:false, classes: "moon-video-player-controls", ontap: "resetAutoTimeout", components: [
			
					{name: "leftPremiumPlaceHolder", classes: "moon-video-player-premium-placeholder-left"},
				
					{name: "controlsContainer", kind: "Panels", arrangerKind: "CarouselArranger", fit: true, draggable: false, classes: "moon-video-player-controls-container", components: [
						{name: "trickPlay", ontap:"playbackControlsTapped", components: [
							{name: "playbackControls", classes: "moon-video-player-control-buttons", components: [
								{name: "jumpBack",		kind: "moon.IconButton", small: false, onholdpulse: "onHoldPulseBackHandler", ontap: "onjumpBackward"},
								{name: "rewind",		kind: "moon.IconButton", small: false, ontap: "rewind"},
								{name: "fsPlayPause",	kind: "moon.IconButton", small: false, ontap: "playPause"},
								{name: "fastForward",	kind: "moon.IconButton", small: false, ontap: "fastForward"},
								{name: "jumpForward",	kind: "moon.IconButton", small: false, onholdpulse: "onHoldPulseForwardHandler", ontap: "onjumpForward"}
							]}
						]},
						{name: "client", classes: "moon-video-player-more-controls"}
					]},
				
					{name: "rightPremiumPlaceHolder", classes: "moon-video-player-premium-placeholder-right", components: [
						{name: "moreButton", kind: "moon.IconButton", small: false, ontap: "moreButtonTapped"}
					]}
				]},
			
				{name: "sliderContainer", classes: "moon-video-player-slider-container", components: [
					{name: "slider", kind: "moon.VideoTransportSlider", rtl: false, disabled: true, onSeekStart: "sliderSeekStart", onSeek: "sliderSeek", onSeekFinish: "sliderSeekFinish", 
						onEnterTapArea: "onEnterSlider", onLeaveTapArea: "onLeaveSlider", ontap:"playbackControlsTapped"
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
				{name: "currTime", content: "00:00 / 00:00"}
			]},
			{name: "ilPlayPause", kind: "moon.IconButton", ontap: "playPause", classes: "moon-video-inline-control-play-pause" },
			{name: "ilFullscreen", kind: "moon.VideoFullscreenToggleButton", classes: "moon-video-inline-control-fullscreen"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.createInfoControls();
		this.inlineChanged();
		this.showInfoChanged();
		this.autoShowInfoChanged();
		this.autoShowControlsChanged();
		this.autoplayChanged();
		this.updateMoreButton();
		this.showPlaybackControlsChanged();
		this.showProgressBarChanged();
		this.jumpSecChanged();
		this.updatePlaybackControlState();
		if (window.ilib) {
			this.durfmt = new ilib.DurFmt({length: "medium", style: "clock", useNative: false});
		}
	},
	transformIconSrc: function(inSrc) {
		var iconPath = this.iconPath || "";
		return iconPath + inSrc;
	},
	disablePlaybackControlsChanged: function() {
		this.updatePlaybackControlState();
	},
	disablePlaybackControlsOnUnloadChanged: function() {
		this.updatePlaybackControlState();
	},
	updatePlaybackControlState: function() {
		var disabled = this.disablePlaybackControls || 
			(this.disablePlaybackControlsOnUnload && (this._errorCode || !this.getSrc()));
		this.updateSliderState();
		this.$.playbackControls.addRemoveClass("disabled", disabled);
		this.$.jumpBack.setDisabled(disabled);
		this.$.rewind.setDisabled(disabled);
		this.$.fsPlayPause.setDisabled(disabled);
		this.$.fastForward.setDisabled(disabled);
		this.$.jumpForward.setDisabled(disabled);
		this.$.ilPlayPause.setDisabled(disabled);
		var currentSpot = enyo.Spotlight.getCurrent();
		if (currentSpot && currentSpot.disabled) {
			if (this.isFullscreen() || !this.getInline()) {
				this.spotFSBottomControls();
			} else {
				enyo.Spotlight.spot(this.$.ilFullscreen);
			}
		}
	},
	playbackControlsTapped: function() {
		if (this.disablePlaybackControls) {
			this.bubble("onPlaybackControlsTapped");
		}
	},
	rendered: function() {
		this.inherited(arguments);
		//* Change aspect ratio based on initialAspectRatio
		this.aspectRatioChanged();
	},
	showPlaybackControlsChanged: function(inOld) {
		this.$.trickPlay.set("showing", this.showPlaybackControls);
		this.$.moreButton.set("showing", this.showPlaybackControls && this.clientComponentsCount > 2);
		this.toggleSpotlightForMoreControls(!this.showPlaybackControls);
		this.$.client.addRemoveClass('moon-video-player-more-controls', this.showPlaybackControls);
	},
	showProgressBarChanged: function(inOld) {
		this.$.sliderContainer.setShowing(this.showProgressBar);
	},
	//* Overrides default _enyo.Control_ behavior.
	getSrc: function() {
		return this.src;
	},
	srcChanged: function() {
		this._canPlay = false;
		this._isPlaying = this.autoplay;
		this._errorCode = null;
		this.updatePlayPauseButtons();
		this.updateSpinner();
		this.updatePlaybackControlState();
		this._resetTime();
		this.$.video.setSrc(this.getSrc());
	},
	//* Returns the underlying _enyo.Video_ control (wrapping the HTML5 video node)
	getVideo: function() {
		return this.$.video;
	},
	createInfoControls: function() {
		var owner = this.hasOwnProperty("infoComponents") ? this.getInstanceOwner() : this;
		this.$.videoInfoHeaderClient.createComponents(this.infoComponents, {owner: owner});
	},
	createClientComponents: function(inComponents) {
		inComponents = (inComponents) ? enyo.clone(inComponents) : [];
		this.clientComponentsCount = inComponents.length;
		if (!this._buttonsSetup) {
			this._buttonsSetup = true;
			if (!inComponents || inComponents.length === 0) {
				// No components - destroy more button
				this.$.leftPremiumPlaceHolder.hide();
				this.$.rightPremiumPlaceHolder.hide();		
			} else if (inComponents.length <= 2) {
				// One or two components - destroy more button and utilize left/right premium placeholders
				this.$.leftPremiumPlaceHolder.createComponent(inComponents.shift(), {owner: this.getInstanceOwner()});
				if (inComponents.length === 1) {
					this.$.rightPremiumPlaceHolder.createComponent(inComponents.shift(), {owner: this.getInstanceOwner()});
				}
			} else {
				// More than two components - use extra panel, with left premium plaeholder for first component
				this.$.leftPremiumPlaceHolder.createComponent(inComponents.shift(), {owner: this.getInstanceOwner()});
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
		this.updateSpinner();
	},
	jumpSecChanged: function() {
		this.$.video.setJumpSec(this.jumpSec);
	},
	disableSliderChanged: function() {
		this.updateSliderState();
	},
	updateSliderState: function() {
		//* this should be be called on create because default slider status should be disabled.
		var disabled = 
			this.disableSlider || 
			this.disablePlaybackControls || 
			!this._loaded || 
			(this.disablePlaybackControlsOnUnload && (this._errorCode || !this.getSrc()));
		this.$.slider.setDisabled(disabled);
	},
	autoShowOverlayChanged: function() {
		this.autoShowInfoChanged();
		this.autoShowControlsChanged();
		if (this.autoShowOverlay) {
			this.resetAutoTimeout();
		}
	},
	autoShowInfoChanged: function() {
		if (this.$.videoInfoHeaderClient.getShowing() && !this.autoShowInfo && !this.showInfo) {
			this.$.videoInfoHeaderClient.hide();
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
		this.$.videoInfoHeaderClient.setShowing(this.showInfo);
		
		if (this.showInfo) {
			// Kick off any marquees in the video info header
			this.$.videoInfoHeaderClient.waterfallDown("onRequestStartMarquee");
		}
	},
	inlineChanged: function() {
		// Force fullscreen
		this.addRemoveClass("enyo-fullscreen enyo-fit", !this.inline);
		// show hide controls visibility
		this.$.inlineControl.setShowing(this.inline);
		this.$.fullscreenControl.setShowing(!this.inline);
		if (!this.inline) {
			this.$.inlineControl.canGenerate = false;
		}
		this.spotlight = !this.inline;
	},
	//* Unloads the current video source, stopping all playback and buffering.
	unload: function() {
		this.$.video.unload();
		this._resetTime();
		this._loaded = false;
		this._isPlaying = false;
		this._canPlay = false;
		this._errorCode = null;
		this.src = null;
		this.updatePlaybackControlState();
		this.updateSpinner();
	},
	showScrim: function(show) {
		this.$.fullscreenControl.addRemoveClass('scrim', !show);
	},
	panelsShown: function(inSender, inEvent) {
		if ((this.isFullscreen() || !this.getInline()) && this.isOverlayShowing()) {
			this.hideFSControls();
			enyo.Spotlight.unspot();
		}
	},
	panelsHidden: function(inSender, inEvent) {
		enyo.Spotlight.spot(this);
	},
	panelsHandleFocused: function(inSender, inEvent) {
		this._infoShowing = this.$.videoInfoHeaderClient.getShowing();
		this._controlsShowing = this.$.playerControl.getShowing();
		this.hideFSControls();
	},
	panelsHandleBlurred: function(inSender, inEvent) {
		if (this.isLarge() && !this.isOverlayShowing()) {
			if (this._infoShowing) {
				this.showFSInfo();
			}
			if (this._controlsShowing) {
				this.showFSBottomControls();
			}
		}
	},
	isLarge: function() {
		return this.isFullscreen() || !this.get("inline");
	},
	spotlightUpHandler: function(inSender, inEvent) {
		if (this.isLarge() && !inEvent.spotSentFromContainer) {
			// Toggle info header on "up" press
			if (inEvent.originator !== this.$.slider) {
				if (!this.$.videoInfoHeaderClient.getShowing()) {
					this.showFSInfo();
				} else {
					this.hideFSInfo();
				}
			}
			return true;
		}
	},
	spotlightDownHandler: function(inSender, inEvent) {
		if (this.isLarge() && !inEvent.spotSentFromContainer) {
			// Toggle info header on "down" press
			if (!this.$.playerControl.getShowing()) {
				this.showFSBottomControls();
			} else {
				this.hideFSBottomControls();
			}
			return true;
		}
	},
	spotlightKeyDownHandler: function(inSender, inEvent) {
		// Do not decorate event with spotlight container flag if sent from control whose events player should handle
		if (inEvent.spotSentFromContainer && (enyo.Spotlight.getParent(inEvent.originator) === this || inEvent.originator === this)) {
			inEvent.spotSentFromContainer = false;
		}
	},

	///// Fullscreen controls /////


	_holdPulseThreadhold: 400,
	_holding: false,
	_sentHold: false,

	//* Returns true if any piece of the overlay is showing.
	isOverlayShowing: function() {
		return this.$.videoInfoHeaderClient.getShowing() || this.$.playerControl.getShowing();
	},
	//* Resets the timeout, or wakes the overlay.
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
	},
	hideFSControls: function() {
		if (this.isOverlayShowing()) {
			this.hideFSInfo();
			this.hideFSBottomControls();
		}
		this.stopJob("autoHide");
	},
	//* Sets _this.visible_ to true and clears hide job.
	showFSBottomControls: function(inSender, inEvent) {
		if (this.autoShowOverlay && this.autoShowControls) {
			this.resetAutoTimeout();
			this.showScrim(true);
			this.$.playerControl.setShowing(true);
			this.$.playerControl.resized();
			if (!this.showPlaybackControls) {
				//* Fixed index
				this.$.controlsContainer.setIndex(1);
			}
			
			//* Initial spot
			this.spotFSBottomControls();
			
			this.$.slider.showKnobStatus();
			if (this.$.video.isPaused()) {
				this.updateFullscreenPosition();
			}
			// When controls are visible, set as container to remember last focused control
			this.set("spotlight", "container");
		}
	},
	spotFSBottomControls: function() {
		if (this.showPlaybackControls) {
			if (this.$.controlsContainer.getIndex() === 0) {
				if (enyo.Spotlight.spot(this.$.fsPlayPause) === false) {
					if(enyo.Spotlight.spot(this.$.fastForward) === false){
						if(enyo.Spotlight.spot(this.$.jumpForward) === false) {
							enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.controls));
						}
					}
				}	
			} else {
				enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.controlsContainer.getActive()));
			}
		} else {
			var oTarget = enyo.Spotlight.getFirstChild(this.$.leftPremiumPlaceHolder);
			enyo.Spotlight.spot(oTarget);
		}
	},
	//* Sets _this.visible_ to false.
	hideFSBottomControls: function() {
		// When controls are hidden, set as just a spotlight true component, 
		// so that it is spottable (since it won't have any spottable children),
		// and then spot itself
		this.set("spotlight", true);
		// Only spot the player if hiding is triggered from player control
		if (enyo.Spotlight.hasCurrent() && enyo.Spotlight.getParent(enyo.Spotlight.getCurrent()) === this) {
			enyo.Spotlight.spot(this);
		}
		if (this.autoHidePopups) {
			// Hide enyo.Popup-based popups (including moon.Popup)
			this.$.playerControl.waterfall("onRequestHide");
			// Hide moon.ContextualPopups
			this.$.playerControl.waterfall("onRequestHidePopup");
		}
		this.showScrim(false);
		this.$.playerControl.setShowing(false);
	},
	//* Sets _this.visible_ to true and clears hide job.
	showFSInfo: function() {
		if (this.autoShowOverlay && this.autoShowInfo) {
			this.resetAutoTimeout();
			this.$.videoInfoHeaderClient.setShowing(true);
			this.$.videoInfoHeaderClient.resized();
			
			// Kick off any marquees in the video info header
			this.$.videoInfoHeaderClient.waterfallDown("onRequestStartMarquee");
		}
	},
	//* Sets _this.visible_ to false.
	hideFSInfo: function() {
		if (!this.showInfo) {
			this.$.videoInfoHeaderClient.setShowing(false);
		}
	},
	resetAutoTimeout: function() {
		if (this.isFullscreen() || !this.getInline()) {
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
		if (this.hideButtonsOnSlider && !this.$.slider.isDragging()) {
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
	sendFeedback: function(inMessage, inParams, inPersistShowing, inLeftSrc, inRightSrc) {
		inParams = inParams || {};
		this.$.slider.feedback(inMessage, inParams, inPersistShowing, inLeftSrc, inRightSrc);
	},

	////// Slider event handling //////

	//* When seeking starts, pauses video.
	sliderSeekStart: function(inSender, inEvent) {
		this._isPausedBeforeDrag = this.$.video.isPaused();
		this.pause();
		return true;
	},
	//* When seeking completes, plays video.
	sliderSeekFinish: function(inSender, inEvent) {
		if (inEvent.value < this._duration - 1) {
			if (!this._isPausedBeforeDrag) {
				this.play();
			} else {
				this.pause();
			}
			this._isPausedBeforeDrag = this.$.video.isPaused();
		}
		if (!this.$.slider.isInPreview()) {
			this.$.controls.show();
		}
		this.setCurrentTime(inEvent.value);
		return true;
	},
	//* When seeking, sets video time.
	sliderSeek: function(inSender, inEvent) {
		this.setCurrentTime(inEvent.value);
		return true;
	},
	//* Programatically updates slider position to match _this.currentTime_/_this.duration_.
	updateFullscreenPosition: function() {
		if (this.$.slider.isDragging()) {
			return;
		}
		this.$.slider.setValue(this._currentTime);
	},



	///// Inline controls /////

	updateInlinePosition: function() {
		var percentComplete = this._duration ? Math.round(this._currentTime * 1000 / this._duration) / 10 : 0;
		this.$.progressStatus.applyStyle("width", percentComplete + "%");
		this.$.currTime.setContent(this.formatTime(this._currentTime) + " / " + this.formatTime(this._duration));
	},
	videoTapped: function() {
		if (this.getInline() && !this.isFullscreen()) {
			this.playPause();
		}
	},

	//* @public
	//* Toggles fullscreen state.
	toggleFullscreen: function(inSender, inEvent) {
		if (this.isFullscreen()) {
			this.cancelFullscreen();
		} else {
			this.requestFullscreen();
		}
	},
	//* @protected
	fullscreenChanged: function(inSender, inEvent) {
		enyo.Spotlight.unspot();
		if (this.isFullscreen()) {
			this.$.ilFullscreen.undepress();
			this.spotlight = true;
			this.spotlightModal = true;
			this.removeClass("inline");
			this.$.inlineControl.setShowing(false);
			this.$.fullscreenControl.setShowing(true);
			this.showFSControls();
			this.$.controlsContainer.resized();
		} else {
			this.stopJob("autoHide");
			this.addClass("inline");
			this.$.inlineControl.setShowing(true);
			this.$.fullscreenControl.setShowing(false);
			enyo.Spotlight.spot(this.$.ilFullscreen);
			this.spotlight = false;
			this.spotlightModal = false;
		}
	},
	//* @public
	//* Facades _this.$.video.play()_.
	play: function(inSender, inEvent) {
		this.currTimeSync = true;
		this._isPlaying = true;
		this.$.video.play();
		this.updatePlayPauseButtons();
		this.updateSpinner();
	},
	//* Facades _this.$.video.pause()_.
	pause: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.pause();
		this.updatePlayPauseButtons();
		this.updateSpinner();
	},
	//* Facades _this.$.video.rewind()_.
	rewind: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.rewind();
		this.updatePlayPauseButtons();
		this.updateSpinner();
	},
	//* Facades _this.$.video.jumpToStart()_.
	jumpToStart: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.jumpToStart();
		this.updatePlayPauseButtons();
		this.updateSpinner();
	},
	//* Facades _this.$.video.jumpBackward()_.
	jumpBackward: function(inSender, inEvent) {
		this.$.video.jumpBackward();
		this.updatePlayPauseButtons();
		this.updateSpinner();
	},
	//* Facades _this.$.video.fastForward()_.
	fastForward: function(inSender, inEvent) {
		this._isPlaying = false;
		this.$.video.fastForward();
		this.updatePlayPauseButtons();
		this.updateSpinner();
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
		this.updateSpinner();
	},
	//* Facades _this.$.video.jumpForward()_.
	jumpForward: function(inSender, inEvent) {
		this.$.video.jumpForward();
		this.updatePlayPauseButtons();
		this.updateSpinner();
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
	//* Refreshes size of video player.
	resizeHandler: function() {
		this.aspectRatioChanged();
	},
	//* Updates the height/width based on the video's aspect ratio.
	aspectRatioChanged: function() {
		// Case 5: Fixed size provided by user
		if (!this.inline || this.aspectRatio == "none" || !this.aspectRatio) { return; }

		var videoAspectRatio = null,
			width = this.getComputedStyleValue('width'),
			height = this.getComputedStyleValue('height'),
			ratio = 1
		;
		
		videoAspectRatio = this.aspectRatio.split(":");
		
		// If fixedHeight is true, update width based on aspect ratio
		if (this.fixedHeight) {
			// Case 2: Automatic resize based on video aspect ratio (fixed height):
			// Case 4: Fixed aspect ratio provided by user (fixed-height):
			ratio = videoAspectRatio[0] / videoAspectRatio[1];
			this.applyStyle("width", ((parseInt(height, 10) * ratio)) + "px");
		// If fixedHeight is false, update height based on aspect ratio
		} else if (!this.fixedHeight) {
			// Case 1: Automatic resize based on video aspect ratio (fixed width):
			// Case 3: Fixed aspect ratio provided by user (fixed-width):
			ratio = videoAspectRatio[1] / videoAspectRatio[0];
			this.applyStyle("height", ((parseInt(width, 10) * ratio)) + "px");
		}
	},
	updatePosition: function() {
		this.updateFullscreenPosition();
		this.updateInlinePosition();
	},
	//* Properly formats time.
	formatTime: function(inValue) {
		var hour = Math.floor(inValue / (60*60));
		var min = Math.floor((inValue / 60) % 60);
		var sec = Math.floor(inValue % 60);
		if (this.durfmt) {
			var val = {minute: min, second: sec};
			if (hour) {
				val.hour = hour;
			}
			return this.durfmt.format(val);
		} else {
			return (hour ? this.padDigit(hour) + ":" : "") + this.padDigit(min) + ":" + this.padDigit(sec);
		}
	},
	//* Format time helper
	padDigit: function(inValue) {
		return (inValue) ? (String(inValue).length < 2) ? "0"+inValue : inValue : "00";
	},
	//* Switches play/pause buttons as appropriate.
	updatePlayPauseButtons: function() {
		var t = this.bindSafely("transformIconSrc");

		this.$.fsPlayPause.setSrc(this._isPlaying ? t(this.pauseIcon) : t(this.playIcon));
		this.$.ilPlayPause.setSrc(this._isPlaying ? t(this.inlinePauseIcon) : t(this.inlinePlayIcon));
	},
	//* Turns spinner on or off, as appropriate.
	updateSpinner: function() {
		var spinner = this.$.spinner;
		if (this.autoShowSpinner && this._isPlaying && !this._canPlay && !this._errorCode) {
			spinner.start();
		} else if (spinner.getShowing()) {
			spinner.stop();
		}
	},
	autoShowSpinnerChanged: function() {
		this.updateSpinner();
	},
	/**
		When _moreButton_ is tapped, toggles visibility of player controls and
		extra functionality.
	*/
	moreButtonTapped: function(inSender, inEvent) {
		var index = this.$.controlsContainer.getIndex();
		var t = this.bindSafely("transformIconSrc");

		if (index === 0) {
			this.$.moreButton.setSrc(t(this.moreControlsIcon));
			this.toggleSpotlightForMoreControls(true);
			this.$.controlsContainer.next();
		} else {
			this.$.moreButton.setSrc(t(this.lessControlsIcon));
			this.toggleSpotlightForMoreControls(false);
			this.$.controlsContainer.previous();
		}
	},
	updateMoreButton: function() {
		var index = this.$.controlsContainer.getIndex();
		var t = this.bindSafely("transformIconSrc");
		
		if (index === 0) {
			this.$.moreButton.setSrc(t(this.lessControlsIcon));
		} else {
			this.$.moreButton.setSrc(t(this.moreControlsIcon));
		}
	},
	toggleSpotlightForMoreControls: function(moreControlsSpottable) {
		this.$.playbackControls.spotlightDisabled = moreControlsSpottable;
		this.$.client.spotlightDisabled = !moreControlsSpottable;
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

		// TODO: Event handler shouldn't know about event delegates.
		// Waterfall should handle this automatically.
		// See https://enyojs.atlassian.net/browse/ENYO-3188
		delete inEvent.delegate;
		this.waterfall("onTimeupdate", inEvent);
	},
	//* Called when video successfully loads video metadata.
	metadataLoaded: function(inSender, inEvent) {
		//* Update aspect ratio based on actual video aspect ratio when autoResize is true.
		if (this.autoResize && this.$.video) {
			this.setAspectRatio(this.$.video.getAspectRatio());
		}
		this.durationUpdate(inSender, inEvent);
	},
	durationUpdate: function(inSender, inEvent) {
		this._duration = this.$.video.getDuration();
		this._currentTime = this.$.video.getCurrentTime();

		this.$.slider.setMin(0);
		this.$.slider.setMax(this._duration);

		this.updatePosition();

		this.waterfall("onTimeupdate", inEvent);
	},
	_loaded: false,
	dataloaded: function(inSender, inEvent) {
		this._loaded = true;
		this.updateSliderState();
		this.durationUpdate(inSender, inEvent);
	},
	_getBufferedProgress: function(inNode) {
		var bufferData = inNode.buffered,
			numberOfBuffers = bufferData.length,
			highestBufferPoint = 0,
			duration = inNode.duration || 0,
			endPoint = 0,
			i
		;
		
		if (duration === 0 || isNaN(duration)) {
			return {value: 0, percent: 0};
		}
		
		// Find furthest along buffer end point and use that (only supporting one buffer range for now)
		for (i = 0; i < numberOfBuffers; i++) {
			endPoint = bufferData.end(i);
			highestBufferPoint = (endPoint > highestBufferPoint) ? endPoint : highestBufferPoint;
		}
		return {value: highestBufferPoint, percent: highestBufferPoint/duration*100};
	},
	//* We get this event while buffering is in progress.
	_progress: function(inSender, inEvent) {
		var buffered = this._getBufferedProgress(inEvent.srcElement);
		if (this.isFullscreen() || !this.getInline()) {
			this.$.slider.setBgProgress(buffered.value); 
		} else {
			this.$.bgProgressStatus.applyStyle("width", buffered.percent + "%");
		}
	},
	_resetTime: function() {
		this._currentTime = 0;
		this._duration = 0;
		this.updatePosition();
		this.$.slider.setBgProgress(0);
		this.$.bgProgressStatus.applyStyle("width", 0);
	},
	_play: function(inSender, inEvent) {
		this.sendFeedback("Play");
	},
	_pause: function(inSender, inEvent) {
		// Don't send pause feedback if we are rewinding
		if (inEvent.srcElement.playbackRate < 0) {
			return;
		}
		if (inEvent.srcElement.currentTime === 0) {
			this.sendFeedback("Stop", {}, true);
			return;
		}
		this.sendFeedback("Pause", {}, true);
	},
	_stop: function(inSender, inEvent) {
		this.pause();
		this.updatePlayPauseButtons();
		this.updateSpinner();
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
	},
	_waiting: function(inSender, inEvent) {
		this._canPlay = false;
		this.updateSpinner();
	},
	_setCanPlay: function(inSender, inEvent) {
		this._canPlay = true;
		this.updateSpinner();
	},
	_error: function(inSender, inEvent) {
		// Error codes in inEvent.currentTarget.error.code
		// 1: MEDIA_ERR_ABORTED, 2: MEDIA_ERR_NETWORK, 3: MEDIA_ERR_DECODE, 4: MEDIA_ERR_SRC_NOT_SUPPORTED
		this._errorCode = inEvent.currentTarget.error.code;
		this._loaded = false;
		this._isPlaying = false;
		this._canPlay = false;
		this.$.currTime.setContent($L("Error"));
		this._stop();
		this.updateSpinner();
		this.updatePlaybackControlState();
	},
	remoteKeyHandler: function(inSender, inEvent) {
		if (this.handleRemoteControlKey && !this.disablePlaybackControls) {
			var showControls = false;
			switch (inEvent.keySymbol) {
			case 'play':
				this.play(inSender, inEvent);
				showControls = true;
				break;
			case 'pause':
				this.pause(inSender, inEvent);
				showControls = true;
				break;
			case 'rewind':
				if (this.showFFRewindControls) {
					this.rewind(inSender, inEvent);
					showControls = true;
				}
				break;
			case 'fastforward':
				if (this.showFFRewindControls) {
					this.fastForward(inSender, inEvent);
					showControls = true;
				}
				break;
			case 'stop':
				this.jumpToStart();
				showControls = true;
				break;
			}
			if (showControls) {
				if(!this.$.playerControl.getShowing()) {
					this.showFSBottomControls();
				} else {
					this.resetAutoTimeout();
				}
			}
		}
		return true;
	}
});
