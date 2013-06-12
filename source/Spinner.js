/**
	_moon.Spinner_ is a control that shows a spinning animation to indicate that
	activity is taking place. By default, the spinner is light-colored and
	suitable for displaying against a dark background. If you need a dark spinner
	(to be shown on a lighter background), add the _moon-light_ CSS class:

		{kind: "moon.Spinner", classes: "moon-light"}

	Typically, a spinner is shown to indicate activity and hidden to indicate
	that the activity has ended. The animation automatically starts when the
	spinner is shown. If you wish, you may control the animation directly by
	calling the _start()_, _stop()_, and _toggle()_ methods.
*/
enyo.kind({
	name: "moon.Spinner",
	classes: "moon-spinner",
	//* @public
	//* Stops the spinner animation.
	stop: function() {
		this.setShowing(false);
	},
	//* Starts the spinner animation.
	start: function() {
		this.setShowing(true);
	},
	//* Toggles the spinner animation on or off.
	toggle: function() {
		this.setShowing(!this.getShowing());
	}
});
