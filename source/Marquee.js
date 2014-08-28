(function (enyo, scope) {
	/**
	* Fires to queue up a list of child animations.
	*
	* @event moon.MarqueeSupport#onRequestMarquee
	* @type {Object}
	* @property {Object} originator - A reference to the originator of this event.
	* @property {Boolean} marqueePause - The desired duration in milliseconds that the
	* marquee will pause at the end of the animation, before resetting to the beginning.
	* @property {Number} marqueeSpeed - The desired speed for the marquee animation,
	* in pixels per second.
	* @private
	*/

	/**
	* Fires to start marquee animation in a child marquee.
	*
	* @event moon.MarqueeSupport#onRequestMarqueeStart
	* @type {Object}
	* @property {Object} originator - A reference to the originator of this event.
	* @private
	*/

	/**
	* Fires to halt marquee animation in a child marquee.
	*
	* @event moon.MarqueeSupport#onRequestMarqueeStop
	* @type {Object}
	* @property {Object} originator - A reference to the originator of this event.
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
	* The {@link moon.MarqueeSupport} [mixin]{@glossary mixin} should be used with controls
	* that contain multiple marquees whose animation behavior should be synchronized. Calling
	* [this.startMarquee()]{@link moon.MarqueeSupport#startMarquee} or
	* [this.stopMarquee()]{@link moon.MarqueeSupport#stopMarquee} will start or stop all
	* contained marquees.
	*
	* The following properties, defined on the base kind to which the mixin is applied,
	* control the marquee behavior:
	*
	* [marqueeOnSpotlight]{@link moon.MarqueeSupport#marqueeOnSpotlight}: When `true`, marquee
	* starts when control is spotlight focused and ends when it is spotlight blurred.
	*
	* [marqueeOnHover]{@link moon.MarqueeSupport#marqueeOnHover}: When `true`, marquee runs
	* while control is hovered over with the mouse. This property is ignored if
	* `marqueeOnSpotlight` is `true`.
	*
	* [marqueeOnRender]{@link moon.MarqueeSupport#marqueeOnRender}: When `true`, marquee starts
	* running as soon as control is rendered, and runs continuously.
	*
	* [marqueeSpeed]{@link moon.MarqueeSupport#marqueeSpeed}: The speed of the marquee animation,
	* in pixels per second.
	*
	* [marqueeDelay]{@link moon.MarqueeSupport#marqueeDelay}: The delay between spotlight
	* focus/hover and the start of the animation. (This is only used when either
	* `marqueeOnSpotlight` or `marqueeOnHover` is `true`).
	*
	* [marqueeOnRenderDelay]{@link moon.MarqueeSupport#marqueeOnRenderDelay}: Used when you want
	* the marquee to run on render, after a specified delay.
	*
	* [marqueePause]{@link moon.MarqueeSupport#marqueePause}: The duration in milliseconds that
	* the marquee will pause at the end of the animation, before resetting to the beginning.
	*
	* @mixin moon.MarqueeSupport
	* @public
	*/

	/** @lends moon.MarqueeSupport.prototype */
	moon.MarqueeSupport = {

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
		* If {@link moon.MarqueeSupport#marqueeOnRender} is `true`, kicks off marquee animation.
		*
		* @method
		* @private
		*/
		rendered: enyo.inherit(function (sup) {
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
		dispatchEvent: enyo.inherit(function (sup) {
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
			if ((this.marqueeOnHover && !this.marqueeOnSpotlight) || 
			(this.disabled && this.marqueeOnSpotlight)) {
				this.startMarquee();
			}
		},

		/**
		* @private
		*/
		_marquee_leave: function (inSender, inEvent) {
			this._marquee_isHovered = false;
			if ((this.marqueeOnHover && !this.marqueeOnSpotlight) || (this.disabled && this.marqueeOnSpotlight)) {
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
		* [marqueeWaitList]{@link moon.marqueeSupport#marqueeWaitList}.
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
		* Starts timer to waterfall an
		* [onRequestMarqueeStart]{@link moon.MarqueeSupport#event:onRequestMarqueeStart} event
		* that kicks off marquee animation on all child marquees.
		*
		* @public
		*/
		startMarquee: function () {
			this.startMarqueeCustomDelay(this.marqueeDelay);
		},

		/**
		* Waterfalls an [onRequestMarqueeStop]{@link moon.MarqueeSupport#event:onRequestMarqueeStop}
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

	/**
	* The {@link moon.MarqueeItem} mixin is used to add marquee animation functionality
	* to a control.
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
			_marquee_centeredChanged: ['centered'],
			_marquee_wrapInsteadOfMarqueeChanged: ["wrapInsteadOfMarquee"]
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
				this._marquee_wrapInsteadOfMarqueeChanged();
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
		* `this.$.marqueeText` (if it exists).
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
			if (!inEvent || !this.showing || this._marquee_fits) {
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
		* @fires moon.MarqueeItem#onMarqueeEnded
		* @private
		*/
		_marquee_stopAnimation: function (inSender, inEvent) {
			this.stopJob('stopMarquee');
			this._marquee_removeAnimationStyles();
			this.doMarqueeEnded();
		},

		/**
		* When animation ends, starts `this.stopMarquee` job.
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
		* Returns `true` if this control has enough content to animate.
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
		* Returns duration based on `inDistance` and `this.marqueeSpeed`.
		*
		* @private
		*/
		_marquee_calcDuration: function (inDistance) {
			return inDistance / this.marqueeSpeed;
		},

		/**
		* Creates a marquee-able `div` inside of `this`.
		*
		* @private
		*/
		_marquee_createMarquee: function () {
			var marqueeText = {name: "marqueeText", classes: "moon-marquee-text", allowHtml: this.allowHtml, content: this.content},
				highlightText = null;

			if (this instanceof moon.HighlightText) {
				enyo.dom.setInnerHtml(this.hasNode(), "");
				highlightText = {renderDelegate: this.renderDelegate, highlightClasses: this.highlightClasses, search: this.search};
				marqueeText = enyo.mixin(marqueeText, highlightText);
			}
			this.createComponent({name:"marqueeTextWrapper", classes: "moon-marquee-text-wrapper", components: [marqueeText]});
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

			enyo.dom.transform(this, {translateZ: '-0.1px'});

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
				enyo.dom.transform(this, {translateZ: null});
			}), enyo.platform.firefox ? 100 : 0);
		},

		/**
		* Flips distance value for RTL support.
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
		},

		/**
		* @private
		*/
		_marquee_wrapInsteadOfMarqueeChanged: function(old) {
			if (this.wrapInsteadOfMarquee) {
				this.addClass("allow-wrap");
				if (this.$.marqueeText) {
					this.$.marqueeTextWrapper.destroy();
					this.render();
				}
			}
			if (old && !this.wrapInsteadOfMarquee) {
				this.removeClass("allow-wrap");
				// FIXME: Performing creation here to workaround potential WebKit measuring issue 
				// with scrollWidth (under-measures by 10px when marquee components are destroyed
				// when we switch wrapInsteadofMarquee from `false` to `true`, and back to `false`).
				this._marquee_createMarquee();
			}
		}
	};

	/**
	* {@link moon.MarqueeText} is a basic text control that supports marquee animation.
	* When `moon.MarqueeText` objects are used inside a
	* [moon.MarqueeDecorator]{@link moon.MarqueeDecorator}, the decorator synchronizes
	* their start times; the user may start a marquee programmatically by calling
	* [startMarquee()]{@link moon.MarqueeSupport#startMarquee}.
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
	* To add the marquee feature to a kind, simply use the
	* [MarqueeSupport]{@link moon.MarqueeSupport} mixin:
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
	* @class moon.MarqueeText
	* @extends enyo.Control
	* @mixes moon.MarqueeItem
	* @ui
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
		kind: 'enyo.Control',

		/**
		* @private
		*/
		mixins: ['moon.MarqueeItem'],

		/**
		* @private
		* @lends moon.MarqueeText.prototype
		*/
		published: {

			/**
			* The speed of the marquee animation, in pixels per second.
			*
			* @type {Number}
			* @default 60
			* @public
			*/
			marqueeSpeed: 60,

			/**
			* The duration in milliseconds that the marquee will pause at the end of the
			* animation, before resetting to the beginning.
			*
			* @type {Number}
			* @default 1000
			* @public
			*/
			marqueePause: 1000,

			/**
			* When `true`, marqueeing will not occur.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disabled: false,

			/**
			* When `true`, text is centered; otherwise, it is left-aligned.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			centered: false,

			/**
			* When `true`, element wraps instead of marqueeing.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			wrapInsteadOfMarquee: false
		}
	});

	/**
	* {@link moon.MarqueeDecorator} is a wrapper for {@link moon.MarqueeText} objects.
	*
	* @class moon.MarqueeDecorator
	* @extends enyo.Control
	* @mixes moon.MarqueeSupport
	* @ui
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
		kind: 'enyo.Control',

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
