require('moonstone');

/**
* Contains the declaration for the {@link moon.MarqueeSupport} mixin and the {@link moon.MarqueeText} &
* {@link moon.MarqueeDecorator} kinds.
* @module moonstone/Marquee
*/

var 
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	Component = require('enyo/Component'),
	Signals = require('enyo/Signals');

/**
* There are a couple scenarios (window blurs and changing from pointer mode to 5-way) in which
* we'd like to stop an actively on-hover marqueeing control. This private instance manages
* those events centrally to minimize unnecessary Signal's subscribers.
*
* @private
*/
var observer = new Component({

	/**
	* @private
	*/
	hoverControl: null,

	/**
	* @private
	*/
	components: [
		{kind: Signals, onSpotlightModeChanged: 'handleModeChanged', onblur: 'handleBlur'}
	],

	/**
	* @private
	*/
	_setMarqueeOnHoverControl: function(oControl) {
		this.hoverControl = oControl;
	},

	/**
	* @private
	*/
	_getMarqueeOnHoverControl: function() {
		return this.hoverControl;
	},

	/**
	* @private
	*/
	handleModeChanged: function (sender, event) {
		if (!event.pointerMode && this.hoverControl) {
			this.hoverControl._marquee_leave();
		}
	},

	/**
	* @private
	*/
	handleBlur: function (sender, event) {
		if (this.hoverControl) {
			this.hoverControl._marquee_leave();
		}
	}
});

