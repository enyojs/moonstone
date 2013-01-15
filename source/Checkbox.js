enyo.kind({
	name: "moon.Checkbox",
	classes: "moon-checkbox",
	//* @protected
	kind: enyo.Checkbox,
	tag: "div",
	spotlight: true,
	handlers: {
		// prevent double onchange bubble in IE
		onclick: "",
		onwebkitTransitionEnd: "destroyOverlay"
	},
	tools: [
		{kind: "Animator", onStep: "animatorStep", onEnd: "destroyOverlay"}
	],
	initComponents: function() {
		this.createChrome(this.tools);
		this.inherited(arguments);
	},
	shouldDoTransition: function(inChecked) {
		return inChecked === true;
	},
	tap: function(inSender, e) {
		if (!this.disabled) {
			this.setChecked(!this.getChecked());
			if(this.shouldDoTransition(this.getChecked())) {
				this.glowTransition(this.getChecked());
			} else {
				this.destroyOverlay(this.$.overlay);
			}
			
			this.bubble("onchange");
		}
		return !this.disabled;
	},
	dragstart: function() {
		// Override enyo.Input dragstart handler, to allow drags to propagate for Checkbox
	},
	glowTransition: function(inChecked) {
		if(this.$.overlay) {
			this.destroyOverlay(this.$.overlay);
		}
		var overlay = this.createOverlayComponent().render();
		setTimeout(function() { overlay.addClass("off"); }, 50); // TODO - shouldn't need this timeout!
	},
	createOverlayComponent: function() {
		return this.createComponent({name: "overlay", classes: "moon-overlay"});
	},
	destroyOverlay: function(inSender, inEvent) {
		var overlay = this.$.overlay;
		if(overlay && inSender === overlay) {
			overlay.setShowing(false);
			overlay.destroy();
		}
	}
});
