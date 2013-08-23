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
		small: false
	},
	components: [
		{name: "texts", mixins: ["moon.MarqueeSupport"], marqueeOnSpotlight: false, components: [
			{name: "titleAbove", classes: "moon-header-font moon-header-title-above"},
			{name: "title", kind: "moon.MarqueeText", classes: "moon-header-font moon-header-title"},
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
	animateCollapse: function(inWidth) {
		var titleStyle = enyo.dom.getComputedStyle(this.$.title.hasNode());
		var titleAboveStyle = enyo.dom.getComputedStyle(this.$.titleAbove.hasNode());
		var myStyle = enyo.dom.getComputedStyle(this.hasNode());
		inWidth = inWidth || 160;

		// TODO - animator should track initial positions so we don't have to store these if we want to reverse the animation
		this.breadcrumbAnimProps = {
			"height" : myStyle["height"],
			"border" : myStyle["border-bottom-width"],
			"width"  : myStyle["width"]
		};
		this.$.title.breadcrumbAnimProps = {
			"font-size" : titleStyle["font-size"],
			"line-height" : titleStyle["line-height"],
			"padding" : titleStyle["padding"]
		};
		this.$.titleAbove.breadcrumbAnimProps = {
			"width" : titleAboveStyle["width"],
			"opacity" : titleAboveStyle["opacity"],
			"height" : titleAboveStyle["height"],
			"padding-top" : titleAboveStyle["padding-top"],
			"padding-bottom" : titleAboveStyle["padding-bottom"]
		};

		this.$.animator.newAnimation({
			name: "collapse",
			duration: 800,
			timingFunction: "cubic-bezier(.42, 0, .16, 1.1)",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"height" : "current",
						"border-bottom-width" : "current",
						"background" : "current"
					}
				},
				{
					control: this.$.title,
					properties: {
						"font-size" : "current",
						"line-height" : "current",
						"padding" : "current"
					}
				},
				{
					control: this.$.client,
					properties: {
						"opacity" : "current"
					}
				}],
				30: [{
					control: this.$.titleAbove,
					properties: {
						"border-bottom-width" : "current",
						"opacity" : "current",
						"height" : "current",
						"padding-top" : "current",
						"padding-bottom" : "current"
					}
				}],
				40: [{
					control: this.$.titleAbove,
					properties: {
						"border-bottom-width" : "0px",
						"opacity" : "1",
						"height" : "36px",
						"padding-top" : "10px",
						"padding-bottom" : "10px"
					}
				}],
				50: [{
					control: this,
					properties: {
						"height" : "100px",
						"border-bottom-width" : "0px",
						"width" : "current",
						"min-width" : "current",
						"max-width" : "current"
					}
				},
				{
					control: this.$.title,
					properties: {
						"font-size" : "36px",
						"line-height" : "48px",
						"padding" : "0px"
					}
				},
				{
					control: this.$.client,
					properties: {
						"opacity" : "0"
					}
				}],
				100: [{
					control: this,
					properties: {
						"width" : inWidth + "px",
						"min-width" : inWidth + "px",
						"max-width" : inWidth + "px"
					}
				}]

			}
		});
		this.$.animator.play("collapse");
	},
	//* @public
	animateExpand: function() {
		this.$.animator.newAnimation({
			name: "expand",
			duration: 500,
			timingFunction: "cubic-bezier(.42, 0, .16, 1.1)",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"width" : "current",
						"min-width" : "current",
						"max-width" : "current"
					}
				}],
				50: [{
					control: this,
					properties: {
						"height" : "current",
						"border-bottom-width" : "current",
						"width" : this.breadcrumbAnimProps["width"],
						"min-width" : this.breadcrumbAnimProps["width"],
						"max-width" : this.breadcrumbAnimProps["width"]
					}
				},
				{
					control: this.$.title,
					properties: {
						"font-size" : "current",
						"line-height" : "current",
						"padding" : "current"
					}
				},
				{
					control: this.$.client,
					properties: {
						"opacity" : "current"
					}
				}],
				60: [{
					control: this.$.titleAbove,
					properties: {
						"border-bottom-width" : "current"
					}
				}],
				70: [{
					control: this.$.titleAbove,
					properties: {
						"border-bottom-width" : "1px",
						"opacity" : this.$.titleAbove.breadcrumbAnimProps["opacity"],
						"height" : this.$.titleAbove.breadcrumbAnimProps["height"],
						"padding-top" : this.$.titleAbove.breadcrumbAnimProps["padding-top"],
						"padding-bottom" : this.$.titleAbove.breadcrumbAnimProps["padding-bottom"]
					}
				}],
				100: [{
					control: this,
					properties: {
						"height" : this.breadcrumbAnimProps["height"],
						"border-bottom-width" : this.breadcrumbAnimProps["border-bottom-width"]
					}
				},
				{
					control: this.$.title,
					properties: {
						"font-size" : this.$.title.breadcrumbAnimProps["font-size"],
						"line-height" : this.$.title.breadcrumbAnimProps["line-height"],
						"padding" : this.$.title.breadcrumbAnimProps["padding"]
					}
				},
				{
					control: this.$.client,
					properties: {
						"opacity" : "1"
					}
				}]

			}
		});
		this.$.animator.play("expand");
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

enyo.kind({
	name: "moon.HeaderItem",
	kind: "moon.Item",
	classes: "moon-header-item",
	published: {
		//* Title of the header item
		title: '',
		//* Description of the header item
		description: ''
	},
	components: [
		{name: "title", classes: "moon-header-item-title"},
		{name: "description", classes: "moon-header-item-description"}
	],
	create: function() {
		this.inherited(arguments);
		this.titleChanged();
		this.descriptionChanged();
	},
	//* @protected
	titleChanged: function() {
		this.$.title.setContent(this.title);
	},
	//* @protected
	descriptionChanged: function() {
		this.$.description.setContent(this.description);
	}
});
