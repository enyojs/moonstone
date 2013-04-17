enyo.kind({
	name: "moon.Header",
	classes: "moon-header",
	// style: "background: purple; border: 2px solid red;",
	published: {
		//* Sets the title for the header
		title: '',
		//* Sets the titleAbove for the header
		titleAbove: '',
		//* Sets the titleBelow for the header
		titleBelow: ''
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
			"border" : myStyle["border-bottom-width"]
		};
		this.$.title.animProps = {
			"font-size" : titleStyle["font-size"],
			"line-height" : titleStyle["line-height"],
			"padding" : titleStyle["padding"]
		};
		this.$.titleAbove.animProps = {
			"padding" : titleAboveStyle["padding"]
		};
		
		this.$.animator.newAnimation({
			animationName: "collapse",
			duration: 800,
			timingFunction: "cubic-bezier(.42, 0, .16, 1.1)",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"height" : "current",
						"border-bottom-width" : "current"
					}
				},
				{
					control: this.$.titleAbove,
					properties: {
						"padding" : "current"
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
				50: [{
					control: this,
					properties: {
						"height" : "100px",
						"border-bottom-width" : "1px",
						"width" : "current"
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
					control: this.$.titleAbove,
					properties: {
						"padding" : "10px 0px 5px 0px"
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
						"width" : "200px"
					}
				}],
				
			}
		});
		this.$.animator.play();
	},
	//* @public
	animateExpand: function() {
		this.$.animator.newAnimation({
			animationName: "collapse",
			duration: 500,
			timingFunction: "cubic-bezier(.42, 0, .16, 1.1)",
			keyframes: {
				0: [{
					control: this,
					properties: {
						"width" : "current"
					}
				}],
				50: [{
					control: this,
					properties: {
						"width" : "auto",
						"height" : "current",
						"border-bottom-width" : "current"
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
					control: this.$.titleAbove,
					properties: {
						"padding" : "current"
					}
				},
				{
					control: this.$.client,
					properties: {
						"opacity" : "current"
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
					control: this.$.titleAbove,
					properties: {
						"padding" : this.$.titleAbove.animProps["font-size"]
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
				}],
				
			}
		});
		this.$.animator.play();
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
		//* Sets the title of the header item
		title: '',
		//* Sets the description of the header item
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