enyo.kind({
	name: "moon.Toggle",
	classes: "moon-toggle",
	//* @protected
	kind: "moon.Checkbox",
	_onContentString: "on",
	_offContentString: "off",
	tap: function(inSender, e) {
		if (!this.disabled) {
			this.setChecked(!this.getChecked());
			this.bubble("onchange");
		}
		return !this.disabled;
	},
	checkedChanged: function() {
		this.inherited(arguments);
		this.setContent(this.getChecked() ? this._onContentString : this._offContentString);
	}
});
