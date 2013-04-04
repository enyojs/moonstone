/**
	A control that activates a <a href="#moon.ContextualPopup">moon.ContextualPopup</a>. It loosely
	couples the Popup with an activating control, which may be a button or any
	other control with an _onActivate_ event. The decorator must surround both
	the	activating control and the popup itself. When the control is activated,
	the	popup shows itself in the correct position relative to the activator.

	{kind: "moon.ContextualPopupDecorator", components: [
		{content: "Show Popup"},
		{kind: "moon.ContextualPopup",
			components: [
				{content:"Sample component in popup"}
			]
		}
	]}
*/
enyo.kind({
	name: "moon.ContextualPopupDecorator",
	defaultKind: "moon.Button",
	//* @protected
	// selection on ios prevents tap events, so avoid.
	classes: "moon-contextual-popup-decorator enyo-unselectable",
	handlers: {
		onActivate: "activated",
		onHide: "popupHidden"
	},
	activated: function(inSender, inEvent) {
		this.requestHidePopup();
		if (inEvent.originator.active) {
			this.popupActive = true;
			this.activator = inEvent.originator;
			this.activator.addClass("active");
			this.requestShowPopup();
		}
	},
	popupHidden: function() {
		this.popupActive = false;
		if (this.activator) {
			this.activator.setActive(false);
			this.activator.removeClass("active");
		}
	},
	requestShowPopup: function() {
		this.waterfallDown("onRequestShowPopup", {activator: this.activator});
	},
	requestHidePopup: function() {
		this.waterfallDown("onRequestHidePopup");
	}
});