/**
	_moon.ProgressBar_ is a  control that shows the current progress of a
	process in a horizontal bar.

		{kind: "moon.ProgressBar", progress: 10}

	To animate progress changes, call the _animateProgressTo_ method:

		this.$.progressBar.animateProgressTo(50);

	You may customize the color of the bar by applying a style via the
	_barClasses_ property, e.g.:

		{kind: "moon.ProgressBar", barClasses: "class-name"}

	For more information, see the documentation on
	<a href="https://github.com/enyojs/moonstone/wiki/Progress-Indicators">Progress Indicators</a>
	in the Enyo Developer Guide.
*/
enyo.kind({
	name: "moon.ProgressBar",
	classes: "moon-progress-bar",
	published: {
		//* Current position of progress bar
		progress: 0,
		//* Minimum progress value (i.e., no progress made)
		min: 0,
		//* Maximum progress value (i.e., process complete)
		max: 100,
		//* CSS classes to apply to progress bar
		barClasses: "",
		//* Value increment that a sliders can be "snapped to" in either direction
		increment: 0,
		//* Progress completed of background
		bgProgress: 0
	},
	events: {
		//* Fires when progress bar finishes animating to a position.
		onAnimateProgressFinish: ""
	},
	//* @protected
	components: [
		{name: "progressAnimator", kind: "Animator", onStep: "progressAnimatorStep", onEnd: "progressAnimatorComplete"},
		{name: "bgbar", classes: "moon-progress-bg-bar"},
		{name: "bar", classes: "moon-progress-bar-bar"}
	],
	create: function() {
		this.inherited(arguments);
		this.progressChanged();
		this.barClassesChanged();
		this.bgProgressChanged();
	},
	barClassesChanged: function(inOld) {
		this.$.bar.removeClass(inOld);
		this.$.bar.addClass(this.barClasses);
	},
	bgProgressChanged: function() {
		this.bgProgress = this.clampValue(this.min, this.max, this.bgProgress);
		var p = this.calcPercent(this.bgProgress);
		this.updateBgBarPosition(p);
	},
	progressChanged: function() {
		this.progress = this.clampValue(this.min, this.max, this.progress);
		var p = this.calcPercent(this.progress);
		this.updateBarPosition(p);
	},
	calcIncrement: function(inValue) {
		return (Math.round(inValue / this.increment) * this.increment);
	},
	clampValue: function(inMin, inMax, inValue) {
		return Math.max(inMin, Math.min(inValue, inMax));
	},
	calcRatio: function(inValue) {
		return (inValue - this.min) / (this.max - this.min);
	},
	calcPercent: function(inValue) {
		return this.calcRatio(inValue) * 100;
	},
	updateBarPosition: function(inPercent) {
		this.$.bar.applyStyle("width", inPercent + "%");
	},
	updateBgBarPosition: function(inPercent) {
		this.$.bgbar.applyStyle("width", inPercent + "%");
	},
	//* @public
	//* Animates progress to the given value.
	animateProgressTo: function(inValue) {
		this.$.progressAnimator.play({
			startValue: this.progress,
			endValue: inValue,
			node: this.hasNode()
		});
	},
	//* @protected
	progressAnimatorStep: function(inSender) {
		this.setProgress(inSender.value);
		return true;
	},
	progressAnimatorComplete: function(inSender) {
		this.doAnimateProgressFinish(inSender);
		return true;
	}
});
