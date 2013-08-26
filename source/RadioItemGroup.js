/**
	_moon.RadioItemGroup_ is a container in which a group of
	<a href="#moon.RadioItem">moon.RadioItem</a> objects are laid out
	horizontally. Within a group, only one item may be active at a time; tapping
	on an item will deactivate any previously-tapped item.

		{kind: "moon.RadioItemGroup", onActivate: "buttonActivated", components: [
			{content: "Cats", active: true},
			{content: "Dogs"},
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