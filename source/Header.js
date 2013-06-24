/**
	_moon.Header_ is a Moonstone-styled control with a large title and an area for
	additional controls.
*/
enyo.kind({
	name: "moon.Header",
	classes: "moon-header moon-header-font",
	style: "overflow: visible;",
	published: {
		//* Title of the header
		title: '',
		//* Text above the header
		titleAbove: '',
		//* Text below the header
		titleBelow: '',
		//* If true, the moon-small-header css class will be applied to this header
		small: false
	},
	components: [
		{name: "titleAbove", classes: "moon-header-title-above"},
		{name: "title", classes: "moon-header-title"},
		{name: "titleBelow", kind: "moon.Item", spotlight: false, classes: "moon-header-title-below"},
		{name: "client", classes: "moon-header-client"},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],
	create: function() {
		this.inherited(arguments);
		this.smallChanged();
		this.titleChanged();
		this.titleAboveChanged();
		this.titleBelowChanged();
	},
	//* @public
	animateCollapse: function() {
		var titleStyle = enyo.dom.getComputedStyle(this.$.title.hasNode());
		var titleAboveStyle = enyo.dom.getComputedStyle(this.$.titleAbove.hasNode());
		var myStyle = enyo.dom.getComputedStyle(this.hasNode());

		// TODO - animator should track initial positions so we don't have to store these if we want to reverse the animation
		this.animProps = {
			"height" : myStyle["height"],
			"border" : myStyle["border-bottom-width"],
			"width"  : myStyle["width"]
		};
		this.$.title.animProps = {
			"font-size" : titleStyle["font-size"],
			"line-height" : titleStyle["line-height"],
			"padding" : titleStyle["padding"]
		};
		this.$.titleAbove.animProps = {
			"width" : titleAboveStyle["width"]
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
						"border-bottom-width" : "current"
					}
				}],
				40: [{
					control: this.$.titleAbove,
					properties: {
						"border-bottom-width" : "0px"
					}
				}],
				50: [{
					control: this,
					properties: {
						"height" : "100px",
						"border-bottom-width" : "1px",
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
						"width" : "30px",
						"min-width" : "30px",
						"max-width" : "30px"
					}
				}],

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
						"width" : this.animProps["width"],
						"min-width" : this.animProps["width"],
						"max-width" : this.animProps["width"],
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
						"border-bottom-width" : "1px"
					}
				}],
				100: [{
					control: this,
					properties: {
						"height" : this.animProps["height"],
						"border-bottom-width" : this.animProps["border-bottom-width"]
					}
				},
				{
					control: this.$.title,
					properties: {
						"font-size" : this.$.title.animProps["font-size"],
						"line-height" : this.$.title.animProps["line-height"],
						"padding" : this.$.title.animProps["padding"]
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
		this.log(this.getSmall());
		this.addRemoveClass("moon-small-header", this.getSmall());
	},
	//* @protected
	titleChanged: function() {
		this.$.title.setContent(this.title || this.content);
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