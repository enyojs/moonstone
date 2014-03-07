/**
	The _moon.MarqueeSupport_ mixin should be used with controls that contain
	multiple marquees whose animation behavior should be synchronized. Calling
	_this.startMarquee()_ or _this.stopMarquee()_ starts/stops all contained
	marquees.  

	The following properties defined on the base kind on which the mixin is applied 
	control the marquee behavior:

	* `marqueeOnSpotlight`: When true, marquee will start when spotlight focused and
		end when spotlight blurred.
	* `marqueeOnHover`: When true, marquee will run when hovered with the mouse.  This
		property is ignored if `marqueeOnSpotlight` is true.
	* `marqueeOnRender`: When true, marquee will start running as soon as it is rendered
		and run continuously.
	* `marqueeSpeed`: The speed of the marquee animation, in pixels/second.
	* `marqueeDelay`: The delay between spotlight focus/hover and the animation starting
		(only used when `marqueeOnSpotlight` or `marqueeOnHover` is true).
	* `marqueePause`: The duration between the last of all subordinate marquee animations
		ending and all animations restarting.
*/
moon.MarqueeSupport = {
	name: "MarqueeSupport",
	//* @protected
	_marquee_Handlers: {
		onRequestStartMarquee: "_marquee_requestStartMarquee",
		onSpotlightFocus: "_marquee_spotlightFocus",
		onSpotlightBlur: "_marquee_spotlightBlur",
		onenter: "_marquee_enter",
		onleave: "_marquee_leave",
		onMarqueeEnded: "_marquee_marqueeEnded",
		onresize: "_marquee_resize",

		// Stop propagation of requests coming from parent MarqueeSupport's, since
		// only this MarqueeSupport should be controlling its subordinate children
		onRequestMarquee: "_marquee_stopPropagation",
		onRequestMarqueeStart: "_marquee_stopPropagation",
		onRequestMarqueeStop: "_marquee_stopPropagation"
	},
	_marquee_active: false,
	//* Initializes marquee timings.
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.marqueeOnSpotlight = (this.marqueeOnSpotlight === undefined) ? true : this.marqueeOnSpotlight;
			this.marqueeOnHover =  (this.marqueeOnHover ===   undefined) ? false :  this.marqueeOnHover;
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
			// Needed for proper onenter/onleave handling
			if (this.strictlyInternalEvents[sEventName] && this.isInternalEvent(oEvent)) {
				return true;
			}
			// FIXME: not sure why events can arrive without event objects, but we gaurd here for safety
			if (oEvent && !oEvent.delegate) {
				var handler = this._marquee_Handlers[sEventName];
				if (handler && this[handler](oSender, oEvent)) {
					return true;
				}
			}
			return sup.apply(this, arguments);
		};
	}),
	//* Handles external requests to kick off _marqueeStart_.
	_marquee_requestStartMarquee: function() {
		if (this.marqueeOnRender) {
			this.stopMarquee();
			this.startMarquee();
			return true;
		}
	},
	//* On focus, starts child marquees.
	_marquee_spotlightFocus: function(inSender, inEvent) {
		this._marquee_isFocused = true;
		if (this.marqueeOnSpotlight) {
			this.startMarquee();
		}
	},
	//* On blur, halts child marquees.
	_marquee_spotlightBlur: function(inSender, inEvent) {
		this._marquee_isFocused = false;
		if (this.marqueeOnSpotlight) {
			this.stopMarquee();
		}
	},
	_marquee_enter: function(inSender, inEvent) {
		this._marquee_isHovered = true;
		if (this.marqueeOnHover && !this.marqueeOnSpotlight) {
			this.startMarquee();
		}
	},
	_marquee_leave: function(inSender, inEvent) {
		this._marquee_isHovered = false;
		if (this.marqueeOnHover && !this.marqueeOnSpotlight) {
			this.stopMarquee();
		}
	},
	_marquee_stopPropagation: function(inSender, inEvent) {
		if (inEvent.originator != this) {
			return true;
		}
	},
	/**
		When a child marquee animation completes, removes the child from
		_this.marqueeWaitList_.
	*/
	_marquee_marqueeEnded: function(inSender, inEvent) {
		if (this._marquee_active) {
			enyo.remove(inEvent.originator, this.marqueeWaitList);
			if (this.marqueeWaitList.length === 0) {
				this._marquee_startHold();
				this._marquee_active = false;
			}
		}
		return true;
	},
	_marquee_resize: function(inSender, inEvent) {
		if (this.marqueeOnSpotlight && this._marquee_active) {
			this._marquee_active = false;
			this._marquee_startHold();
		}
	},

	//* @public
	/**
		Starts timer to waterfall an _onRequestMarqueeStart_ event that kicks off
		marquee animation on all child marquees.
	*/
	startMarquee: function() {
		this._marquee_buildWaitList();

		if (this.marqueeWaitList.length === 0) {
			return;
		}

		this._marquee_active = true;
		this.startJob("marqueeSupportJob", "_marquee_startChildMarquees", this.marqueeDelay);
	},
	/**
		Waterfalls an _onRequestMarqueeStop_ event to halt all running child
		marquees.
	*/
	stopMarquee: function() {
		this.stopJob("marqueeSupportJob");
		this._marquee_active = false;
		this._marquee_stopChildMarquees();
	},
	enableMarquee: function() {
		this._marquee_enableChildMarquees();
	},
	disableMarquee: function() {
		this.stopMarquee();
		this._marquee_disableChildMarquees();
	},
	//* Adds _inControl_ to _this.marqueeWaitList_.
	addMarqueeItem: function(inControl) {
		this.marqueeWaitList.push(inControl);
	},
	//* Restarts marquee if needed (depends on marqueeOnSpotlight/marqueeOnRender settings)
	resetMarquee: function() {
		if ((this.marqueeOnSpotlight && this._marquee_isFocused) || 
			(this.marqueeOnHover && this._marquee_isHovered) || 
			this.marqueeOnRender) {
			// Batch multiple requests to reset from children being hidden/shown
			this.startJob("resetMarquee", "_resetMarquee", 10);
		}
	},

	//* @protected

	//* Stops and restarts the marquee animations
	_resetMarquee: function() {
		this.stopMarquee();
		this.startMarquee();
	},
	//* Waterfalls request for child animations to build up _this.marqueeWaitList_.
	_marquee_buildWaitList: function() {
		this.marqueeWaitList = [];
		this.waterfall("onRequestMarquee", {originator: this, marqueePause: this.marqueePause, marqueeSpeed: this.marqueeSpeed});
	},
	//* Waterfalls event to kick off child marquee animations.
	_marquee_startChildMarquees: function() {
		this.waterfall("onRequestMarqueeStart", {originator: this});
	},
	//* Waterfalls event to halt child marquee animations.
	_marquee_stopChildMarquees: function() {
		this.waterfall("onRequestMarqueeStop", {originator: this});
	},
	//* Waterfalls event to enable child marquee animations.
	_marquee_enableChildMarquees: function() {
		this.waterfall("onRequestMarqueeEnable");
	},
	//* Waterfalls event to disable child marquee animations.
	_marquee_disableChildMarquees: function() {
		this.waterfall("onRequestMarqueeDisable");
	},
	//* Begins delayed restart of child marquee animations.
	_marquee_startHold: function() {
		this.startJob("marqueeSupportJob", "startMarquee", this.marqueeHold);
	}
};

