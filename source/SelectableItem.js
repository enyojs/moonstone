enyo.kind({
	name: "moon.SelectableItem",
	kind: "moon.Item",
	classes: "moon-selectableItem",
	spotlight: true,
	events: {
	//* Fires when selectableItem is tapped.
		onActivate: ""
	},	
	handlers: {
		// prevent double onchange bubble in IE
		onclick: "",
		onwebkitTransitionEnd: "destroyOverlay"
	},
	published: {
		//* Value of selectableItem; true if checked
		selected: false,
		//* Group API requirement for determining selected item
		active: false,
	},
	tools: [
		{kind: "Animator", onStep: "animatorStep", onEnd: "destroyOverlay"},
		{name: "textUnderline", tag: "span"}
	],
	initComponents: function() {
		var content = this.getContent();
		this.createChrome(this.tools);
		this.$.textUnderline.setContent(content);
		this.inherited(arguments);
	},
	shouldDoTransition: function(inSelected) {
		return inSelected === true;
	},
	tap: function(inSender, e) {
		if (!this.disabled) {
			this.setActive(!this.getActive());
			if(this.shouldDoTransition(this.getActive())) {
				this.glowTransition(this.getActive());
			} else {
				this.destroyOverlay();
			}
	
			this.bubble("onchange");
		}
		return !this.disabled;
	},
	glowTransition: function(inSelected) {
		if(this.$.overlay) {
			this.destroyOverlay(this.$.overlay);
		}
		this.$.textUnderline.addClass("moon-overlay");
		//setTimeout(function() { overlay.addClass("off"); }, 50);
	},
	destroyOverlay: function(inSender, inEvent) {
		this.$.textUnderline.removeClass("moon-overlay");
	},
	selectedChanged: function() {
		this.setNodeProperty("selected", this.selected);
		this.setAttribute("selected", this.selected ? "selected" : "");
		this.setActive(this.selected);
		this.$.textUnderline.addRemoveClass("moon-underline", this.selected);
	},
	// active property, and onActivate event, are part of "GroupItem" interface
	// that we support in this object
	activeChanged: function() {
		this.active = enyo.isTrue(this.active);
		this.setSelected(this.active);
		this.bubble("onActivate");
	},
});