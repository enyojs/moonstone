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
			{name: "feedIcon", kind: "moon.BoxIconButton", classes: "moon-video-feedback-icon", spotlight: false}
		]}
	],
	//* @public
	feedback: function(cmd, param, src) {
		if(cmd=="time") {
			this.cmdTimeInfo(param);
			return true;
		}
		var msg = cmd;
		switch(msg)
		{
		case "play":
			if(param === true) {
				msg = "pause";
			} 
			this.configuration(src, 10, 0, "left");
			break;
		case "live":
			this.configuration(null, 50, 0, null);
			break;
		case "livepause":
			this.configuration(src, 10, 0, "left");
			break;
		case "rewind":
			msg = param*10+"x";
			this.configuration(src, 0, 25, "right");
			break;
		case "fastForward":
			msg = param*10+"x";
			this.configuration(src, 25, 0, "left");
			break;
		case "jumpBack":
			msg = 30 + " sec";
			this.configuration(src, 0, 5, "right");
			break;
		case "jumpForward":
			msg = 30 + " sec";
			this.configuration(src, 0, 0, "left");
			break;
		case "rewindpaused":
			msg = "N/A";
			break;
		case "forwardpaused":
			msg = "N/A";
			break;
		}
		this.$.feedText.setContent(msg);
		if(!this.$.feedIcon.getShowing()) {
			this.$.feedIcon.setShowing(true);
			this.$.feedText.setShowing(true);
		}
		this._setAutoTimer();

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
		this.log();
	},
	
	_resetAutoTimer: function() {
		if (this._autoTimer != null) {
		}
	}
});