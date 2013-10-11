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
	classes: "moon-selectable-item",
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
	components: [
		{name: "indicator", classes: "moon-selectable-item-indicator"},
		{name: "client", kind: "moon.MarqueeText", classes: "moon-selectable-item-client"}
	],
	//@protected
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.contentChanged();
		};
	}),
	rendered: function() {
		this.inherited(arguments);
		this.selectedChanged();
	},
	shouldDoTransition: function(inSelected) {
		return inSelected === true;
	},
	tap: function(inSender, inEvent) {
		if (this.disabled) {
			return true;
		}
		
		this.setActive(!this.getActive());
		this.bubble("onchange");
	},
	selectedChanged: function() {
		var selected = this.getSelected();
		this.addRemoveClass("selected", selected);
		this.setNodeProperty("selected", selected);
		this.setAttribute("selected", selected ? "selected" : "");
		this.setActive(selected);
		this.stopMarquee();
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
	},
	contentChanged: function() {
		this.$.client.setContent(this.content);
	}
});