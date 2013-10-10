/**
	@public

	The _moon.MarqueeSupport_ mixin should be used with controls that contain multiple marquees
	whose animation behavior should be synchronized. Calling _this.startMarquee()_ or
	_this.stopMarquee()_ starts/stops all contained marquees.
*/
moon.MarqueeSupport = {
	name: "MarqueeSupport",
	//* @protected
	_marquee_Handlers: {
		onRequestStartMarquee: "_marquee_requestStartMarquee",
		onSpotlightFocus: "_marquee_spotlightFocus",
		onSpotlightBlur: "_marquee_spotlightBlur",
		onMarqueeEnded: "_marquee_marqueeEnded",
		onresize: "_marquee_resize"
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
	dispatchEvent: enyo.inherit(function (sup) {
		return function(sEventName, oEvent, oSender) {
			if (!oEvent.delegate) {
				var handler = this._marquee_Handlers[sEventName];
				if (handler && this[handler](oSender, oEvent)) {
					return true;
				}
			}
			return sup.apply(this, arguments);
		};
	}),
	//* Handle external requests to kick off _marqueeStart_
	_marquee_requestStartMarquee: function() {
		if (this.marqueeOnRender) {
			this.stopMarquee();
			this.startMarquee();
			return true;
		}
	},
	//* On focus, start child marquees
	_marquee_spotlightFocus: function(inSender, inEvent) {
		if (this.marqueeOnSpotlight) {
			this.startMarquee();
		}
	},
	//* On blur, halt child marquees
	_marquee_spotlightBlur: function(inSender, inEvent) {
		if (this.marqueeOnSpotlight) {
			this.stopMarquee();
		}
	},
	//* When a child marquee animation completes, remove the child from _this.marqueeWaitList_
	_marquee_marqueeEnded: function(inSender, inEvent) {
		if (this.marqueeActive) {
			enyo.remove(inEvent.originator, this.marqueeWaitList);
			if (this.marqueeWaitList.length === 0) {
				this._marquee_startHold();
				this.marqueeActive = false;
			}
		}
		return true;
	},
	_marquee_resize: function(inSender, inEvent) {
		if (this.marqueeOnSpotlight && this.marqueeActive) {
			this.marqueeActive = false;
			this._marquee_startHold();
		}
	},
	
	//* @public
	
	//* Start timer to waterfall an _onRequestMarqueeStart_ event that kicks off marquee animation on all child marquees
	startMarquee: function() {
		this._marquee_buildWaitList();

		if (this.marqueeWaitList.length === 0) {
			return;
		}
	
		this.marqueeActive = true;
		this.startJob("marqueeSupportJob", "_marquee_startChildMarquees", this.marqueeDelay);
	},
	//* Waterfall an _onRequestMarqueeStop_ event to halt all running child marquees
	stopMarquee: function() {
		this.stopJob("marqueeSupportJob");
		this.marqueeActive = false;
		this._marquee_stopChildMarquees();
	},
	//* Add _inControl_ to _this.marqueeWaitList_
	addMarqueeItem: function(inControl) {
		this.marqueeWaitList.push(inControl);
	},
	
	//* @protected
	
	//* Waterfall request for child animations to build up _this.marqueeWaitList_
	_marquee_buildWaitList: function() {
		this.marqueeWaitList = [];
		this.waterfall("onRequestMarquee", {originator: this, marqueePause: this.marqueePause, marqueeSpeed: this.marqueeSpeed});
	},
	//* Waterfall event to kick off child marquee animations
	_marquee_startChildMarquees: function() {
		this.waterfall("onRequestMarqueeStart");
	},
	//* Waterfall event to halt child marquee animations
	_marquee_stopChildMarquees: function() {
		this.waterfall("onRequestMarqueeStop");
	},
	//* Begin delayed restart of child marquee animations
	_marquee_startHold: function() {
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
	_marqueeItem_Handlers: {
		onRequestMarquee: "_marquee_requestMarquee",
		onRequestMarqueeStart: "_marquee_startAnimation",
		onRequestMarqueeStop: "_marquee_stopAnimation",
		ontransitionend: "_marquee_animationEnded"
	},
	observers: {
		_marquee_contentChanged: ["content"]
	},
	classes: "moon-marquee",
	dispatchEvent: enyo.inherit(function (sup) {
		return function(sEventName, oEvent, oSender) {
			if (!oEvent.delegate) {
				var handler = this._marqueeItem_Handlers[sEventName];
				if (handler && this[handler](oSender, oEvent)) {
					return true;
				}
			}
			return sup.apply(this, arguments);
		};
	}),
	//* When the content of this control changes, update the content of _this.$.marqueeText_ (if it exists)
	_marquee_contentChanged: function() {
		if (this.$.marqueeText) {
			this.$.marqueeText.setContent(this.content);
			this._marquee_stopAnimation();
		}
	},
	//* If this control needs to marquee, let the event originator know
	_marquee_requestMarquee: function(inSender, inEvent) {
		if (!inEvent || !this._marquee_shouldAnimate()) {
			return;
		}
		
		inEvent.originator.addMarqueeItem(this);
		
		this.marqueePause = inEvent.marqueePause || 1000;
		this.marqueeSpeed = inEvent.marqueeSpeed || 60;
	},
	//* Start marquee animation
	_marquee_startAnimation: function(inSender, inEvent) {
		var distance = this._marquee_calcDistance();
		
		// If there is no need to animate, return early
		if (!this._marquee_shouldAnimate(distance)) {
			return;
		}
		
		// Lazy creation of _this.$.marqueeText_
		if (!this.$.marqueeText) {
			this._marquee_createMarquee();
		}
		
		this._marquee_addAnimationStyles(distance);
		return true;
	},
	//* Stop marquee animation
	_marquee_stopAnimation: function(inSender, inEvent) {
		this.stopJob("stopMarquee");
		this._marquee_removeAnimationStyles();
		this.doMarqueeEnded();
	},
	//* When animation ends, start _this.stopMarquee_ job
	_marquee_animationEnded: function(inSender, inEvent) {
		if (inEvent.originator !== this.$.marqueeText) {
			return;
		}
		
		this.startJob("stopMarquee", "_marquee_stopAnimation", this.marqueePause);
        return true;
	},
	//* Return _true_ if this control has enough content that it needs to animate
	_marquee_shouldAnimate: function(inDistance) {
		inDistance = (inDistance && inDistance >= 0) ? inDistance : this._marquee_calcDistance();
		return (!this.disabled && inDistance > 0);
	},
	//* Determine how far the marquee needs to scroll
	_marquee_calcDistance: function() {
		var node = this.$.marqueeText ? this.$.marqueeText.hasNode() : this.hasNode();
		return Math.abs(node.scrollWidth - node.clientWidth);
	},
	//* Return duration based on _inDistance_ and _this.marqueeSpeed_
	_marquee_calcDuration: function(inDistance) {
		return inDistance / this.marqueeSpeed;
	},
	//* Create a marquee-able div inside of _this_
	_marquee_createMarquee: function() {
		this.createComponent({classes: "moon-marquee-text-wrapper", components: [{name: "marqueeText", classes: "moon-marquee-text", allowHtml: this.allowHtml, content: this.content}]});
		// FIXME: When created in DataList, controls don't go through the normal render path that
		// sets this, but parent.generated==true is required for dynamically rendering new controls
		this.parent.generated = true;
		this.render();
		return true;
	},
	_marquee_addAnimationStyles: function(inDistance) {
		var duration = this._marquee_calcDuration(inDistance);
		
		this.$.marqueeText.addClass("animate-marquee");
		this.$.marqueeText.applyStyle("transition-duration", duration + "s");
		this.$.marqueeText.applyStyle("-webkit-transition-duration", duration + "s");
		
		// Need this timeout for FF!
		setTimeout(enyo.bind(this, function() {
			enyo.dom.transform(this.$.marqueeText, {translateX: this._marquee_adjustDistanceForRTL(inDistance) + "px"});
		}), 100);
	},
	_marquee_removeAnimationStyles: function() {
		if (!this.$.marqueeText) {
			return;
		}
		
		this.$.marqueeText.applyStyle("transition-duration", "0s");
		this.$.marqueeText.applyStyle("-webkit-transition-duration", "0s");	
		
		// Need this timeout for FF!
		setTimeout(enyo.bind(this, function() {
			this.$.marqueeText.removeClass("animate-marquee");
			enyo.dom.transform(this.$.marqueeText, {translateX: null});
		}), 0);
	},
	//* Flip distance value for RTL support
	_marquee_adjustDistanceForRTL: function(inDistance) {
		return this.rtl ? inDistance : inDistance * -1;
	}
};

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

enyo.kind({
	name: "moon.MarqueeDecorator",
	//* @protected
	mixins: ["moon.MarqueeSupport"],
	style: "overflow: hidden;"
});
