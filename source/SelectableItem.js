enyo.kind({
	name: "moon.SelectableItem",
	kind: "moon.Item",
	classes: "moon-selectableItem",
	spotlight: true,
	events: {
	//* Fires when the SelectableItem is tapped.
		onActivate: ""
	},
	handlers: {
		// prevents double bubbling of _onchange_ in IE
		onclick: ""
	},
	published: {
		//* True if this item is currently selected; false if not
		selected: false,
		//* For use with Enyo Group API; true if this item is the selected item in
		//* the group
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
	/**
		For use with the Enyo Group API, which is supported by this object. Called
		when the active item within the group changes. The _active_ property and
		_onActivate_ event are both part of the Group API.
	*/
	activeChanged: function() {
		this.active = enyo.isTrue(this.active);
		this.setSelected(this.active);
		this.bubble("onActivate");
	}
});