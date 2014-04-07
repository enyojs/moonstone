/**
	_moon.BodyText_ is a simple control for displaying body text in an app.  It is
	designed to align with other text-based controls.
*/

enyo.kind({
	name: "moon.BodyText",
	//*	@protected
	classes: "moon-body-text moon-body-text-spacing",
	//* @public
	//* If true, HTML tags are allowed in the control's content 
	allowHtml: true,
	contentChanged: function() {
		this.inherited(arguments);
		this.detectTextDirectionality();
	}
});