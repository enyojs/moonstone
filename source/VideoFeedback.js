enyo.kind({
	name: "moon.VideoFeedback",
	kind: "enyo.Control",
	classes: "moon-video-player-feedback",
	published: {
		autoTimeout: 3,
		showFeedback: false
	},
	//* @protected
	_autoTimer: null,
	components: [
		{classes: "moon-video-feedback-wrapper", components: [
			{name: "feedtext", classes: "moon-video-feedback-text"},
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
				if(param == true) {
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
				this.configuration(src, 0, 10, "right");
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
		this.$.feedtext.setContent(msg);
		if(!this.$.feedIcon.getShowing()) {
			this.$.feedIcon.setShowing(true);
		}
		this._setAutoTimer();

		return true;
	},
	//* @protected
	configuration: function(src, left, right, option) {
		this.$.feedIcon.setSrc(src);
		this.$.feedIcon.applyStyle("float", option);
		this.$.feedtext.applyStyle("float", option);
		this.$.feedtext.applyStyle("padding-left", left + "px");
		this.$.feedtext.applyStyle("padding-right", right + "px");
	},

	cmdTimeInfo: function(param) {
		if(!this.getShowFeedback()) {
			this.configuration(null, 50, 0, null);
			this.$.feedtext.setContent(param);
			if(this.$.feedIcon.getShowing())
				this.$.feedIcon.setShowing(false);
		}	
		return true;	
	},

	_timeoutHandler: function() {
		this.setShowFeedback(false);
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
			clearTimeout(this._autoTimer);
		}
	}
});