
/**
	_moon.VideoPlayer_ is a control that wraps an _enyo.Video_ HTML5 video player to provide 
	moonstone-styled standard transport controls, optional app-specific controls, and an 
	information bar for video information and player feedback.

	Client components added to the _components_ block should generally be limited to type 
	_moon.BoxIconButton_, which are into the video player's transport control area.  If more than 
	two are provided, they will be rendered onto an "overflow" screen which is reached via
	a button that appears at the right of the controls.

	The _infoComponents_ block is rendered into the top info bar.  A standard _moon.VidePlayerInfo_
	control is provided for default styling of information in the info bar.

	Example:

		{
			kind: "moon.VideoPlayer",
			src: "http://www.w3schools.com/html/mov_bbb.mp4",
			components: [
				// Custom icons for app-specific features
				{kind: "moon.BoxIconButton", src: "assets/feature1.png", ontap: "feature1"},
				{kind: "moon.BoxIconButton", src: "assets/feature2.png", ontap: "feature2"},
				{kind: "moon.BoxIconButton", src: "assets/feature3.png", ontap: "feature3"}
			],
			infoComponents: [
				{
					kind: "moon.VideoPlayerInfo", 
					datetime: "CURRENT DATE & TIME", 
					showname: "SHOW NAME", 
					channel: "CHANNEL - AIR DATE & TIME SLOT", 
					synopsys: "SHORT SYNOPSYS ABOUT THE CURRENT SHOW",
					components: [
						{content: "SUB ENGLISH", classes: "moon-videoplayer-info-icon"},
						{content: "CINEMA", classes: "moon-videoplayer-info-icon"},
						{content: "3D", classes: "moon-videoplayer-info-icon"},
						{content: "REC 00:00", classes: "moon-videoplayer-info-icon moon-videoplayer-info-redicon"}
					]
				}
			]
		}

*/

