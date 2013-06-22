
enyo.kind({
	name: "moon.VideoControl.Fullscreen",
	kind: "moon.VideoControl",
	classes: "moon-video-fullscreen-control enyo-fit",
	published: {
		visible: false,
		autoCloseTimeout: 4000,
		jumpHoldTimeout: 2000
	},
	handlers: {
		onenter: "enter",
		onleave: "leave"
	},
	components: [
		{name: "videoInfoHeader", kind: "FittableColumns", classes: "moon-video-player-header", components: [
			{name: "videoInfo", fit: true, classes: "moon-video-player-info", components: [
				{classes: "moon-video-player-description-info", components: [
					{name: "videoDateTime", classes: "moon-header-font moon-videoplayer-info-datetime"},
					{name: "videoTitle", classes: "moon-header-font moon-video-player-info-showname"},
					{name: "videoChannel", classes: "moon-video-player-info-channel"},
					{name: "videoDescription", classes: "moon-video-player-info-description"},
				]},
				{classes: "moon-video-player-settings-info", components: [
					{content: "SUB ENGLISH", classes: "moon-video-player-info-icon"},
					{content: "CINEMA", classes: "moon-video-player-info-icon"},
					{content: "3D", classes: "moon-video-player-info-icon"},
					{content: "REC 00:00", classes: "moon-video-player-info-icon moon-video-player-info-redicon"}
				]}
			]},
			{name: "feedbackHeader", kind: "moon.VideoFeedback"}
		]},
		
		{name: "playerControl", classes: "moon-video-player-bottom", components: [
			{name: "controls", kind: "FittableColumns", classes: "moon-video-player-controls", components: [
			
				{name: "leftPremiumPlaceHolder", classes: "premium-placeholder"},
				
				{name: "controlsContainer", kind: "Panels", arrangerKind: "CarouselArranger", fit: true, draggable: false, classes: "moon-video-player-controller", components: [
					{name: "trickPlay", kind: "FittableColumns", noStretch: true, classes: "enyo-center", components: [
						{name: "jumpBack", 		kind: "moon.IconButton", src: "$lib/moonstone/images/icon-jumpback.png", 	ondown: "jumpBackDown", onholdpulse: "jumpBackPulseThrottle", onup: "jumpBackUp"},
						{name: "rewind", 		kind: "moon.IconButton", src: "$lib/moonstone/images/icon-rewind.png", 		ontap: "rewind"},
						{name: "playPause",		kind: "moon.IconButton", src: "$lib/moonstone/images/icon-play.png", 		ontap: "playPause", mode: "pause"},
						{name: "fastForward", 	kind: "moon.IconButton", src: "$lib/moonstone/images/icon-fastforward.png", ontap: "fastForward"},
						{name: "jumpForward", 	kind: "moon.IconButton", src: "$lib/moonstone/images/icon-jumpforward.png", ondown: "jumpForwardDown", onholdpulse: "jumpForwardPulseThrottle", onup: "jumpForwardUp"}
					]},
					{name: "client", layoutKind: "FittableColumnsLayout", classes: "enyo-center", noStretch: true}
				]},
				
				{name: "rightPremiumPlaceHolder", classes: "premium-placeholder", components: [
					{name: "moreButton", kind: "moon.IconButton", src: "$lib/moonstone/images/icon-extend.png", ontap: "moreButtonTapped"}
				]}
			]},
			
			{classes: "moon-video-player-slider-container", onenter: "onEnterSlider", onleave: "onLeaveSlider", components: [
				{name: "slider", kind: "moon.VideoTransportSlider", popupColor: "#323232", onSeekStart: "sliderSeekStart", onSeek: "sliderSeek", onSeekFinish: "sliderSeekFinish"}
			]}
		]},
		
		{name:"bgScreen", kind: "moon.VideoPauseCanvas", classes: "moon-video-player-screen enyo-fit", showing: false}
	],
	//* Update visibility on create
	create: function() {
		this.inherited(arguments);
		this.visibleChanged();
	},
	//* Update layout to support the number of components that are passed in
	initComponents: function() {
		this.inherited(arguments);
		// No components - destroy more button
		if (!this.components) {
			this.$.moreButton.destroy();
		
		// One or two components - destroy more button and utilize left/right premium placeholders
		} else if (this.components.length <= 2) {
			this.$.moreButton.destroy();
			this.$.leftPremiumPlaceHolder.createComponent(this.components[0], {owner: this});
			this.components.splice(0,1);
			if (this.components.length == 1) {
				this.$.rightPremiumPlaceHolder.createComponent(this.components[0], {owner: this});
				this.components.splice(0,1);
			}
		
		// More than two components - use extra panel, with left premium plaeholder for first component
		} else {
			this.$.leftPremiumPlaceHolder.createComponents(this.components.splice(0,1), {owner: this});
		}
	},
	
	
	//* Add a _visible_ css class when _this.visible_ changes
	visibleChanged: function() {
		this.addRemoveClass("visible", this.getVisible());
	},
	playingChanged: function() {
		var src = "$lib/moonstone/images/";
		src += (this.getPlaying()) ? "icon-pause.png" : "icon-play.png";
		this.$.playPause.setSrc(src);
	},
	currentTimeChanged: function() {
		var cur = new Date(this.getCurrentTime()*1000);
	//	this.$.feedback.setContent(this.formatTime(cur.getMinutes(), cur.getSeconds()));
		this.doRequestTimeChange({param: this.formatTime(cur.getMinutes(), cur.getSeconds())});
		this.updatePosition();
	},
	durationChanged: function() {
		this.updatePosition();
	},
	videoDateTimeChanged: function() {
		this.$.videoDateTime.setContent(this.getVideoDateTime());
	},
	videoTitleChanged: function() {
		this.$.videoTitle.setContent(this.getVideoTitle());
	},
	videoChannelChanged: function() {
		this.$.videoChannel.setContent(this.getVideoChannel());
	},
	videoDescriptionChanged: function() {
		this.$.videoDescription.setContent(this.getVideoDescription());
	},
	
	
	//* Toggle play based on _this.playing_
	playPause: function(inSender, inEvent) {
		if(this.getPlaying()) {
			this.doRequestPause(inSender);
		} else {
			this.doRequestPlay(inSender);
		}
		return true;
	},
	//* When rewind button is pressed, bubble _onRewind_ event
	rewind: function(inSender, inEvent) {
		this.doRequestRewind(inSender);
	},
	//* When fastForward button is pressed, bubble _onFastForward_ event
	fastForward: function(inSender, inEvent) {
		this.doRequestFastForward(inSender);
	},
	
	jumpBackPulses: 0,
	jumpBackPulseThreshold: 4,
	jumpedToStart: false,
	jumpBackDown: function(inSender, inEvent) {
		this.jumpBackPulses = 0;
		this.jumpedToStart = false;
	},
	jumpBackPulseThrottle: function(inSender, inEvent) {
		this.throttleJob("jumpPulse", this.bindSafely("jumpBackPulse"), 500);
	},
	jumpBackPulse: function() {
		if (this.jumpBackPulses === this.jumpBackPulseThreshold && !this.jumpedToStart) {
			this.jumpToStart();
		}
		this.jumpBackPulses++;
	},
	jumpToStart: function(inSender, inEvent) {
		this.jumpedToStart = true;
		this.doRequestJumpToStart(inSender);
	},
	jumpBackUp: function(inSender, inEvent) {
		if (!this.jumpedToStart) {
			this.doRequestJumpBack(inSender);
		}
		this.jumpedToStart = false;
	},
	jumpForwardPulses: 0,
	jumpForwardPulseThreshold: 4,
	jumpedToEnd: false,
	jumpForwardDown: function(inSender, inEvent) {
		this.jumpForwardPulses = 0;
		this.jumpedToEnd = false;
	},
	jumpForwardPulseThrottle: function(inSender, inEvent) {
		this.throttleJob("jumpPulse", this.bindSafely("jumpForwardPulse"), 500);
	},
	jumpForwardPulse: function() {
		if (this.jumpForwardPulses === this.jumpForwardPulseThreshold && !this.jumpedToEnd) {
			this.jumpToEnd();
		}
		this.jumpForwardPulses++;
	},
	jumpToEnd: function(inSender, inEvent) {
		this.jumpedToEnd = true;
		this.doRequestJumpToEnd(inSender);
	},
	jumpForwardUp: function(inSender, inEvent) {
		if (!this.jumpedToEnd) {
			this.doRequestJumpForward(inSender);
		}
		this.jumpedToEnd = false;
	},
	//* Programatically update slider position to match _this.currentTime_/_this.duration_
	updatePosition: function() {
		if (this.$.slider.dragging) {
			return;
		}
		var percentComplete = Math.round(this.getCurrentTime()*1000/this.getDuration())/10;
		this.$.slider.setValue(percentComplete);
	},
	//* Set _visible_ to _true_ on mouseenter
	enter: function(inSender, inEvent) {
		this.showMe();
	},
	//* Set _visible_ to _false_ on mouseleave
	leave: function(inSender, inEvent) {
		enyo.job(this.id + "hide", this.bindSafely("hideMe"), this.getAutoCloseTimeout());
	},
	//* Clear auto-close timer
	resetAutoCloseTimer: function() {
		enyo.job.stop(this.id + "hide");
	},
	//* Set _this.visible_ to true and clear hide job
	showMe: function() {
		this.setVisible(true);
		this.resetAutoCloseTimer();
	},
	//* Set _this.visible_ to false
	hideMe: function() {
		this.setVisible(false);
	},
	//* When moreButton is tapped, toggle visibility of player controls and extra functionality
	moreButtonTapped: function(inSender, inEvent) {
		var index = this.$.controlsContainer.getIndex(),
			src = "$lib/moonstone/images/"
		;
		
		if (index === 0) {
			this.$.moreButton.setSrc(src + "icon-shrink.png");
			this.$.controlsContainer.next();
		} else {
			this.$.moreButton.setSrc(src + "icon-extend.png");
			this.$.controlsContainer.previous();
		}
	},
	
	////// Slider event handling //////
	
	//* When seeking starts, pause video
	sliderSeekStart: function(inSender, inEvent) {
		this.doRequestPause();
		this.showBGScreen();
		return true;
	},
	//* When seeking completes, play video
	sliderSeekFinish: function(inSender, inEvent) {
		this.doRequestPlay();
		this.hideBGScreen();
		return true;
	},
	//* When seeking, set video time
	sliderSeek: function(inSender, inEvent) {
		var time = this.getDuration() * inEvent.value / 100;
		this.doRequestTimeChange({value: time});
		return true;
	},
	
	////// BG Screen //////
	
	showBGScreen: function() {
		this.$.bgScreen.show();
	},
	hideBGScreen: function() {
		this.$.bgScreen.hide();
	}
});

enyo.kind({
	name: "moon.VideoPauseCanvas",
	kind: "enyo.Control",
	tag: "canvas",
	handlers: {
		onTimeupdate: "timeUpdate"
	},
	showingChanged: function() {
		this.inherited(arguments);
		if (!this.showing) {
			this.hasSnapshot = false;
		}
	},
	timeUpdate: function(inSender, inEvent) {
		if (this.showing && !this.hasSnapshot) {
			this.updateBoundsAttributes();
			this.takeSnapshot(inEvent.srcElement);
		}
	},
	takeSnapshot: function(inNode) {
		var node = this.hasNode(),
			bounds = node.getBoundingClientRect(),
			ctx = node.getContext("2d")
		;
		// draw video preview thumbnail
		ctx.drawImage(inNode, 0, 0, bounds.width, bounds.height);
		this.hasSnapshot = true;
	},
	updateBoundsAttributes: function() {
		var bounds = this.getBounds();
		this.setAttribute("width", bounds.width);
		this.setAttribute("height", bounds.height);
	}
});
