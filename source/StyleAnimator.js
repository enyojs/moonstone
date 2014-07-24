(function (enyo, scope) {
	/**
	 * Fires when an animation step occurs.
	 *
	 * @event enyo.StyleAnimator#event:onStep
	 * @type {Object}
	 * @property {Object} animation - A link to the animation causing this event
	 * @public
	 */

	/**
	 * Fires when the animation completes.
	 *
	 * @event enyo.StyleAnimator#event:onComplete
	 * @type {Object}
	 * @property {Object} animation - A link to the animation completing
	 * @public
	 */

	/**
	 * _enyo.StyleAnimator_ is a basic animation component.  Call
	 * [play()]{@link enyo.StyleAnimator#play) to start the animation.  The animation will run for
	 * the period of time (in milliseconds) specified by its
	 * [duration]{@link enyo.StyleAnimotor#duration}, subject to its
	 * [timingFunction]{@link enyo.StyleAnimator#timingFunction}
	 * and [direction]{@link enyo.StyleAnimator#direction}.
	 *
	 * @class enyo.StyleAnimator
	 * @extends enyo.Component
	 * @public
	 */
	enyo.kind(
		/** @lends  enyo.StyleAnimator.prototype */ {

		/**
		 * @private
		 */
		name: 'enyo.StyleAnimator',

		/**
		 * @private
		 */
		kind: 'enyo.Component',

		/**
		 * @private
		 */
		events: {
			onStep: '',
			onComplete: ''
		},

		/**
		 * @private
		 */
		published: /** @lends moon.StyleAnimator.prototype */ {
			//* Default value used if the animation has no _duration_ specified
			defaultDuration: 1000,
			//* Default value used if the animation has no _timingFunction_ specified
			defaultTimingFunction: 'linear',
			//* Default value used if the animation has no _direction_ specified
			defaultDirection: 'forward'
		},

		/**
		 * @private
		 */
		transitionProperty: enyo.dom.transition,

		/**
		 * @private
		 */
		instructions: null,

		/**
		 * @private
		 */
		stepInterval: null,

		/**
		 * @private
		 */
		stepIntervalMS: 50,

		/**
		 * @private
		 */
		startTime: null,

		/**
		 * @private
		 */
		animations: null,

		/**
		 * @private
		 */
		create: function () {
			this.inherited(arguments);
			this.animations = [];
		},

		/**
		 * Returns animation object reflecting the passed-in properties, while also adding it to the
		 * [animations]{@link enyo.StyleAnotmor#animations} array.
		 *
		 * @param {Object} props - An animation definition hash
		 * @public
		 */
		newAnimation: function (inProps) {
			// TODO: Document definition hash
			if (this.animations && inProps.name && this.getAnimation(inProps.name)) {
				this.deleteAnimation(inProps.name);
			}

			inProps.keyframes = this.formatKeyframes(inProps.keyframes);
			inProps.instructions = this.generateInstructions(inProps.keyframes);

			var animation = {
				name:           inProps.name || this.generateAnimationName(),
				duration:       inProps.duration || this.getDefaultDuration,
				timingFunction: this.updateTimingFunction (inProps.timingFunction) || this.updateTimingFunction (this.getDefaultTimingfunction ()),
				direction:      inProps.direction || this.getDefaultDirection(),
				timeElapsed:    0,
				keyframes:      inProps.keyframes,
				instructions:   inProps.instructions,
				state:          'paused'
			};

			this.animations.push(animation);

			return animation;
		},

		/**
		 * Resets transition properties to their pre-transition state.
		 *
		 * @public
		 */
		reset: function (inName) {
			this.getAnimation(inName);
			this._reset(inName);
		},

		/**
		 * Plays the animation according to its properties.
		 *
		 * @public
		 */
		play: function (inName) {
			var animation = this.getAnimation(inName);

			if (!animation) {
				return;
			}

			this.findStartAndEndValues(animation);
			this.applyValues(animation.startValues);
			this.cacheStartValues(animation.startValues);

			enyo.asyncMethod(this.bindSafely(function () { this._play(inName); }));
		},

		/**
		 * Jumps directly to the end state of a given animation (without animating).
		 *
		 * @public
		 */
		jumpToEnd: function (inName) {
			var animation = this.getAnimation(inName);

			if (!animation) {
				return;
			}

			this.findStartAndEndValues(animation);
			this.applyValues(animation.endValues);
		},

		/**
		 * Pauses the animation, if it is currently playing.
		 *
		 * @public
		 */
		pause: function (inName) {
			var animation = this.getAnimation(inName);
			if (animation.state === 'playing') {
				this._pause(inName);
			}
		},

		/**
		 * Looks up an animation by name in _this.animations_.
		 *
		 * @public
		 */
		getAnimation: function (inName) {
			var animation = null;
			for (var i = 0; i < this.animations.length; i++) {
				if (this.animations[i].name === inName) {
					animation = this.animations[i];
					break;
				}
			}
			return animation;
		},

		/**
		 * Removes an existing animation from _this.animations_, stopping it first, if necessary.
		 *
		 * @public
		 */
		deleteAnimation: function (inName) {
			var animation = this.getAnimation(inName);

			if (!animation) {
				return false;
			}

			// Pause animation if necessary
			this._pause(inName);

			// Splice out this animation
			this.animations.splice(this.animations.indexOf(animation), 1);
		},

		/**
		 * Begins stepping through the animation.
		 *
		 * @public
		 */
		start: function () {
			this.beginStepping();
		},

		/**
		 * Stops stepping through the animation.
		 *
		 * @public
		 */
		stop: function () {
			this.stopStepping();
		},

		/**
		 * Generates a unique name based on the length of _this.animations_.
		 *
		 * @private
		 */
		generateAnimationName: function () {
			var count = this.animations.length,
				name = this.getName()+'_animation_'+count;
			while (this.getAnimation(name)) {
				name = this.getName()+'_animation_'+count;
			}
			return name;
		},

		/**
		 * @private
		 */
		formatKeyframes: function (inKeyframes) {
			var frames = [];
			for (var index in inKeyframes) {
				frames.push({index: index, controls: inKeyframes[index]});
			}
			return frames;
		},

		/**
		 * @private
		 */
		updateTimingFunction: function (inTimingFunction) {
			return inTimingFunction.match(/\bcubic-bezier/i) ? inTimingFunction : this.convertTimingFunctionToBezier(inTimingFunction);
		},

		/**
		 * @private
		 */
		convertTimingFunctionToBezier: function (timing) {
			switch (timing) {
			case 'linear':
				return 'cubic-bezier(0, 0, 1, 1)';
			case 'ease':
				return 'cubic-bezier(0.25, 0.1, 0.25, 1.0)';
			case 'ease-in':
				return 'cubic-bezier(.42, 0, 1, 1)';
			case 'ease-out':
				return 'cubic-bezier(0, 0, .58, 1)';
			case 'ease-in-out':
				return 'cubic-bezier(.42, 0, .58, 1)';
			}
			enyo.warn('Unknown timing function: ', timing);
			return timing;
		},

		/**
		 * @private
		 */
		generateInstructions: function (inKeyframes) {
			var frames = inKeyframes,
				instructions = [],
				instruction,
				endValues;

			for (var i = 0; i < frames.length-1; i++) {
				for (var j = 0, control; (control = frames[i].controls[j]); j++) {
					for (var prop in control.properties) {

						instruction = {
							control: control.control,
							property: prop,
							startValue: control.properties[prop],
							startTime: frames[i].index
						};

						endValues = this.findInstructionEndValues(instruction, i+1, frames);

						// If no end values, skip this rule   TODO - is this right?
						if (!endValues) {
							continue;
						}

						// Mix in end values
						instructions.push(enyo.mixin(instruction, endValues));
					}
				}
			}

			return instructions;
		},

		/**
		 * @private
		 */
		findStartAndEndValues: function (inAnimation) {
			var frames = inAnimation.keyframes,
				startValues = {},
				endValues = {},
				c,
				cID;

			for (var i = 0; i < frames.length; i++) {
				for (var j = 0, control; (control = frames[i].controls[j]); j++) {
					c = control.control;
					cID = c.id;

					if (!startValues[cID]) {
						startValues[cID] = {
							control: c,
							properties: {}
						};
					}
					if (!endValues[cID]) {
						endValues[cID] = {
							control: c,
							properties: {}
						};
					}

					for (var prop in control.properties) {
						// If value is set to _current_, grab the computed value
						if (control.properties[prop] === 'current') {
							control.properties[prop] = enyo.dom.getComputedStyle(c.hasNode())[prop];
						}
						// at zero, every prop is a startvalue
						if (i === 0 || typeof startValues[cID]['properties'][prop] === 'undefined') {
							startValues[cID]['properties'][prop] = control.properties[prop];
						}

						endValues[cID]['properties'][prop] = control.properties[prop];
					}
				}
			}

			inAnimation.startValues = startValues;
			inAnimation.endValues = endValues;
		},

		/**
		 * @private
		 */
		findInstructionEndValues: function (inInstruction, inFrameIndex, inFrames) {
			for (var i = inFrameIndex; i < inFrames.length; i++) {
				for (var j = 0, control; (control = inFrames[i].controls[j]); j++) {
					if (control.control !== inInstruction.control) {
						continue;
					}
					for (var prop in control.properties) {
						if (prop === inInstruction.property) {
							return {endValue: control.properties[prop], endTime: inFrames[i].index};
						}
					}
				}
			}
		},

		/**
		 * @private
		 */
		_play: function (inName) {
			this.startAnimation(inName);
			this.beginStepping();
		},

		/**
		 * @private
		 */
		startAnimation: function (inName) {
			var animation = this.getAnimation(inName);

			this.applyTransitions(inName, 0);
			animation.state = 'playing';
			animation.timeElapsed = 0;
			animation.startTime = enyo.perfNow();
		},

		/**
		 * @private
		 */
		applyValues: function (inValues) {
			var item, prop, control;

			for(item in inValues) {
				control = inValues[item].control;

				for (prop in inValues[item].properties) {
					control.applyStyle(prop, inValues[item].properties[prop]);
				}
			}
		},

		/**
		 * @private
		 */
		cacheStartValues: function (inStartValues) {
			var item, control;
			this.startValues = inStartValues;

			for(item in inStartValues) {
				control = inStartValues[item].control;
				inStartValues[item].properties[this.transitionProperty] = control[this.transitionProperty];
			}
		},

		/**
		 * @private
		 */
		applyTransitions: function (inName, inStartTime) {
			var animation = this.getAnimation(inName),
				instructions = animation.instructions;
			for (var i = 0; i < instructions.length; i++) {
				if (instructions[i].startTime <= inStartTime && !instructions[i].started) {
					this.applyTransition(inName, instructions[i]);
					instructions[i].started = true;
				}
			}
		},

		/**
		 * @private
		 */
		applyTransition: function (inName, inInstruction) {
			var animation = this.getAnimation(inName),
				currentStyle = inInstruction.control[this.transitionProperty],
				transitionTime = (inInstruction.endTime - inInstruction.startTime)*animation.duration/(100*1000),
				newStyle = currentStyle ? currentStyle + ', ' : '',
				transitionProperty = this.transitionProperty;

			newStyle += inInstruction.property + ' ' + transitionTime + 's ' + animation.timingFunction + ' 0s';

			inInstruction.control.applyStyle(transitionProperty, newStyle);

			// we arbitrarily cache this value for cheaper lookup later
			inInstruction.control[transitionProperty] = newStyle;

			inInstruction.control.applyStyle(inInstruction.property, inInstruction.endValue);

			//  this.log(inInstruction.control.id+'.applyStyle('+transitionProperty+', '+newStyle+')');
			//  this.log(inInstruction.control.id+'.applyStyle('+inInstruction.property+', '+inInstruction.endValue+')');
		},

		/**
		 * Begins stepping.
		 *
		 * @private
		 */
		beginStepping: function () {
			if (!this.stepInterval) {
				this.stepInterval = setInterval(this.bindSafely('_step'), this.stepIntervalMS);
			}
		},

		/**
		 * Stops stepping.
		 *
		 * @private
		 */
		stopStepping: function () {
			if (this.stepInterval) {
				clearInterval(this.stepInterval);
				this.stepInterval = null;
			}
		},

		/**
		 * Steps through each playing animation.
		 *
		 * @private
		 */
		_step: function () {
			var playingAnimations = false,
				now = enyo.perfNow(),
				animation,
				elapsed,
				i;

			for (i = 0; (animation = this.animations[i]); i++) {
				if (animation.state === 'paused') {
					continue;
				}

				elapsed = now - animation.startTime;

				// If complete, bail
				if (elapsed > animation.duration) {
					if (animation.percentElapsed != 100) {
						this.applyTransitions(animation.name, 100);
					}
					animation.percentElapsed = 100;
					this.doStep({animation: animation});
					this.completeAnimation(animation.name);
					return;
				}

				animation.timeElapsed = elapsed;
				animation.percentElapsed = Math.round(elapsed*100/animation.duration);
				this.applyTransitions(animation.name, animation.percentElapsed);
				playingAnimations = true;

				// Bubble step event
				this.doStep({animation: animation});
			}

			if (!playingAnimations) {
				this.stop();
			}
		},

		/**
		 * @private
		 */
		completeAnimation: function (inName) {
			var animation = this.getAnimation(inName);

			this._pause(inName);
			this._reset(inName);
			this.doComplete({animation: animation});
		},

		/**
		 * Resets transition properties to their pre-transition values.
		 *
		 * @private
		 */
		_reset: function (inName) {
			var animation = this.getAnimation(inName);
			for(var item in animation.startValues) {
				animation.startValues[item].control.applyStyle(this.transitionProperty, animation.startValues[item].properties[this.transitionProperty]);
			}
		},

		/**
		 * @private
		 */
		_pause: function (inName) {
			var animation = this.getAnimation(inName);
			animation.state = 'paused';
		}
	});

})(enyo, this);
