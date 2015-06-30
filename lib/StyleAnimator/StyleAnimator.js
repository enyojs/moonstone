require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/StyleAnimator~StyleAnimator} kind.
* @module moonstone/StyleAnimator
*/

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	log = require('enyo/logger'),
	utils = require('enyo/utils'),
	Component = require('enyo/Component');

/**
* @typedef {Object} enyo.StyleAnimator~AnimationDefinitionObject
* @property {String} name - An optional name for the animation. If not specified,
* a name will be generated.
* @property {Number} duration - An optional duration. If not specified, the
*	[default duration]{@link module:enyo/StyleAnimator~StyleAnimator#defaultDuration} will be used.
* @property {Object} timingFunction - An optional timing function. If not specified, the
*	[default timing function]{@link module:enyo/StyleAnimator~StyleAnimator#deafultTimingFunction} will be used.
* @property {String} direction - `'forward'` or `'backward'`. Currently unused.
* @property {Object[]} keyframes - Animation keyframes.
* @public
*/

/**
* Fires when an animation step occurs.
*
* @event enyo.StyleAnimator#onStep
* @type {Object}
* @property {Object} animation - A reference to the animation that generated the event.
* @public
*/

/**
* Fires when the animation completes.
*
* @event enyo.StyleAnimator#onComplete
* @type {Object}
* @property {Object} animation - A reference to the animation that completed.
* @public
*/

/**
* {@link module:enyo/StyleAnimator~StyleAnimator} is a basic animation component.  Call
* [play()]{@link module:enyo/StyleAnimator~StyleAnimator#play} to start the animation.  The animation will run for
* the period of time (in milliseconds) specified by its `duration`, subject to its
* `timingFunction` and `direction` (See: {@link module:enyo/StyleAnimator~StyleAnimator~AnimationDefinitionObject}).
*
* @class StyleAnimator
* @extends module:enyo/Component~Component
* @public
*/
module.exports = kind(
	/** @lends module:enyo/StyleAnimator~StyleAnimator.prototype */ {

	/**
	* @private
	*/
	name: 'enyo.StyleAnimator',

	/**
	* @private
	*/
	kind: Component,

	/**
	* @private
	*/
	events: {
		onStep: '',
		onComplete: ''
	},

	/**
	* @private
	* @lends module:enyo/StyleAnimator~StyleAnimator.prototype
	*/
	published: {
		//* Default value used if the animation has no `duration` specified.
		defaultDuration: 1000,
		//* Default value used if the animation has no `timingFunction` specified.
		defaultTimingFunction: 'linear',
		//* Default value used if the animation has no `direction` specified.
		defaultDirection: 'forward'
	},

	/**
	* @private
	*/
	transitionProperty: dom.transition,

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
		Component.prototype.create.apply(this, arguments);
		this.animations = [];
	},

	/**
	* Returns animation object reflecting the passed-in properties, while also adding it to the
	* `animations` array.
	*
	* @param {enyo.StyleAnimator~AnimationDefinitionObject} props - An animation definition hash.
	* @public
	*/
	newAnimation: function (props) {
		// TODO: Add documentation for the generated animation object
		if (this.animations && props.name && this.getAnimation(props.name)) {
			this.deleteAnimation(props.name);
		}

		props.keyframes = this.formatKeyframes(props.keyframes);
		props.instructions = this.generateInstructions(props.keyframes);

		var animation = {
			name:           props.name || this.generateAnimationName(),
			duration:       props.duration || this.defaultDuration,
			timingFunction: props.timingFunction ? this.updateTimingFunction (props.timingFunction) : this.updateTimingFunction (this.defaultTimingFunction),
			direction:      props.direction || this.defaultDirection,
			timeElapsed:    0,
			keyframes:      props.keyframes,
			instructions:   props.instructions,
			state:          'paused'
		};

		this.animations.push(animation);

		return animation;
	},

	/**
	* Resets transition properties to their pre-transition state for the specified animation.
	*
	* @param {String} name - Name of the animation.
	* @public
	*/
	reset: function (name) {
		this.getAnimation(name);
		this._reset(name);
	},

	/**
	* Plays the animation according to its properties.
	*
	* @param {String} name - Name of the animation.
	* @public
	*/
	play: function (name) {
		var animation = this.getAnimation(name);

		if (!animation) {
			return;
		}

		this.findStartAndEndValues(animation);
		this.applyValues(animation.startValues);
		this.cacheStartValues(animation.startValues);

		utils.asyncMethod(this.bindSafely(function () { this._play(name); }));
	},

	/**
	* Jumps directly to the end state of a given animation (without animating).
	*
	* @param {String} name - Name of the animation.
	* @public
	*/
	jumpToEnd: function (name) {
		var animation = this.getAnimation(name);

		if (!animation) {
			return;
		}

		this.findStartAndEndValues(animation);
		this.applyValues(animation.endValues);
	},

	/**
	* Pauses the animation, if it is currently playing.
	*
	* @param {String} name - Name of the animation.
	* @public
	*/
	pause: function (name) {
		var animation = this.getAnimation(name);
		if (animation.state === 'playing') {
			this._pause(name);
		}
	},

	/**
	* Looks up an animation by name in the animation list.
	*
	* @param {String} name - Name of the animation.
	* @public
	*/
	getAnimation: function (name) {
		var animation = null;
		for (var i = 0; i < this.animations.length; i++) {
			if (this.animations[i].name === name) {
				animation = this.animations[i];
				break;
			}
		}
		return animation;
	},

	/**
	* Removes an existing animation from `this.animations`, stopping it first, if necessary.
	*
	* @param {String} name - Name of the animation.
	* @public
	*/
	deleteAnimation: function (name) {
		var animation = this.getAnimation(name);

		if (!animation) {
			return false;
		}

		// Pause animation if necessary
		this._pause(name);

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
	* Generates a unique name based on the length of `this.animations`.
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
		log.warn('Unknown timing function: ', timing);
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
					instructions.push(utils.mixin(instruction, endValues));
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
						control.properties[prop] = dom.getComputedStyle(c.hasNode())[prop];
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
	_play: function (name) {
		this.startAnimation(name);
		this.beginStepping();
	},

	/**
	* @private
	*/
	startAnimation: function (name) {
		var animation = this.getAnimation(name);

		this.applyTransitions(name, 0);
		animation.state = 'playing';
		animation.timeElapsed = 0;
		animation.startTime = utils.perfNow();
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
	applyTransitions: function (name, inStartTime) {
		var animation = this.getAnimation(name),
			instructions = animation.instructions;
		for (var i = 0; i < instructions.length; i++) {
			if (instructions[i].startTime <= inStartTime && !instructions[i].started) {
				this.applyTransition(name, instructions[i]);
				instructions[i].started = true;
			}
		}
	},

	/**
	* @private
	*/
	applyTransition: function (name, inInstruction) {
		var animation = this.getAnimation(name),
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
			now = utils.perfNow(),
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
	completeAnimation: function (name) {
		var animation = this.getAnimation(name);

		this._pause(name);
		this._reset(name);
		this.doComplete({animation: animation});
	},

	/**
	* Resets transition properties to their pre-transition values.
	*
	* @private
	*/
	_reset: function (name) {
		var animation = this.getAnimation(name);
		for(var item in animation.startValues) {
			animation.startValues[item].control.applyStyle(this.transitionProperty, animation.startValues[item].properties[this.transitionProperty]);
		}
	},

	/**
	* @private
	*/
	_pause: function (name) {
		var animation = this.getAnimation(name);
		animation.state = 'paused';
	}
});
