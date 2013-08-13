/**
	_sun.Input_ is a Moonstone-styled input control for sun, derived from
	<a href='#moon.Input'>moon.Input</a>. Typically, a _sun.Input_ is placed
	inside a <a href="#sun.InputDecorator">sun.InputDecorator</a>, which
	provides styling, e.g.:

		{kind: 'sun.InputDecorator', components: [
			{kind: 'sun.Input', placeholder: 'Enter some text...', onchange: 'inputChange'}
		]}

	For more information, see the documentation on
	[Text Fields](https://github.com/enyojs/enyo/wiki/Text-Fields) in the Enyo
	Developer Guide.
*/

enyo.kind({
	name	: "sun.Input",
	kind	: "moon.Input",
	classes	: "sun"
});