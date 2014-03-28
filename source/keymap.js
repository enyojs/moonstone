if (enyo.platform.webos >= 4) {
	// Table of default keyCode mappings for webOS device
	enyo.dispatcher.registerKeyMap({
		415 : "play",
		413 : "stop",
		19  : "pause",
		412 : "rewind",
		417 : "fastforward"
	});
}