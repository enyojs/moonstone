/**
	_moon.RadioItem_ is a modified <a href="#moon.Button">moon.Button</a>
	control designed to be used inside a
	<a href="#moon.RadioItemGroup">moon.RadioItemGroup</a>.

	For more information, see the documentation on
	[Buttons](https://github.com/enyojs/enyo/wiki/Buttons) in the Enyo Developer
	Guide.
*/
enyo.kind({
	name: "moon.RadioItem",
	kind: "moon.SelectableItem",
	classes: "moon-radio-item",
	componentOverrides: {
		indicator: {kind: "moon.RadioItemIndicator"}
	}
});

enyo.kind({
	name: "moon.RadioItemIndicator",
	kind: "enyo.Control",
	classes: "moon-radio-item-indicator",
	components: [
		{classes: "moon-radio-item-indicator-center-dot"}
	]
});