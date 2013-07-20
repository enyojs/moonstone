/**
	_moon.SelectableItem_ is a <a href="#moon.Item">moon.Item</a> with a flag to
	track selection state.  It is especially useful within the context of the
	<a href="#enyo.Group">Enyo Group API</a>.

	When selected, the item appears as underlined.

	If multiple SelectableItems are used in a group, only one of them may be in
	the selected state at a given time.
*/

enyo.kind({
	name: "moon.SelectableItem",
	kind: "moon.Item",
	classes: "moon-selectableItem",
	events: {
	//* Fires when the SelectableItem is tapped.
		onActivate: ""
	},
	handlers: {
		// Prevents double bubbling of _onchange_ in IE.
		onclick: ""
	},
	published: {
		//* True if this item is currently selected; false if not
		selected: false,
		//* For use with Enyo Group API; true if this item is the selected item in
		//* the group
		active: false
	},
	components: [	// This client allow underline to fit the content
		{name: "client", classes: "moon-selectableItem-item"}
	],
	shouldDoTransition: function(inSelected) {
		return inSelected === true;
	},
	tap: function(inSender, e) {
		if (!this.disabled) {
			this.setActive(!this.getActive());
			this.$.client.addRemoveClass("moon-overlay", this.getActive());
			this.bubble("onchange");
		}
		return !this.disabled;
	},
	selectedChanged: function() {
		this.$.client.removeClass("moon-overlay");
		this.setNodeProperty("selected", this.selected);
		this.setAttribute("selected", this.selected ? "selected" : "");
		this.setActive(this.selected);
		this.$.client.addRemoveClass("moon-underline", this.selected);
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