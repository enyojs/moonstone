/**
	_moon.RadioButtonGroup_ is a container in which a group of
	<a href="#moon.RadioButton">moon.RadioButton</a> objects are laid out
	horizontally. Within a given button group, tapping on one button will release
	any previously-tapped button.

		{kind: "moon.RadioButtonGroup", onActivate: "buttonActivated", components: [
			{content: "Cats", active: true},
			{content: "Dogs"},
			{content: "Bears"}
		]}
*/
enyo.kind({
	name: "moon.RadioButtonGroup",
	kind: "enyo.Group",
	published: {
		//* CSS classes to be applied to selected bar
		barClasses: ""
	},
	//* @protected
	classes: "enyo-tool-decorator moon-radio-button-group",
	handlers: {
		onActivate: "activate",
		onSpotlightFocus : "spotFocus",
		onSpotlightBlur	: "spotBlur"
	},
	moreComponents: [
		{kind: "enyo.Control", name: "bar", classes: "moon-button-bar"},
		{kind: "enyo.Animator", onStep: "animatorStep", onEnd: "animatorEnd"}
	],
	defaultKind: "moon.RadioButton",
	componentsRendered: false,
	lastBarPos: 0,
	create: function() {
		this.inherited(arguments);
		this.createComponents(this.moreComponents);
	},
	rendered: function() {
		this.inherited(arguments);
		this.barClassesChanged();
		this.init();
	},
	init: function() {
		this.componentsRendered = true;
		this.calcBarValue(this.active);
	},
	barClassesChanged: function(inOld) {
		this.$.bar.removeClass(inOld);
		this.$.bar.addClass(this.barClasses);
	},
	animatorStep: function(inSender) {
		this.updateBarPosition(this.$.bar, inSender.value);
	},
	updateBarPosition: function(inControl, inValue) {
		var xPos = inValue + "px";
		if (enyo.dom.canTransform()) {
			enyo.dom.transform(inControl, {translateX: xPos});
		} else {
			inControl.applyStyle("left", xPos);
		}
	},
	calcBarValue: function(activeItem) {
		var differential, xPos;
		if ((this.active) && (this.componentsRendered)) {
			if (this.active.kind === "moon.RadioButton") {
				this.$.bar.applyStyle("width", activeItem.contentWidth + "px");
				// IE8 doesn't return getBoundingClientRect().width, so we calculate from right/left. Who cares ... it's IE8 ... I know
				//var differential = activeItem.hasNode().getBoundingClientRect().width - activeItem.contentWidth;
				differential = (activeItem.hasNode().getBoundingClientRect().right - activeItem.hasNode().getBoundingClientRect().left) - activeItem.contentWidth - 25;
				//adjusting for 25 extra pixels added to make room for spotlight focus
				xPos = this.getCSSProperty(activeItem, "offsetLeft", false) + (differential / 2);
			}
			this.$.animator.play({
				startValue: this.lastBarPos,
				endValue: xPos,
				node: this.$.bar.hasNode()
			});
			this.lastBarPos = xPos;
		}
	},
	activate: function(inSender, inEvent) {
		if (this.highlander) {
			// deactivation messages are ignored unless it's an attempt
			// to deactivate the highlander
			if (!inEvent.originator.active) {
				// this clause prevents deactivating a grouped item once it's been active.
				// the only proper way to deactivate a grouped item is to choose a new
				// highlander.
				if (inEvent.originator === this.active) {
					this.active.setActive(true);
				}
			} else {
				this.setActive(inEvent.originator);
				this.$.bar.addClass("spotlight");
				this.calcBarValue(inEvent.originator);
			}
		}
	},
	getCSSProperty: function(target, property, style) {
		if (target.hasNode()) {
			return (style) ? target.node.style[property] : target.node[property];
		}
	},
	spotFocus: function(inSender, inEvent) {
		if ( (this.active == inEvent.originator) &&
		     (!this.$.bar.hasClass("spotlight")))
		{
			this.$.bar.addClass("spotlight");
		}		
	},
	spotBlur: function(inSender, inEvent) {
		if ( (this.active == inEvent.originator) &&
		     (this.$.bar.hasClass("spotlight")))
		{
			this.$.bar.removeClass("spotlight");
		}
	}
});