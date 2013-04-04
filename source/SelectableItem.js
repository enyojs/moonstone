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
		onclick: ""
	},
	published: {
		//* Value of selectableItem; true if checked
		selected: false,
		//* Group API requirement for determining selected item
		active: false
	},
	tools: [
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
			this.$.textUnderline.addRemoveClass("moon-overlay", this.getActive());
			this.bubble("onchange");
		}
		return !this.disabled;
	},
	selectedChanged: function() {
		this.$.textUnderline.removeClass("moon-overlay");
		this.setNodeProperty("selected", this.selected);
		this.setAttribute("selected", this.selected ? "selected" : "");
		this.setActive(this.selected);
		this.$.textUnderline.addRemoveClass("moon-underline", this.selected);
		this.render();
	},
	// active property, and onActivate event, are part of "GroupItem" interface
	// that we support in this object
	activeChanged: function() {
		this.active = enyo.isTrue(this.active);
		this.setSelected(this.active);
		this.bubble("onActivate");
	}
});