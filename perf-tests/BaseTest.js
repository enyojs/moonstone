enyo.kind({
	name: "BaseTest",
	classes: "enyo-fit moon",
	components: [
		{
			kind: "enyo.FittableColumns",
			noStretch: true,
			components: [
				{name: "client", fit: true},
				{kind: "Button", content: "Stop", ontap: "toggle", style: "width: 4em;"}
			]
		},
		{name: "meter", kind: "enyo.FPSMeter"}
	],
	running: true,
	toggle: function() {
		if (this.running) {
			this.running = false;
			this.$.button.set("content", "Start");
		} else {
			this.running = true;
			this.$.button.set("content", "Stop");
			this.nextTest();
		}
	},
	nextTest: function() {
		// Override this in subkinds
	},
	rendered: function() {
		this.inherited(arguments);
		this.$.meter.run();
		this.nextTest();
	}
});
