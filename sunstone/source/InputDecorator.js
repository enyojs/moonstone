/**
	_sun.InputDecorator_ is a control that provides input styling. Any controls
	in the InputDecorator will appear to be inside an area styled as an	input.
	Usually, an InputDecorator surrounds a <a href='#sun.Input'>sun.Input</a>:

		{kind: 'sun.InputDecorator', components: [
			{kind: 'sun.Input'}
		]}

	Other controls, such as buttons, may be placed to the right or left of the
	input control, e.g.:

		{kind: 'sun.InputDecorator', components: [
			{kind: 'sun.IconButton', src: 'search.png'},
			{kind: 'sun.Input'},
			{kind: 'sun.IconButton', src: 'cancel.png'}
		]}

	Note that the InputDecorator fits around the content inside it. If the
	decorator is sized, then its contents will likely need to be sized as well.

		{kind: 'sunInputDecorator', style: 'width: 500px;', components: [
			{kind: 'sunInput', style: 'width: 100%;'}
		]}
*/
enyo.kind({
	name    : "sun.InputDecorator",
	kind    : "moon.InputDecorator",
	classes	: "sun"
});