enyo.kind({
	name: "moon.Item",
	classes: "moon-item",
	spotlight: true,
	handlers: {
		onSpotlightFocused: "spotlightFocused"
	},
	published: {
		//* When true, button is shown as disabled and does not generate tap
		//* events
		disabled: false,
		//* The relative position of the spotlight;
		//* valid values are "locale-default", "left", "right", "top", and "bottom"
		//* The locale-specific setting selects either left or right, depending on the
		//* default text-direction of the current locale, when enyo-ilib is loaded
		//* (defaults to left if enyo-ilib is not loaded)
		spotlightPosition: "locale-default",
		//* The behavior of the spotlight
		spotlightOverlay: false
	},
	//* @protected
	overlayComponents: [
		{name: "overlay", classes: "moon-item-overlay", addBefore: true}
	],
	create: function() {
		this.inherited(arguments);
		this.disabledChanged();
	},
	initComponents: function() {
		this.inherited(arguments);
		this.spotlightConfig();
	},
	rendered: function() {
		this.inherited(arguments);
		this.setSpotlightBounds();
	},
	spotlightConfig: function() {
		if (this.spotlightOverlay) {
			this.createComponents(this.overlayComponents);
			this.addClass("overlay");
		}
		this.addClass(this.spotlightPosition);
	},
	setSpotlightBounds: function() {
		if (this.spotlightOverlay) {
			var b = this.getBounds();
			var ob;
			switch (this.spotlightPosition) {
				case "top":
					ob = {width: b.width};
					break;
				case "bottom":
					ob = {width: b.width, bottom: 0};
					break;
				case "left":
					ob = {height: b.height};
					break;
				case "right":
					ob = {height: b.height, right: 0};
					break;
			}
			this.$.overlay.setBounds(ob);
		}
	},
	spotlightPositionChanged: function(inOld) {
		this.removeClass(inOld);
		this.addClass(this.spotlightPosition);
	},
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
	},
	spotlightFocused: function(inSender, inEvent) {
		this.bubble("onRequestScrollIntoView", {side: "top"});
		return true;
	}
});
