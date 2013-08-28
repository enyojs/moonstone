/**
	_moon.CaptionDecorator_ wraps a control with a caption. The position of the
	caption is defined via the _side_ property.

		{kind: "moon.CaptionDecorator", side: "top", content: "Top Label", components: [
			{kind: "moon.Button", content: "My Button", ontap: "buttonTapped"},
		]}
*/
enyo.kind({
	name: "moon.CaptionDecorator",
	handlers: {
		onSpotlightFocus:"spotFocus",
		onSpotlightBlur:"spotBlur"
	},
	published: {
		side: "top",
		showOnFocus: false
	},
	//* @protected
	classes: "moon-button-caption-decorator",
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
		this.showOnFocusChanged();
	},
	sideChanged: function() {
		var side = this.getSide();
		this.$.topCaption.canGenerate = (side === "top");
		this.$.rightCaption.canGenerate = (side === "right");
		this.$.bottomCaption.canGenerate = (side === "bottom");
		this.$.leftCaption.canGenerate = (side === "left");
		this.$.client.setClasses("moon-caption-client "+side);
		if (this.hasNode()) {
			this.render();
		}
	},
	showOnFocusChanged: function() {
		this.$[this.getSide()+"Caption"].applyStyle("opacity", this.getShowOnFocus() ? 0 : 1);
	},
	contentChanged: function() {
		this.$[this.getSide()+"Caption"].setContent(this.getContent());
	},
	spotFocus: function () {
		if (this.getShowOnFocus()) {
			this.$[this.getSide()+"Caption"].applyStyle("opacity", 1);
		}
	},
	spotBlur: function () {
		if (this.getShowOnFocus()) {
			this.$[this.getSide()+"Caption"].applyStyle("opacity", 0);
		}
	}
});