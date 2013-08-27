/**
	_moon.ContextualPopupDecorator_ is a control that activates a
	<a href="#moon.ContextualPopup">moon.ContextualPopup</a>. It loosely couples
	the popup with an activating control, which may be a button or any other
	control that fires an _onActivate_ event. The decorator surrounds both the
	activating control and the contextual popup.

	When the control is activated, the popup shows itself in the correct position
	relative to the activator.

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
	defaultKind: "moon.ContextualPopupButton",
	//* @protected
	// selection on ios prevents tap events, so avoid.
	classes: "moon-contextual-popup-decorator moon enyo-unselectable",
	handlers: {
		onActivate: "activated",
		onHide: "popupHidden",
		onSpotlightBlur: "spotBlur"
	},
	activated: function(inSender, inEvent) {
		// Don't process activate events that came from inside this decorator
		if (inEvent.sentFromPopup && inEvent.sentFromPopup.isDescendantOf(this)) {
			return;
		}

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
			this.activator.removeClass("pressed");
		}
	},
	spotBlur: function(inSender, inEvent) {
		if ((this.activator !== undefined) && (!this.activator.keepOpen) && (this.popupActive) && (!enyo.Spotlight.getPointerMode())) {
			this.requestHidePopup();
		}
	},
	requestShowPopup: function() {
		this.waterfallDown("onRequestShowPopup", {activator: this.activator});
	},
	requestHidePopup: function() {
		this.waterfallDown("onRequestHidePopup");
	}
});