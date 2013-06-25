/**
	_moon.VideoInlineControl_ is a protected kind used inside of _moon.VideoPlayer_, to provide controls for the 
	inline (non-full screen) video player.
*/
enyo.kind({
	name: "moon.VideoControl.Inline",
	kind: "moon.VideoControl",
	classes: "moon-video-inline-control",
	components: [
		{name: "currPosAnimator", kind: "Animator", onStep: "currPosAnimatorStep", onEnd: "currPosAnimatorComplete"},
		{name: "playPause", kind: "moon.IconButton", src: "$lib/moonstone/images/icon-play.png", ontap: "playPause", classes: "moon-video-inline-control-play-pause" },
		{classes: "moon-video-inline-control-text", components: [
			{name: "currTime", content: "00:00"},
			{name: "totalTime", content: "00:00"}
		]},
		{name: "progressStatus", classes: "moon-video-inline-control-progress"},
		{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-fullscreenbutton.png", ontap: "doToggleFullscreen", classes: "moon-video-inline-control-fullscreen"}
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.commandChanged();
	},
	commandChanged: function() {
		var src = "$lib/moonstone/images/";
		src += this.getPlaying() ? "icon-pause.png" : "icon-play.png";
		this.$.playPause.setSrc(src);
	},
	currentTimeChanged: function() {
		var cur = new Date(this.getCurrentTime()*1000);
		this.$.currTime.setContent(this.formatTime(cur.getMinutes(), cur.getSeconds()));
		this.updatePosition();
	},
	durationChanged: function() {
		var dur = new Date(this.getDuration()*1000);
		this.$.totalTime.setContent("/" + this.formatTime(dur.getMinutes(), dur.getSeconds()));
	},
	playPause: function(inSender, inEvent) {
		if(this.getPlaying()) {
			this.doRequestPause();
		} else {
			this.doRequestPlay();
		}
		return true;
	},
	updatePosition: function() {
		var percentComplete = Math.round(this.getCurrentTime()*1000/this.getDuration())/10;
		this.$.progressStatus.applyStyle("width", percentComplete + "%");
	}
});
