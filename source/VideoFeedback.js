/**
	_moon.VideoFeedback_ is a control used by	[moon.VideoPlayer](#moon.VideoPlayer)
	to display feedback in response to input from video playback controls.  It may
	also be used to display custom messages.
*/
enyo.kind({
	name: "moon.VideoFeedback",
	kind: "enyo.Control",
	classes: "moon-video-player-feedback",
	published: {
		/**
			Length of time (in milliseconds) after which the on-screen feedback will
			automatically disapear
		*/
		autoTimeoutMS:	2000
	},
	//* @protected
	_showingFeedback: false,

	_imagePath:				"$lib/moonstone/images/",
	_jumpBackImg:			"IndicatorIcon_JumpBackward.png",
	_rewindImg:				"IndicatorIcon_Backward.png",
	_playImg:				"IndicatorIcon_Play.png",
	_pauseImg:				"IndicatorIcon_Pause.png",
	_fastForwardImg:		"IndicatorIcon_Forward.png",
	_jumpForwardImg:		"IndicatorIcon_JumpForward.png",
	_pauseBackImg:			"IndicatorIcon_PauseBackward.png",
	_pauseForwardImg:		"IndicatorIcon_PauseForward.png",
	_pauseJumpBackImg:		"IndicatorIcon_PauseJumpBackward.png",
	_pauseJumpForwardImg:	"IndicatorIcon_PauseJumpForward.png",
	_autoTimer: null,

	components: [
		{name: "leftIcon",  classes: "moon-video-feedback-icon-left",  allowHtml: true, content: "&nbsp;", showing: false},
		{name: "feedText",  classes: "moon-video-feedback-text"},
		{name: "rightIcon", classes: "moon-video-feedback-icon-right", allowHtml: true, content: "&nbsp;", showing: false}
	],
	
	//* @public
	
	feedback: function(inMessage, inParams, inPersistShowing, inLeftSrc, inRightSrc) {
		var customMessage = false;
		inMessage = inMessage || "";
		inParams = inParams || {};
		
		switch (inMessage) {
		case "Play":
			inRightSrc = enyo.path.rewrite(this._imagePath + this._playImg);
			break;
			
		case "Pause":
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
			inMessage = inParams.jumpSize + " sec";
			inLeftSrc = enyo.path.rewrite(this._imagePath + this._pauseJumpBackImg);
			break;
			
		case "JumpForward":
			inMessage = inParams.jumpSize + " sec";
			inRightSrc = enyo.path.rewrite(this._imagePath + this._pauseJumpForwardImg);
			break;

		case "JumpToStart":
			inLeftSrc = enyo.path.rewrite(this._imagePath + this._pauseJumpBackImg);
			break;
			
		case "JumpToEnd":
			inRightSrc = enyo.path.rewrite(this._imagePath + this._pauseJumpForwardImg);
			break;

		case "Stop":
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
		this.$.feedText.setContent(inMessage);

		// Show output controls
		this.showFeedback();
		
		// Show icons as appropriate
		this.updateIcons(inLeftSrc, inRightSrc);

		//* Don't setup hide timer if _inPersistShowing_ is true
		if (inPersistShowing) {
			this.resetAutoTimer();
		} else {
			this.setAutoTimer();
		}
		this.inPersistShowing = inPersistShowing;
	},

	//* When true, means current feedback message has no timeout.
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
