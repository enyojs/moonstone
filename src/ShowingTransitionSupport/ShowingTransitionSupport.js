require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Marquee~MarqueeSupport} mixin and the {@link module:moonstone/Marquee~MarqueeText} &
* {@link module:moonstone/Marquee~MarqueeDecorator} kinds.
* @module moonstone/Marquee
*/

var kind = require('enyo/kind'),
	util = require('enyo/utils');

/**
* The {@link module:moonstone/Marquee~MarqueeSupport} [mixin]{@glossary mixin} should be used with controls
* that contain multiple marquees whose animation behavior should be synchronized. Calling
* [this.startMarquee()]{@link module:moonstone/Marquee~MarqueeSupport#startMarquee} or
* [this.stopMarquee()]{@link module:moonstone/Marquee~MarqueeSupport#stopMarquee} will start or stop all
* contained marquees.
*
* The following properties, defined on the base kind to which the mixin is applied,
* control the marquee behavior:
*
* [marqueeOnSpotlight]{@link module:moonstone/Marquee~MarqueeSupport#marqueeOnSpotlight}: When `true`, marquee
* starts when control is spotlight focused and ends when it is spotlight blurred.
*
* [marqueeOnHover]{@link module:moonstone/Marquee~MarqueeSupport#marqueeOnHover}: When `true`, marquee runs
* while control is hovered over with the mouse. This property is ignored if
* `marqueeOnSpotlight` is `true`.
*
* @mixin
* @public
*/
module.exports =
	/** @lends module:moonstone/Button~Button.prototype */ {

	/**
	* @private
	*/
	name: 'ShowingTransitionSupport',

	/**
	* @private
	*/
	showingTransitioning: false,

	showingDuration: undefined,
	hidingDuration: undefined,
	shownMethod: undefined,
	hiddenMethod: undefined,

	shownClass: undefined,
	hiddenClass: undefined,

	hidingClass: undefined,
	showingClass: undefined,

	/**
	* Initializes marquee timings.
	*
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.showingDuration = (this.showingDuration === undefined) ? null      : this.showingDuration;
			this.hidingDuration  = (this.hidingDuration  === undefined) ? null      : this.hidingDuration;
			this.shownMethod     = (this.shownMethod     === undefined) ? null      : this.shownMethod;
			this.hiddenMethod    = (this.hiddenMethod    === undefined) ? null      : this.hiddenMethod;
			this.shownClass      = (this.shownClass      === undefined) ? null      : this.shownClass;
			this.hiddenClass     = (this.hiddenClass     === undefined) ? 'hidden'  : this.hiddenClass;
			this.hidingClass     = (this.hidingClass     === undefined) ? 'hiding'  : this.hidingClass;
			this.showingClass    = (this.showingClass    === undefined) ? 'showing' : this.showingClass;
			this.showingChanged();
		};
	}),

	// showingChangedHandler: kind.inherit(function (sup) {
	showingChanged: kind.inherit(function (sup) {
		return function (sender, ev) {
			var args = arguments;
			// console.log(this.showing ? 'Showing:' : 'Hiding:', this);
			// debugger;

			// Prepare our visual state
			this.applyStyle('display', null);
			this.applyStyle('visibility', null);
			if (this.showing) {
				// Reset our state classes, in case we switched mid-stream
				if (this.hidingClass) this.removeClass(this.hidingClass);
				if (this.hiddenClass) this.removeClass(this.hiddenClass);
				sup.apply(this, args);
				if (this.showingDuration && this.generated) {
					this.set('showingTransitioning', true);
					// Start transition: Apply a class and start a timer.
					// When timer finishes, run the exit function,
					// remove the transitioning class
					// and add the final-state class
					if (this.showingClass) this.addClass(this.showingClass);
					this.startJob('showingTransition', this.bindSafely(function () {
						if (this.shownMethod) this[this.shownMethod];	// Run the supplied method.
						if (this.showingClass) this.removeClass(this.showingClass);
						if (this.shownClass) this.addClass(this.shownClass);
						this.set('showingTransitioning', false);
					}), this.showingDuration);
				} else {
					// No transition, just a shown class.
					if (this.shownClass) this.addClass(this.shownClass);
				}
			} else {
				// Reset our state classes, in case we switched mid-stream
				if (this.showingClass) this.removeClass(this.showingClass);
				if (this.shownClass) this.removeClass(this.shownClass);
				if (this.hidingDuration && this.generated) {
					this.set('showingTransitioning', true);
					if (this.hidingClass) this.addClass(this.hidingClass);
					this.startJob('showingTransition', this.bindSafely(function () {
						if (this.hiddenMethod) this[this.hiddenMethod];	// Run the supplied method.
						if (this.hidingClass) this.removeClass(this.hidingClass);
						if (this.hiddenClass) this.addClass(this.hiddenClass);
						this.set('showingTransitioning', false);
						sup.apply(this, args);
						this.applyStyle('visibility', 'hidden');
						this.applyStyle('display', null);
					}), this.hidingDuration);
				} else {
					// No transition, just a hidden class.
					if (this.hidingClass) this.removeClass(this.hidingClass);
					if (this.hiddenClass) this.addClass(this.hiddenClass);
					sup.apply(this, args);
					this.applyStyle('visibility', 'hidden');
					this.applyStyle('display', null);
				}
				// util.asyncFunction( this.bindSafely(function () { this.applyStyle('display', null);}));
			}
		};
	})
};
