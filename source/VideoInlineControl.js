/**
	_moon.VideoInlineControl_ is a protected kind used inside of _moon.VideoPlayer_, to provide controls for the 
	inline (non-full screen) video player.
*/
enyo.kind({
	name: "moon.VideoInlineControl",
	classes: "moon-video-inline-control",
	style: "margin: 0px; padding: 0px",
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
		duration: 0
	},
	events: {
		onPlay: "",
		onPause: "",
		onFullScreen: "",
		onAnimateCurrPosFinish: ""
	},
	components: [
		{name: "currPosAnimator", kind: "Animator", onStep: "currPosAnimatorStep", onEnd: "currPosAnimatorComplete"},
		{name: "playpause", kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-play.png", ontap: "playPause", classes: "moon-video-inline-control-play-pause" },
		{classes: "moon-video-inline-control-text", components: [
			{name: "currTime", style: "display:inline"},
			{name: "totalTime", style: "display:inline"}
		]},
		{name: "progressStatus", classes: "moon-video-inline-control-progress"},
		{kind: "moon.BoxIconButton", src: "$lib/moonstone/images/icon-fullscreenbutton.png", ontap: "doFullScreen", classes: "moon-video-inline-control-fullscreen"}
	],
	//* @protected
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
	playPause: function(inSender, inEvent)
	{
		if(this.getPaused()) {
			this.doPlay();
		} else {	
			this.doPause();	
		}
		return true;
	},
	pausedChanged: function() 
	{
		if (this.getPaused()) {
			this.$.playpause.setSrc("$lib/moonstone/images/icon-play.png");
		}
		else {
			this.$.playpause.setSrc("$lib/moonstone/images/icon-pause.png");
		}
		return true;
	},
	currentPositionChanged: function() {
		var pos = this.getCurrentPosition();
		var diff = Math.abs(pos - this.getOldPosition());
		this.animateProgressTo(pos);
		this.setOldPosition(pos);
		return true;
	},
	animateProgressTo: function(inValue) {
		this.$.currPosAnimator.play({
			startValue: this.oldPosition,
			endValue: inValue,
			node: this.hasNode()
		});
		return true;
	},
	currPosAnimatorStep: function(inSender) {
		this.$.progressStatus.applyStyle("width", inSender.value + "%");		
		return true;
	},
	currPosAnimatorComplete: function(inSender) {
		this.doAnimateCurrPosFinish(inSender);
		return true;
	}
});
