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
		//* When true, marqueeing will not occur
		disabled: false
	}
});

/**
	@public

	The _moon.MarqueeSupport_ mixin should be used with controls that contain multiple marquees
	whose animation behavior should be synchronized. Calling _this.startMarquee()_ or
	_this.stopMarquee()_ starts/stops all contained marquees.
*/
moon.MarqueeSupport = {
	name: "MarqueeSupport",
	marqueeOnSpotlight: true,
	
	//* @protected
	
	handlers: {
		onSpotlightFocus: "_marqueeSpotlightFocus",
		onSpotlightBlur: "_marqueeSpotlightBlur",
		onMarqueeEnded: "_marqueeEnded",
		onresize: "_marqueeResize"
	},
	marqueeActive: false,
	
	//* Initialize marquee timings during _create_
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.marqueeOnSpotlight = (this.marqueeOnSpotlight === undefined) ? true : this.marqueeOnSpotlight;
			this.marqueeSpeed =    (this.marqueeSpeed ===     undefined) ? 60 :    this.marqueeSpeed;
			this.marqueeDelay =    (this.marqueeDelay ===     undefined) ? 1000 :  this.marqueeDelay;
			this.marqueePause =    (this.marqueePause ===     undefined) ? 1000 :  this.marqueePause;
			this.marqueeHold  =    (this.marqueeHold  ===     undefined) ? 2000 :  this.marqueeHold;
			this.marqueeOnRender = (this.marqueeOnRender  === undefined) ? false : this.marqueeOnRender;
		};
	}),
	//* If _this.marqueeOnRender_ is true, kick off marquee animation
	rendered: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			if (this.marqueeOnRender) {
				this.startMarquee();
			}
		};
	}),
	//* On focus, start child marquees
	_marqueeSpotlightFocus: function(inSender, inEvent) {
		if (this.marqueeOnSpotlight) {
			this.startMarquee();
		}
	},
	//* On blur, halt child marquees
	_marqueeSpotlightBlur: function(inSender, inEvent) {
		if (this.marqueeOnSpotlight) {
			this.stopMarquee();
		}
	},
	//* When a child marquee animation completes, remove the child from _this.marqueeWaitList_
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
	_marqueeResize: function(inSender, inEvent) {
		if (this.marqueeOnSpotlight) {
			this._marqueeStartHold();
		}
	},
	
	//* @public
	
	//* Start timer to waterfall an _onRequestMarqueeStart_ event that kicks off marquee animation on all child marquees
	startMarquee: function() {
		this._buildMarqueeWaitList();
		
		if (this.marqueeWaitList.length === 0) {
			return;
		}
	
		this.marqueeActive = true;
		this.startJob("marqueeSupportJob", "_startChildMarquees", this.marqueeDelay);
	},
	//* Waterfall an _onRequestMarqueeStop_ event to halt all running child marquees
	stopMarquee: function() {
		this.stopJob("marqueeSupportJob");
		this.marqueeActive = false;
		this._stopChildMarquees();
	},
	//* Add _inControl_ to _this.marqueeWaitList_
	addMarqueeItem: function(inControl) {
		this.marqueeWaitList.push(inControl);
	},
	
	//* @protected
	
	//* Waterfall request for child animations to build up _this.marqueeWaitList_
	_buildMarqueeWaitList: function() {
		this.marqueeWaitList = [];
		this.waterfall("onRequestMarquee", {originator: this, marqueePause: this.marqueePause, marqueeSpeed: this.marqueeSpeed});
	},
	//* Waterfall event to kick off child marquee animations
	_startChildMarquees: function() {
		this.waterfall("onRequestMarqueeStart");
	},
	//* Waterfall event to halt child marquee animations
	_stopChildMarquees: function() {
		this.waterfall("onRequestMarqueeStop");
	},
	//* Begin delayed restart of child marquee animations
	_marqueeStartHold: function() {
		this.startJob("marqueeSupportJob", "startMarquee", this.marqueeHold);
	}
};


/**
	@public

	The _moon.MarqueeSupport_ mixin is used to add marquee animation functionality
	to a control.
*/
moon.MarqueeItem = {
	events: {
		onMarqueeEnded:""
	},
	
	//* @protected
	
	handlers: {
		onRequestMarquee: "requestMarquee",
		onRequestMarqueeStart: "startMarqueeAnimation",
		onRequestMarqueeStop: "stopMarqueeAnimation",
		ontransitionend: "marqueeAnimationEnded"
	},
	observers: {
		marqueeContentChanged: ["content"]
	},
	classes: "moon-marquee",
	//* When the content of this control changes, update the content of _this.$.marqueeText_ (if it exists)
	marqueeContentChanged: function() {
		if (this.$.marqueeText) {
			this.$.marqueeText.setContent(this.content);
		}
	},
	//* If this control needs to marquee, let the event originator know
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
	marqueeAnimationEnded: function(inSender, inEvent) {
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
	//* Determine how far the marquee needs to scroll
	calcMarqueeDistance: function() {
		var node = this.getMarqueeNode() || this.hasNode();
		return node.scrollWidth - node.clientWidth;
	},
	//* Return duration based on _inDistance_ and _this.marqueeSpeed_
	calcMarqueeDuration: function(inDistance) {
		return inDistance / this.marqueeSpeed;
	},
	//* Return the marquee-able node
	getMarqueeNode: function() {
		this.marqueeNode = this.marqueeNode || (this.$.marqueeText ? this.$.marqueeText.hasNode() : null);
		return this.marqueeNode;
	},
	//* Create a marquee-able div inside of _this_
	createMarquee: function() {
		this.createComponent({classes: "moon-marquee-text-wrapper", components: [{name: "marqueeText", classes: "moon-marquee-text", allowHtml: this.allowHtml, content: this.content}]});
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

//* @public
enyo.kind({
	name: "moon.MarqueeDecorator",
	//* @protected
	mixins: ["moon.MarqueeSupport"],
	style: "overflow: hidden;"
});
