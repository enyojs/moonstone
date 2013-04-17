/**

Sample usage:

enyo.kind({
	name: "App",
	fit: true,
	components: [
		{name: "box", content: "Box 2", style: "width: 800px; height: 100%; background: rgba(0,0,0,0.8); top: 0px; left: 200px; position: absolute;", components: [
			{name: "header", content: "This is a Header", style: "font-size:40px; border-bottom:4px solid #222; line-height:180px; color: rgba(255,255,255,0.95); padding: 20px;"}
		]},
		{kind: "onyx.Button", content: "Go", ontap: "go"}
	],
	
	go: function () {
		var animation = new StyleAnimation({
			duration: 800,
			timingFunction: "cubic-bezier(.42, 0, .16, 1.1)",
			keyframes: {
				0: [{
					control: this.$.box,
					properties: {
						"height": "current",
						"border": "current"
					}
				},
				{
					control: this.$.header,
					properties: {
						"font-size" : "current",
						"border-bottom" : "current",
						"line-height" : "current"
					}
				}],
				40: [{
					control: this.$.header,
					properties: {
						"font-size" : "40px",
						"border-bottom" : "none",
						"line-height" : "80px"
					}
				}],
				50: [{
					control: this.$.box,
					properties: {
						"height": "124px",
						"width" : "800px"
					}
				}],
				100: [{
					control: this.$.box,
					properties: {
						"width": "200px"
					}
				},
				{
					control: this.$.header,
					properties: {
						"font-size" : "18px"
					}
				}]
			}
		}).play();
	}
});

*/

enyo.kind({
	name: "StyleAnimation",
	kind: "Component",
	published: {
		animations: [],
		keyframes: null,
		duration: 1000,
		timeElapsed: 0,
		timingFunction: "linear"
	},
	
	transitionProperty: enyo.dom.transition,
	instructions: null,
	stepInterval: null,
	stepIntervalMS: 100,
	startTime: null,
	
	create: function() {
		this.inherited(arguments);
		this.keyframesChanged();
		this.timingFunctionChanged();
	},
	keyframesChanged: function() {
		var frames = [];
		for (var index in this.keyframes) {
			frames.push({index: index, controls: this.keyframes[index]});
		}
		this.keyframes = frames;
		this.updateInstructions();
	},
	timeElapsedChanged: function () {
		if (this.getTimeElapsed() > this.getDuration()) {
			this.animationComplete();
		}
	},
	timingFunctionChanged: function() {
		this.timingFunction = this.getTimingFunction().match(/\bcubic-bezier/i) ? this.getTimingFunction() : this.convertTimingFunctionToBezier(this.getTimingFunction());
	},
	convertTimingFunctionToBezier: function(timing) {
		switch (timing) {
			case "linear":
				return "cubic-bezier(0, 0, 1, 1)";
			case "ease":
				return "cubic-bezier(0.25, 0.1, 0.25, 1.0)";
			case "ease-in":
				return "cubic-bezier(.42, 0, 1, 1)";
			case "ease-out":
				return "cubic-bezier(0, 0, .58, 1)";
			case "ease-in-out":
				return "cubic-bezier(.42, 0, .58, 1)";
		}
		enyo.warn("Unknown timing function: ", timing);
		return timing;
	},
	updateInstructions: function () {
		var frames = this.keyframes,
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
					
					endValues = this.findEndValues(instruction, i+1, frames);
					
					// If no end values, skip this rule
					if (!endValues) {
						continue;
					}
					
					// Mix in end values
					instructions.push(enyo.mixin(instruction, endValues));
				}
			}
		}
		
		this.instructions = instructions;
	},
	findStartValues: function() {
		var frames = this.keyframes,
			startValues = {};
		
		for (var i = 0; i < frames.length-1; i++) {
			for (var j = 0, control; (control = frames[i].controls[j]); j++) {
				if (!startValues[control.control.id]) {
					startValues[control.control.id] = {
						control: control.control,
						properties: {}
					};
				}
				
				for (var prop in control.properties) {
					// at zero, every prop is a startvalue
					if (i === 0 || !startValues[control.control.id]["properties"][prop]) {
						if (control.properties[prop] === "current") {
							control.properties[prop] = enyo.dom.getComputedStyle(control.control.hasNode())[prop];
						}
						// If start value is set to _current_, grab the computed value
						startValues[control.control.id]["properties"][prop] = (control.properties[prop] === "current")
							?	enyo.dom.getComputedStyle(control.control.hasNode())[prop]
							:	control.properties[prop];
					}
				}
			}
		}
		
		return startValues;
	},
	findEndValues: function (inInstruction, inFrameIndex, inFrames) {
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
	play: function () {
		this.applyStartValues(this.findStartValues());
		setTimeout(enyo.bind(this, "_play"), 0);
	},
	_play: function () {
		this.applyTransitions(0);
		this.beginStepping();
	},
	applyStartValues: function(inStartValues) {
		for(var item in inStartValues) {
			var control = inStartValues[item].control;
			
			for (var prop in inStartValues[item].properties) {
				control.applyStyle(prop, inStartValues[item].properties[prop]);
			}
		}
	},
	applyTransitions: function(inStartTime) {
		var instructions = this.instructions;
		for (var i = 0; i < instructions.length; i++) {
			if (instructions[i].startTime <= inStartTime && !instructions[i].started) {
				this.applyTransition(instructions[i]);
				instructions[i].started = true;
			}
		}
	},
	applyTransition: function (inInstruction) {
		var currentStyle = inInstruction.control.domStyles[this.transitionProperty],
			transitionTime = (inInstruction.endTime - inInstruction.startTime)*this.duration/(100*1000),
			newStyle = currentStyle ? currentStyle + ", " : "",
			transitionProperty = this.transitionProperty;
		
		newStyle += inInstruction.property + " " + transitionTime + "s " + this.getTimingFunction() + " 0s";
		
		inInstruction.control.applyStyle(transitionProperty, newStyle);
		inInstruction.control.applyStyle(inInstruction.property, inInstruction.endValue);
		
		// this.log("------");
// 		this.log(inInstruction.control.id+".applyStyle("+transitionProperty+", "+newStyle+")");
// 		this.log(inInstruction.control.id+".applyStyle("+inInstruction.property+", "+inInstruction.endValue+")");
	},
	beginStepping: function () {
		this.setTimeElapsed(0);
		this.startTime = enyo.now();
		this.stepInterval = setInterval(enyo.bind(this, "_step"), this.stepIntervalMS);
	},
	_step: function () {
		var elapsed = enyo.now() - this.startTime;
		this.setTimeElapsed(elapsed);
		this.applyTransitions(Math.round((elapsed/this.duration)*100));
	},
	animationComplete: function () {
		this.stop();
		this.reset();
	},
	stop: function () {
		clearInterval(this.stepInterval);
		this.stepInterval = null;
	},
	reset: function () {
		this.onComplete && this.onComplete();
		
		var instructions = this.instructions;
		for (var i = 0; i < instructions.length; i++) {
			//this.log(instructions[i]);
		}
	}
});