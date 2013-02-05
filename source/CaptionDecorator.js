/**
	moon.Button_ is an <a href="#enyo.Button">enyo.Button</a> with Moonraker styling
	applied. The color of the button may be customized by specifying a
	background color.

	For more information, see the documentation on
	<a href="https://github.com/enyojs/enyo/wiki/Buttons">Buttons</a> in the
	Enyo Developer Guide.
*/
enyo.kind({
	name: "moon.CaptionDecorator",
	published: {
		side: "top"
	},
	//* @protected
	classes: "moon enyo-unselectable moon-button-caption-decorator",
	components: [
		{kind: "enyo.Control", name: "leftCaption",   classes: "moon-caption left",   canGenerate: false, content: "Left Caption"},
		{kind: "enyo.Control", name: "topCaption",    classes: "moon-caption top",    canGenerate: false, content: "Top Caption"},
		{kind: "enyo.Control", name: "client",      classes: "moon-caption-client"},
		{kind: "enyo.Control", name: "rightCaption",  classes: "moon-caption right",  canGenerate: false, content: "Right Caption"},
		{kind: "enyo.Control", name: "bottomCaption", classes: "moon-caption bottom", canGenerate: false, content: "Bottom Caption"}
	],
	create: function() {
		this.inherited(arguments);
		this.sideChanged();
	},
	sideChanged: function() {
		var side = this.getSide();
		this.$.topCaption.canGenerate = (side === "top");
		this.$.rightCaption.canGenerate = (side === "right");
		this.$.bottomCaption.canGenerate = (side === "bottom");
		this.$.leftCaption.canGenerate = (side === "left");
		this.$.client.setClasses("moon-caption-client "+side);
		this.render();
	},
	contentChanged: function() {
		this.$[this.getSide()+"Caption"].setContent(this.getContent());
	}
});