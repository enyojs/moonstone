enyo.kind({
	name: "moon.SelectableItem",
	kind: "moon.Item",
	classes: "moon-selectableItem",
	spotlight: true,
	handlers: {
		// prevent double onchange bubble in IE
		onclick: "",
	},
	published: {
		selected: false
	},
	tools: [
		{kind: "Animator", onStep: "animatorStep", onEnd: "destroyOverlay"},
		{tag: "span"}
	],
	initComponents: function() {
		var content = this.getContent();
		this.createChrome(this.tools);
		this.controls[0].setContent(content);
		this.controls[0].addStyles("border-bottom:4px solid #A2A2A2")
		this.inherited(arguments);
	}
});