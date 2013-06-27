/**
	_moon.VideoFeedback_ is a protected kind used inside of _moon.VideoPlayer_, to provide feedback informations 
	of video contorls and status.
*/
enyo.kind({
	name: "moon.VideoFeedback",
	kind: "enyo.Control",
	classes: "moon-video-player-feedback hidden",
	published: {
		//* Timeout duration for disapearing feedback information (in milliseconds)
		autoTimeoutMS: 	2000,
		imagePath: 		"$lib/moonstone/images/",
		jumpBackImg: 	"icon-jumpback.png",
		rewindImg: 		"icon-rewind.png",
		playImg: 		"icon-play.png",
		pauseImg: 		"icon-pause.png",
		fastForwardImg: "icon-fastforward.png",
		jumpForwardImg: "icon-jumpforward.png"
	},
	//* @protected
	showingFeedback: false,
	_autoTimer: null,
	components: [
		{classes: "moon-video-feedback-wrapper", components: [
			{name: "leftIcon",  classes: "moon-video-feedback-icon-left",  allowHtml: true, content: "&nbsp;", showing: false},
			{name: "feedText",  classes: "moon-video-feedback-text"},
			{name: "rightIcon", classes: "moon-video-feedback-icon-right", allowHtml: true, content: "&nbsp;", showing: false}
		]}
	],
	
	//* @public
	
	feedback: function(inMessage, inParams, inPersistShowing, inLeftSrc, inRightSrc) {
		var customMessage = false;
		inMessage = inMessage || "";
		inParams = inParams || {};
		
		switch (inMessage) {
			case "Play":
				inRightSrc = enyo.path.rewrite(this.imagePath + this.playImg);
				break;
				
			case "Pause":
				inRightSrc = enyo.path.rewrite(this.imagePath + this.pauseImg);
				break;
				
			case "Rewind":
				inMessage = inParams.playbackRate + "x";
				inLeftSrc = enyo.path.rewrite(this.imagePath + this.rewindImg);
				break;
				
			case "Fastforward":
				inMessage = inParams.playbackRate + "x";
				inRightSrc = enyo.path.rewrite(this.imagePath + this.fastForwardImg);
				break;
				
			case "JumpBackward":
				inMessage = inParams.jumpSize + " sec";
				inLeftSrc = enyo.path.rewrite(this.imagePath + this.jumpBackImg);
				break;
				
			case "JumpForward":
				inMessage = inParams.jumpSize + " sec";
				inRightSrc = enyo.path.rewrite(this.imagePath + this.jumpForwardImg);
				break;
			
			// If the user sends in a custom message, block other messages until it's hidden
			default:
				customMessage = true;
				this.showingFeedback = true;
				break;
		}
		
		// Don't show feedback if we are showing custom feedback already, unless this is a new custom message
		if (!customMessage && this.showingFeedback) {
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
	},

	//* Show this control
	showFeedback: function() {
		this.removeClass("hidden");
	},
	//* Hide this control and set _this.showingFeedback_ to _false_
	hideFeedback: function() {
		this.addClass("hidden");
		this.showingFeedback = false;
	},
	
	//* @protected
	
	//* Start job that will hide this control
	setAutoTimer: function() {
		this.hideJob = enyo.job(this.id + "hide", this.bindSafely("hideFeedback"), this.getAutoTimeoutMS());
	},
	//* Clear job that will hide this control
	resetAutoTimer: function() {
		enyo.job.stop(this.id + "hide");
	},
	//* Show/hide icons and set sources
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
