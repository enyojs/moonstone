/**
	_moon.Sound_
*/
enyo.kind({
	name: "moon.Sound",
	tag: "audio",
	published: {
		/** URL of the sound file to play, can be relative to the application HTML file */
		src: "",
		/** Audio format of sound file*/
		type: "audio/mpeg",
		preload: true
	},
	events: {
		onEnd: ""
	},
	//* @protected
	handlers: {
		onended: "ended"
	},
	isPlaying: false,
	components: [
		{name: "source", tag: "source"}
	],
	create: function() {
		this.inherited(arguments);
		this.srcChanged();
		this.preloadChanged();
		this.setAttribute("onended", enyo.bubbler);
	},
	srcChanged: function() {
		var path = enyo.path.rewrite(this.src);
		this.$.source.setAttribute("src", path);
		this.$.source.setAttribute("type", this.type);
		if (this.hasNode()) {
			this.node.load();
		}
	},
	preloadChanged: function() {
		this.setAttribute("autobuffer", this.preload ? "autobuffer" : null);
		this.setAttribute("preload", this.preload ? "preload" : null);
	},
	//* @public
	play: function() {
		if (this.hasNode()) {
			this.node.play();
			this.isPlaying = true;
		}
	},
	pause: function() {
		if (this.hasNode()) {
			this.node.pause();
			this.isPlaying = false;
		}
	},
	seekTo: function(inValue) {
		if (this.hasNode()) {
			this.node.currentTime = inValue;
		}
	},
	ended: function() {
		this.doEnd();
	},
	getCurrentTime: function() {
		if (this.hasNode()) {
			return Math.floor(this.node.currentTime);
		}
	},
	getDuration: function() {
		if (this.hasNode()) {
			return Math.floor(this.node.duration);
		}
	}
});
