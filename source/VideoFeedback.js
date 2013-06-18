enyo.kind({
	name: "moon.VideoFeedback",
	kind: "enyo.Control",
	classes: "moon-video-player-feedback", 
	handlers: {
		onFeedback: "feedback",
		ontimeupdate: "timeInfo"
	},
	published: {
		autoTimeout: 3,
		showFeedback: false
	},
	//* @protected
	_autoTimer: null,
	components: [
		{name: "feedbackDecorator", style: "margin: 5px; padding-top: 50px;", components: [
			{name: "feedback", classes: "moon-header-font", 
			style: "height: 65px; margin-top: 12px; text-align: center; font-size: 50px;"},
			{name: "feedIcon", spotlight: false, kind: "moon.BoxIconButton"}
		]}
	],
	//* @protected
	feedback: function(cmd, param, src) {
		var msg = cmd;
		if(msg=="time") {
			this.cmdTimeInfo(param);
			return true;
		}
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
				this.configuration(src, 0, 0, "right");
				break;
			case "jumpForward":
				msg = 30 + " sec";
				this.configuration(src, 0, 0, "left");
				break;
			case "rewindpaused":
				msg = "";
				// TODO
				break;
			case "forwardpaused":
				msg = "";
				// TODO
				break;
		}
		this.$.feedback.setContent(msg);
		if(!this.$.feedIcon.getShowing()) {
			this.$.feedIcon.setShowing(true);
		}
		this._setAutoTimer();

		return true;
	},
	configuration: function(src, left, right, option) {
		this.$.feedIcon.setSrc(src);
		this.$.feedback.applyStyle("padding-left", left + "px");
		this.$.feedback.applyStyle("padding-right", right + "px");
		this.$.feedback.applyStyle("float", option);
		this.$.feedIcon.applyStyle("float", option);
	},
	cmdTimeInfo: function(param) {
		if(!this.getShowFeedback()) {
			this.configuration(null, 50, 0, null);
			this.$.feedback.setContent(param);
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