(function (enyo, scope) {
	/**
	* Fires to queue up a list of child animations
	*
	* @event moon.MarqueeSupport#onRequestMarquee
	* @type {Object}
	* @property {Object} originator - contains a reference to the originator of this event
	*
	* @property {Boolean} marqueePause - contains the value of {@link #marqueePause}
	* @property {number} marqueeSpeed - contains the value of {@link #marqueeSpeed}
	* @private
	*/

	/**
	* Fires to start marquee animation in a child marquee.
	*
	* @event moon.MarqueeSupport#onRequestMarqueeStart
	* @type {Object}
	* @property {Object} originator - contains a reference to the originator of this event
	* @private
	*/

	/**
	* Fires to halt marquee animation in a child marquee.
	*
	* @event moon.MarqueeSupport#onRequestMarqueeStop
	* @type {Object}
	* @property {Object} originator - contains a reference to the originator of this event
	* @private
	*/

	/**
	* Fires to enable animation in a child marquee. No additional data is sent with this event.
	*
	* @event moon.MarqueeSupport#onRequestMarqueeEnable
	* @type {Object}
	* @private
	*/

	/**
	* Fires to disable animation in a child marquee. No additional data is sent with this event.
	*
	* @event moon.MarqueeSupport#onRequestMarqueeDisable
	* @type {Object}
	* @private
	*/

	/**
	* Fires when marquee ends. No additional data is sent with this event.
	*
	* @event moon.MarqueeItem#onMarqueeEnded
	* @type {Object}
	* @private
	*/

	/**
	* The _moon.MarqueeSupport_ mixin should be used with controls that contain
	* multiple marquees whose animation behavior should be synchronized. Calling
	* [this.startMarquee()]{@link moon.MarqueeSupport#startMarquee} or [this.stopMarquee()]{@link
	* moon.MarqueeSupport#stopMarquee} starts/stops all contained marquees.
	*
	* The following properties defined on the base kind on which the mixin is applied
	* control the marquee behavior:
	*
	* {@link moon.MarqueeSupport#marqueeOnSpotlight}: When `true`, marquee will start when
	* spotlight focused and end when spotlight blurred.
	*
	* {@link moon.MarqueeSupport#marqueeOnHover}: When `true`, marquee will run when hovered with
	* the mouse. This property is ignored if `marqueeOnSpotlight` is `true`.
	*
	* {@link moon.MarqueeSupport#marqueeOnRender}: When `true`, marquee will start running as soon
	* as it is rendered and run continuously.
	*
	* {@link moon.MarqueeSupport#marqueeSpeed}: The speed of the marquee animation, in
	* pixels/second.
	*
	* {@link moon.MarqueeSupport#marqueeDelay}: The delay between spotlight focus/hover and the
	* animation starting (only used when `marqueeOnSpotlight` or `marqueeOnHover` is `true`).
	*
	* {@link moon.MarqueeSupport#marqueeOnRenderDelay}: Used when you want the marquee to run on
	* render, after a custom delay
	*
	* {@link moon.MarqueeSupport#marqueePause}: The duration between the last of all subordinate
	* marquee animations ending and all animations restarting.
	*
	* @mixin moon.MarqueeSupport
	* @public
	*/
	moon.MarqueeSupport =  /** @lends moon.MarqueeSupport.prototype */ {

		/**
		* @private
		*/
		name: 'MarqueeSupport',

		/**
		* @private
		*/
		_marquee_Handlers: {
			onRequestStartMarquee: '_marquee_requestStartMarquee',
			onSpotlightFocus: '_marquee_spotlightFocus',
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
		* When `true`, marquee will start when spotlight focused and end when spotlight blurred.
		*
		* @type {Boolean}
		* @default undefined
		* @public
		*/
		marqueeOnSpotlight: undefined,

		/**
		* When true, marquee will run when hovered with the mouse. This property is ignored if
		* {#marqueeOnSpotlight} is `true`.
		*
		* @type {Boolean}
		* @default undefined
		* @public
		*/
		marqueeOnHover: undefined,

		/**
		* When true, marquee will start running as soon as it is rendered and run continuously.
		*
		* @type {Boolean}
		* @default undefined
		* @public
		*/
		marqueeOnRender: undefined,

		/**
		* The speed of the marquee animation, in pixels/second.
		*
		* @type {Number}
		* @default undefined
		* @public
		*/
		marqueeSpeed: undefined,

		/**
		* The delay between spotlight focus/hover and the animation starting (only used when
		* {#marqueeOnSpotlight} or {#marqueeOnHover} is true).
		*
		* @type {Number}
		* @default undefined
		* @public
		*/
		marqueeDelay: undefined,

		/**
		* Used when you want the marquee to run on render, after a custom delay
		*
		* @type {Number}
		* @default undefined
		* @public
		*/
		marqueeOnRenderDelay: undefined,

		/**
		* The duration between the last of all subordinate marquee animations ending and all animations
		* restarting.
		*
		* @type {Number}
		* @default undefined
		* @public
		*/
		marqueePause: undefined,

		/**
		* Initializes marquee timings.
		*
		* @private
		*/
		create: enyo.inherit(function (sup) {
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
		* If {@link moon.MarqueeSupport#marqueeOnRender} is `true`, kick off marquee animation
		*
		* @method
		* @private
		*/
		rendered: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				if (this.marqueeOnRender) {
					this.startMarqueeCustomDelay(this.marqueeOnRenderDelay);
				}
			};
		}),

		/**
		* @method
		* @private
		*/
		dispatchEvent: enyo.inherit(function (sup) {
			return function (sEventName, oEvent, oSender) {
				// Needed for proper onenter/onleave handling
				if (this.strictlyInternalEvents[sEventName] && this.isInternalEvent(oEvent)) {
					return true;
				}
				// FIXME: not sure why events can arrive without event objects, but we guard here for safety
				if (oEvent && !oEvent.delegate) {
					var handler = this._marquee_Handlers[sEventName];
					if (handler && this[handler](oSender, oEvent)) {
						return true;
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
		_marquee_spotlightFocus: function (inSender, inEvent) {
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
		_marquee_spotlightBlur: function (inSender, inEvent) {
			this._marquee_isFocused = false;
			if (this.marqueeOnSpotlight) {
				this.stopMarquee();
			}
		},

		/**
		* @private
		*/
		_marquee_enter: function (inSender, inEvent) {
			this._marquee_isHovered = true;
			if (this.marqueeOnHover && !this.marqueeOnSpotlight) {
				this.startMarquee();
			}
		},

		/**
		* @private
		*/
		_marquee_leave: function (inSender, inEvent) {
			this._marquee_isHovered = false;
			if (this.marqueeOnHover && !this.marqueeOnSpotlight) {
				this.stopMarquee();
			}
		},

		/**
		* @private
		*/
		_marquee_stopPropagation: function (inSender, inEvent) {
			if (inEvent.originator != this) {
				return true;
			}
		},

		/**
		* When a child marquee animation completes, removes the child from
		* {@link moon.marqueeSupport#marqueeWaitList}.
		*
		* @private
		*/
		_marquee_marqueeEnded: function (inSender, inEvent) {
			if (this._marquee_active) {
				enyo.remove(inEvent.originator, this.marqueeWaitList);
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
		_marquee_resize: function (inSender, inEvent) {
			if (this.marqueeOnSpotlight && this._marquee_active) {
				this._marquee_active = false;
				this._marquee_startHold();
			}
		},

		/**
		* Starts timer to waterfall an _onRequestMarqueeStart_ event that kicks off
		* marquee animation on all child marquees.
		*
		* @public
		*/
		startMarquee: function () {
			this.startMarqueeCustomDelay(this.marqueeDelay);
		},

		/**
		* Waterfalls an _onRequestMarqueeStop_ event to halt all running child
		* marquees.
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
		* Adds _control_ to {@link moon.MarqueeSupport#marqueeWaitList}.
		*
		* @param {Object} control  Control to add to list
		* @public
		*/
		addMarqueeItem: function (control) {
			this.marqueeWaitList.push(control);
		},

		/**
		* Restarts marquee if needed (depends on {@link moon.MarqueeSupport#marqueeOnSpotlight}
		* / {@link moon.MarqueeSupport#marqueeOnRender} settings)
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
		* starts Marquee with a custom delay. Used to provide a different delay for onRender and
		* onSpotlight/Hover
		*
		* @param {Number} delay  Number of milliseconds to delay
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
		* Stops and restarts the marquee animations
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
		* {@link moon.MarqueeSupport#marqueeWaitList}.
		*
		* @fires moon.MarqueeSupport#event:onRequestMarquee
		* @private
		*/
		_marquee_buildWaitList: function () {
			this.marqueeWaitList = [];
			this.waterfall('onRequestMarquee', {originator: this, marqueePause: this.marqueePause, marqueeSpeed: this.marqueeSpeed});
		},

		/**
		* Waterfalls event to kick off child marquee animations.
		*
		* @fires moon.MarqueeSupport#event:onRequestMarqueeStart
		* @private
		*/
		_marquee_startChildMarquees: function () {
			this.waterfall('onRequestMarqueeStart', {originator: this});
		},

		/**
		* Waterfalls event to halt child marquee animations.
		*
		* @fires moon.MarqueeSupport#event:onRequestMarqueeStop
		* @private
		*/
		_marquee_stopChildMarquees: function () {
			this.waterfall('onRequestMarqueeStop', {originator: this});
		},

		/**
		* Waterfalls event to enable child marquee animations.
		*
		* @fires moon.MarqueeSupport#event:onRequestMarqueeEnable
		* @private
		*/
		_marquee_enableChildMarquees: function () {
			this.waterfall('onRequestMarqueeEnable');
		},

		/**
		* Waterfalls event to disable child marquee animations.
		*
		* @fires moon.MarqueeSupport#event:onRequestMarqueeDisable
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

	/**
	* The _moon.MarqueeItem_ mixin is used to add marquee animation functionality to
	* a control.
	*
	* @mixin moon.MarqueeItem
	* @public
	*/
	moon.MarqueeItem = /** @lends moon.MarqueeItem.prototype */ {

		/**
		* @private
		*/
		events: {

			/**
			* {@link moon.MarqueeItem#event:onMarqueeEnded}
			*/
			onMarqueeEnded:''
		},

		/**
		* @private
		*/
		_marqueeItem_Handlers: {
			onRequestMarquee: '_marquee_requestMarquee',
			onRequestMarqueeStart: '_marquee_startAnimation',
			onRequestMarqueeStop: '_marquee_stopAnimation',
			onRequestMarqueeEnable: '_marquee_enable',
			onRequestMarqueeDisable: '_marquee_disable',
			ontransitionend: '_marquee_animationEnded'
		},

		/**
		* @private
		*/
		observers: {
			_marquee_contentChanged: ['content'],
			_marquee_centeredChanged: ['centered']
		},

		/**
		* @private
		*/
		bindings: [
			{from: '.allowHtml', to:'.$.marqueeText.allowHtml'}
		],

		/**
		* @private
		*/
		classes: 'moon-marquee',

		/**
		* @method
		* @private
		*/
		dispatchEvent: enyo.inherit(function (sup) {
			return function (sEventName, oEvent, oSender) {
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

		/**
		* @private
		*/
		_marquee_enabled: true,

		/**
		* @private
		*/
		_marquee_distance: null,

		/**
		* @private
		*/
		_marquee_fits: null,

		/**
		* @private
		*/
		_marquee_puppetMaster: null,

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.detectTextDirectionality();
				this._marquee_centeredChanged();
			};
		}),

		/**
		* @method
		* @private
		*/
		reflow: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this._marquee_invalidateMetrics();
			};
		}),

		/**
		* @method
		* @private
		*/
		showingChangedHandler: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this._marquee_reset();
			};
		}),

		/**
		* @private
		*/
		_marquee_invalidateMetrics: function () {
			this._marquee_distance = null;
			this._marquee_fits = null;
		},

		/**
		* When the content of this control changes, updates the content of
		* _this.$.marqueeText_ (if it exists).
		*
		* @private
		*/
		_marquee_contentChanged: function () {
			this.detectTextDirectionality();
			if (this.$.marqueeText) {
				this.$.marqueeText.setContent(this.content);
			}
			this._marquee_reset();
		},

		/**
		* If this control needs to marquee, lets the event originator know.
		*
		* @private
		*/
		_marquee_requestMarquee: function (inSender, inEvent) {
			if (!inEvent || this.disabled || !this.showing || !this._marquee_enabled || this._marquee_fits) {
				return;
			}

			this._marquee_puppetMaster = inEvent.originator;
			inEvent.originator.addMarqueeItem(this);

			this.marqueePause = inEvent.marqueePause || 1000;
			this.marqueeSpeed = inEvent.marqueeSpeed || 60;
		},

		/**
		* Starts marquee animation.
		*
		* @private
		*/
		_marquee_startAnimation: function (inSender, inEvent) {
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

		/**
		* @private
		*/
		_marquee_enable: function () {
			this.set('_marquee_enabled', true);
		},

		/**
		* @private
		*/
		_marquee_disable: function () {
			this.set('_marquee_enabled', false);
			this._marquee_stopAnimation();
		},

		/**
		* Stops marquee animation.
		*
		* @fires moon.MarqueeItem#event:onMarqueeEnded
		* @private
		*/
		_marquee_stopAnimation: function (inSender, inEvent) {
			this.stopJob('stopMarquee');
			this._marquee_removeAnimationStyles();
			this.doMarqueeEnded();
		},

		/**
		* When animation ends, starts _this.stopMarquee_ job.
		*
		* @private
		*/
		_marquee_animationEnded: function (inSender, inEvent) {
			if (inEvent.originator !== this.$.marqueeText) {
				return;
			}

			this.startJob('stopMarquee', '_marquee_stopAnimation', this.marqueePause);
	        return true;
		},

		/**
		* Returns _true_ if this control has enough content that it needs to animate.
		*
		* @private
		*/
		_marquee_shouldAnimate: function (inDistance) {
			inDistance = (inDistance && inDistance >= 0) ? inDistance : this._marquee_calcDistance();
			return (inDistance > 0);
		},

		/**
		* Determines how far the marquee needs to scroll.
		*
		* @private
		*/
		_marquee_calcDistance: function () {
			if (this._marquee_distance !== null) {
				return this._marquee_distance;
			}
			var node = this.$.marqueeText ? this.$.marqueeText.hasNode() : this.hasNode();
			this._marquee_distance = Math.abs(node.scrollWidth - node.clientWidth);
			return this._marquee_distance;
		},

		/**
		* Returns duration based on _inDistance_ and _this.marqueeSpeed_.
		*
		* @private
		*/
		_marquee_calcDuration: function (inDistance) {
			return inDistance / this.marqueeSpeed;
		},

		/**
		* Creates a marquee-able div inside of _this_.
		*
		* @private
		*/
		_marquee_createMarquee: function () {
			this.createComponent({name:'marqueeTextWrapper', classes: 'moon-marquee-text-wrapper', components: [{name: 'marqueeText', classes: 'moon-marquee-text', allowHtml: this.allowHtml, content: this.content}]});
			this.render();
			return true;
		},

		/**
		* @private
		*/
		_marquee_addAnimationStyles: function (inDistance) {
			var duration = this._marquee_calcDuration(inDistance);

			this.$.marqueeText.addClass('animate-marquee');
			this.$.marqueeText.applyStyle('transition-duration', duration + 's');
			this.$.marqueeText.applyStyle('-webkit-transition-duration', duration + 's');

			enyo.dom.transform(this.$.marqueeText, {translateZ: 0});

			// Need this timeout for FF!
			setTimeout(this.bindSafely(function () {
				enyo.dom.transform(this.$.marqueeText, {translateX: this._marquee_adjustDistanceForRTL(inDistance) + 'px'});
			}), enyo.platform.firefox ? 100 : 0);
		},

		/**
		* @private
		*/
		_marquee_removeAnimationStyles: function () {
			if (!this.$.marqueeText) {
				return;
			}

			this.$.marqueeText.applyStyle('transition-duration', '0s');
			this.$.marqueeText.applyStyle('-webkit-transition-duration', '0s');

			// Need this timeout for FF!
			/**
			* @private
			*/
			setTimeout(this.bindSafely(function () {
				this.$.marqueeText.removeClass('animate-marquee');
				enyo.dom.transform(this.$.marqueeText, {translateX: null});
				enyo.dom.transform(this.$.marqueeText, {translateZ: null});
			}), enyo.platform.firefox ? 100 : 0);
		},

		/**
		* Flips distance value for RTL support
		*
		* @private
		*/
		_marquee_adjustDistanceForRTL: function (inDistance) {
			return this.rtl ? inDistance : inDistance * -1;
		},

		/**
		* @private
		*/
		_marquee_reset: function () {
			this._marquee_invalidateMetrics();
			if (this._marquee_puppetMaster) {
				this._marquee_puppetMaster.resetMarquee();
			}
		},

		/**
		* @private
		*/
		_marquee_centeredChanged: function () {
			this.applyStyle('text-align', this.centered ? 'center' : null);
		}
	};

	/**
	* _moon.MarqueeText_ is a basic text control that supports marquee animation.
	* When {@link moon.MarqueeText} objects are used inside a
	* [moon.MarqueeDecorator]{@link moon.MarqueeDecorator}, the decorator synchronizes
	* their start times; the user may start a marquee programmatically by calling
	* {@link moon.MarqueeText#startMarquee}.
	*
	* ```
	* enyo.kind({
	* 	name: 'moon.Header',
	* 	mixins: ['moon.MarqueeSupport'],
	* 	marqueeSpeed: 100,
	* 	components: [
	* 		{kind: 'moon.MarqueeText', content: 'longText+longText'},
	* 		{kind: 'moon.MarqueeText', content: 'longText'}
	* 	],
	* 	rendered: function () {
	* 		this.startMarquee();
	* 	}
	* });
	* ```
	*
	* To add the marquee feature to a kind, simply use the MarqueeSupport mixin:
	*
	* ```
	* enyo.kind({
	* 	name: 'moon.MarqueeButton',
	* 	kind: 'enyo.Button',
	* 	mixins: ['moon.MarqueeSupport'],
	* 	components: [
	* 		{kind:'moon.MarqueeText'}
	* 	],
	* 	contentChanged: function () {
	* 		this.$.marqueeText.setContent(this.content);
	* 	}
	* });
	* ```
	*
	* @ui
	* @class moon.MarqueeText
	* @extends enyo.Control
	* @mixes moon.MarqueeItem
	* @public
	*/
	enyo.kind(
		/** @lends moon.MarqueeText.prototype */ {

		/**
		* @private
		*/
		name: 'moon.MarqueeText',

		/**
		* @private
		*/
		mixins: ['moon.MarqueeItem'],

		/**
		* @private
		*/
		published: /** @lends moon.MarqueeText.prototype */ {

			/**
			* Speed of marquee animation, in pixels per second
			*
			* @type {Number}
			* @default 60
			* @public
			*/
			marqueeSpeed: 60,

			/**
			* Time in milliseconds that the marquee will pause at the end of the
			* animation, before resetting to the beginning
			*
			* @type {Number}
			* @default 1000
			* @public
			*/
			marqueePause: 1000,

			/**
			* When true, marqueeing will not occur
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disabled: false,

			/**
			* When true, text is centered; otherwise left-aligned
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			centered: false
		}
	});

	/**
	* _moon.MarqueeDecorator_ is a wrapper for [moon.MarqueeText]{@link moon.MarqueeText}
	* objects.
	*
	* @ui
	* @class moon.MarqueeDecorator
	* @extends enyo.Control
	* @mixes moon.MarqueeSupport
	* @public
	*/
	enyo.kind(
		/** @lends moon.MarqueeDecorator.prototype */ {

		/**
		* @private
		*/
		name: 'moon.MarqueeDecorator',

		/**
		* @private
		*/
		mixins: ['moon.MarqueeSupport'],

		/**
		* @private
		*/
		style: 'overflow: hidden;'
	});

})(enyo, this);
