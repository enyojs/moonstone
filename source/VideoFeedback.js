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
	_jumpBackImg:			"icon_indicator_jumpbackward.png",
	_rewindImg:				"icon_indicator_backward.png",
	_playImg:				"icon_indicator_play.png",
	_pauseImg:				"icon_indicator_pause.png",
	_fastForwardImg:		"icon_indicator_forward.png",
	_jumpForwardImg:		"icon_indicator_jumpforward.png",
	_pauseBackImg:			"icon_indicator_pausebackward.png",
	_pauseForwardImg:		"icon_indicator_pauseforward.png",
	_pauseJumpBackImg:		"icon_indicator_pausejumpbackward.png",
	_pauseJumpForwardImg:	"icon_indicator_pausejumpforward.png",
	_autoTimer: null,

	components: [
		{name: "leftIcon",  classes: "moon-video-feedback-icon-left", allowHtml: true, content: "&nbsp;", showing: false},
		{name: "feedText",  classes: "moon-video-feedback-text", allowHtml: true, content: "&nbsp;", showing: false},
		{name: "rightIcon", classes: "moon-video-feedback-icon-right", allowHtml: true, content: "&nbsp;", showing: false}
	],

	//* @public
	create: function() {
		this.inherited(arguments);
		if (window.ilib) {
			this.df = new ilib.DurFmt({length: "medium"});
		}
	},

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
	feedback: function(inMessage, inParams, inPersistShowing, inLeftSrc, inRightSrc) {
		var customMessage = false;
		inMessage = inMessage || "";
		inParams = inParams || {};

		if (inMessage !== "") { this.$.feedText.show(); }

		switch (inMessage) {
		case "Play":
			inMessage = moon.$L("Play"); // i18n "PLAY" feedback text in moon.VideoPlayer widget
			inRightSrc = enyo.path.rewrite(this._imagePath + this._playImg);
			break;

		case "Pause":
			inMessage = moon.$L("Pause"); // i18n "PAUSE" feedback text in moon.VideoPlayer widget
			inRightSrc = enyo.path.rewrite(this._imagePath + this._pauseImg);
			break;

		case "Rewind":
			inMessage = Math.abs(inParams.playbackRate) + "x";
			inLeftSrc = enyo.path.rewrite(this._imagePath + this._rewindImg);
			break;

		case "Slowrewind":
			inMessage = inParams.playbackRate + "x";
			inLeftSrc = enyo.path.rewrite(this._imagePath + this._pauseBackImg);
			break;

		case "Fastforward":
			inMessage = Math.abs(inParams.playbackRate) + "x";
			inRightSrc = enyo.path.rewrite(this._imagePath + this._fastForwardImg);
			break;

		case "Slowforward":
			inMessage = inParams.playbackRate + "x";
			inRightSrc = enyo.path.rewrite(this._imagePath + this._pauseForwardImg);
			break;

		case "JumpBackward":
			inMessage = this.df ? this.df.format({second: inParams.jumpSize}) : inParams.jumpSize + " sec";
			inLeftSrc = enyo.path.rewrite(this._imagePath + this._pauseJumpBackImg);
			break;

		case "JumpForward":
			inMessage = this.df ? this.df.format({second: inParams.jumpSize}) : inParams.jumpSize + " sec";
			inRightSrc = enyo.path.rewrite(this._imagePath + this._pauseJumpForwardImg);
			break;

		case "JumpToStart":
			inMessage = "";
			inLeftSrc = enyo.path.rewrite(this._imagePath + this._pauseJumpBackImg);
			break;

		case "JumpToEnd":
			inMessage = "";
			inRightSrc = enyo.path.rewrite(this._imagePath + this._pauseJumpForwardImg);
			break;

		case "Stop":
			inMessage = moon.$L("Stop"); // i18n "Stop" feedback text in moon.VideoPlayer widget
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

		// Show output controls
		this.showFeedback();

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

	//* When true, current feedback message has no timeout.
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
			this.$.leftIcon.applyStyle("background-image", "url(" + inLeftSrc + ")");
		} else {
			this.$.leftIcon.hide();
		}

		if (inRightSrc) {
			this.$.rightIcon.show();
			this.$.rightIcon.applyStyle("background-image", "url(" + inRightSrc + ")");
		} else {
			this.$.rightIcon.hide();
		}
	}
});
