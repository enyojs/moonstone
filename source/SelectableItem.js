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
	},
	published: {
		//* Value of selectableItem; true if checked
		selected: false,
		//* Group API requirement for determining selected item
		active: false,
	},
	tools: [
		{kind: "Animator", onStep: "animatorStep", onEnd: "destroyOverlay"},
		{tag: "span"}
	],
	initComponents: function() {
		var content = this.getContent();
		this.createChrome(this.tools);
		this.controls[0].setContent(content);
		this.inherited(arguments);
	},
	tap: function(inSender, e) {
		if (!this.disabled) {
			this.setActive(!this.getActive());
			this.bubble("onchange");
		}
		return !this.disabled;
	},
	selectedChanged: function() {
		this.setNodeProperty("selected", this.selected);
		this.setAttribute("selected", this.selected ? "selected" : "");
		this.setActive(this.selected);
		this.controls[0].addRemoveClass("moon-underline", this.selected)
	},
	// active property, and onActivate event, are part of "GroupItem" interface
	// that we support in this object
	activeChanged: function() {
		this.active = enyo.isTrue(this.active);
		this.setSelected(this.active);
		this.bubble("onActivate");
	},
});