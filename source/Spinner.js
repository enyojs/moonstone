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
	//* @protected
	classes: "moon-spinner",
	//* @public
	published: {
		//* Set the background of the spinner to transparent (defaults to false)
		transparent: false
	},
	components: [
		{name: "decorator", classes: "moon-spinner-ball-decorator spin-ball-animation", components: [
			{classes: "moon-spinner-ball moon-spinner-ball1"},
			{classes: "moon-spinner-ball moon-spinner-ball2"},
			{classes: "moon-spinner-ball moon-spinner-ball3"}
		]},
		{name: "client", classes: "moon-spinner-text"}
	],
	create: function() {
		this.inherited(arguments);
		this.contentChanged();
		this.transparentChanged();
		// Begin our animation, so each ball is in-sync (for slower devices)
		this.addRemoveClass("running", true);
	},
	//* @public
	//* Hides the animating spinner.
	stop: function() {
		this.set("showing", false);
	},
	//* Shows the spinner with animation.
	start: function() {
		this.set("showing", true);
	},
	/** Toggle existing state of spinner.
		If spinner is visible it will be removed and viceversa.
	*/
	toggle: function() {
		this.set("showing", !this.get("showing"));
	},
	//* @protected
	contentChanged: function() {
		this.inherited(arguments);
		this.$.client.setContent(this.content);
		this.$.client.set("showing", !!this.content);
		this.addRemoveClass("content", !!this.content);
	},
	transparentChanged: function() {
		this.addRemoveClass("moon-spinner-transparent-background", !!this.get("transparent"));
	}
});
