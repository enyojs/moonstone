/**
	_moon.RadioItem_ is a modified [moon.Item](#moon.Item) control designed for
	use inside a [moon.RadioItemGroup](#moon.RadioItemGroup).

	It contains the properties of [moon.SelectableItem](#moon.SelectableItem) with
	an additional indicator component [moon.RadioItemIndicator](#moon.RadioItemIndicator).
*/
enyo.kind({
	name: "moon.RadioItem",
	kind: "moon.SelectableItem",
	//* @protected
	classes: "moon-radio-item",
	componentOverrides: {
		indicator: {kind: "moon.RadioItemIndicator"}
	}
});

//* @public

/**
	_moon.RadioItemIndicator_ is a control designed for use with
	[moon.RadioItem](#moon.RadioItem). It is used to display the indicator dot
	that appears when a RadioItem is selected.
*/
enyo.kind({
	name: "moon.RadioItemIndicator",
	kind: "enyo.Control",
	//* @protected
	classes: "moon-radio-item-indicator",
	components: [
		{classes: "moon-radio-item-indicator-center-dot"}
	]
});