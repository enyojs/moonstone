enyo.kind({
	name: "enyo.FPSMeter",
	style: "position: absolute; bottom: 10px; right: 10px; z-index: 999;",
	content: "Start FPS Meter",
	handlers: {
		ontap: "toggle"
	},
	fps: function(evt) {
		if (this.static.running) {
			this.setContent(evt.fps + " FPS");
		}
	},
	toggle: function() {
		this.log();
		if (this.static.running) {
			this.stop();
		} else {
			this.run();
		}
	},
	stop: function() {
		this.meter.stop();
		this.static.running = false;
		this.setContent("Start FPS Meter");
	},
	run: function() {
		this.meter.run();
		this.static.running = true;
	},
	create: function() {
		this.inherited(arguments);
		this.static = enyo.getPath(this.kindName);
		this.parentNode = enyo.floatingLayer.hasNode();
		if (!enyo.floatingLayer.hasNode()) {
			enyo.floatingLayer.render();
		}
		this.meter = window.FPSMeter;
		enyo.dispatcher.listen(document, "fps", this.bindSafely(this.fps));
	},
	statics: {
		running: false
	}
});