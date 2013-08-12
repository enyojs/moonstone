/**
	_sun.ProgressBar_ is a  control that shows the current progress of a
	process in a horizontal bar.

		{kind: "sun.ProgressBar", progress: 10}

	To animate progress changes, call the _animateProgressTo()_ method:

		this.$.progressBar.animateProgressTo(50);

	You may customize the color of the bar by applying a style via the
	_barClasses_ property, e.g.:

		{kind: "sun.ProgressBar", barClasses: "class-name"}

	For more information, see the documentation on
	<a href="https://github.com/enyojs/moonstone/wiki/Progress-Indicators">Progress Indicators</a>
	in the Enyo Developer Guide.
*/
// test
enyo.kind({
	name: "sun.ProgressBar",
	kind: "moon.ProgressBar",
	classes: "sun"
});
