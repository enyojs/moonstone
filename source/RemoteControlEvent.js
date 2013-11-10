enyo.remoteContolEvent = {
	//* @protected
	registerKeyMap: {
		415 : "play",
		413 : "stop",
		19  : "pause",
		412 : "rewind",
		417 : "fastforward"
	},
	dispatch: function(inEvent) {
		if(enyo.master) {
			inEvent = enyo.clone(inEvent);
			inEvent.type ="remoteControlKeyEvent";
			inEvent.keyIdentifier = this.registerKeyMap[inEvent.keyCode];
			enyo.master.waterfall("onRemoteControlKeyDown", inEvent);
		}
	},
},

enyo.dispatcher.features.push(
	function (e) {
		if("keydown" === e.type) {
			if(enyo.remoteContolEvent.registerKeyMap[e.keyCode]) {
				return enyo.remoteContolEvent.dispatch(e);
			}
		}
	}
);