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
		currentPosition: 0,
		//* Old position of video progress
		oldPosition: 0,
		//* Current time of video
		currentTime: 0,
		//* Total duration of video
		duration: 0,
	},
	events: {
		onPlay: "",
		onPause: "",
		onFullScreen: "",
		//* Fires when currPosAnimator bar finishes animating to a position.
		onAnimateCurrPosFinish: ""
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
			style: "position: absolute; bottom: 20px; left: 100px; background-color: transparent; color: white; font-size: 32px; z-index: 5;",
			components: [
				{
					name: "currTime",
					style: "display:inline"
				},
				{
					name: "totalTime",
					style: "display:inline"
				}
			]			
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
	currentTimeChanged: function() {
		var cur = new Date(this.getCurrentTime()*1000);
		this.$.currTime.setContent(cur.getMinutes() + ':' + cur.getSeconds()); 
		return true;
	},
	durationChanged: function() {
		var dur = new Date(this.getDuration()*1000);
		this.$.totalTime.setContent('/'+ dur.getMinutes() + ':' + dur.getSeconds()); 
		return true;
	},
	PlayPause: function(inSender, inEvent)
	{
		if(this.getPaused())
		{
			this.doPlay();
		} else {	
			this.doPause();	
		}
		return true;
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
	currentPositionChanged: function() {
		var pos = this.getCurrentPosition();
		var diff = Math.abs(pos - this.getOldPosition());
		if(diff >= 0.69) {
			this.animateProgressTo(pos);
		}
		this.setOldPosition(pos);
		return true;
	},
	//* @public
	//* Animates current video position to the given value.
	animateProgressTo: function(inValue) {
		this.$.currPosAnimator.play({
			startValue: this.oldPosition,
			endValue: inValue,
			node: this.hasNode()
		});
		return true;
	},
	//* @protected
	currPosAnimatorStep: function(inSender) {
		this.$.progressStatus.applyStyle("width", inSender.value + "%");		
		return true;
	},
	currPosAnimatorComplete: function(inSender) {
		this.doAnimateCurrPosFinish(inSender);
		return true;
	}
});