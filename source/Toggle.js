enyo.kind({
	name: "moon.Toggle",
	classes: "moon-toggle",
	published: {
		//* Label for toggle button's "on" state
		onContent: $L("on"),
		//* Label for toggle button's "off" state
		offContent: $L("off"),
	},
	//* @protected
	kind: "moon.Checkbox",
	tap: function(inSender, e) {
		if (!this.disabled) {
			this.setChecked(!this.getChecked());
			this.bubble("onchange");
		}
		return !this.disabled;
	},
	checkedChanged: function() {
		this.inherited(arguments);
		this.setContent(this.getChecked() ? this.onContent : this.offContent);
	}
});