enyo.kind({
	name: "moon.VideoPlayer",
	kind: "enyo.Control",
	// Fixme: When enyo-fit is used than the background image does not fit to video while dragging.
	classes: "moon-video-player", 
	published: {
		//* HTML5 video source URL
		src: "",
		//* Width of video player, in pixels
		width: 640,
		//* Height of video player, in pixels
		height: 360,
		//* Time for video player controls to hide after the pointer stops moving (in seconds)
		autoCloseTimeout: 4
	},
	handlers: {
		onUpdate: "onUpdateHandler",
		onmove: "onMoveHandler",
		ontap: "checkHideLayer",
		onSpotlightDown: "checkHideLayer",
		onSpotlightUp: "checkHideLayer",
		onSpotlightLeft: "checkHideLayer",
		onSpotlightRight: "checkHideLayer",
		ondrag: "checkHideLayer"
	},

	//* @public

	//* Components to be rendered into the top info bar.  This would typically include a _moon.VidePlayerInfo_ kind.
	infoComponents: [],

	//* @protected
	
	_autoCloseTimer: null,
	_holdPulseThreadhold: 300,
	controlTools: [
		{name: "video", kind: "enyo.Video", classes: "moon-video-player-video", ontimeupdate:"timeupdate"},
		{name: "videoInfoHeader", layoutKind: "FittableColumnsLayout", classes: "moon-video-player-header", components: [
			{name: "videoInfo", fit: true, classes: "moon-video-player-detail"},
			{name: "feedbackHeader", classes: "moon-video-player-feedback", components: [
				{name: "feedback", classes: "moon-video-player-feedback-icon"}
			]}
		]},
		{name: "playerControl", classes: "moon-video-player-bottom", components: [
			{name: "controls", layoutKind: "FittableColumnsLayout", classes: "moon-video-player-controls", components: [
				{name: "leftPremiumPlaceHolder", style: "width: 80px; height:80px;"},
				{name: "controller", kind: "Panels", arrangerKind: "CarouselArranger", fit: true, draggable: false, classes: "moon-video-player-controller", components: [
					{name: "trickPlay", layoutKind: "FittableColumnsLayout", noStretch: true, classes: "enyo-center", components: [
						{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-jumpback.png", ontap: "jumpBackHandler", onholdpulse: "onHoldPulseBackHandler"},
						{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-rewind.png", ontap: "rewindHandler"},
						{name: "playpause", mode: "pause", kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-play.png", ontap: "playpauseHandler"},
						{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-fastforward.png", ontap: "fastForwardHandler"},
						{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-jumpforward.png", ontap: "jumpForwardHandler", onholdpulse: "onHoldPulseForwardHandler"}
					]},
					{name: "client", layoutKind: "FittableColumnsLayout", classes: "enyo-center", noStretch: true}
				]},
				{name: "rightPremiumPlaceHolder", components: [
					{name: "more", kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-extend.png", ontap: "moreButtonTapped"}
				]}
			]},
			{classes: "moon-video-player-slider-container", onenter: "onEnterSlider", onleave: "onLeaveSlider", components: [
				{name: "slider", kind: "moon.VideoPlayerSlider", classes:"moon-video-player-slider"}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.srcChanged();
		this.widthChanged();
		this.heightChanged();
	},
	initComponents: function() {
		this.createTools();
		this.createVideoInfo();
		if (this.components.length <= 2) {
			this.$.more.destroy();
			this.$.leftPremiumPlaceHolder.createComponent(this.components[0], {owner: this});
			this.components.splice(0,1);
			if (this.components.length == 1) {
				this.$.rightPremiumPlaceHolder.createComponent(this.components[0], {owner: this});
				this.components.splice(0,1);
			}
		} else {
			this.$.leftPremiumPlaceHolder.createComponents(this.components.splice(0,1), {owner: this});
		}
		this.controlParentName = "client";
		this.discoverControlParent();
        this.inherited(arguments);
		this._hideLayer();
	},
	createTools: function() {	
		this.createComponents(this.controlTools, {owner: this});
	},
	createVideoInfo: function() {
		this.controlParentName = "videoInfo";
		this.discoverControlParent();
		this.createComponents(this.infoComponents, {owner: this});
	},

	//* @public
	//* Called then video source is changed
	srcChanged: function() {
		if (typeof this.src === "string" && this.src.length > 0) {
			if (this.$.video) {
				this.$.video.setSrc(this.src);
			}
			var p = this.controlParent;
			this.controlParent = undefined;
			this.$.slider.setVideo(this.$.video);
			this.controlParent = p;

		}
	},
	//* Called then video width is changed
	widthChanged: function() {
		this.$.video.setWidth(this.width);
		this.$.video.setAttribute("width", this.width + "px");
	},
	//* Called then video height is changed
	heightChanged: function() {
		this.$.video.setHeight(this.height);
		this.$.video.setAttribute("height", this.height + "px");
	},
	//* Called then video time is need to be changed
	timeupdate: function(inSender, inEvent) {
		var val = (inSender.getCurrentTime() / inSender.getDuration())*100;
		
		// Fixme : how to handle more than 1 buffer (buf_length > 1)
		var bufferdRange = inSender.getBufferedTimeRange();
		var buf_length = bufferdRange.length;
		// var buf_start = bufferdRange.start(0);
		// var buf_end = bufferdRange.end(0);
		// var buf = (buf_end - buf_start) / inSender.getDuration() * 100;

		// update slider positon
		if (!this.$.slider.dragging) {
			this.$.slider.setValue(val);
			// this.$.slider.setBgProgress(buf);
		}

		// update play/pause icon
		this.onUpdateHandler();

		var curTime = new Date(inSender.getCurrentTime()*1000);
		this.$.feedback.setContent(curTime.getMinutes() + ':' + curTime.getSeconds()); 
		return true;
	},
	//* Get access to the video info control
	getVideoInfoArea: function(inSender, inEvent) {
		return this.$.videoInfo;
	},
	//* Get access to the left 'primium' control
	getLeftControlArea: function(inSender, inEvent) {
		return this.$.leftPremiumPlaceHolder;
	},
	//* Get access to the right 'primium' control
	getRightControlArea: function(inSender, inEvent) {
		return this.$.rightPremiumPlaceHolder;
	},
	//* Get access to the 'more' icon button
	getMoreControlsArea: function(inSender, inEvent) {
		return this.$.client;
	},
	
	//* @protected
	moreButtonTapped: function(inSender, inEvent) {
		var index = this.$.controller.getIndex();
		if (index === 0) {
			inEvent.originator.setSrc("$lib/moonstone/images/icon-shrink.png");
			this.$.controller.next();
		}
		else {
			inEvent.originator.setSrc("$lib/moonstone/images/icon-extend.png");
			this.$.controller.previous();
		}
	},
	playpauseHandler: function(inSender, inEvent) {
		if (this.$.video.isPaused() == true) {
			this.$.video.play();
		}
		else {
			this.$.video.pause();
		}
	},
	rewindHandler: function(inSender, inEvent) {
		this.$.video.rewind();
	},
	jumpBackHandler: function(inSender, inEvent) {
		this.$.video.jumpBack();
	},
	fastForwardHandler: function(inSender, inEvent) {
		this.$.video.fastForward();
	},
	jumpForwardHandler: function(inSender, inEvent) {
		this.$.video.jumpForward();
	},
	onUpdateHandler: function(inSender, inEvent) {
		if (this.$.video.isPaused()) {
			this.$.playpause.setSrc("$lib/moonstone/images/icon-play.png");
		}
		else {
			this.$.playpause.setSrc("$lib/moonstone/images/icon-pause.png");
		}
		return true;
	},
	onMoveHandler: function(inSender, inEvent) {
		var bDirty = false;
		if (this.$.videoInfoHeader.getShowing() == false) {
			this.$.videoInfoHeader.show();
			bDirty = true;
		}
		if (this.$.playerControl.getShowing() == false) {
			this.$.playerControl.show();
			bDirty = true;
		}
		if (bDirty == true) {
			this.resized();
		}
		this._setAutoCloseTimer();
		return true;
	},
	checkHideLayer: function(inSender, inEvent) {
		if (inSender.name == "video") {
			this._hideLayer();
		} else {
			this._setAutoCloseTimer();
		}
	},
	onEnterSlider: function(inSender, inEvent) {
		if (!this.$.slider.dragging) {
			this.$.controls.setShowing(false);
		}
	},
	onLeaveSlider: function(inSender, inEvent) {
		if (!this.$.slider.dragging) {
			this.$.controls.show();
			this.$.controls.resized();
		}
	},
	onHoldPulseBackHandler: function(inSender, inEvent) {
		if (inEvent.holdTime > this._holdPulseThreadhold) {
			// fixme: ugly hacking to prevent repeated call
			this.$.video.holdJumpToStart = true;
			inEvent.cancelHold = true
		}
	},
	onHoldPulseForwardHandler: function(inSender, inEvent) {
		if (inEvent.holdTime > this._holdPulseThreadhold) {
			this.$.video.holdJumpToEnd = true;
			inEvent.cancelHold = true
		}
	},
	_hideLayer: function(inSender, inEvent) {
		this.$.videoInfoHeader.setShowing(false);
		this.$.playerControl.setShowing(false);
	},
	_setAutoCloseTimer: function(inSender, inEvent) {
		this._resetAutoCloseTimer();
		this._autoCloseTimer = setTimeout(enyo.bind(this, function() { 			
				this._hideLayer();
			}), this.getAutoCloseTimeout() * 1000);
	},
	_resetAutoCloseTimer: function() {
		if (this._autoCloseTimer != null) {
			clearTimeout(this._autoCloseTimer);
		}
	}
});
