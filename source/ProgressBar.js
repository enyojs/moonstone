/**
	_moon.ProgressBar_ is a  control that shows the current progress of a
	process in a horizontal bar.

		{kind: "moon.ProgressBar", progress: 10}

	To animate progress changes, call the _animateProgressTo()_ method:

		this.$.progressBar.animateProgressTo(50);

	You may customize the color of the bar by applying a style via the
	_barClasses_ property, e.g.:

		{kind: "moon.ProgressBar", barClasses: "class-name"}

	For more information, see the documentation on [Progress
	Indicators](building-apps/controls/progress-indicators.html) in the Enyo
	Developer Guide.
*/
enyo.kind({
	name: "moon.ProgressBar",
	//* @protected
	classes: "moon-progress-bar",
	//* @public
	published: {
		//* Current position of progress bar
		progress: 0,
		//* Minimum progress value (i.e., no progress made)
		min: 0,
		//* Maximum progress value (i.e., process complete)
		max: 100,
		//* CSS classes to apply to progress bar
		barClasses: "moon-progress-bar-bar",
		//* CSS classes to apply to bg progress bar
		bgBarClasses: "moon-progress-bg-bar",
		//* Completion percentage for background process
		bgProgress: 0
	},
	events: {
		//* Fires when progress bar finishes animating to a position.
		onAnimateProgressFinish: ""
	},
	//* @protected
	components: [
		{name: "progressAnimator", kind: "Animator", onStep: "progressAnimatorStep", onEnd: "progressAnimatorComplete"},
		{name: "bgbar"},
		{name: "bar"}
	],
	create: function() {
		this.inherited(arguments);
		this.addRemoveClass("moon-progress-bar-rtl", this.rtl);
		this.progressChanged();
		this.barClassesChanged();
		this.bgBarClassesChanged();
		this.bgProgressChanged();
	},
	barClassesChanged: function(inOld) {
		this.$.bar.removeClass(inOld);
		this.$.bar.addClass(this.barClasses);
	},
	bgBarClassesChanged: function(inOld) {
		this.$.bgbar.removeClass(inOld);
		this.$.bgbar.addClass(this.bgBarClasses);
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
	//* Animates progress to the passed-in value.
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
