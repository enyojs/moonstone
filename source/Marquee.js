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
	//*@protected
	handlers: {
		onRequestMarquee: "requestMarquee",
		onRequestMarqueeStart: "requestStart",
		onRequestMarqueeStop: "stopMarquee",
		onwebkitAnimationEnd: "animationEnded"
	},
	initComponents: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.addClass(this.clipInsidePadding ? "moon-marquee-clip" : "moon-marquee-text");
			if (this.clipInsidePadding) {
				this.createChrome([{name:"client", classes:"moon-marquee-text"}]);
				this.marqueeControl = this.$.client;
			} else {
				this.marqueeControl = this;
			}
		};
	}),
	//*@public
	startMarquee: function() {
		this.calcMarqueeDistance();
		if (!this.disabled && this.marqueeDistance > 0) {
			var xPos = (this.marqueeDistance * (this.rtl ? 1 : -1)) + "px";
			if (enyo.dom.canTransform()) {
				enyo.dom.transform(this.marqueeControl, {translateX: xPos});
			} else {
				this.marqueeControl.applyStyle("left", xPos);
			}
			this.marqueeControl.applyStyle("-webkit-animation-duration", this.marqueeDistance/this.marqueeSpeed + "s");
			this.marqueeControl.addClass("moon-marquee");
		}
	},
	stopMarquee: function(inSender, inEvent) {
		this.stopJob(this.id);
		if (enyo.dom.canTransform()) {
			enyo.dom.transform(this.marqueeControl, {translateX: 0});
		} else {
			this.marqueeControl.applyStyle("left", 0);
		}
		this.marqueeControl.removeClass("moon-marquee");
		this.marqueeRequested = false;
		this.doMarqueeEnded();
		return true;
	},
	//*@protected
	allowHtmlTextChanged: function() {
		if(this.marqueeControl) {
			this.marqueeControl.setAllowHtml(this.allowHtmlText);
		}
	},
	contentChanged: enyo.inherit(function(sup) {
		return function() {
			if (this.$.client) {
				this.$.client.setContent(this.content);
			} else {
				sup.apply(this, arguments);
			}
		};
	}),
	calcMarqueeDistance: function() {
		this.marqueeDistance = this.marqueeControl.hasNode().scrollWidth - this.marqueeControl.hasNode().clientWidth;
		return this.marqueeDistance;
	},
	requestMarquee: function(inSender, inEvent) {
		enyo.mixin(this, inEvent);
		this.calcMarqueeDistance();
		if (!this.disabled && this.marqueeDistance > 0) {
			this.doMarqueeStarted({marqueeDistance: this.marqueeDistance});
		}
		this.marqueeRequested = true;
		return true;
	},
	requestStart: function(inSender, inEvent) {
		this.startMarquee();
		return true;
	},
	animationEnded: function(inSender, inEvent) {
		this.startJob(this.id, enyo.bind(this, this.stopMarquee), this.marqueePause);
		return true;
	}
});

moon.MarqueeSupport = {
	name: "MarqueeSupport",
	//*@protected
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
			//this.log(this.id);
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
		if (this.marqueeOnSpotlight) {
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
	}
};

enyo.kind({
	name: "moon.MarqueeDecorator",
	mixins: ["moon.MarqueeSupport"],
	style: "overflow: hidden;"
});
