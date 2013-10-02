/**
	_moon.MarqueeText_ is a basic text control that supports marquee animation.
	When _moon.MarqueeText_ objects are used inside a
	[moon.MarqueeDecorator](#moon.MarqueeDecorator), the decorator synchronizes
	their start times; the user may start a marquee programmatically by calling
	_startMarquee()_.

		enyo.kind({
			name: "moon.Header",
			mixins: ["moon.MarqueeSupport"],
			marqueeSpeed: 100,
			components: [
				{kind: "moon.MarqueeText", content: "longText+longText"},
				{kind: "moon.MarqueeText", content: "longText"}
			],
			rendered: function() {
				this.startMarquee();
			}
		});

	To add the marquee feature to a kind, simply use the MarqueeSupport mixin:

		enyo.kind({
			name: "moon.MarqueeButton",
			kind: "enyo.Button",
			mixins: ["moon.MarqueeSupport"],
			components: [
				{kind:"moon.MarqueeText"}
			],
			contentChanged: function() {
				this.$.marqueeText.setContent(this.content);
			}
		});
*/


enyo.kind({
	name: "moon.MarqueeText",
	mixins: ["moon.MarqueeItem"],
	published: {
		//* Speed of marquee animation, in pixels per second
		marqueeSpeed: 60,
		/**
			Time in milliseconds that the marquee will pause at the end of the
			animation, before resetting to the beginning
		*/
		marqueePause: 1000,
		/**
			Whether this control should clip itself inside its parent's padding. If
			false, the parent control must have _overflow: hidden_ set, and the marquee
			text will clip at the parent's border.
		*/
		clipInsidePadding: true,
		//* When true, marqueeing will not occur
		disabled: false,
		//* _allowHtml_ property of Marquee text
		allowHtmlText: false
	}
});

moon.MarqueeSupport = {
	name: "MarqueeSupport",
	//*@protected
	classes: "moon-marquee-container",
	handlers: {
		onSpotlightFocus: "_marqueeSpotlightFocus",
		onSpotlightBlur: "_marqueeSpotlightBlur",
		onReturnRequestedMarquee: "_marqueeStarted",
		onMarqueeEnded: "_marqueeEnded",
		onresize: "_marqueeResize"
	},
	
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.marqueeOnSpotlight = (this.marqueeOnSpotlight === undefined) ? true : this.marqueeOnSpotlight;
			this.marqueeSpeed = (this.marqueeSpeed === undefined) ? 60 : this.marqueeSpeed;
			this.marqueeDelay = (this.marqueeDelay === undefined) ? 1000 : this.marqueeDelay;
			this.marqueePause = (this.marqueePause === undefined) ? 1000 : this.marqueePause;
			this.marqueeHold  = (this.marqueeHold  === undefined) ? 2000 : this.marqueeHold;
		};
	}),
	//*@public
	startMarquee: function() {
		this.buildMarqueeWaitList();
		
		if (this.marqueeWaitList.length == 0) {
			return;
		}
	
		this.marqueeActive = true;
		this.startJob("_startMarquee", "_startMarquee", this.marqueeDelay);
	},
	//* Build up _this.marqueeWaitList_
	buildMarqueeWaitList: function() {
		this.marqueeWaitList = [];
		this.waterfall("onRequestMarquee", {originator: this, marqueePause: this.marqueePause, marqueeSpeed: this.marqueeSpeed});
	},
	//* 
	addMarqueeItem: function(inControl) {
		this.marqueeWaitList.push(inControl);
	},
	_startMarquee: function() {
		this.waterfall("onRequestMarqueeStart");
	},
	stopMarquee: function() {
		this.stopJob("_startMarquee");
		this.marqueeActive = false;
		this.waterfall("onRequestMarqueeStop");
	},
	//*@protected
	_marqueeSpotlightFocus: function(inSender, inEvent) {
		if (!this.marqueeOnSpotlight) {
			return;
		}
		
		this.startMarquee();
	},
	_marqueeSpotlightBlur: function(inSender, inEvent) {
		if (this.marqueeOnSpotlight) {
			this.stopMarquee();
		}
	},
	_marqueeStarted: function(inSender, inEvent) {
		if (this.marqueeWaitList) {
			this.marqueeWaitList.push(inEvent.originator);
		}
		return true;
	},
	_marqueeEnded: function(inSender, inEvent) {
		if (this.marqueeActive) {
			enyo.remove(inEvent.originator, this.marqueeWaitList);
			if (this.marqueeWaitList.length === 0) {
				this._marqueeStartHold();
				this.marqueeActive = false;
			}
		}
		return true;
	},
	_marqueeStartHold: function() {
		this.startJob("_startMarquee", "startMarquee", this.marqueeHold);
	},
	_marqueeResize: function(inSender, inEvent) {
		if (this.marqueeOnSpotlight !== false) {
			return;
		}
		
		this._marqueeStartHold();
	}
};

