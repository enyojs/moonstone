/**
	_moon.VideoFeedback_ is a protected kind used inside of _moon.VideoPlayer_, to provide feedback informations 
	of video contorls and status.
*/
enyo.kind({
	name: "moon.VideoFeedback",
	kind: "enyo.Control",
	classes: "moon-video-player-feedback",
	published: {
		//* Timeout duration for disapearing feedback information 
		autoTimeout: 3,
		//* Boolean flag for showing status of feedback information
		showFeedback: false
	},
	//* @protected
	_autoTimer: null,
	components: [
		{classes: "moon-video-feedback-wrapper", components: [
			{name: "feedText", classes: "moon-video-feedback-text"},
			{name: "feedIcon", kind: "moon.IconButton", classes: "moon-video-feedback-icon", spotlight: false}
		]}
	],
	//* @public
	feedback: function(inFeedbackData) {
		var msg = inFeedbackData.command;
		var playbackRate = Math.abs(inFeedbackData.playbackRate);
		var param = inFeedbackData.param;
		var src = inFeedbackData.imgsrc;
		var timer = true;

		if (!this.$.feedIcon.getShowing()) {
			this.$.feedIcon.setShowing(true);
			this.$.feedText.setShowing(true);
		}

		switch (msg) {
			case "play":
				if (param === "live") {
					msg = "live";
				}
				this.configuration(src, 30, 0, "left");
				break;
			case "pause":
				timer = false;
				if (param === "live") {
					msg = "00:00:00";
				}
				this.configuration(src, 20, 0, "left");
				break;
			case "rewind":
				timer = false;
				msg = playbackRate+"x";
				this.configuration(src, 0, 35, "right");
				break;
			case "fastForward":
				timer = false;
				msg =playbackRate+"x";
				this.configuration(src, 35, 0, "left");
				break;
			case "jumpBackward":
				if (param === true) { // when paused
					timer = false;
					msg = "<||";
					src = "";
				} else {
					msg = 30 + "sec";
				}
				this.configuration(src, 0, 15, "right");
				break;
			case "jumpForward":
				if (param === true) { // when paused
					timer = false;
					msg = "||>";
					src = "";
				} else {
					msg = 30 + "sec";
				}
				this.configuration(src, 15, 0, "left");
				break;
			
			// after long press Not Implemented yet
			case "jumpLive":
			case "jumpNext":
			case "jumpPrev":
			default:
				break;
		}

		this.$.feedText.setContent(msg);
		if(timer) {
			this._setAutoTimer();
		} else {
			this._resetAutoTimer();
		}
		return true;
	},
	//* @protected
	configuration: function(src, left, right, option) {
		this.$.feedIcon.setSrc(src);
		this.$.feedIcon.applyStyle("float", option);
		this.$.feedText.applyStyle("float", option);
		this.$.feedText.applyStyle("padding-left", left + "px");
		this.$.feedText.applyStyle("padding-right", right + "px");
	},

	cmdTimeInfo: function(param) {
		if(!this.getShowFeedback()) {
			this.$.feedText.setContent(param);
			if(!this.$.feedText.getShowing()) {
				this.$.feedText.setShowing(true);
			}
			if(this.$.feedIcon.getShowing()) {
				this.$.feedIcon.setShowing(false);
			}
			this.configuration(null, 50, 0, null);
		}	
		return true;	
	},

	_timeoutHandler: function() {
		this.setShowFeedback(false);
		this.$.feedText.setShowing(false);
		this.$.feedIcon.setShowing(false);
	},

	_setAutoTimer: function() {
		this._resetAutoTimer();
		this._autoTimer = setTimeout(enyo.bind(this, 
			function() {
				this._timeoutHandler();
			}), this.getAutoTimeout() * 1000);
		this.setShowFeedback(true);
	},
	
	_resetAutoTimer: function() {
		if (this._autoTimer != null) {
			clearTimeout(this._autoTimer);
		}
	}
});
