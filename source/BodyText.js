/**
	_moon.BodyText_ is a simple control for displaying body text in an app.  It is
	designed to align with other text-based controls.
*/

enyo.kind({
	name: "moon.BodyText",
	//*	@protected
	classes: "moon-body-text moon-body-text-spacing moon-body-text-control",
	//* @public
	//* If true, HTML tags are allowed in the control's content
	allowHtml: true,
	published: {
		//* When true, text content is centered; otherwise left-aligned
		centered: false
	},
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.centeredChanged();
		};
	}),
	contentChanged: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.detectTextDirectionality();
			this.bubble("onRequestSetupBounds");
		};
	}),
	centeredChanged: function() {
		this.applyStyle("text-align", this.centered ? "center" : null);
	}
});