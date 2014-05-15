/**
	_moon.SelectableItem_ is a [moon.Item](#moon.Item) with a flag to track
	selection state.  It is especially useful within the context of the [Enyo
	Group API](#enyo.Group).

	When selected, the item appears as underlined.

	If multiple SelectableItems are used in a group, only one of them may be in
	the selected state at a given time.
*/

enyo.kind({
	name: "moon.SelectableItem",
	kind: "moon.Item",
	//* @protected
	classes: "moon-selectable-item",
	//* @public
	events: {
	//* Fires when the SelectableItem is tapped.
		onActivate: ""
	},
	//* @protected
	handlers: {
		// Prevents double bubbling of _onchange_ in IE.
		onclick: ""
	},
	//* @public
	published: {
		/**
			True if this item is currently selected; false if not
		*/
		selected: false,
		/**
			For use with the Enyo Group API; true if this item is the selected item in
			the group. Within this kind, _selected_ and _active_ appear to behave
			similarly; however, _active_ is meant to be used by _enyo.Group_, while
			_selected_ is to be used for changing selection state.
		*/
		active: false
	},
	//* @protected
	components: [
		{name: "indicator", classes: "moon-selectable-item-indicator"},
		{name: "client", kind: "moon.MarqueeText", classes: "moon-selectable-item-client"}
	],
    bindings: [
        {from: ".allowHtml", to: ".$.client.allowHtml"}
    ],
	//* @protected
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.contentChanged();
			this.updateSelectedValue();
		};
	}),
	rendered: function() {
		this.inherited(arguments);
		this.updateActiveValue();
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
	updateSelectedValue: function() {
		var selected = this.getSelected();
		this.addRemoveClass("selected", selected);
		this.setNodeProperty("selected", selected);
		this.setAttribute("selected", selected ? "selected" : "");
	},
	updateActiveValue: function() {
		this.setActive(this.getSelected());
		this.resetMarquee();
	},
	selectedChanged: function() {
		this.updateSelectedValue();
		this.updateActiveValue();
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