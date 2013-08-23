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
		if (!this.getShowOnFocus()) return;

		this.$[this.getSide()+"Caption"].applyStyle("visibility", "hidden");
		this.$[this.getSide()+"Caption"].addClass("showOnFocus " + this.getSide());
	},
	contentChanged: function() {
		this.$[this.getSide()+"Caption"].setContent(this.getContent());
	},
	rendered: function () {
		this.inherited(arguments);
		if (this.getShowOnFocus() && this.hasNode()) {			
			this.captionBounds = this.getBounds();
			this.sideCaptionBounds = this.$[this.getSide()+"Caption"].getBounds();
			this.clientBounds = this.$.client.getBounds();
		}
	},
	spotFocus: function () {
		if (this.getShowOnFocus()) {
			var side = this.$[this.getSide()+"Caption"],
				paddingWidth = (this.captionBounds.width - this.clientBounds.width)/2,
				paddingHeight = (this.captionBounds.height - this.clientBounds.height)/2; 

			this.applyStyle('position', 'relative');

			switch (this.getSide()) {
			case "left": 
				side.applyStyle("left", (this.sideCaptionBounds.width * -1) + "px");
				break;
			case "right":
				side.applyStyle("left", (this.clientBounds.width + paddingWidth) + "px");
				break;
			case "top":
				side.applyStyle("top", (paddingHeight - this.sideCaptionBounds.height)  + "px");
				side.applyStyle("left", (Math.floor(this.captionBounds.width/2) - Math.floor(this.sideCaptionBounds.width/2)) + "px");
				break;
			case "bottom":
				side.applyStyle("top", this.clientBounds.height + paddingHeight + "px");
				side.applyStyle("left", (Math.floor(this.captionBounds.width/2) - Math.floor(this.sideCaptionBounds.width/2)) + "px");
			}
				
			side.applyStyle("visibility", "visible");
		}
	},
	spotBlur: function () {
		if (this.getShowOnFocus()) {
			this.$[this.getSide()+"Caption"].applyStyle("visibility", "hidden");
		}
	}
});