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
		//* Determines whether spinner's background is transparent (default is false)
		transparent: false
	},
	components: [
		{name: "decorator", classes: "moon-spinner-ball-decorator spin-ball-animation", components: [
			{classes: "moon-spinner-ball moon-spinner-ball1"},
			{classes: "moon-spinner-ball moon-spinner-ball2"},
			{classes: "moon-spinner-ball moon-spinner-ball3"}
		]}
	],
	spinnerTools: [
		{name: "client", classes: "moon-spinner-client"}
	],
	initComponents: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.createTools();
		};
	}),
	createTools: function() {
		// This allows for the spinner instances with child components to not have
		// MarqueeText kind on the client container.
		var tools = enyo.clone(this.spinnerTools);
		if (!(this.components && this.components.length > 0)) {
			// If there are no components in the spinner, convert its client area to a MarqueeText kind
			enyo.mixin(tools[0], {
				kind: "moon.MarqueeText",
				mixins: ["moon.MarqueeSupport"],
				marqueeOnSpotlight: false,
				marqueeOnHover: true,
				marqueeOnRender: true,
				marqueeOnRenderDelay: 1000
			});
		}
		this.createChrome(tools);
	},
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.contentChanged();
			this.transparentChanged();
			this.addClass("running");
		};
	}),
	//* @public
	//* Hides the animating spinner.
	stop: function() {
		this.set("showing", false);
	},
	//* Shows the spinner with animation.
	start: function() {
		this.set("showing", true);
	},
	//* Toggles the spinner's visibility state.
	toggle: function() {
		this.set("showing", !this.get("showing"));
	},
	//* @protected
	hasContent: function() {
		// true if this.content is set to something OR if there are more than zero components
		return (!!this.content || (this.components && this.components.length > 0));
	},
	contentChanged: enyo.inherit(function (sup) {
		return function(inOld) {
			sup.apply(this, arguments);
			if (this.content || inOld) {
				this.$.client.set("content", this.content);
			}
			this.$.client.set("showing", !!this.content);
			this.addRemoveClass("content", this.hasContent());
		};
	}),
	transparentChanged: function() {
		this.addRemoveClass("moon-spinner-transparent-background", !!this.get("transparent"));
	}
});
