enyo.kind({
	name: "moon.VideoPlaybackInline",
	style:"position: absolute; \
		   width: 100%; height: 80px; bottom: 0px; left: 0px; \
		   margin: 0px; \
		   background-color: rgba(0,0,0,0.5);",
	published: {
		//* Current status of video play
		paused : true,
		//* Current position of video progress
		currPos: 0,
		progress: 0,
		currTime: 0,
		duration: 0,
	},
	events: {
		onPlay: "",
		onPause: "",
		onFullScreen: "",
	},
	components: [
		{name: "currPosAnimator", kind: "Animator", onStep: "currPosAnimatorStep", onEnd: "currPosAnimatorComplete"},
		{
			name: "playpause",
			kind: "moon.BoxIconButton", 
			src: "assets/icon-Play.png",
			ontap: "PlayPause",
			style: "position: absolute; bottom: 0px; left: 0px; width: 80px; height:80px; background-color: transparent; z-index: 5;",
		},
		{
			name: "textBox",
			style: "position: absolute; bottom: 20px; left: 100px; background-color: transparent; color: white; font-size: 32px; z-index: 5;",
		},
		{
			name: "progressStatus", 
			style: "position: absolute; bottom: 0px; left: 0px; width: 0%; height:80px; background-color: #00d4b3; z-index: 2;",
		},
		{
			kind: "moon.BoxIconButton",
			src: "assets/icon-FullScreenButton.png",
			ontap: "doFullScreen",
			style: "position: absolute; bottom: 0px; right: 0px; width: 80px; height:80px; background-color: transparent; z-index: 5;",
		}
	],
	currTimeChanged: function() {
		this.textBoxUpdate();
	},
	durationChanged: function() {
		this.textBoxUpdate();
	},
	textBoxUpdate: function() {
		var cu = Math.floor(this.getCurrTime());
		var du = Math.floor(this.getDuration());
		this.$.textBox.setContent(cu+"/"+du);
	},
	PlayPause: function(inSender, inEvent)
	{
		if(this.getPaused())
		{
			this.doPlay();
		} else {	
			this.doPause();	
		}
	},
	pausedChanged: function() 
	{
		if (this.getPaused()) {
			this.$.playpause.setSrc("assets/icon-Play.png");
		}
		else {
			this.$.playpause.setSrc("assets/icon-Pause.png");
		}
		return true;
	},
	currPosChanged: function() {
		this.$.progressStatus.applyStyle("width", this.getCurrPos() + "%");		
	}
});