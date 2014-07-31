(function (enyo, scope) {
	/**
	* Fires when [_disablePlaybackControls_]{@link enyo.VideoPlayer#disablePlaybackControls} 
	* is `true` and the user taps one of the [controls]{@link enyo.Control}; may be handled to 
	* re-enable the controls, if desired. No event-specific information is sent with this event.
	*
	* @event moon.VideoPlayer#event:onPlaybackControlsTapped
	* @type {Object}
	* @public
	*/

	/**
	* _moon.VideoPlayer_ is an HTML5 [video]{@glossary video} player control.  It wraps an 
	* {@link enyo.Video} [object]{@glossary Object} to provide Moonstone-styled standard transport 
	* [controls]{@link enyo.Control}, optional app-specific controls, and an information bar for 
	* displaying video information and player feedback.
	* 
	* All of the standard HTML5 media [events]{@glossary event} bubbled from _enyo.Video_ will also
	* bubble from this control.
	* 
	* Client [components]{@link enyo.Component} added to the _components_ block are rendered into 
	* the video player's transport control area, and should generally be limited to instances of 
	* {moon.IconButton}. If more than two client components are specified, they will be rendered 
	* into an "overflow" screen, reached by activating a button to the right of the controls.
	*
	* ```javascript
	* {
	*	kind: 'moon.VideoPlayer',
	*	src: 'http://www.w3schools.com/html/mov_bbb.mp4',
	*	components: [
	*		// Custom icons for app-specific features
	*		{kind: 'moon.IconButton', src: 'assets/feature1.png', ontap: 'feature1'},
	*		{kind: 'moon.IconButton', src: 'assets/feature2.png', ontap: 'feature2'},
	*		{kind: 'moon.IconButton', src: 'assets/feature3.png', ontap: 'feature3'}
	*	]
	* }
	* ```
	*
	* @ui
	* @class moon.VideoPlayer
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends moon.VideoPlayer.prototype */ {

		/**
		* @private
		*/
		name: 'moon.VideoPlayer',

		/**
		* @private
		*/
		kind: 'enyo.Control',
		
		/**
		* @private
		*/
		spotlight: true,

		// Fixme: When enyo-fit is used than the background image does not fit to video while dragging.
		/**
		* @private
		*/
		classes: 'moon-video-player enyo-unselectable',
		
		/**
		* @private
		*/
		events: {
			onPlaybackControlsTapped: ''
		},

		/**
		* @private
		*/
		published: 
			/** @lends moon.VideoPlayer.prototype */ {
			
			/** 
			* URL of HTML5 video
			*
			* @type {String}
			* @default ''
			* @public
			*/
			src: '',
			
			/** 
			* Array for setting multiple sources for the same video
			*
			* @type {Array}
			* @default null
			* @public
			*/
			sources: null,
			
			/**
			* When `true`, the video player is resized after metadata is loaded, based on the 
			* [_aspectRatio_]{@link moon.VideoPlayer#aspectRatio} contained in the metadata. This 
			* applies only to [inline]{@link moon.VideoPlayer#inline} mode--i.e., when 
			* `inline: true`.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			autoResize: false,
			
			/**
			* Video aspect ratio, specified as `width:height`, or `none`.  When an aspect ratio is 
			* specified at render time, the player's height or width will be updated to respect the 
			* ratio, depending on whether [_fixedHeight_]{@link moon.VideoPlayer#fixedHeight} is
			* `true` or `false`. If [_autoResize_]{@link moon.VideoPlayer#autoResize} is `true`, the
			* _aspectRatio_ will be updated based on the metadata for the current video and the 
			* player will be resized accordingly. This applies only to inline mode.
			*
			* @type {String}
			* @default '16:9'
			* @public
			*/
			aspectRatio: '16:9',

			/**
			* When `true`, the width will be adjusted at render time based on the observed height 
			* and the aspect ratio. When `false` (the default), the height will be adjusted at 
			* render time based on the observed width and the aspect ratio. This property is ignored
			* if [_aspectRatio_]{@link moon.VideoPlayer#aspectRatio} is `none` or a falsy value. In
			* addition, this applies only to inline mode.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			fixedHeight: false,

			/**
			* Amount of time (in milliseconds) after which control buttons are automatically hidden.
			*
			* @type {Number}
			* @default 7000
			* @public
			*/
			autoCloseTimeout: 7000,

			/** 
			* Duration of the video
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			duration: 0,
			
			/** 
			* When `true`, playback starts automatically when video is loaded.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			autoplay: false,

			/**
			* When `false`, fullscreen video control overlays (info or transport) are not shown or 
			* hidden automatically in response to _up/down_ events.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			autoShowOverlay: true,

			/**
			* When `true`, the overlay will be shown in response to pointer movement (in addition to
			* _up/down_ events).
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			shakeAndWake: false,

			/**
			* When `false`, the top _infoComponents_ are not automatically shown or hidden in 
			* response to _up_ events}.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			autoShowInfo: true,

			/**
			* When `false`, the bottom slider/controls are not automatically shown or hidden in 
			* response to _down_ events.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			autoShowControls: true,

			/**
			* When `true`, the top _infoComponents_ are shown with no timeout; when `false`, they 
			* are shown based on [_autoShow_]{@link moon.VideoPlayer#autoShow} property values.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			showInfo: false,

			/**
			* When `false`, the player starts in fullscreen mode; when `true`, it starts in inline 
			* mode.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			inline: false,

			/**
			* Amount of time (in seconds) to jump in response to jump buttons. This value is ignored
			* when [_jumpStartEnd_]{@link moon.VideoPlayer#jumpStartEnd} is `true`.
			*
			* @type {Number}
			* @default 30
			* @public
			*/
			jumpSec: 30,

			/**
			* When `true`, the jump forward and jump back buttons jump to the start and end of the 
			* video, respectively.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			jumpStartEnd: false,

			/**
			* When `true`, popups opened from _VideoPlayer_ client controls are automatically 
			* hidden.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			autoHidePopups: true,

			/**
			* When `false`, the progress bar is removed and any additional controls are moved 
			* downward.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			showProgressBar: true,

			/**
			* When `false`, the transport controls are removed, but the icon button area is kept.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			showPlaybackControls: true,

			/** 
			* When `true`, playback controls are hidden when the slider is hovered over.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			hideButtonsOnSlider: true,

			/**
			* When `true`, the slider is disabled and will not be enabled when video data has 
			* loaded.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disableSlider: false,

			/** 
			* When `false`, the jump forward and jump back buttons are hidden.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			showJumpControls: true, 
			
			/** 
			* When `true`, the fast-forward and rewind buttons are visible.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			showFFRewindControls: false,
			
			/**
			* When `true`, the slider and playback controls are disabled. If the user taps the 
			* controls, an 
			* [_onPlaybackControlsTapped_]{@link enyo.VideoPlayer#event:onPlaybackControlsTapped} 
			* event will be bubbled.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disablePlaybackControls: false,

			/**
			* When `true`, playback controls are only active when the video player has a valid 
			* source URL and no errors occur during video loading.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			disablePlaybackControlsOnUnload: true,

			/** 
			* When `false`, the Play/Pause control is hidden.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			showPlayPauseControl: true,
			
			/** 
			* When `false`, the video element is hidden.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			showVideo: true,

			/**
			* When `true`, a spinner is automatically shown when video is in play state but is still
			* loading/buffering.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			autoShowSpinner: true,

			/**
			* Source of image file to show when video isn't available or user has not yet tapped the
			* play button
			*
			* @type {String}
			* @default ''
			* @public
			*/
			poster: '',

			/**
			* When `false`, video player doesn't respond to remote controller.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			handleRemoteControlKey: true,

			/** 
			* Base URL for icons
			*
			* @private
			*/
			iconPath: '$lib/moonstone/images/video-player/',
			
			/** 
			* Icon font or image files
			*
			* @private
			*/
			jumpBackIcon: 'skipbackward',

			/** 
			* Icon font or image files
			*
			* @private
			*/
			rewindIcon: 'backward',

			/** 
			* Icon font or image files
			*
			* @private
			*/
			playIcon: 'play',

			/** 
			* Icon font or image files
			*
			* @private
			*/
			pauseIcon: 'pause',

			/** 
			* Icon font or image files
			*
			* @private
			*/
			fastForwardIcon: 'forward',

			/** 
			* Icon font or image files
			*
			* @private
			*/
			jumpForwardIcon: 'skipforward',

			/** 
			* Icon font or image files
			*
			* @private
			*/
			moreControlsIcon: 'arrowextend',

			/** 
			* Icon font or image files
			*
			* @private
			*/
			lessControlsIcon: 'arrowshrink',

			/** 
			* Icon font or image files
			*
			* @private
			*/
			inlinePlayIcon: 'play',

			/** 
			* Icon font or image files
			*
			* @private
			*/
			inlinePauseIcon: 'pause',

			/** 
			* Icon font or image files
			*
			* @private
			*/
			inlineFullscreenIcon: 'fullscreen',

			/** 
			* Default hash of playback states and their associated playback rates
			* playbackRateHash: {
			*	fastForward: ['2', '4', '8', '16'],
			*	rewind: ['-2', '-4', '-8', '-16'],
			*	slowForward: ['1/4', '1/2'],
			*	slowRewind: ['-1/2', '-1']
			* }
			*
			* @private
			*/
			playbackRateHash: {
				fastForward: ['2', '4', '8', '16'],
				rewind: ['-2', '-4', '-8', '-16'],
				slowForward: ['1/4', '1/2', '1'],
				slowRewind: ['-1/2', '-1']
			}
		},
		
		/**
		* @private
		*/
		handlers: {
			onRequestTimeChange: 'timeChange',
			onRequestToggleFullscreen: 'toggleFullscreen',
			onSpotlightKeyUp: 'resetAutoTimeout',
			onSpotlightKeyDown: 'spotlightKeyDownHandler',
			onSpotlightUp: 'spotlightUpHandler',
			onSpotlightDown: 'spotlightDownHandler',
			onSpotlightLeft: 'spotlightLeftRightFilter',
			onSpotlightRight: 'spotlightLeftRightFilter',
			onresize: 'handleResize'
		},
		
		/**
		* @private
		*/
		eventsToCapture: {
			onSpotlightFocus: 'capturedFocus'
		},

		/**
		* @private
		*/
		bindings: [
			{from: '.src',						to:'.$.video.src'},
			{from: '.sources',					to:'.$.video.sourceComponents'},
			{from: '.playbackRateHash',			to:'.$.video.playbackRateHash'},
			{from: '.poster',					to:'.$.video.poster'},
			{from: '.constrainToBgProgress',	to:'.$.slider.constrainToBgProgress'},
			{from: '.elasticEffect',			to:'.$.slider.elasticEffect'},
			{from: '.showJumpControls',			to:'.$.jumpForward.showing'},
			{from: '.showJumpControls',			to:'.$.jumpBack.showing'},
			{from: '.showFFRewindControls',		to:'.$.fastForward.showing'},
			{from: '.showFFRewindControls',		to:'.$.rewind.showing'},
			{from: '.showPlayPauseControl',		to:'.$.fsPlayPause.showing'},
			{from: '.showVideo',				to:'.$.videoContainer.showing'}
		],

		/**
		* @private
		*/
		observers: {
			updateSource: ['src', 'sources']
		},
		
		/**
		* @private
		*/
		_isPlaying: false,

		/**
		* @private
		*/
		_canPlay: false,

		/**
		* @private
		*/
		_autoCloseTimer: null,

		/**
		* @private
		*/
		_currentTime: 0,

		/**
		* @private
		*/
		_panelsShowing: false,
		
		/**
		* @private
		*/
		components: [
			{kind: 'enyo.Signals', onPanelsShown: 'panelsShown', onPanelsHidden: 'panelsHidden', onPanelsHandleFocused: 'panelsHandleFocused', onPanelsHandleBlurred: 'panelsHandleBlurred', onFullscreenChange: 'fullscreenChanged', onkeyup:'remoteKeyHandler'},
			{name: 'videoContainer', classes: 'moon-video-player-container', components: [
				{name: 'video', kind: 'enyo.Video', classes: 'moon-video-player-video',
					ontimeupdate: 'timeUpdate', onloadedmetadata: 'metadataLoaded', durationchange: 'durationUpdate', onloadeddata: 'dataloaded', onprogress: '_progress', onPlay: '_play', onpause: '_pause', onStart: '_start',  onended: '_stop',
					onFastforward: '_fastforward', onSlowforward: '_slowforward', onRewind: '_rewind', onSlowrewind: '_slowrewind',
					onJumpForward: '_jumpForward', onJumpBackward: '_jumpBackward', onratechange: 'playbackRateChange', ontap: 'videoTapped', oncanplay: '_setCanPlay', onwaiting: '_waiting', onerror: '_error'
				},
				{name: 'spinner', kind: 'moon.Spinner', classes: 'moon-video-player-spinner'}
			]},

			//* Fullscreen controls
			{name: 'fullscreenControl', classes: 'moon-video-fullscreen-control enyo-fit scrim', onmousemove: 'mousemove', components: [
			
				{name: 'videoInfoHeaderClient', showing: false, classes: 'moon-video-player-header'},
				
				{name: 'playerControl', classes: 'moon-video-player-bottom', showing: false, components: [
					{name: 'controls', kind: 'FittableColumns', rtl:false, classes: 'moon-video-player-controls', ontap: 'resetAutoTimeout', components: [
				
						{name: 'leftPremiumPlaceHolder', classes: 'moon-video-player-premium-placeholder-left'},
					
						{name: 'controlsContainer', kind: 'Panels', arrangerKind: 'CarouselArranger', fit: true, draggable: false, classes: 'moon-video-player-controls-container', components: [
							{name: 'trickPlay', ontap:'playbackControlsTapped', components: [
								{name: 'playbackControls', classes: 'moon-video-player-control-buttons', components: [
									{name: 'jumpBack',		kind: 'moon.IconButton', small: false, onholdpulse: 'onHoldPulseBackHandler', ontap: 'onjumpBackward'},
									{name: 'rewind',		kind: 'moon.IconButton', small: false, ontap: 'rewind'},
									{name: 'fsPlayPause',	kind: 'moon.IconButton', small: false, ontap: 'playPause'},
									{name: 'fastForward',	kind: 'moon.IconButton', small: false, ontap: 'fastForward'},
									{name: 'jumpForward',	kind: 'moon.IconButton', small: false, onholdpulse: 'onHoldPulseForwardHandler', ontap: 'onjumpForward'}
								]}
							]},
							{name: 'client', classes: 'moon-video-player-more-controls'}
						]},
					
						{name: 'rightPremiumPlaceHolder', classes: 'moon-video-player-premium-placeholder-right', components: [
							{name: 'moreButton', kind: 'moon.IconButton', small: false, ontap: 'moreButtonTapped'}
						]}
					]},
				
					{name: 'sliderContainer', classes: 'moon-video-player-slider-container', components: [
						{name: 'slider', kind: 'moon.VideoTransportSlider', rtl: false, disabled: true, onSeekStart: 'sliderSeekStart', onSeek: 'sliderSeek', onSeekFinish: 'sliderSeekFinish', 
							onEnterTapArea: 'onEnterSlider', onLeaveTapArea: 'onLeaveSlider', ontap:'playbackControlsTapped'
						}
					]}
				]}
			]},
			//* Inline controls
			{name: 'inlineControl', classes: 'moon-video-inline-control', components: [
				{name: 'currPosAnimator', kind: 'Animator', onStep: 'currPosAnimatorStep', onEnd: 'currPosAnimatorComplete'},
				{name: 'bgProgressStatus', classes: 'moon-video-inline-control-bgprogress'},
				{name: 'progressStatus', classes: 'moon-video-inline-control-progress'},
				{classes: 'moon-video-inline-control-text', components: [
					{name: 'currTime', content: '00:00 / 00:00'}
				]},
				{name: 'ilPlayPause', kind: 'moon.IconButton', ontap: 'playPause'},
				{name: 'ilFullscreen', kind: 'moon.VideoFullscreenToggleButton'}
			]}
		],

		/**
		* @private
		*/
		create: function() {
			this.inherited(arguments);
			this.updateSource();
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
			this.retrieveIconsSrcOrFont(this.$.jumpBack, this.jumpBackIcon, 'moon-icon-video-main-control-font-style');
			this.retrieveIconsSrcOrFont(this.$.rewind, this.rewindIcon, 'moon-icon-video-main-control-font-style');
			this.retrieveIconsSrcOrFont(this.$.fastForward, this.fastForwardIcon, 'moon-icon-video-main-control-font-style');
			this.retrieveIconsSrcOrFont(this.$.jumpForward, this.jumpForwardIcon, 'moon-icon-video-main-control-font-style');
			this.retrieveIconsSrcOrFont(this.$.ilFullscreen, this.inlineFullscreenIcon, 'moon-video-inline-control-fullscreen');
			this.$.ilFullscreen.removeClass('moon-icon-video-round-controls-style moon-icon-exitfullscreen-font-style');
			if (window.ilib) {
				this.durfmt = new ilib.DurFmt({length: 'medium', style: 'clock', useNative: false});
			}
		},

		/**
		* @private
		*/
		checkIconType: function(icon) {
			var imagesrcRegex=/\.(jpg|jpeg|png|gif)$/i;
			var iconType=imagesrcRegex.test(icon)?'image':'iconfont';
			return iconType;
		},

		/**
		* @private
		*/
		transformIconSrc: function(icon) {
			var iconPath=Boolean(this.checkIconType(icon)=='image')?(this.iconPath+icon):icon;
			return iconPath;
		},

		/**
		* @private
		*/
		disablePlaybackControlsChanged: function() {
			this.updatePlaybackControlState();
		},

		/**
		* @private
		*/
		disablePlaybackControlsOnUnloadChanged: function() {
			this.updatePlaybackControlState();
		},

		/**
		* @private
		*/
		updatePlaybackControlState: function() {
			var disabled = this.disablePlaybackControls || 
				this._panelsShowing || 
				(this.disablePlaybackControlsOnUnload && (this._errorCode || (!this.getSrc() && !this.getSources()) ));
			this.updateSliderState();
			this.$.playbackControls.addRemoveClass('disabled', disabled);
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

		/**
		* @private
		*/
		playbackControlsTapped: function() {
			if (this.disablePlaybackControls) {
				this.bubble('onPlaybackControlsTapped');
			}
		},

		/**
		* @private
		*/
		rendered: function() {
			this.inherited(arguments);
			//* Change aspect ratio based on initialAspectRatio
			this.aspectRatioChanged();
		},

		/**
		* @private
		*/
		showPlaybackControlsChanged: function(was) {
			this.$.trickPlay.set('showing', this.showPlaybackControls);
			this.$.moreButton.set('showing', this.showPlaybackControls && this.clientComponentsCount > 2);
			this.toggleSpotlightForMoreControls(!this.showPlaybackControls);
			this.$.client.addRemoveClass('moon-video-player-more-controls', this.showPlaybackControls);
		},

		/**
		* @private
		*/
		showProgressBarChanged: function(was) {
			this.$.sliderContainer.setShowing(this.showProgressBar);
		},

		/**
		* @private
		*/
		updateSource: function(old, value, source) {
			this._canPlay = false;
			this._isPlaying = this.autoplay;
			this._errorCode = null;
			this.updatePlayPauseButtons();
			this.updateSpinner();
			this.updatePlaybackControlState();
			this._resetTime();

			// since src and sources are mutually exclusive, clear the other property
			// when one changes
			if (source === 'src') {
				this.sources = null;
			} else if (source === 'sources') {
				this.src = '';
			}
		},

		/** 
		* Returns the underlying _enyo.Video_ control (wrapping the HTML5 video node).
		*
		* @returns {enyo.Video} An {@link enyo.Video} control.
		* @public
		*/
		getVideo: function() {
			return this.$.video;
		},

		/**
		* @private
		*/
		createInfoControls: function() {
			var owner = this.hasOwnProperty('infoComponents') ? this.getInstanceOwner() : this;
			this.$.videoInfoHeaderClient.createComponents(this.infoComponents, {owner: owner});
		},

		/**
		* @private
		*/
		createClientComponents: function(comps) {
			comps = (comps) ? enyo.clone(comps) : [];
			this.clientComponentsCount = comps.length;
			if (!this._buttonsSetup) {
				this._buttonsSetup = true;
				if (!comps || comps.length === 0) {
					// No components - destroy more button
					this.$.leftPremiumPlaceHolder.hide();
					this.$.rightPremiumPlaceHolder.hide();		
				} else if (comps.length <= 2) {
					// One or two components - destroy more button and utilize left/right premium placeholders
					this.$.leftPremiumPlaceHolder.createComponent(comps.shift(), {owner: this.getInstanceOwner()});
					if (comps.length === 1) {
						this.$.rightPremiumPlaceHolder.createComponent(comps.shift(), {owner: this.getInstanceOwner()});
					}
				} else {
					// More than two components - use extra panel, with left premium plaeholder for first component
					this.$.leftPremiumPlaceHolder.createComponent(comps.shift(), {owner: this.getInstanceOwner()});
				}
				// Create the rest of the components in the client (panels)
				this.createComponents(comps, {owner: this.getInstanceOwner()});
			} else {
				this.inherited(arguments);
			}
		},

		/**
		* @private
		*/
		playIconChanged: function() {
			this.updatePlayPauseButtons();
		},

		/**
		* @private
		*/
		pauseIconChanged: function() {
			this.updatePlayPauseButtons();
		},

		/**
		* @private
		*/
		inlinePlayIconChanged: function() {
			this.updatePlayPauseButtons();
		},

		/**
		* @private
		*/
		inlinePauseIconChanged: function() {
			this.updatePlayPauseButtons();
		},

		/**
		* @private
		*/
		moreControlsIconChanged: function() {
			this.updateMoreButton();
		},

		/**
		* @private
		*/
		lessControlsIconChanged: function() {
			this.updateMoreButton();
		},

		/**
		* @private
		*/
		autoplayChanged: function() {
			this.$.video.setAutoplay(this.autoplay);
			this._isPlaying = this.autoplay;
			this.updatePlayPauseButtons();
			this.updateSpinner();
		},

		/**
		* @private
		*/
		jumpSecChanged: function() {
			this.$.video.setJumpSec(this.jumpSec);
		},

		/**
		* @private
		*/
		disableSliderChanged: function() {
			this.updateSliderState();
		},

		/**
		* @private
		*/
		updateSliderState: function() {
			//* this should be be called on create because default slider status should be disabled.
			var disabled = 
				this.disableSlider || 
				this.disablePlaybackControls || 
				!this._loaded || 
				(this.disablePlaybackControlsOnUnload && (this._errorCode || (!this.getSrc() && !this.getSources()) ));
			this.$.slider.setDisabled(disabled);
		},

		/**
		* @private
		*/
		autoShowOverlayChanged: function() {
			this.autoShowInfoChanged();
			this.autoShowControlsChanged();
			if (this.autoShowOverlay) {
				this.resetAutoTimeout();
			}
		},

		/**
		* @private
		*/
		autoShowInfoChanged: function() {
			if (this.$.videoInfoHeaderClient.getShowing() && !this.autoShowInfo && !this.showInfo) {
				this.$.videoInfoHeaderClient.hide();
			}
			if (this.autoShowInfo) {
				this.resetAutoTimeout();
			}
		},

		/**
		* @private
		*/
		autoShowControlsChanged: function() {
			if (this.$.playerControl.getShowing() && !this.autoShowControls) {
				this.$.playerControl.hide();
			}
			if (this.autoShowControls) {
				this.resetAutoTimeout();
			}
		},

		/**
		* @private
		*/
		showInfoChanged: function() {
			this.$.videoInfoHeaderClient.setShowing(this.showInfo);
			
			if (this.showInfo) {
				// Kick off any marquees in the video info header
				this.$.videoInfoHeaderClient.waterfallDown('onRequestStartMarquee');
			}
		},

		/**
		* @private
		*/
		inlineChanged: function() {
			// Force fullscreen
			this.addRemoveClass('enyo-fullscreen enyo-fit', !this.inline);
			// show hide controls visibility
			this.$.inlineControl.setShowing(this.inline);
			this.$.fullscreenControl.setShowing(!this.inline);
			if (!this.inline) {
				this.$.inlineControl.canGenerate = false;
			}
			this.spotlight = !this.inline;
		},
		
		/** 
		* Unloads the current video source, stopping all playback and buffering.
		*
		* @public
		*/
		unload: function() {
			this.$.video.unload();
			this._resetTime();
			this._loaded = false;
			this._isPlaying = false;
			this._canPlay = false;
			this._errorCode = null;
			this.src = '';
			this.updatePlaybackControlState();
			this.updateSpinner();
		},
		showScrim: function(show) {
			this.$.fullscreenControl.addRemoveClass('scrim', !show);
		},

		/**
		* @private
		*/
		updateSpotability: function() {
			var spotState = this._panelsShowing ? false : (this._controlsShowing ? 'container' : true);
			this.updatePlaybackControlState();
			this.set('spotlight', spotState);
			this.$.leftPremiumPlaceHolder.spotlightDisabled = this._panelsShowing;
			this.$.rightPremiumPlaceHolder.spotlightDisabled = this._panelsShowing;
		},

		/**
		* @private
		*/
		panelsShown: function(sender, e) {
			this._panelsShowing = true;
			this._controlsShowing = false;
			this._infoShowing = false;
			this.updateSpotability();
			if (e.initialization) {
				return;
			}

			if ((this.isFullscreen() || !this.getInline()) && this.isOverlayShowing()) {
				this.hideFSControls();
				enyo.Spotlight.unspot();
			}
		},

		/**
		* @private
		*/
		panelsHidden: function(sender, e) {
			this._panelsShowing = false;
			this.updateSpotability();
			if (!enyo.Spotlight.getCurrent().isDescendantOf(this)) {
				enyo.Spotlight.spot(this);
			}
		},

		/**
		* @private
		*/
		panelsHandleFocused: function(sender, e) {
			this._infoShowing = this.$.videoInfoHeaderClient.getShowing();
			this._controlsShowing = this.$.playerControl.getShowing();
			this.hideFSControls(true);
		},

		/**
		* @private
		*/
		panelsHandleBlurred: function(sender, e) {
			if (this.isLarge() && !this.isOverlayShowing()) {
				if (this._infoShowing) {
					this.showFSInfo();
				}
				if (this._controlsShowing) {
					this.showFSBottomControls();
				}
			}
		},

		/**
		* @private
		*/
		isLarge: function() {
			return this.isFullscreen() || !this.get('inline');
		},

		/**
		* @private
		*/
		spotlightLeftRightFilter: function(sender, e) {
			return this.spotlightModal && e.originator === this;
		},

		/**
		* @private
		*/
		spotlightUpHandler: function(sender, e) {
			if (this._shouldHandleUpDown) {
				// Toggle info header on 'up' press
				if (e.originator !== this.$.slider) {
					if (!this.$.videoInfoHeaderClient.getShowing()) {
						this.showFSInfo();
					} else {
						this.hideFSInfo();
					}
				}
				return true;
			}
		},

		/**
		* @private
		*/
		spotlightDownHandler: function(sender, e) {
			if (this._shouldHandleUpDown) {
				// Toggle info header on 'down' press
				if (!this.$.playerControl.getShowing()) {
					this.showFSBottomControls();
				} else {
					this.hideFSBottomControls();
				}
				return true;
			}
		},

		/**
		* @private
		*/
		spotlightKeyDownHandler: function(sender, e) {
			this._shouldHandleUpDown = this.isLarge() && (e.originator === this || enyo.Spotlight.getParent(e.originator) === this);
		},

		///// Fullscreen controls /////


		/**
		* @private
		*/
		_holdPulseThreadhold: 400,

		/**
		* @private
		*/
		_holding: false,

		/**
		* @private
		*/
		_sentHold: false,

		/** 
		* Returns true if any piece of the overlay is showing.
		*
		* @private
		*/
		isOverlayShowing: function() {
			return this.$.videoInfoHeaderClient.getShowing() || this.$.playerControl.getShowing();
		},

		/** 
		* Resets the timeout, or wakes the overlay.
		*
		* @private
		*/
		mousemove: function(sender, e) {
			if (this.isOverlayShowing()) {
				this.resetAutoTimeout();
			} else if (this.shakeAndWake) {
				this.showFSControls();
			}
		},
		//* Sets _this.visible_ to true and clears hide job.
		showFSControls: function(sender, e) {
			this.showFSInfo();
			this.showFSBottomControls();
		},
		hideFSControls: function(spottingHandled) {
			if (this.isOverlayShowing()) {
				this.hideFSInfo();
				this.hideFSBottomControls();
			}
			if (!spottingHandled) {
				enyo.Spotlight.setPointerMode(false);
				enyo.Spotlight.spot(this);
			}
			this.stopJob('autoHide');
		},
		//* Sets _this.visible_ to true and clears hide job.
		showFSBottomControls: function(sender, e) {
			if (this.autoShowOverlay && this.autoShowControls) {
				this.resetAutoTimeout();
				this.showScrim(true);
				this.$.playerControl.setShowing(true);
				this.$.playerControl.resize();
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
				this.set('spotlight', 'container');
			}
		},

		/**
		* @private
		*/
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

		/** 
		* Sets _this.visible_ to false.
		*
		* @private
		*
		*/
		hideFSBottomControls: function() {
			// When controls are hidden, set as just a spotlight true component, 
			// so that it is spottable (since it won't have any spottable children),
			// and then spot itself
			this.set('spotlight', true);
			// Only spot the player if hiding is triggered from player control
			if (enyo.Spotlight.hasCurrent() && enyo.Spotlight.getParent(enyo.Spotlight.getCurrent()) === this) {
				enyo.Spotlight.spot(this);
			}
			if (this.autoHidePopups) {
				// Hide enyo.Popup-based popups (including moon.Popup)
				this.$.playerControl.waterfall('onRequestHide');
				// Hide moon.ContextualPopups
				this.$.playerControl.waterfall('onRequestHidePopup');
			}
			this.showScrim(false);
			this.$.playerControl.setShowing(false);
		},
		//* Sets _this.visible_ to true and clears hide job.
		showFSInfo: function() {
			if (this.autoShowOverlay && this.autoShowInfo) {
				this.resetAutoTimeout();
				this.$.videoInfoHeaderClient.setShowing(true);
				this.$.videoInfoHeaderClient.resize();
				
				// Kick off any marquees in the video info header
				this.$.videoInfoHeaderClient.waterfallDown('onRequestStartMarquee');
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
				this.startJob('autoHide', this.bindSafely('hideFSControls'), this.getAutoCloseTimeout());
			}
		},
		//* Toggles play/pause state based on _this.playing_.
		playPause: function(sender, e) {
			if (this._isPlaying) {
				this.pause(sender, e);
			} else {
				this.play(sender, e);
			}
			return true;
		},

		/**
		* @private
		*/
		onHoldPulseBackHandler: function(sender, e) {
			if (!this.jumpStartEnd) {
				if (e.holdTime > this._holdPulseThreadhold) {
					if (sender._sentHold !== true) {
						this.jumpToStart(sender, e);
						sender._sentHold = true;
						return true;
					}
				} else {
					sender._holding = true;
					sender._sentHold = false;
				}
			}
		},

		/**
		* @private
		*/
		onHoldPulseForwardHandler: function(sender, e) {
			if (!this.jumpStartEnd) {
				if (e.holdTime > this._holdPulseThreadhold) {
					if (sender._sentHold !== true) {
						this.jumpToEnd(sender, e);
						sender._sentHold = true;
						return true;
					}
				} else {
					sender._holding = true;
					sender._sentHold = false;
				}
			}
		},

		/**
		* @private
		*/
		onEnterSlider: function(sender, e) {
			if (this.hideButtonsOnSlider) {
				this.$.controls.setShowing(false);
			}
		},

		/**
		* @private
		*/
		onLeaveSlider: function(sender, e) {
			if (this.hideButtonsOnSlider && !this.$.slider.isDragging()) {
				this.$.controls.setShowing(true);
			}
		},

		/**
		* @private
		*/
		onjumpBackward: function(sender, e) {
			if (this.jumpStartEnd) {
				this.jumpToStart(sender, e);
			} else {
				if (!sender._holding || (sender._holding && sender._sentHold !== true)) {
					this.jumpBackward(sender, e);
				}
				sender._holding = false;
			}
		},

		/**
		* @private
		*/
		onjumpForward: function(sender, e) {
			if (this.jumpStartEnd) {
				this.jumpToEnd(sender, e);
			} else {
				if (!sender._holding || (sender._holding && sender._sentHold !== true)) {
					this.jumpForward(sender, e);
				}
				sender._holding = false;
			}
		},

		/**
		* @private
		*/
		sendFeedback: function(msg, params, persist, leftSrc, rightSrc) {
			params = params || {};
			this.$.slider.feedback(msg, params, persist, leftSrc, rightSrc);
		},

		////// Slider event handling //////

		/** 
		* When seeking starts, pauses video.
		*
		* @private
		*/
		sliderSeekStart: function(sender, e) {
			this._isPausedBeforeDrag = this.$.video.isPaused();
			this.pause();
			return true;
		},

		/** 
		* When seeking completes, plays video.
		*
		* @private
		*/
		sliderSeekFinish: function(sender, e) {
			if (e.value < this._duration - 1) {
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
			this.setCurrentTime(e.value);
			return true;
		},

		/** 
		* When seeking, sets video time.
		*
		* @private
		*/
		sliderSeek: function(sender, e) {
			this.setCurrentTime(e.value);
			return true;
		},

		/** 
		* Programatically updates slider position to match _this.currentTime_/_this.duration_.
		*
		* @private
		*/
		updateFullscreenPosition: function() {
			if (this.$.slider.isDragging()) {
				return;
			}
			this.$.slider.setValue(this._currentTime);
		},

		/**
		* @private
		*/
		capture: function () {
			enyo.dispatcher.capture(this, this.eventsToCapture);
		},
		
		/**
		* @private
		*/
		release: function () {
			enyo.dispatcher.release(this);
		},
		
		/**
		* @private
		*/
		capturedFocus: function (sender, event) {
			enyo.Spotlight.spot(this);
			return true;
		},

		///// Inline controls /////

		/**
		* @private
		*/
		updateInlinePosition: function() {
			var percentComplete = this._duration ? Math.round(this._currentTime * 1000 / this._duration) / 10 : 0;
			this.$.progressStatus.applyStyle('width', percentComplete + '%');
			this.$.currTime.setContent(this.formatTime(this._currentTime) + ' / ' + this.formatTime(this._duration));
		},

		/**
		* @private
		*/
		videoTapped: function() {
			if (this.getInline() && !this.isFullscreen()) {
				this.playPause();
			}
		},

		/** 
		* Toggles fullscreen state.
		*
		* @public
		*/
		toggleFullscreen: function() {
			if (this.isFullscreen()) {
				this.cancelFullscreen();
			} else {
				this.requestFullscreen();
			}
		},
		
		/**
		* @private
		*/
		fullscreenChanged: function(sender, e) {
			enyo.Spotlight.unspot();
			if (this.isFullscreen()) {
				this.$.ilFullscreen.undepress();
				this.$.ilFullscreen.removeClass('moon-icon-video-round-controls-style moon-icon-exitfullscreen-font-style');
				this.spotlight = true;
				this.spotlightModal = true;
				this.removeClass('inline');
				this.$.inlineControl.setShowing(false);
				this.$.fullscreenControl.setShowing(true);
				this.showFSControls();
				this.$.controlsContainer.resize();
				this.capture();
			} else {
				this.release();
				this.stopJob('autoHide');
				this.addClass('inline');
				this.$.inlineControl.setShowing(true);
				this.$.fullscreenControl.setShowing(false);
				enyo.Spotlight.spot(this.$.ilFullscreen);
				this.spotlight = false;
				this.spotlightModal = false;
			}
		},

		/** 
		* Facades _this.$.video.play()_.
		*
		* @public
		*/
		play: function() {
			this.currTimeSync = true;
			this._isPlaying = true;
			this.$.video.play();
			this.updatePlayPauseButtons();
			this.updateSpinner();
		},
		
		/** 
		* Facades _this.$.video.pause()_.
		*
		* @public
		*/
		pause: function() {
			this._isPlaying = false;
			this.$.video.pause();
			this.updatePlayPauseButtons();
			this.updateSpinner();
		},
		
		/** 
		* Facades _this.$.video.rewind()_.
		*
		* @public
		*/
		rewind: function() {
			this._isPlaying = false;
			this.$.video.rewind();
			this.updatePlayPauseButtons();
			this.updateSpinner();
		},

		/** 
		* Facades _this.$.video.jumpToStart()_.
		*
		* @public
		*/
		jumpToStart: function() {
			this.$.video.jumpToStart();
			this.updatePlayPauseButtons();
			this.updateSpinner();
			if(this._isPlaying){
				this.$.video.play();
			}
		},

		/** 
		* Facades _this.$.video.jumpBackward()_.
		*
		* @public
		*/
		jumpBackward: function() {
			this.$.video.jumpBackward();
			this.updatePlayPauseButtons();
			this.updateSpinner();
		},

		/** 
		* Facades _this.$.video.fastForward()_.
		*
		* @public
		*/
		fastForward: function() {
			this._isPlaying = false;
			this.$.video.fastForward();
			this.updatePlayPauseButtons();
			this.updateSpinner();
		},

		/** 
		* Facades _this.$.video.jumpToEnd()_.
		*
		* @public
		*/
		jumpToEnd: function() {
			this._isPlaying = false;
			if ( this.$.video.isPaused() ) {
				//* Make video able to go futher than the buffer
				this.$.video.play();
			}
			this.$.video.jumpToEnd();
			this.updatePlayPauseButtons();
			this.updateSpinner();
		},

		/** 
		* Facades _this.$.video.jumpForward()_.
		*
		* @public
		*/
		jumpForward: function() {
			this.$.video.jumpForward();
			this.updatePlayPauseButtons();
			this.updateSpinner();
		},

		/** 
		* Facades _this.$.video.setCurrentTime()_.
		*
		* @param {Number} val The current time to set the video to, in seconds.
		* @public
		*/
		setCurrentTime: function(val) {
			this.$.video.setCurrentTime(val);
		},

		/** 
		* Responds to _onRequestTimeChange_ event by setting current video time.
		*
		* @private
		*/
		timeChange: function(sender, e) {
			this.setCurrentTime(e.value);
		},

		/** 
		* Refreshes size of video player.
		*
		* @private
		*/
		handleResize: function() {
			this.aspectRatioChanged();
		},

		/** 
		* Updates the height/width based on the video's aspect ratio.
		*
		* @private
		*/
		aspectRatioChanged: function() {
			// Case 5: Fixed size provided by user
			if (!this.inline || this.aspectRatio == 'none' || !this.aspectRatio) { return; }

			var videoAspectRatio = null,
				width = this.getComputedStyleValue('width'),
				height = this.getComputedStyleValue('height'),
				ratio = 1;
			
			videoAspectRatio = this.aspectRatio.split(':');
			
			// If fixedHeight is true, update width based on aspect ratio
			if (this.fixedHeight) {
				// Case 2: Automatic resize based on video aspect ratio (fixed height):
				// Case 4: Fixed aspect ratio provided by user (fixed-height):
				ratio = videoAspectRatio[0] / videoAspectRatio[1];
				this.applyStyle('width', ((parseInt(height, 10) * ratio)) + 'px');
			// If fixedHeight is false, update height based on aspect ratio
			} else if (!this.fixedHeight) {
				// Case 1: Automatic resize based on video aspect ratio (fixed width):
				// Case 3: Fixed aspect ratio provided by user (fixed-width):
				ratio = videoAspectRatio[1] / videoAspectRatio[0];
				this.applyStyle('height', ((parseInt(width, 10) * ratio)) + 'px');
			}
		},

		/**
		* @private
		*/
		updatePosition: function() {
			this.updateFullscreenPosition();
			this.updateInlinePosition();
		},
		
		/** 
		* Properly formats time.
		*
		* @private
		*/
		formatTime: function(val) {
			var hour = Math.floor(val / (60*60));
			var min = Math.floor((val / 60) % 60);
			var sec = Math.floor(val % 60);
			if (this.durfmt) {
				var time = {minute: min, second: sec};
				if (hour) {
					time.hour = hour;
				}
				return this.durfmt.format(time);
			} else {
				return (hour ? this.padDigit(hour) + ':' : '') + this.padDigit(min) + ':' + this.padDigit(sec);
			}
		},

		/** 
		* Format time helper
		*
		* @private
		*/
		padDigit: function(val) {
			return (val) ? (String(val).length < 2) ? '0'+val : val : '00';
		},

		/** 
		* Switches play/pause buttons as appropriate.
		*
		* @private
		*/
		updatePlayPauseButtons: function() {
			if (this._isPlaying) {
				this.retrieveIconsSrcOrFont(this.$.fsPlayPause, this.pauseIcon, 'moon-icon-playpause-font-style');
			} else {
				this.retrieveIconsSrcOrFont(this.$.fsPlayPause, this.playIcon, 'moon-icon-playpause-font-style');
			}
			if (this._isPlaying) {
				this.retrieveIconsSrcOrFont(this.$.ilPlayPause, this.inlinePauseIcon, 'moon-video-inline-control-play-pause');
			} else {
				this.retrieveIconsSrcOrFont(this.$.ilPlayPause, this.inlinePlayIcon, 'moon-video-inline-control-play-pause');
			}
		},
		
		/**
		* Retrieve icons -- either through setSrc or setIcon depending on the iconType.
		*
		* @private
		*/
		retrieveIconsSrcOrFont:function(src, icon, classes){
			var t = this.bindSafely('transformIconSrc');
			if(this.checkIconType(icon) == 'image') {
				src.setIcon('');
				src.setSrc(t(icon));
				if(src !== this.$.ilPlayPause){
					src.addRemoveClass(classes, Boolean(this.checkIconType(icon) == 'iconfont'));
				}
				src.addRemoveClass('moon-icon-', Boolean(this.checkIconType(icon) == 'iconfont'));
				src.addRemoveClass('"moon-icon-' + icon + '"', Boolean(this.checkIconType(icon) == 'iconfont'));
			}
			if(this.checkIconType(icon) == 'iconfont') {
				src.setSrc('');
				src.setIcon(t(icon));
				src.addRemoveClass(classes, Boolean(this.checkIconType(icon) == 'iconfont'));
				src.applyStyle('background-image', src.src);
			}
		},

		/** 
		* Turns spinner on or off, as appropriate.
		*
		* @private
		*/
		updateSpinner: function() {
			var spinner = this.$.spinner;
			if (this.autoShowSpinner && this._isPlaying && !this._canPlay && !this._errorCode) {
				spinner.start();
			} else if (spinner.getShowing()) {
				spinner.stop();
			}
		},

		/**
		* @private
		*/
		autoShowSpinnerChanged: function() {
			this.updateSpinner();
		},

		/**
		* When _moreButton_ is tapped, toggles visibility of player controls and extra 
		* functionality.
		*
		* @private
		*/
		moreButtonTapped: function(sender, e) {
			var index = this.$.controlsContainer.getIndex();
			if (index === 0) {
				this.retrieveIconsSrcOrFont(this.$.moreButton, this.lessControlsIcon, 'moon-icon-video-round-controls-style moon-icon-video-more-controls-font-style');
				this.toggleSpotlightForMoreControls(true);
				this.$.controlsContainer.next();
			} else {
				this.retrieveIconsSrcOrFont(this.$.moreButton, this.moreControlsIcon, 'moon-icon-video-round-controls-style moon-icon-video-more-controls-font-style');
				this.toggleSpotlightForMoreControls(false);
				this.$.controlsContainer.previous();
			}
		},
		updateMoreButton: function() {
			var index = this.$.controlsContainer.getIndex();
			if (index === 0) {
				this.retrieveIconsSrcOrFont(this.$.moreButton, this.moreControlsIcon, 'moon-icon-video-round-controls-style moon-icon-video-more-controls-font-style');
			} else {
				this.retrieveIconsSrcOrFont(this.$.moreButton, this.lessControlsIcon, 'moon-icon-video-round-controls-style moon-icon-video-more-controls-font-style');
			}
		},
		toggleSpotlightForMoreControls: function(moreControlsSpottable) {
			this.$.playbackControls.spotlightDisabled = moreControlsSpottable;
			this.$.client.spotlightDisabled = !moreControlsSpottable;
		},

		///////// VIDEO EVENT HANDLERS /////////

		/** 
		* Updates the video time.
		*
		* @private
		*/
		timeUpdate: function(sender, e) {
			//* Update _this.duration_ and _this.currentTime_
			if (!e && e.srcElement) {
				return;
			}

			this._duration = e.duration;
			this._currentTime = e.currentTime;

			this.updatePosition();

			// TODO: Event handler shouldn't know about event delegates.
			// Waterfall should handle this automatically.
			// See https://enyojs.atlassian.net/browse/ENYO-3188
			delete e.delegate;
			this.waterfall('onTimeupdate', e);
		},

		/** 
		* Called when video successfully loads video metadata.
		*
		* @private
		*/
		metadataLoaded: function(sender, e) {
			//* Update aspect ratio based on actual video aspect ratio when autoResize is true.
			if (this.autoResize && this.$.video) {
				this.setAspectRatio(this.$.video.getAspectRatio());
			}
			this.durationUpdate(sender, e);
		},

		/**
		* @private
		*/
		durationUpdate: function(sender, e) {
			this._duration = this.$.video.getDuration();
			this._currentTime = this.$.video.getCurrentTime();

			this.$.slider.setMin(0);
			this.$.slider.setMax(this._duration);

			this.updatePosition();

			this.waterfall('onTimeupdate', e);
		},

		/**
		* @private
		*/
		_loaded: false,

		/**
		* @private
		*/
		dataloaded: function(sender, e) {
			this._loaded = true;
			this.updateSliderState();
			this.durationUpdate(sender, e);
		},

		/**
		* @private
		*/
		_getBufferedProgress: function(node) {
			var bufferData = node.buffered,
				numberOfBuffers = bufferData.length,
				highestBufferPoint = 0,
				duration = node.duration || 0,
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

		/** 
		* We get this event while buffering is in progress.
		*
		* @private
		*/
		_progress: function(sender, e) {
			var buffered = this._getBufferedProgress(e.srcElement);
			if (this.isFullscreen() || !this.getInline()) {
				this.$.slider.setBgProgress(buffered.value); 
			} else {
				this.$.bgProgressStatus.applyStyle('width', buffered.percent + '%');
			}
		},

		/**
		* @private
		*/
		_resetTime: function() {
			this._currentTime = 0;
			this._duration = 0;
			this.updatePosition();
			this.$.slider.setBgProgress(0);
			this.$.bgProgressStatus.applyStyle('width', 0);
		},

		/**
		* @private
		*/
		_play: function(sender, e) {
			this.sendFeedback('Play');
		},

		/**
		* @private
		*/
		_pause: function(sender, e) {
			// Don't send pause feedback if we are rewinding
			if (e.srcElement.playbackRate < 0) {
				return;
			}
			if (e.srcElement.currentTime === 0) {
				this.sendFeedback('Stop', {}, true);
				return;
			}
			this.sendFeedback('Pause', {}, true);
		},

		/**
		* @private
		*/
		_stop: function(sender, e) {
			this.pause();
			this.updatePlayPauseButtons();
			this.updateSpinner();
			this.sendFeedback('Stop');
		},

		/**
		* @private
		*/
		_fastforward: function(sender, e) {
			this.sendFeedback('Fastforward', {playbackRate: e.playbackRate}, true);
		},

		/**
		* @private
		*/
		_slowforward: function(sender, e) {
			this.sendFeedback('Slowforward', {playbackRate: e.playbackRate}, true);
		},

		/**
		* @private
		*/
		_rewind: function(sender, e) {
			this.sendFeedback('Rewind', {playbackRate: e.playbackRate}, true);
		},

		/**
		* @private
		*/
		_slowrewind: function(sender, e) {
			this.sendFeedback('Slowrewind', {playbackRate: e.playbackRate}, true);
		},

		/**
		* @private
		*/
		_jumpForward: function(sender, e) {
			this.sendFeedback('JumpForward', {jumpSize: e.jumpSize}, false);
		},

		/**
		* @private
		*/
		_jumpBackward: function(sender, e) {
			this.sendFeedback('JumpBackward', {jumpSize: e.jumpSize}, false);
		},

		/**
		* @private
		*/
		_waiting: function(sender, e) {
			this._canPlay = false;
			this.updateSpinner();
		},

		/**
		* @private
		*/
		_setCanPlay: function(sender, e) {
			this._canPlay = true;
			this.updateSpinner();
		},

		/**
		* @private
		*/
		_error: function(sender, e) {
			// Error codes in e.currentTarget.error.code
			// 1: MEDIA_ERR_ABORTED, 2: MEDIA_ERR_NETWORK, 3: MEDIA_ERR_DECODE, 4: MEDIA_ERR_SRC_NOT_SUPPORTED
			this._errorCode = e.currentTarget.error.code;
			this._loaded = false;
			this._isPlaying = false;
			this._canPlay = false;
			this.$.currTime.setContent($L('Error'));
			this._stop();
			this.updateSpinner();
			this.updatePlaybackControlState();
		},

		/**
		* @private
		*/
		remoteKeyHandler: function(sender, e) {
			if (this.handleRemoteControlKey && !this.disablePlaybackControls) {
				var showControls = false;
				switch (e.keySymbol) {
				case 'play':
					this.play(sender, e);
					showControls = true;
					break;
				case 'pause':
					this.pause(sender, e);
					showControls = true;
					break;
				case 'rewind':
					if (this.showFFRewindControls) {
						this.rewind(sender, e);
						showControls = true;
					}
					break;
				case 'fastforward':
					if (this.showFFRewindControls) {
						this.fastForward(sender, e);
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

})(enyo, this);