//* @public

/**
	The _moon.MarqueeItem_ mixin is used to add marquee animation functionality to
	a control.
*/
moon.MarqueeItem = {
	//* @public
	events: {
		onMarqueeEnded:""
	},
	//* @protected
	_marqueeItem_Handlers: {
		onRequestMarquee: "_marquee_requestMarquee",
		onRequestMarqueeStart: "_marquee_startAnimation",
		onRequestMarqueeStop: "_marquee_stopAnimation",
		onRequestMarqueeEnable: "_marquee_enable",
		onRequestMarqueeDisable: "_marquee_disable",
		ontransitionend: "_marquee_animationEnded"
	},
	observers: {
		_marquee_contentChanged: ["content"]
	},
	bindings: [
		{from: ".allowHtml", to:".$.marqueeText.allowHtml"}
	],
	classes: "moon-marquee",
	dispatchEvent: enyo.inherit(function (sup) {
		return function(sEventName, oEvent, oSender) {
			if (sup.apply(this, arguments)) {
				return true;
			}
			if (oEvent && !oEvent.delegate) {
				var handler = this._marqueeItem_Handlers[sEventName];
				if (handler && this[handler](oSender, oEvent)) {
					return true;
				}
			}
		};
	}),
	_marquee_enabled: true,
	_marquee_distance: null,
	_marquee_fits: null,
	_marquee_puppetMaster: null,
	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this._marquee_checkRtl();
		};
	}),
	reflow: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this._marquee_invalidateMetrics();
		};
	}),
	showingChangedHandler: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this._marquee_reset();
		};
	}),
	_marquee_invalidateMetrics: function() {
		this._marquee_distance = null;
		this._marquee_fits = null;
	},
	/**
		When the content of this control changes, updates the content of
		_this.$.marqueeText_ (if it exists).
	*/
	_marquee_contentChanged: function() {
		this._marquee_checkRtl();
		if (this.$.marqueeText) {
			this.$.marqueeText.setContent(this.content);
		}
		this._marquee_reset();
	},
	//* If this control needs to marquee, lets the event originator know.
	_marquee_requestMarquee: function(inSender, inEvent) {
		if (!inEvent || this.disabled || !this.showing || !this._marquee_enabled || this._marquee_fits) {
			return;
		}

		this._marquee_puppetMaster = inEvent.originator;
		inEvent.originator.addMarqueeItem(this);

		this.marqueePause = inEvent.marqueePause || 1000;
		this.marqueeSpeed = inEvent.marqueeSpeed || 60;
	},
	//* Starts marquee animation.
	_marquee_startAnimation: function(inSender, inEvent) {
		var distance = this._marquee_calcDistance();

		// If there is no need to animate, return early
		if (!this._marquee_shouldAnimate(distance)) {
			this._marquee_fits = true;
			this.doMarqueeEnded();
			return;
		}

		// Lazy creation of _this.$.marqueeText_
		if (!this.$.marqueeText) {
			this._marquee_createMarquee();
		}

		this._marquee_addAnimationStyles(distance);
		return true;
	},
	_marquee_enable: function() {
		this.set("_marquee_enabled", true);
	},
	_marquee_disable: function() {
		this.set("_marquee_enabled", false);
		this._marquee_stopAnimation();
	},
	//* Stops marquee animation.
	_marquee_stopAnimation: function(inSender, inEvent) {
		this.stopJob("stopMarquee");
		this._marquee_removeAnimationStyles();
		this.doMarqueeEnded();
	},
	//* When animation ends, starts _this.stopMarquee_ job.
	_marquee_animationEnded: function(inSender, inEvent) {
		if (inEvent.originator !== this.$.marqueeText) {
			return;
		}

		this.startJob("stopMarquee", "_marquee_stopAnimation", this.marqueePause);
        return true;
	},
	//* Returns _true_ if this control has enough content that it needs to animate.
	_marquee_shouldAnimate: function(inDistance) {
		inDistance = (inDistance && inDistance >= 0) ? inDistance : this._marquee_calcDistance();
		return (inDistance > 0);
	},
	//* Determines how far the marquee needs to scroll.
	_marquee_calcDistance: function() {
		if (this._marquee_distance !== null) {
			return this._marquee_distance;
		}
		var node = this.$.marqueeText ? this.$.marqueeText.hasNode() : this.hasNode();
		this._marquee_distance = Math.abs(node.scrollWidth - node.clientWidth);
		return this._marquee_distance;
	},
	//* Returns duration based on _inDistance_ and _this.marqueeSpeed_.
	_marquee_calcDuration: function(inDistance) {
		return inDistance / this.marqueeSpeed;
	},
	//* Creates a marquee-able div inside of _this_.
	_marquee_createMarquee: function() {
		this.createComponent({name:"marqueeTextWrapper", classes: "moon-marquee-text-wrapper", components: [{name: "marqueeText", classes: "moon-marquee-text", allowHtml: this.allowHtml, content: this.content}]});
		this.render();
		return true;
	},
	_marquee_addAnimationStyles: function(inDistance) {
		var duration = this._marquee_calcDuration(inDistance);

		this.$.marqueeText.addClass("animate-marquee");
		this.$.marqueeText.applyStyle("transition-duration", duration + "s");
		this.$.marqueeText.applyStyle("-webkit-transition-duration", duration + "s");

		enyo.dom.transform(this, {translateZ: 0});

		// Need this timeout for FF!
		setTimeout(this.bindSafely(function() {
			enyo.dom.transform(this.$.marqueeText, {translateX: this._marquee_adjustDistanceForRTL(inDistance) + "px"});
		}), enyo.platform.firefox ? 100 : 0);
	},
	_marquee_removeAnimationStyles: function() {
		if (!this.$.marqueeText) {
			return;
		}

		this.$.marqueeText.applyStyle("transition-duration", "0s");
		this.$.marqueeText.applyStyle("-webkit-transition-duration", "0s");

		// Need this timeout for FF!
		setTimeout(this.bindSafely(function() {
			this.$.marqueeText.removeClass("animate-marquee");
			enyo.dom.transform(this.$.marqueeText, {translateX: null});
			enyo.dom.transform(this, {translateZ: null});
		}), enyo.platform.firefox ? 100 : 0);
	},
	//* Flips distance value for RTL support
	_marquee_adjustDistanceForRTL: function(inDistance) {
		return this.rtl ? inDistance : inDistance * -1;
	},
	_marquee_reset: function() {
		this._marquee_invalidateMetrics();
		if (this._marquee_puppetMaster) {
			this._marquee_puppetMaster.resetMarquee();
		}
	},
	_marquee_checkRtl: function() {
		// Set RTL mode based on first character of content
		if (this.content.length) {
			var firstCharCode = this.content.charCodeAt(0);
			// Check if within Hebrew or Arabic ranges (in addition to Syriac to reduce number of comparisons)
			// Hebrew: 1424-1535
			// Arabic: 1536-1791, 1872-1919, 64336-65023, 65136-65279
			// Syriac: 1792-1871
			var isRtl = ((firstCharCode >= 1424 && firstCharCode <= 1919) ||
				(firstCharCode >= 64336 && firstCharCode <= 65023) ||
				(firstCharCode >= 65136 && firstCharCode <= 65279));
			this.rtl = isRtl;
			this.applyStyle("direction", isRtl ? "rtl" : "ltr");
		}
	}
};

//* @public

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
	//* @protected
	mixins: ["moon.MarqueeItem"],
	//* @public
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

//* @public
/**
	_moon.MarqueeDecorator_ is a wrapper for [moon.MarqueeText](#moon.MarqueeText)
	objects.
*/
enyo.kind({
	name: "moon.MarqueeDecorator",
	//* @protected
	mixins: ["moon.MarqueeSupport"],
	style: "overflow: hidden;"
});
