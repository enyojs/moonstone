/**
	_moon.ToggleText_, which extends [moon.Checkbox](#moon.Checkbox), is a control
	that looks like a switch with labels for an "on" state and an "off" state.
	When the ToggleText is tapped, it switches its state and fires an _onChange_
	event.
*/

enyo.kind({
	name: "moon.ToggleText",
	kind: "moon.Checkbox",
	//* @public
	published: {
		//* Text label for the "on" state
		onContent: moon.$L("on"),   // i18n "ON" label in moon.ToggleText / moon.ToggleItem widget
		//* Text label for the "off" state
		offContent: moon.$L("off")  // i18n "OFF" label in moon.ToggleText / moon.ToggleItem widget
	},
	//* @protected
	casedOnContent: "",
	casedOffContent: "",
	classes: "moon-toggle-text",
	components: [
		{name: "label", classes: "moon-toggle-text-text"}
	],
	create: function() {
		this.inherited(arguments);
		this.onContentChanged();
		this.offContentChanged();
		this.checkedChanged();
	},
	onContentChanged: function() {
		this.casedOnContent = enyo.toUpperCase( this.getOnContent() );
	},
	offContentChanged: function() {
		this.casedOffContent = enyo.toUpperCase( this.getOffContent() );
	},
	checkedChanged: function() {
		this.inherited(arguments);
		this.$.label.set("content", this.getChecked() ? this.casedOnContent : this.casedOffContent);
	},
	shouldDoTransition: function(inChecked) {
		return true;
	}
});
