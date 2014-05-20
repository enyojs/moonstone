/**
	_moon.RadioItemGroup_ is a container in which a group of
	[moon.RadioItem](#moon.RadioItem) objects are laid out horizontally. Within a
	group, only one item may be active at a time; tapping on an item will
	deactivate any previously-tapped item.

		{kind: "moon.RadioItemGroup", onActivate: "buttonActivated", components: [
			{content: "Lions", selected: true},
			{content: "Tigers"},
			{content: "Bears"}
		]}
*/
enyo.kind({
	name: "moon.RadioItemGroup",
	kind: "enyo.Group",
	//* @protected
	classes: "moon-radio-item-group",
	defaultKind: "moon.RadioItem"
});