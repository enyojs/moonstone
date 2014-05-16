/**
	_moon.ContextualPopupDecorator_ is a control that activates a
	[moon.ContextualPopup](#moon.ContextualPopup). It loosely couples the popup
	with an activating control, which may be a button or any other control that
	fires an _onActivate_ event. The decorator surrounds both the activating
	control and the contextual popup.

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
	//* @protected
	defaultKind: "moon.ContextualPopupButton",
	// selection on ios prevents tap events, so avoid.
	classes: "moon-contextual-popup-decorator",
	handlers: {
		onActivate: "activated",
		onShow: "popupShown",
		onHide: "popupHidden"
	},
	activated: function(inSender, inEvent) {
		// Don't process activate events that came from inside this decorator
		if (inEvent.sentFromPopup && inEvent.sentFromPopup.isDescendantOf(this)) {
			return;
		}

		this.requestHidePopup();
		if (inEvent.originator.active) {
			this.activator = inEvent.originator;
			// if this ContextualPopup is already activated
			if (this.popupActived) {	
				inEvent.originator.active = false;
				this.popupActived = false;
			} else {
				this.activator.addClass("active");
				this.requestShowPopup();	
			}
		}			
	},
	/**
		onShow event handler. 
		Due to popup is "client control" of decorator
		we should provide connetor between them.

		@param {inSender} the component that most recently propagated onShow event
		@param {inEvent} an object which contains event information
	*/
	popupShown: function(inSender, inEvent) {
		if (this.popup === undefined) {
			this.popup = inEvent.originator;
		}
	},
	/**
		If you tap out of popup control, {@link enyo.Popup} close it
	*/
	popupHidden: function() {
		if (this.activator) {
			this.popupActived = this.popup.popupActived;
			this.activator.active = false;
			this.activator.removeClass("active");
			this.activator.removeClass("pressed");
		}
	},
	requestShowPopup: function() {
		this.waterfallDown("onRequestShowPopup", {activator: this.activator});
	},
	requestHidePopup: function() {
		this.waterfallDown("onRequestHidePopup");
	}
});