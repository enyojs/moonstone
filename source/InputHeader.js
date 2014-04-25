/**
	_moon.InputHeader_ is a header that uses an input for the title. While this
	was initially created as an independent subkind of [moon.Header](#moon.Header),
	its unique functionality has since been folded back into the latter kind,
	making the current _moon.InputHeader_ simply a _moon.Header_ for which
	_inputMode_ is set to _true_. We continue to offer _moon.InputHeader_ as a
	separate kind for reasons of convenience and backward compatibility.

	The _title_ property is used as the input placeholder, while the _value_
	property contains the contents of the input. Developers may listen for
	_onInputHeaderInput_ and _onInputHeaderChange_ events from the embedded input
	to respond to changes.

			{
				kind: "moon.InputHeader",
				title: "Input Header",
				titleAbove: "02",
				titleBelow: "Sub Header",
				subTitleBelow: "Sub-sub Header",
				components: [
					{kind: "moon.IconButton", src: "assets/icon-like.png"},
					{kind: "moon.IconButton", src: "assets/icon-next.png"}
				]
			}
*/
enyo.kind({
	//* @public
	name: "moon.InputHeader",
	kind: "moon.Header",
	//* @protected
	classes: "moon-input-header",
	inputMode: true
});
