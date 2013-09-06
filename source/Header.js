/**
	_moon.Header_ is a Moonstone-styled control with a large title and an area for
	additional controls.
*/
enyo.kind({
	name: "moon.Header",
	classes: "moon-header",
	published: {
		//* Title of the header
		title: '',
		//* Text above the header
		titleAbove: '',
		//* Text below the header
		titleBelow: '',
		//* Sub-text below the header
		subTitleBelow: '',
		//* If true, the moon-small-header css class will be applied to this header
		small: false,
		//* URL src of a background image
		backgroundSrc: null,
		/**
			Background position, defined as a string in the form of _"vertical horizontal"_,
			with a space separating the _vertical_ and _horizontal_ properties (e.g. _"top right"_).
			If no second property is included, the horizontal value will default to _right_.
		*/
		backgroundPosition: "top right"
	},
	components: [
		{name: "texts", mixins: ["moon.MarqueeSupport"], marqueeOnSpotlight: false, components: [
			{name: "titleAbove", classes: "moon-super-header-text moon-header-title-above"},
			{name: "titleWrapper", classes: "moon-header-title-wrapper", components: [
				{name: "title", kind: "moon.MarqueeText", classes: "moon-header-font moon-header-title"}
			]},
			{name: "titleBelow", kind: "moon.MarqueeText", classes: "moon-header-title-below"},
			{name: "subTitleBelow", kind: "moon.MarqueeText", classes: "moon-header-sub-title-below"}
		]},
		{name: "client", classes: "moon-hspacing moon-header-client"},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],
	create: function() {
		this.inherited(arguments);
		this.smallChanged();
		this.titleChanged();
		this.titleAboveChanged();
		this.titleBelowChanged();
		this.subTitleBelowChanged();
		this.allowHtmlChanged();
		this.backgroundSrcChanged();
		this.backgroundPositionChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.startMarquee();
	},
	startMarquee: function() {
		this.$.texts.startMarquee();
	},
	stopMarquee: function() {
		this.$.texts.stopMarquee();
	},
	allowHtmlChanged: function() {
		this.$.title.setAllowHtmlText(this.allowHtml);
		this.$.titleBelow.setAllowHtmlText(this.allowHtml);
		this.$.subTitleBelow.setAllowHtmlText(this.allowHtml);
	},
	backgroundSrcChanged: function() {
		this.applyStyle("background-image", (this.backgroundSrc) ? "url(" + this.backgroundSrc + ")" : "none");
	},
	backgroundPositionChanged: function() {
		var posArray = this.backgroundPosition && this.backgroundPosition.split(" ") || [],
			posStr = (posArray.length === 0) ? "top right" : (posArray.length === 1) ? posArray[0] + " right" : posArray[0] + " " + posArray[1];
		this.applyStyle("background-position", posStr);
	},
	//* @public
	collapseToSmall: function() {
		if (this.collapsed) {
			return;
		}

		var titleAboveStyle = enyo.dom.getComputedStyle(this.$.titleAbove.hasNode());
		var myStyle = enyo.dom.getComputedStyle(this.hasNode());

		// TODO - animator should track initial positions so we don't have to store these if we want to reverse the animation
		this.smallAnimProps = {
			"height" : myStyle["height"]
			//"border" : myStyle["border-bottom-width"],
			//"width"  : myStyle["width"]
		};
		this.$.titleAbove.smallAnimProps = {
			"height" : titleAboveStyle["height"],
			"padding-top" : titleAboveStyle["padding-top"],
			"padding-bottom" : titleAboveStyle["padding-bottom"],
			"opacity" : titleAboveStyle["opacity"],
			"overflow" : titleAboveStyle["overflow"]
		};

		this.$.animator.newAnimation({
			name: "collapseToSmall",
			duration: 200,
			timingFunction: "linear",
			keyframes: {
				0: [{
					control: this.$.titleAbove,
					properties: {
						"height" : "current",
						"padding-top" : "current",
						"padding-bottom" : "current",
						"overflow" : "hidden"
					}
				},
				{
					control: this,
					properties: {
						"height" : "current"
					}
				}],
				70: [{
					control: this.$.titleAbove,
					properties: {
						"opacity" : "current"
					}
				}],
				100: [{
					control: this.$.titleAbove,
					properties: {
						"height" : "0px",
						"padding-top" : "0px",
						"padding-bottom" : "0px",
						"opacity" : "0"
					}
				},
				{
					control: this,
					properties: {
						"height" : "260px"
					}
				}]

			}
		});
		this.$.animator.play("collapseToSmall");
		this.collapsed = true;
	},
	expandToLarge: function() {
		if (!this.collapsed) {
			return;
		}

		this.$.animator.newAnimation({
			name: "expandToLarge",
			duration: 200,
			timingFunction: "linear",
			keyframes: {
				0: [{
					control: this.$.titleAbove,
					properties: {
						"height" : "current",
						"padding-top" : "current",
						"padding-bottom" : "current",
						"opacity" : "current"
					}
				},
				{
					control: this,
					properties: {
						"height" : "current"
					}
				}],
				30: [{
					control: this.$.titleAbove,
					properties: {
						"opacity" : this.$.titleAbove.smallAnimProps.opacity
					}
				}],
				100: [{
					control: this.$.titleAbove,
					properties: {
						"height" : this.$.titleAbove.smallAnimProps.height,
						"padding-top" : this.$.titleAbove.smallAnimProps["padding-top"],
						"padding-bottom" : this.$.titleAbove.smallAnimProps["padding-bottom"],
						"overflow" : this.$.titleAbove.smallAnimProps.overflow
					}
				},
				{
					control: this,
					properties: {
						"height" : this.smallAnimProps.height
					}
				}]
			}
		});
		this.$.animator.play("expandToLarge");
		this.collapsed = false;
	},
	//* @protected
	smallChanged: function() {
		this.addRemoveClass("moon-small-header", this.getSmall());
	},
	//* @protected
	contentChanged: function() {
		this.$.title.setContent(this.title || this.content);
	},
	//* @protected
	// For backward-compatibility with original API
	titleChanged: function() {
		this.contentChanged();
	},
	//* @protected
	titleAboveChanged: function() {
		this.$.titleAbove.addRemoveClass('no-border', this.titleAbove === '');
		this.$.titleAbove.setContent(this.titleAbove);
	},
	//* @protected
	titleBelowChanged: function() {
		this.$.titleBelow.setContent(this.titleBelow || '');
	},
	//* @protected
	subTitleBelowChanged: function() {
		this.$.subTitleBelow.setContent(this.subTitleBelow || '');
	},
	//* @protected
	animationComplete: function(inSender, inEvent) {
		// Do something?
	}
});
