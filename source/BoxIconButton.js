/**
	_moon.BoxIconButton_, which extends <a href="#moon.IconButton>moon.IconButton</a>,
	is an icon control 80x80 pixels in size. It is typically used inside the
	_components_ block of a _moon.VideoPlayer_.

		{kind: "moon.BoxIconButton", src: "assets/icon.png"}
*/
enyo.kind({
	name: "moon.BoxIconButton",
	kind: "moon.IconButton",
	classes: "moon-box-icon-button",
	create: function() {
		this.inherited(arguments);
		this.removeClass("moon-icon-button");
	}
});
