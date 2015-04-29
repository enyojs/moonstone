require('moonstone');

var
	kind = require('enyo/kind'),
	Animator = require('enyo/Animator'),
	Control = require('enyo/Control');

var
	Button = require('../Button');

/**
* Fires when progress button finishes animating to a position. No event-specific data is sent 
* with this event.
*
* @event moon.ProgressButton#onButtonProgressFinish
* @type {Object}
* @public
*/

/**
* `moon.ProgressButton` is an animated button to show progress from one state to another.
*
* ```
* {kind: 'moon.ProgressButton', progress: 10, content: 'Download', postContent: 'Launch'}
* ```
*
* To animate progress changes, call the {@link moon.ProgressButton#animateProgressTo} method:
*
* ```
* this.$.progressButton.animateProgressTo(50);
* ```
*
* You may customize the color of the bar by applying a style via the
* {@link moon.ProgressButton#barClasses} property, e.g.:
*
* ```
* {kind: 'moon.ProgressButton', barClasses: 'class-name'}
* ```
*
* For more information, see the documentation on [Progress Button
* Indicators](building-apps/controls/progress-button-indicators.html) in the Enyo
* Developer Guide
*
* @class moon.ProgressButton
* @extends moon.Button
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.ProgressButton.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ProgressButton',

	/**
	* @private
	*/
	kind: Button,

	/**
	* @private
	*/
	classes: 'moon-progress-button',

	/**
	* @private
	*/
	spotlight: true,

	/**
	* @private
	* @lends moon.ProgressButton.prototype
	*/
	published: {

		/**
		* Current position of progress button.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		progress: 0,

		/**
		* Minimum progress value (i.e., no progress made).
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		min: 0,

		/**
		* Maximum progress value (i.e., process complete).
		*
		* @type {Number}
		* @default 100
		* @public
		*/
		max: 100,

		/**
		* Optional CSS classes to apply to progress button bar.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		barClasses: '',

		/**
		* The text to display after the progress has been completed.
		*
		* @type {String}
		* @default 'Completed'
		* @public
		*/
		postContent: 'Completed',

		/**
		* Toggle whether there will be animation on the progress updates
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		animated: true,

		/**
		* The amount of fixed-steps the progress bar should increment to. 4 steps would step to
		* 25%, 50%, 75%, and 100%. 5 steps would step to 20%, 40%, 60%, 80%, and 100%. etc.
		*
		* @type {Number}
		* @default 4
		* @public
		*/
		steps: 4
	},

	/**
	* @private
	*/
	events: {

		/**
		* {@link moon.ProgressButton#onButtonProgressFinish}
		*/
		onButtonProgressFinish: ''
	},

	/**
	* @private
	*/
	components: [
		{name: 'progressAnimator', kind: Animator, onStep: 'progressAnimatorStep', onEnd: 'progressAnimatorComplete'},
		{name: 'bar', kind: Control, classes: 'moon-progress-button-bar'},
		{name: 'progressPercent', kind: Control, classes: 'moon-progress-button-progresspercent'}
	],

	/**
	* @private
	*/
	create: function () {
		Button.prototype.create.apply(this, arguments);
		this.preContent = this.content;
		this.addRemoveClass('moon-progress-button-rtl', this.rtl);
		this.progressChanged();
		this.animatedChanged();
		this.barClassesChanged();
	},

	/**
	* @private
	*/
	barClassesChanged: function (old) {
		this.$.bar.removeClass(old);
		this.$.bar.addClass(this.barClasses);
	},

	/**
	* @private
	*/
	progressChanged: function () {
		this.progress = this.clampValue(this.min, this.max, this.progress);

		var progress,
			percent = this.calcPercent(this.progress),
			offset = -10,
			minimumVisibleProgress = 10,
			increment = parseInt(100 / this.get('steps'), 10);
		if (percent < 100) {
			this.removeClass('completed');
		}
		if (percent < 5) {
			if (percent === 0) {
				this._inProgress(false);
				this.set('content', this.preContent);
				this.$.progressPercent.set('content', '');
				this.removeClass('in-progress');
			} else {
				this._inProgress(true);
				this.updateProgressPercent(percent);
			}
			// The value is so small that it should not be visible.
			this.$.bar.applyStyle('transform', 'translateX(-100%)');
			this.$.bar.applyStyle('-webkit-transform', 'translateX(-100%)');
			progress = 0;
		} else if (percent >= 5 && percent < 100) {
			// Disable spotlight: you can't click a button once it's in progress
			this._inProgress(true);
			if (percent < increment) {
				// Statically set the size of the progress bar if it's less than 1 increment.
				progress = minimumVisibleProgress;
			} else {
				// Calculate how many increments we should use
				progress = parseInt(percent / increment, 10) * increment;
			}
			this.updateProgressPercent(percent);
			// Only change the progress bar if it's different from the last time this was run
			if (progress != this._visibleProgress) {
				this.$.bar.applyStyle('transform', 'translateX(-' + (100 + offset - progress) + '%)');
				this.$.bar.applyStyle('-webkit-transform', 'translateX(-' + (100 + offset - progress) + '%)');
			}
		} else if (percent >= 100) {
			// Make it spottable again, now that it's finished.
			this.$.bar.applyStyle('transform', null);
			this.$.bar.applyStyle('-webkit-transform', null);
			this.setPostContent();
			progress = 100;
		}
		// Remember the last progress state
		this._visibleProgress = progress;
	},

	/**
	* @private
	*/
	_inProgress: function (state) {
		this.addRemoveClass('in-progress', state);
		this.set('spotlight', !state);
	},

	/**
	* @private
	*/
	clampValue: function (min, max, value) {
		return Math.max(min, Math.min(value, max));
	},

	/**
	* @private
	*/
	animatedChanged: function () {
		this.addRemoveClass('animated', this.get('animated'));
	},

	/**
	* @private
	*/
	calcRatio: function (value) {
		return (value - this.min) / (this.max - this.min);
	},

	/**
	* @private
	*/
	calcPercent: function (value) {
		return this.calcRatio(value) * 100;
	},

	/**
	* @private
	*/
	updateBarPosition: function (percent) {
		this.$.bar.applyStyle('width', percent + '%');
	},

	/**
	* @private
	*/
	updateProgressPercent: function(percent) {
		this.set('content', '');
		this.$.progressPercent.set('content', Math.round(percent) + '%');
	},

	/**
	* @private
	*/
	setPostContent: function(){
		this.startJob('completeProgress', function () {
			this.$.progressPercent.set('content', '');
			this.addClass('completed');
			this.set('content', this.get('postContent'));

			// When the animation is done, we are finally no longer in-progress.
			this.startJob('completeProgressDone', function () {
				this._inProgress(false);
			}, 200); // Same as the CSS transition duration
		}, 1000);
	},

	/**
	* Animates progress to the passed-in value.
	*
	* @param {Number} value  The destination number
	* @public
	*/
	animateProgressTo: function (value) {
		this.$.progressAnimator.play({
			startValue: this.progress,
			endValue: value,
			node: this.hasNode()
		});
	},

	/**
	* @private
	*/
	progressAnimatorStep: function (sender) {
		this.setProgress(sender.value);
		return true;
	},

	/**
	* @fires moon.ProgressBar#onButtonProgressFinish
	* @private
	*/
	progressAnimatorComplete: function (sender) {
		this.doButtonProgressFinish();
		return true;
	}
});