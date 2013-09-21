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

		var myStyle = enyo.dom.getComputedStyle(this.hasNode());
		var titleWrapperStyle = enyo.dom.getComputedStyle(this.$.titleWrapper.hasNode());
		var titleStyle = enyo.dom.getComputedStyle(this.$.title.hasNode());
		var titleBelowStyle = enyo.dom.getComputedStyle(this.$.titleBelow.hasNode());
		var subTitleBelowStyle = enyo.dom.getComputedStyle(this.$.subTitleBelow.hasNode());


		// TODO - animator should track initial positions so we don't have to store these if we want to reverse the animation
		this.smallAnimProps = {
			"height": myStyle["height"]
		};
		this.$.titleWrapper.smallAnimProps = {
			"padding-left": titleWrapperStyle["padding-left"],
			"top": titleWrapperStyle["top"]
		};
		this.$.title.smallAnimProps = {};
		this.$.titleBelow.smallAnimProps = {
			"top": titleBelowStyle["top"]
		};
		this.$.subTitleBelow.smallAnimProps = {
			"top": subTitleBelowStyle["top"]
		};

		this.$.animator.newAnimation({
			name: "collapseToSmall",
			duration: 200,
			timingFunction: "linear",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"height": "current"
					}
				}, {
					control: this.$.titleWrapper,
					properties: {
						"padding-left": "current",
						"top": "current"
					}
				}, {
					control: this.$.title,
					properties: {}
				}, {
					control: this.$.titleBelow,
					properties: {
						"top": "current"
					}
				}, {
					control: this.$.subTitleBelow,
					properties: {
						"top": "current"
					}
				}],
				70: [],
				100: [{
					control: this,
					properties: {
						"height": "260px"
					}
				}, {
					control: this.$.titleWrapper,
					properties: {
						"padding-left": "58px",
						"top": "-44px"
					}
				}, {
					control: this.$.title,
					properties: {}
				}, {
					control: this.$.titleBelow,
					properties: {
						"top": "-44px"
					}
				}, {
					control: this.$.subTitleBelow,
					properties: {
						"top": "-44px"
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
					control: this,
					properties: {
						"height": "current"
					}
				}, {
					control: this.$.titleWrapper,
					properties: {
						"padding-left": "current",
						"top": "current"
					}
				}, {
					control: this.$.title,
					properties: {}
				}, {
					control: this.$.titleBelow,
					properties: {
						"top": "current"
					}
				}, {
					control: this.$.subTitleBelow,
					properties: {
						"top": "current"
					}
				}],
				30: [],
				100: [{
					control: this,
					properties: {
						"height": this.smallAnimProps.height
					}
				}, {
					control: this.$.titleWrapper,
					properties: {
						"padding-left": this.$.titleWrapper.smallAnimProps["padding-left"],
						"top": this.$.titleWrapper.smallAnimProps["top"]
					}
				}, {
					control: this.$.title,
					properties: {}
				}, {
					control: this.$.titleBelow,
					properties: {
						"top": this.$.titleBelow.smallAnimProps["top"]
					}
				}, {
					control: this.$.subTitleBelow,
					properties: {
						"top": this.$.subTitleBelow.smallAnimProps["top"]
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
