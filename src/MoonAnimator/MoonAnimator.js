/**
* Contains the declaration for the {@link module:moonstone/MoonAnimator~MoonAnimator} kind.
* @module moonstone/MoonAnimator
*/

require('moonstone');

var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	Animator = require('enyo/Animator'),
	animation = require('enyo/animation');



/**
* {@link module:moonstone/MoonAnimator~MoonAnimator} is an animation for breadcrumb panels.
*
* @class MoonAnimator
* @extends module:enyo/Animator~Animator
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/MoonAnimator~MoonAnimator.prototype */ {

	/**
	* A context in which to run the specified {@glossary event} handlers. If this is
	* not specified or is falsy, then the [window object]{@glossary window} is used.
	*
	* @name context
	* @type {Object}
	* @default undefined
	* @memberOf module:moonstone/MoonAnimator~MoonAnimator.prototype
	* @public
	*/

	/**
	* @private
	*/
	name: 'moon.MoonAnimator',

	/**
	* @private
	*/
	kind: Animator,

	/**
	* @private
	*/
	published: /** @lends module:moonstone/MoonAnimator~MoonAnimator.prototype */ {
		direction: 'forward',

		useBezier: false,

		configs: {}
	},

	/**
	* @private
	*/
	accuracy: 0.01,

	/**
	* @private
	*/
	values: {},

	/**
	* @private
	*/
	fractions: {},

	/**
	* @private
	*/
	debug: false,

	/**
	* @private
	*/
	constructed: function () {
		Animator.prototype.constructed.apply(this, arguments);
		this.buildBezierTable();
	},

	/**
	* @private
	*/
	bezier: function (t, x1, y1, x2, y2) {
		var p0 = {x: 0, y: 0}, p1 = {x: x1, y: y1}, p2 = {x: x2, y: y2}, p3 = {x: 1, y: 1};
		var cX = 3 * (p1.x - p0.x),
			bX = 3 * (p2.x - p1.x) - cX,
			aX = p3.x - p0.x - cX - bX;

		var cY = 3 * (p1.y - p0.y),
			bY = 3 * (p2.y - p1.y) - cY,
			aY = p3.y - p0.y - cY - bY;

		var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
		var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

		return {x: x, y: y};
	},

	/**
	* Adds configuration for animation.
	*
	* The config can be specified for each object that needs to be animated.
	* Each config consists of two directions, forward and backward.
	*
	* ```javascript
	* panel: {
	* 	forward: { startValue: 0, endValue: 1, delay: 0, duration: 430, bezier: [.69,.01,.97,.59]},
	* 	backward: { startValue: 0, endValue: 1, delay: 0, duration: 500, bezier: [.06,.53,.38,.99] }
	* }
	* ```
	*
	* @param {Object} config
	* @public
	*/
	addConfig: function (config) {
		if (config) {
			util.mixin(this.configs, config);
		}
		this.buildBezierTable();
	},

	/**
	* Builds bezier curve table as a function of x and y.
	* Interpolates the intermediate values in the table.
	*
	* @private
	*/
	buildBezierTable: function () {
		if (!this.useBezier) return;

		var start = util.perfNow(), end;

		this.iterateConfig(this, function(obj, dir, config) {
			var last = {x:0, y:0},
				conf = config.bezier,	// Format: { x1, y1, x2, y2 }, values between 0 and 1
				ret, i, j;

			config.bezierTable = {};

			for (i = 0; i <= 1; i += this.accuracy){
				// Todo: Modify bezier function to have input as x and output as y.
				ret = this.bezier(i, conf[0], conf[1], conf[2], conf[3]);

				// Linear Interpolation
				//  - Bezier curve table which is having X as a key between 0 and 100.
				//  - Y value is having value between 0 and 1.
				for (j = last.x; j < ret.x; j += 0.01) {
					config.bezierTable[(j*100)<<0] = last.y + (j - last.x) * (ret.y-last.y) / (ret.x - last.x);
				}
				last = ret;
			}
			// Fill rest of table to 1
			for (i = (last.x*100)<<0; i <= 100; i++) {
				config.bezierTable[i] = 1;
			}
		});

		end = util.perfNow();

		if (this.debug) {
			this.log('Build Bezier Table takes', end - start, 'ms');
		}
	},


	/**
	* Plays the animation.
	*
	* @param {Object} props - As a convenience, this [hash]{@glossary Object} will be mixed
	*	directly into this [object]{@glossary Object}.
	* @public
	*/
	play: function (props) {
		var duration = 0;

		// Find maximum duration for the whole animation
		this.iterateConfig(this, function(obj, dir, config) {
			this.values[obj] = config.startValue;
			duration = Math.max(config.delay + config.duration, duration);
		}, this.direction);

		this.duration = duration;

		Animator.prototype.play.apply(this, arguments);

		return this;
	},

	/**
	* Reverses the direction of a running animation.
	*
	* @return {this} The callee for chaining.
	* @public
	*/
	reverse: function () {
		if (this.isAnimating()) {
			Animator.prototype.reverse.apply(this, arguments);
			this.iterateConfig(this, function(obj, dir, config) {
				// swap start and end values
				var startValue = config.startValue;
				config.startValue = config.endValue;
				config.endValue = startValue;
			}, this.direction);
			return this;
		}
	},

	/**
	* Runs the next step of the animation.
	*
	* @fires module:enyo/Animator~Animator#onStep
	* @fires module:enyo/Animator~Animator#onEnd
	* @private
	*/
	next: function () {
		this.t1 = util.perfNow();
		this.dt = this.t1 - this.t0;
		this.fraction = this.dt / this.duration;

		this.iterateConfig(this, function(obj, dir, config) {
			var fraction, f;

			if (this.dt - config.delay < 0) return;

			if (this.dt - config.delay >= config.duration) {
				this.values[obj] = config.endValue;
				this.fractions[obj] = 1;
				return;
			}

			if (this.useBezier) {
				// Use bezier function
				fraction = (this.dt - config.delay) / config.duration;
				f = this.fractions[obj] = config.bezierTable[(fraction*100)<<0];
				this.values[obj] = config.startValue + f * (config.endValue - config.startValue);
			} else {
				// Use easing function
				if (config.easing.length === 1) {
					// time independent
					this.fractions[obj] = animation.easedLerp(this.t0 + config.delay, config.duration, config.easing, this.reversed);
					this.values[obj] = config.startValue + this.fractions[obj] * (config.endValue - config.startValue);
				} else {
					this.values[obj] = animation.easedComplexLerp(this.t0 + config.delay, config.duration, config.easing, this.reversed,
						this.dt - config.delay, config.startValue, (config.endValue - config.startValue));
				}
			}
		}, this.direction);

		if (this.shouldEnd()) {
			this.fire('onStep');
			this.cancel();
			util.asyncMethod(this.bindSafely(function() {
				this.fire('onEnd');
			}));
		} else {
			this.fire('onStep');
			this.requestNext();
		}
	},

	/**
	* @private
	*/
	iterateConfig: function (scope, callback, direction) {
		var obj, dir;

		for (obj in this.configs) {
			if (direction) {
				// for specified direction
				callback.call(scope, obj, direction, this.configs[obj][direction]);
			} else {
				// for all directions
				for (dir in this.configs[obj]) {
					callback.call(scope, obj, dir, this.configs[obj][dir]);
				}
			}
		}
	}
});
