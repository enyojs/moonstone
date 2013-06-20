//* @public
enyo.kind({
	name: "moon.VideoControl",
	kind: "enyo.Control",
	published: {
		playing: false,
		//* Current time of video
		currentTime: 0,
		//* Total duration of video
		duration: 0,
		// Properties passed through from player
		videoDateTime: null,
		videoTitle: "",
		videoChannel: "",
		videoDescription: "",
		videoSubtitleLanguage: null,
		videoDisplayMode: "",
		video3d: null,
		videoTimeRecorded: null
	},
	events: {
		onRequestPlay: "",
		onRequestPause: "",
		onRequestRewind: "",
		onRequestFastForward: "",
		onRequestJumpBack: "",
		onRequestJumpForward: "",
		onRequestJumpToStart: "",
		onRequestJumpToEnd: "",
		onToggleFullscreen: "",
		onRequestTimeChange: "",
		onFullScreen: "",
	},
	handlers: {
		onTimeupdate: "handleTimeUpdate",
		onPlayStateChanged: "handlePlayStateChanged"
	},
	
	//* @protected
	
	bindings: [],
	//* _onPlayStateChanged_ update _this.playing_
	handlePlayStateChanged: function(inSender, inEvent) {
		this.setPlaying(inEvent.playing);
	},
	//* Update _this.duration_ and _this.currentTime_
	handleTimeUpdate: function(inSender, inEvent) {
		if (!inEvent && inEvent.srcElement) {
			return;
		}
		
		this.setDuration(inEvent.srcElement.duration);
		this.setCurrentTime(inEvent.srcElement.currentTime);
	},
	//* Properly format time
	formatTime: function(inMinutes, inSeconds) {
		inMinutes = this._formatTime(inMinutes);
		inSeconds = this._formatTime(inSeconds);
		return inMinutes + ":" + inSeconds;
	},
	//* Format time helper
	_formatTime: function(inValue) {
		return (inValue) ? (String(inValue).length < 2) ? "0"+inValue : inValue : "00";
	}
});