module.exports = {

	/**
	* @private
	*/
	name: 'MarqueeSupport',

	/**
	* @private
	*/
	_marquee_Handlers: {
		onRequestStartMarquee: '_marquee_requestStartMarquee',
		onSpotlightFocused: '_marquee_spotlightFocused',
		onSpotlightBlur: '_marquee_spotlightBlur',
		onenter: '_marquee_enter',
		onleave: '_marquee_leave',
		onMarqueeEnded: '_marquee_marqueeEnded',
		onresize: '_marquee_resize',

		// Stop propagation of requests coming from parent MarqueeSupport's, since
		// only this MarqueeSupport should be controlling its subordinate children
		onRequestMarquee: '_marquee_stopPropagation',
		onRequestMarqueeStart: '_marquee_stopPropagation',
		onRequestMarqueeStop: '_marquee_stopPropagation'
	},

	/**
	* @private
	*/
	_marquee_active: false,

	/**
	* When `true`, marquee starts when the control is {@link Spotlight} focused and ends
	* when it is spotlight blurred.
	*
	* @type {Boolean}
	* @default undefined
	* @public
	*/
	marqueeOnSpotlight: undefined,

	/**
	* When `true`, marquee runs while the control is hovered over with the mouse. This
	* property is ignored if [marqueeOnSpotlight]{@link moon.MarqueeSupport#marqueeOnSpotlight}
	* is `true`.
	*
	* @type {Boolean}
	* @default undefined
	* @public
	*/
	marqueeOnHover: undefined,

	/**
	* When `true`, marquee starts running as soon as the control is rendered, and runs
	* continuously.
	*
	* @type {Boolean}
	* @default undefined
	* @public
	*/
	marqueeOnRender: undefined,

	/**
	* The speed of the marquee animation, in pixels per second.
	*
	* @type {Number}
	* @default undefined
	* @public
	*/
	marqueeSpeed: undefined,

	/**
	* The delay between spotlight focus/hover and the start of the animation. (This is only
	* used when either [marqueeOnSpotlight]{@link moon.MarqueeSupport#marqueeOnSpotlight} or
	* [marqueeOnHover]{@link moon.MarqueeSupport#marqueeOnHover} is `true`.)
	*
	* @type {Number}
	* @default undefined
	* @public
	*/
	marqueeDelay: undefined,

	/**
	* Used when you want the marquee to run on render, after a specified delay.
	*
	* @type {Number}
	* @default undefined
	* @public
	*/
	marqueeOnRenderDelay: undefined,

	/**
	* The duration in milliseconds that the marquee will pause at the end of the
	* animation, before resetting to the beginning.
	*
	* @type {Number}
	* @default undefined
	* @public
	*/
	marqueePause: undefined,

	/**
	* Initializes marquee timings.
	*
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.marqueeOnSpotlight = (this.marqueeOnSpotlight === undefined) ? true : this.marqueeOnSpotlight;
			this.marqueeOnHover =  (this.marqueeOnHover ===   undefined) ? false :  this.marqueeOnHover;
			this.marqueeSpeed =    (this.marqueeSpeed ===     undefined) ? 60 :    this.marqueeSpeed;
			this.marqueeDelay =    (this.marqueeDelay ===     undefined) ? 1000 :  this.marqueeDelay;
			this.marqueePause =    (this.marqueePause ===     undefined) ? 1000 :  this.marqueePause;
			this.marqueeHold  =    (this.marqueeHold  ===     undefined) ? 2000 :  this.marqueeHold;
			this.marqueeOnRender = (this.marqueeOnRender  === undefined) ? false : this.marqueeOnRender;
			this.marqueeOnRenderDelay = (this.marqueeOnRenderDelay === undefined) ? this.marqueeDelay : this.marqueeOnRenderDelay;
		};
	}),

	/**
	* If {@link moon.MarqueeSupport#marqueeOnRender} is `true`, kicks off marquee animation.
	*
	* @method
	* @private
	*/
	rendered: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			if (this.marqueeOnRender && !this.disabled) {
				this.startMarqueeCustomDelay(this.marqueeOnRenderDelay);
			}
		};
	}),

	/**
	* @method
	* @private
	*/
	destroy: kind.inherit(function (sup) {
		return function () {
			if (this === observer._getMarqueeOnHoverControl()) {
				observer._setMarqueeOnHoverControl(null);
			}
			sup.apply(this, arguments);
		};
	}),

	/**
	* @method
	* @private
	*/
	dispatchEvent: kind.inherit(function (sup) {
		return function (sEventName, oEvent, oSender) {
			// Needed for proper onenter/onleave handling
			if (this.strictlyInternalEvents[sEventName] && this.isInternalEvent(oEvent)) {
				return true;
			}
			// FIXME: not sure why events can arrive without event objects, but we guard here for safety
			if (oEvent && !oEvent.delegate) {
				var handler = this._marquee_Handlers[sEventName];
				if (handler){
					this.cachePoint = true;
					if(this[handler](oSender, oEvent)) {
						return true;
					}
				}
			}
			return sup.apply(this, arguments);
		};
	}),

	/**
	* Handles external requests to kick off {@link moon.MarqueeSupport#marqueeStart}.
	*
	* @private
	*/
	_marquee_requestStartMarquee: function () {
		if (this.marqueeOnRender) {
			this.stopMarquee();
			this.startMarquee();
			return true;
		}
	},

	/**
	* On focus, starts child marquees.
	*
	* @private
	*/
	_marquee_spotlightFocused: function (sender, ev) {
		this._marquee_isFocused = true;
		if (this.marqueeOnSpotlight) {
			this.startMarquee();
		}
	},

	/**
	* On blur, halts child marquees.
	*
	* @private
	*/
	_marquee_spotlightBlur: function (sender, ev) {
		this._marquee_isFocused = false;
		if (this.marqueeOnSpotlight) {
			this.stopMarquee();
		}
	},

	/**
	* @private
	*/
	_marquee_enter: function (sender, ev) {
		this._marquee_isHovered = true;
		if ((this.marqueeOnHover && !this.marqueeOnSpotlight) ||
		(this.disabled && this.marqueeOnSpotlight)) {
			if (this.marqueeOnHover) {
				observer._setMarqueeOnHoverControl(this);
			}
			this.startMarquee();
		}
	},

	/**
	* @private
	*/
	_marquee_leave: function (sender, ev) {
		this._marquee_isHovered = false;
		if ((this.marqueeOnHover && !this.marqueeOnSpotlight) || (this.disabled && this.marqueeOnSpotlight)) {
			if (this.marqueeOnHover) {
				observer._setMarqueeOnHoverControl(null);
			}
			this.stopMarquee();
		}
	},

	/**
	* @private
	*/
	_marquee_stopPropagation: function (sender, ev) {
		if (ev.originator != this) {
			return true;
		}
	},

	/**
	* When a child marquee animation completes, removes the child from
	* [marqueeWaitList]{@link moon.MarqueeSupport#marqueeWaitList}.
	*
	* @private
	*/
	_marquee_marqueeEnded: function (sender, ev) {
		if (this._marquee_active) {
			util.remove(ev.originator, this.marqueeWaitList);
			if (this.marqueeWaitList.length === 0) {
				this._marquee_startHold();
				this._marquee_active = false;
			}
		}
		return true;
	},

	/**
	* @private
	*/
	_marquee_resize: function (sender, ev) {
		if (this.marqueeOnSpotlight && this._marquee_active) {
			this._marquee_active = false;
			this._marquee_startHold();
		}
	},

	/**
	* Starts timer to waterfall an
	* [onRequestMarqueeStart]{@link moon.MarqueeSupport#onRequestMarqueeStart} event
	* that kicks off marquee animation on all child marquees.
	*
	* @public
	*/
	startMarquee: function () {
		this.startMarqueeCustomDelay(this.marqueeDelay);
	},

	/**
	* Waterfalls an [onRequestMarqueeStop]{@link moon.MarqueeSupport#onRequestMarqueeStop}
	* event to halt all running child marquees.
	*
	* @public
	*/
	stopMarquee: function () {
		this.stopJob('marqueeSupportJob');
		this.stopJob('resetMarquee');
		this._marquee_active = false;
		this._marquee_stopChildMarquees();
	},

	/**
	* @public
	*/
	enableMarquee: function () {
		this._marquee_enableChildMarquees();
	},

	/**
	* @public
	*/
	disableMarquee: function () {
		this.stopMarquee();
		this._marquee_disableChildMarquees();
	},

	/**
	* Adds the passed-in [control]{@link enyo.Control} to the list of marquee items.
	*
	* @param {Object} control  The [control]{@link enyo.Control} to add.
	* @public
	*/
	addMarqueeItem: function (control) {
		this.marqueeWaitList.push(control);
	},

	/**
	* Restarts marquee if needed (depending on the
	* [marqueeOnSpotlight]{@link moon.MarqueeSupport#marqueeOnSpotlight} and
	* [marqueeOnRender]{@link moon.MarqueeSupport#marqueeOnRender} settings).
	*
	* @public
	*/
	resetMarquee: function () {
		if ((this.marqueeOnSpotlight && this._marquee_isFocused) ||
			(this.marqueeOnHover && this._marquee_isHovered) ||
			this.marqueeOnRender) {
			// Batch multiple requests to reset from children being hidden/shown
			this.startJob('resetMarquee', '_resetMarquee', 10);
		}
	},

	/**
	* Starts Marquee after a specified delay. Used to provide different delays for `onRender`
	* and `onSpotlight/Hover`.
	*
	* @param {Number} delay  Length of delay in milliseconds
	* @public
	*/
	startMarqueeCustomDelay: function (delay) {
		this._marquee_buildWaitList();

		if (this.marqueeWaitList.length === 0) {
			return;
		}

		this._marquee_active = true;
		this.startJob('marqueeSupportJob', '_marquee_startChildMarquees', delay);
	},

	/**
	* Stops and restarts the marquee animations.
	*
	* @private
	*/
	_resetMarquee: function () {
		this.stopMarquee();
		if (this.marqueeOnRender) { this.startMarqueeCustomDelay(this.marqueeOnRenderDelay); }
		else { this.startMarquee(); }
	},

	/**
	* Waterfalls request for child animations to build up
	* [marqueeWaitList]{@link moon.MarqueeSupport#marqueeWaitList}.
	*
	* @fires moon.MarqueeSupport#onRequestMarquee
	* @private
	*/
	_marquee_buildWaitList: function () {
		this.marqueeWaitList = [];
		this.waterfall('onRequestMarquee', {originator: this, marqueePause: this.marqueePause, marqueeSpeed: this.marqueeSpeed});
	},

	/**
	* Waterfalls event to kick off child marquee animations.
	*
	* @fires moon.MarqueeSupport#onRequestMarqueeStart
	* @private
	*/
	_marquee_startChildMarquees: function () {
		this.waterfall('onRequestMarqueeStart', {originator: this});
	},

	/**
	* Waterfalls event to halt child marquee animations.
	*
	* @fires moon.MarqueeSupport#onRequestMarqueeStop
	* @private
	*/
	_marquee_stopChildMarquees: function () {
		this.waterfall('onRequestMarqueeStop', {originator: this});
	},

	/**
	* Waterfalls event to enable child marquee animations.
	*
	* @fires moon.MarqueeSupport#onRequestMarqueeEnable
	* @private
	*/
	_marquee_enableChildMarquees: function () {
		this.waterfall('onRequestMarqueeEnable');
	},

	/**
	* Waterfalls event to disable child marquee animations.
	*
	* @fires moon.MarqueeSupport#onRequestMarqueeDisable
	* @private
	*/
	_marquee_disableChildMarquees: function () {
		this.waterfall('onRequestMarqueeDisable');
	},

	/**
	* Begins delayed restart of child marquee animations.
	*
	* @private
	*/
	_marquee_startHold: function () {
		this.startJob('marqueeSupportJob', 'startMarquee', this.marqueeHold);
	}
};
