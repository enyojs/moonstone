/**
	_sun.DropDownDecorator_ is a control that activates a
	<a href="#sun.DropDown">sun.DropDown</a>. It loosely couples
	the popup with an activating control, which may be a button or any other
	control that fires an _onActivate_ event. The decorator surrounds both the
	activating control and the DropDown.

	When the control is activated, the DropDown popup shows itself in the correct position
	relative to the activator.

		{kind: "sun.DropDownDecorator", components: [
			{content: "Show Popup"},
			{kind: "sun.DropDown",
				components: [
					{content:"Sample component in popup"}
				]
			}
		]}
*/
enyo.kind({
	name: "sun.DropDownDecorator",
	defaultKind: "sun.DropDownButton",
	classes: "sun-drop-down-decorator",
	//* @protected
	// selection on ios prevents tap events, so avoid.
	handlers: {
		onActivate: "activated",
		onHide: "popupHidden",
		onSpotlightBlur: "spotBlur"
	},
	activated: function(inSender, inEvent) {
		// Don't process activate events that came from inside this decorator
		if(inEvent.originator.kind == "sun.OptionItem") {
			this.requestHidePopup();
			this.controls[0].setContent(inEvent.originator.content);
			return;
		}
		else if (inEvent.sentFromPopup && inEvent.sentFromPopup.isDescendantOf(this)) {
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
