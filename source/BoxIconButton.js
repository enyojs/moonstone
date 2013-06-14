/**
	_moon.BoxIconButton_ is a icon control that has 80x80 size.

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

