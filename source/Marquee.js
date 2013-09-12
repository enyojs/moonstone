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
	classes: "moon-marquee-text",
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
	},
	events: {
		onMarqueeStarted:"",
		onMarqueeEnded:""
	},
	handlers: {
		onRequestMarquee: "requestMarquee",
		onRequestMarqueeStart: "startMarquee",
		onRequestMarqueeStop: "stopMarquee",
		ontransitionend: "animationEnded"
	},
	//* @protected
	
	allowHtml: true,
	
	create: function() {
		this.inherited(arguments);
		if (this.clipInsidePadding) {
			this.addClass("moon-marquee-clip");
		}
	},
	contentChanged: function() {
		var content = this.allowHtmlText ? this.get("content") : enyo.Control.escapeHtml(this.get("content")),
			id = this.id + "_marquee_node";
		this.content = "<div>" + content + "</div>";
		this.marqueeNode = null;
		this.inherited(arguments);
	},
	
	//* @public
	
	//* Start marquee animation
	startMarquee: function() {
		var distance = this.calcMarqueeDistance(),
			duration = this.calcMarqueeDuration(distance),
			node = this.getMarqueeNode(),
			transformProp = enyo.dom.getCssTransformProp(),
			styleString = enyo.dom.transition + ": " + transformProp + " " + duration + "s linear;  " + transformProp + ": translateX( " + (-1 * distance) + "px);";
		
		this.addClass("animate-marquee");
		
		if (node) {
			node.style.cssText = styleString;
		}
		
		this.doMarqueeStarted({marqueeDistance: distance});
		return true;
	},
	//* Stop marquee animation
	stopMarquee: function(inSender, inEvent) {
		var node = this.getMarqueeNode();
		this.stopJob("stopMarquee");
		this.doMarqueeEnded();
		
		this.removeClass("animate-marquee");
		
		if (node) {
			node.style.cssText = "";
		}
		return true;
	},
	
	//* @protected
	
	//* Return marquee distance based on difference of scrollWidth and clientWidth
	calcMarqueeDistance: function() {
		var node = this.getMarqueeNode();
		return node.scrollWidth - node.clientWidth;
	},
	//* Return duration based on _inDistance_ and _this.marqueeSpeed_
	calcMarqueeDuration: function(inDistance) {
		return inDistance / this.marqueeSpeed;
	},
	requestMarquee: function(inSender, inEvent) {
		enyo.mixin(this, inEvent);
		var distance = this.calcMarqueeDistance();
		
		if (!this.disabled && distance > 0) {
			this.doMarqueeStarted({marqueeDistance: distance});
		}
        return true;
	},
	//* When animation ends, start _this.stopMarquee_ job
	animationEnded: function(inSender, inEvent) {
		if (inEvent.originator !== this) {
			return;
		}
		
		this.startJob("stopMarquee", "stopMarquee", this.marqueePause);
        return true;
	},
	getMarqueeNode: function() {
		this.marqueeNode = this.marqueeNode || this.hasNode().getElementsByTagName("div")[0];
		return this.marqueeNode;
	}
});

moon.MarqueeSupport = {
	name: "MarqueeSupport",
	//*@protected
	classes: "moon-marquee-container",
	handlers: {
		onSpotlightFocus: "_marqueeSpotlightFocus",
		onSpotlightBlur: "_marqueeSpotlightBlur",
		onMarqueeStarted: "_marqueeStarted",
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
			this.marqueeHold = (this.marqueeHold === undefined) ? 5000 : this.marqueeHold;
		};
	}),
	//*@public
	startMarquee: function() {
		this.marqueeWaitList = [];
		this.waterfall("onRequestMarquee", {
			marqueePause: this.marqueePause,
			marqueeSpeed: this.marqueeSpeed
		});
		if (this.marqueeWaitList.length > 0) {
			this.marqueeActive = true;
			this.startJob(this.id, enyo.bind(this, function() {
				this.waterfall("onRequestMarqueeStart");
			}), this.marqueeDelay);
		}
	},
	stopMarquee: function() {
		this.stopJob(this.id);
		this.marqueeActive = false;
		this.waterfall("onRequestMarqueeStop");
	},
	//*@protected
	_marqueeSpotlightFocus: function(inSender, inEvent) {
		if (!this.marqueeOnSpotlight) {
			return;
		}
		
		if (this.marqueeCreated) {
			this.startMarquee();
		} else {
			this.marqueeCreated = this.createMarquee();
			this.startMarquee();
		}
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
		this.startJob(this.id, enyo.bind(this, this.startMarquee), this.marqueeHold);
	},
	_marqueeResize: function(inSender, inEvent) {
		if (this.marqueeOnSpotlight === false) {
			this.stopJob(this.id);
			this.startJob(this.id, enyo.bind(this, function() {
				this.startMarquee();
			}), 400);
		}
	},
	createMarquee: function() {
		this.createComponent({name: "marqueeText", kind:"moon.MarqueeText", allowHtmlText: this.allowHtml, content: this.content});
		this.render();
		return true;
	}
};

enyo.kind({
	name: "moon.MarqueeDecorator",
	mixins: ["moon.MarqueeSupport"],
	style: "overflow: hidden;"
});
