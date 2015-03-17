(function (enyo, scope) {
	/**
	* {@link moon.MoonAnimator} is an animation for breadcrumb panels.
	*
	* @class moon.MoonAnimator
	* @extends enyo.Animator
	* @public
	*/
	enyo.kind(
		/** @lends moon.MoonAnimator.prototype */ {

		/**
		* A context in which to run the specified {@glossary event} handlers. If this is
		* not specified or is falsy, then the [window object]{@glossary window} is used.
		* 
		* @name context
		* @type {Object}
		* @default undefined
		* @memberOf moon.MoonAnimator.prototype
		* @public
		*/

		/**
		* @private
		*/
		name: 'moon.MoonAnimator',

		/**
		* @private
		*/
		kind: 'enyo.Animator',

		/**
		* @private
		*/
		published: /** @lends moon.MoonAnimator.prototype */ {
			direction: 'forward',

			useBezier: false,
			
			configs: {}
		},

		duration: 500,

		accuracy: 0.01,

		values: {},

		fractions: {},

		debug: true, 

		constructed: enyo.inherit(function (sup) {
			return function() {
				sup.apply(this, arguments);
				this.buildBezierTable();
			};
		}),

		bezier: function(t, x1, y1, x2, y2) {
			var p0 = {x: 0, y: 0}, p1 = {x: x1, y: y1}, p2 = {x: x2, y: y2}, p3 = {x: 1, y: 1};
			var cX = 3 * (p1.x - p0.x),
				bX = 3 * (p2.x - p1.x) - cX,
				aX = p3.x - p0.x - cX - bX;

			var cY = 3 * (p1.y - p0.y),
				bY = 3 * (p2.y - p1.y) - cY,
				aY = p3.y - p0.y - cY - bY;

			var x = ((p3.x - p0.x - 3 * (p1.x - p0.x) - 3 * (p2.x - p1.x) - 3 * (p1.x - p0.x)) * Math.pow(t, 3)) + ((3 * (p2.x - p1.x) - 3 * (p1.x - p0.x)) * Math.pow(t, 2)) + (3 * (p1.x - p0.x) * t) + p0.x;

			var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
			var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

			return {x: x, y: y};
		},

		addConfig: function(config) {
			if (config) {
				enyo.mixin(this.configs, config);
			}
			this.buildBezierTable();
		},

		buildBezierTable: function() {
			if (!this.useBezier) return;
			var start = enyo.perfNow(), end;
			var config, dir, e, b, x, last = {x:0, y:0};
			for (var k in this.configs) {
				config = this.configs[k];
				for (var d in config) {
					dir = config[d];
					e = dir.bezier;
					dir.bezierTable = {};

					for (var i=0; i<=1; i+=this.accuracy){
						b = this.bezier(i, e[0], e[1], e[2], e[3]);
	 
						// Linear Interpolation
						for (var j=last.x; j<b.x; j+=this.accuracy) {
							dir.bezierTable[Math.ceil(j*100)] = last.y + (j - last.x) * (b.y-last.y) / (b.x - last.x);
						}
						last = b;
					}
					for (j=last.x; j<=1; j+=this.accuracy) {
						dir.bezierTable[Math.ceil(j*100)] = 1;
					}
				}
			}
			end = enyo.perfNow();
			if (this.debug) {
				console.log('Build Bezier Table takes', end - start, 'ms')
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
			for (var k in this.configs) {
				var config = this.configs[k], 
					dir = config[this.direction];
				this.values[k] = dir.startValue;
				duration = Math.max(dir.delay + dir.duration, duration);
			}
			this.duration = duration;
			this.inherited(arguments);
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
				this.inherited(arguments);
				for (var k in this.configs) {
					var config = this.configs[k], 
						dir = config[this.direction];

					// swap start and end values
					var startValue = dir.startValue;
					dir.startValue = dir.endValue;
					dir.endValue = startValue;
				}
				return this;
			}
		},

		/**
		* Runs the next step of the animation.
		*
		* @fires enyo.Animator#onStep
		* @fires enyo.Animator#onEnd
		* @private
		*/
		next: function () {
			var k, f, config, dir, args;
			this.t1 = enyo.perfNow();
			this.dt = this.t1 - this.t0;
			this.fraction = this.dt / this.duration;

			for (k in this.configs) {
				config = this.configs[k];
				dir = config[this.direction];

				if (this.dt - dir.delay >= 0) {
					if (this.dt - dir.delay >= dir.duration) {
						this.values[k] = dir.endValue;
						this.fractions[k] = 1;
					} else {
						if (this.useBezier) {
							var e = dir.bezier, fraction = (this.dt - dir.delay) / dir.duration;
							var value = dir.bezierTable[Math.ceil(fraction*100)];
							f = this.fractions[k] = value;
							this.values[k] = dir.startValue + f * (dir.endValue - dir.startValue);
						} else {
							args = dir.easing.length;
							if (args === 1) {
								// time independent
								f = this.fractions[k] = enyo.easedLerp(this.t0 + dir.delay, dir.duration, dir.easing, this.reversed);
								this.values[k] = dir.startValue + f * (dir.endValue - dir.startValue);
							} else {
								this.values[k] = enyo.easedComplexLerp(this.t0 + dir.delay, dir.duration, dir.easing, this.reversed,
									this.dt - dir.delay, dir.startValue, (dir.endValue - dir.startValue));
							}
						}
					}
				}
			}

			if (this.shouldEnd()) {
				this.fire('onStep');
				this.cancel();
				enyo.asyncMethod(this.bindSafely(function() {
					this.fire('onEnd');
				}));
			} else {
				this.fire('onStep');
				this.requestNext();
			}
		}
	});

})(enyo, this);
