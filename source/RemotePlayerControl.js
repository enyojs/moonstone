enyo.kind({
	name: "moon.RemotePlayerControl",
	tag: null,
	published: {
		//* Keycode map (keycode : function)
		keyMap : {
			39 : "pause", //should be removed: it is for test on chrome browser : <right arrow key>
			415 : "play",
			413 : "stop",
			19  : "pause",
			412 : "rewind",
			417 : "fastForward"
		},
		//* flag to handle key event
		handleKeyEvents: true
	},
	events: {
		//* Fires when play key pressed
		onPlay: "",
		//* Fires when stop key pressed
		onStop: "",
		//* Fires when pause key pressed
		onPause: "",
		//* Fires when rewind key pressed
		onRewind: "",
		//* Fires when fastforward key pressed
		onFastForward: ""
	},
	create: function() {
		this.inherited(arguments);
		enyo.dispatcher.features.push(enyo.bind(this, this.handleEvents));
	},
	handleEvents: function(inEvent) {
		if (this.handleKeyEvents && inEvent.type === "keydown") {
			var fn;
			if((fn = this[this.keyMap[inEvent.keyCode]]) && enyo.isFunction(fn)) {
				fn.call(this, inEvent);
			}
		}	
	},
	play: function(inEvent) {
		this.doPlay(inEvent);
	},
	pause: function(inEvent) {
		this.doPause(inEvent);
	},
	stop: function(inEvent) {
		this.doStop(inEvent);
	},
	rewind: function(inEvent) {
		this.doRewind(inEvent);
	},
	fastforward: function(inEvent) {
		this.doFastForward(inEvent);
	}
});