moon.MarqueeItem = {
	events: {
		onMarqueeEnded:""
	},
	handlers: {
		onRequestMarquee: "requestMarquee",
		onRequestMarqueeStart: "startMarqueeAnimation",
		onRequestMarqueeStop: "stopMarqueeAnimation",
		ontransitionend: "animationEnded"
	},
	observers: {
		marqueeContentChanged: ["content"]
	},
	classes: "moon-marquee-text",
	marqueeContentChanged: function() {
		if (this.$.marqueeText) {
			this.$.marqueeText.setContent(this.content);
		}
	},
	requestMarquee: function(inSender, inEvent) {
		if (!inEvent || !this.shouldAnimate()) {
			return true;
		}
		
		inEvent.originator.addMarqueeItem(this);
		
		this.marqueePause = inEvent.marqueePause || 1000;
		this.marqueeSpeed = inEvent.marqueeSpeed || 60;
		
		return true;
	},
	//* Start marquee animation
	startMarqueeAnimation: function() {
		var distance = this.calcMarqueeDistance();
		
		// If there is no need to animate, return early
		if (!this.shouldAnimate(distance)) {
			return;
		}
		
		// Lazy creation of _this.$.marqueeText_
		if (!this.$.marqueeText) {
			this.createMarquee();
		}
		
		this.addClass("animate-marquee");
		this.updateNodeCSSText(this.generateAnimationCSSText(distance));
		
		return true;
	},
	//* Stop marquee animation
	stopMarqueeAnimation: function(inSender, inEvent) {
		this.stopJob("stopMarquee");
		this.removeClass("animate-marquee");
		this.updateNodeCSSText("");

		this.doMarqueeEnded();
		return true;
	},
	//* When animation ends, start _this.stopMarquee_ job
	animationEnded: function(inSender, inEvent) {
		if (inEvent.originator !== this.$.marqueeText) {
			return;
		}
		
		this.startJob("stopMarquee", "stopMarqueeAnimation", this.marqueePause);
        return true;
	},
	//* Return _true_ if this control has enough content that it needs to animate
	shouldAnimate: function(inDistance) {
		inDistance = (inDistance && inDistance >= 0) ? inDistance : this.calcMarqueeDistance();
		return (!this.disabled && inDistance > 0);
	},
	calcMarqueeDistance: function() {
		var node = this.getMarqueeNode() || this.hasNode();
		return node.scrollWidth - node.clientWidth;
	},
	//* Return duration based on _inDistance_ and _this.marqueeSpeed_
	calcMarqueeDuration: function(inDistance) {
		return inDistance / this.marqueeSpeed;
	},
	getMarqueeNode: function() {
		this.marqueeNode = this.marqueeNode || (this.$.marqueeText ? this.$.marqueeText.hasNode() : null);
		return this.marqueeNode;
	},
	createMarquee: function() {
		this.createComponent({name: "marqueeText", allowHtml: this.allowHtml, content: this.content});
		this.render();
		return true;
	},
	//* Generate the CSS text for the marquee animation based on _inDistance_
	generateAnimationCSSText: function(inDistance) {
		var duration = this.calcMarqueeDuration(inDistance),
			transformProp = enyo.dom.getCssTransformProp();
		
		return enyo.dom.transition + ": " + transformProp + " " + duration + "s linear; " + transformProp + ": translateX( " + (-1 * inDistance) + "px);";
	},
	//* Set the cssText of marquee node to _inCSSString_
	updateNodeCSSText: function(inCSSString) {
		var node = this.getMarqueeNode();
		if (!node) {
			return;
		}
		node.style.cssText = inCSSString;
	}
};

enyo.kind({
	name: "moon.MarqueeDecorator",
	mixins: ["moon.MarqueeSupport"],
	style: "overflow: hidden;"
});
