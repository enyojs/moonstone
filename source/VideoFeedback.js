/**
	_moon.VideoFeedback_ is a control used by	[moon.VideoPlayer](#moon.VideoPlayer)
	to display feedback in response to input from video playback controls.  It may
	also be used to display custom messages.
*/
enyo.kind({
	name: "moon.VideoFeedback",
	kind: "enyo.Control",
	//* @protected
	classes: "moon-video-player-feedback",
	//* @public
	published: {
		/**
			Length of time (in milliseconds) after which the on-screen feedback will
			automatically disappear
		*/
		autoTimeoutMS:	2000
	},
	//* @protected
	_showingFeedback: false,
	_imagePath:				"$lib/moonstone/images/video-player/",
	_jumpBackImg:			"jumpbackward",
	_rewindImg:				"backward",
	_playImg:				"play",
	_pauseImg:				"pause",
	_fastForwardImg:		"forward",
	_jumpForwardImg:		"jumpforward",
	_pauseBackImg:			"pausebackward",
	_pauseForwardImg:		"pauseforward",
	_pauseJumpBackImg:		"pausejumpbackward",
	_pauseJumpForwardImg:	"pausejumpforward",
	_autoTimer: null,

	components: [
		{name: "leftIcon", kind: "moon.Icon", classes: "moon-video-feedback-icon-left", allowHtml: true, showing: false},
		{name: "feedText",  classes: "moon-video-feedback-text", allowHtml: true, showing: false},
		{name: "rightIcon", kind: "moon.Icon", classes: "moon-video-feedback-icon-right", allowHtml: true, showing: false}
	],

	//* @public
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			if (window.ilib) {
				this.df = new ilib.DurFmt({length: "medium", useNative: false});
			}
		};
	}),

	//* @public
	/**
		Updates IconButton image and Slider message with current state and
		playback rate when any of the playback controls are triggered.

		Playback states are mapped to _playbackRate_ values according to the
		following hash:

			{
				"fastForward": ["2", "4", "8", "16"],
				"rewind": ["-2", "-4", "-8", "-16"],
				"slowForward": ["1/4", "1/2"],
				"slowRewind": ["-1/2", "-1"]
			}
	*/
	checkIconType: function(inIcon) {
		var imagesrcRegex = /\.(jpg|jpeg|png|gif)$/i;
		return imagesrcRegex.test(inIcon) ? "image" : "iconfont";
	},
	retriveImgOrIconPath:function(inIcon){
		if (this.checkIconType(inIcon) == "image") {
			return enyo.path.rewrite(this._imagePath + inIcon);
		} else {
			return enyo.path.rewrite(inIcon);
		}
	},
	feedback: function(inMessage, inParams, inPersistShowing, inLeftSrc, inRightSrc, isInPreview) {
		var customMessage = false;
		inMessage = inMessage || "";
		inParams = inParams || {};

		if (inMessage !== "") { this.$.feedText.show(); }

		switch (inMessage) {
		case "Play":
			inMessage = moon.$L("PLAY"); // i18n "PLAY" feedback text in moon.VideoPlayer widget, should be translated to ALL CAPS in all languages
			inRightSrc = this.retriveImgOrIconPath(this._playImg);
			break;

		case "Pause":
			inMessage = moon.$L("PAUSE"); // i18n "PAUSE" feedback text in moon.VideoPlayer widget, should be translated to ALL CAPS in all languages
			inRightSrc = this.retriveImgOrIconPath(this._pauseImg);
			break;

		case "Rewind":
			inMessage = Math.abs(inParams.playbackRate) + "x";
			inLeftSrc = this.retriveImgOrIconPath(this._rewindImg);
			break;

		case "Slowrewind":
			inMessage = inParams.playbackRate + "x";
			inLeftSrc = this.retriveImgOrIconPath(this._pauseBackImg);
			break;

		case "Fastforward":
			inMessage = Math.abs(inParams.playbackRate) + "x";
			inRightSrc = this.retriveImgOrIconPath(this._fastForwardImg);
			break;

		case "Slowforward":
			inMessage = inParams.playbackRate + "x";
			inRightSrc = this.retriveImgOrIconPath(this._pauseForwardImg);
			break;

		case "JumpBackward":
			inMessage = this.df ? enyo.toUpperCase(this.df.format({second: inParams.jumpSize})) : inParams.jumpSize + " SEC";
			inLeftSrc = this.retriveImgOrIconPath(this._pauseJumpBackImg);
			break;

		case "JumpForward":
			inMessage = this.df ? enyo.toUpperCase(this.df.format({second: inParams.jumpSize})) : inParams.jumpSize + " SEC";
			inRightSrc = this.retriveImgOrIconPath(this._pauseJumpForwardImg);
			break;

		case "JumpToStart":
			inMessage = "";
			inLeftSrc = this.retriveImgOrIconPath(this._pauseJumpBackImg);
			break;

		case "JumpToEnd":
			inMessage = "";
			inRightSrc = this.retriveImgOrIconPath(this._pauseJumpForwardImg);
			break;

		case "Stop":
			inMessage = moon.$L("STOP"); // i18n "STOP" feedback text in moon.VideoPlayer widget, should be translated to ALL CAPS in all languages
			inRightSrc = "";
			break;

		// If the user sends in a custom message, block other messages until it's hidden
		default:
			customMessage = true;
			this._showingFeedback = true;
			break;
		}

		// Don't show feedback if we are showing custom feedback already, unless this is a new custom message
		if (!customMessage && this._showingFeedback) {
			return;
		}

		// Set content as _inMessage_
		this.$.feedText.setContent( enyo.toUpperCase(inMessage) );

		// Show output controls when video player is not preview mode
		if (!isInPreview) {
			this.showFeedback();
		}

		// Show icons as appropriate
		this.updateIcons(inLeftSrc, inRightSrc);

		//* Don't set up hide timer if _inPersistShowing_ is true
		if (inPersistShowing) {
			this.resetAutoTimer();
		} else {
			this.setAutoTimer();
		}
		this.inPersistShowing = inPersistShowing;
	},

	/**
		Returns boolean value previously passed into _feedback()_. A return value of
		true indicates that the current feedback message has no timeout.
	*/
	isPersistShowing: function() {
		return this.inPersistShowing;
	},

	//* Shows this control.
	showFeedback: function() {
		this.setShowing(true);
	},
	//* Hides this control and sets _this.showingFeedback_ to false.
	hideFeedback: function() {
		this.setShowing(false);
		this._showingFeedback = false;
	},

	//* @protected

	//* Starts job that will hide this control.
	setAutoTimer: function() {
		this.hideJob = enyo.job(this.id + "hide", this.bindSafely("hideFeedback"), this.getAutoTimeoutMS());
	},
	//* Clears job that will hide this control.
	resetAutoTimer: function() {
		enyo.job.stop(this.id + "hide");
	},
	//* Shows or hides icons and sets sources.
	updateIcons: function(inLeftSrc, inRightSrc) {
		if (inLeftSrc) {
			this.$.leftIcon.show();
			this.displayIconSrcOrFont(this.$.leftIcon, inLeftSrc);
		} else {
			this.$.leftIcon.hide();
		}

		if (inRightSrc) {
			this.$.rightIcon.show();
			this.displayIconSrcOrFont(this.$.rightIcon, inRightSrc);
		} else {
			this.$.rightIcon.hide();
		}
	},
	displayIconSrcOrFont: function(inIconKind, inIcon) {
		if (this.checkIconType(inIcon) == "image") {
			inIconKind.set("icon", "");
			inIconKind.set("src", inIcon);
		} else {
			inIconKind.set("src", "");
			inIconKind.set("icon", inIcon);
		}
	}
});
