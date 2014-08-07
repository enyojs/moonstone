(function (enyo, scope) {
	/**
	* Fires when progress bar finishes animating to a position. No event-specific data is sent with
	* this event.
	*
	* @event moon.ProgressBar#onAnimateProgressFinish
	* @type {Object}
	* @public
	*/

	/**
	* `moon.ProgressBar` is a  control that shows the current progress of a
	* process in a horizontal bar.
	*
	* ```
	* {kind: 'moon.ProgressBar', progress: 10}
	* ```
	*
	* To animate progress changes, call the {@link moon.ProgressBar#animateProgressTo} method:
	*
	* ```
	* this.$.progressBar.animateProgressTo(50);
	* ```
	*
	* You may customize the color of the bar by applying a style via the
	* {@link moon.ProgressBar#barClasses} property, e.g.:
	*
	* ```
	* {kind: 'moon.ProgressBar', barClasses: 'class-name'}
	* ```
	*
	* For more information, see the documentation on [Progress
	* Indicators](building-apps/controls/progress-indicators.html) in the Enyo
	* Developer Guide
	*
	* @class moon.ProgressBar
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ProgressBar.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ProgressBar',

		/**
		* @private
		*/
		classes: 'moon-progress-bar',

		/**
		* @private
		* @lends moon.ProgressBar.prototype
		*/
		published: {

			/**
			* Current position of progress bar
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			progress: 0,

			/**
			* Minimum progress value (i.e., no progress made)
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			min: 0,

			/**
			* Maximum progress value (i.e., process complete)
			*
			* @type {Number}
			* @default 100
			* @public
			*/
			max: 100,

			/**
			* CSS classes to apply to progress bar
			*
			* @type {String}
			* @default 'moon-progress-bar-bar'
			* @public
			*/
			barClasses: 'moon-progress-bar-bar',

			/**
			* CSS classes to apply to background progress bar
			*
			* @type {String}
			* @default 'moon-progress-bg-bar'
			* @public
			*/
			bgBarClasses: 'moon-progress-bg-bar',

			/**
			* Completion percentage for background process
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			bgProgress: 0
		},

		/**
		* @private
		*/
		events: {

			/**
			* {@link moon.ProgressBar#onAnimateProgressFinish}
			*/
			onAnimateProgressFinish: ''
		},

		/**
		* @private
		*/
		components: [
			{name: 'progressAnimator', kind: 'Animator', onStep: 'progressAnimatorStep', onEnd: 'progressAnimatorComplete'},
			{name: 'bgbar'},
			{name: 'bar'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.progressChanged();
			this.barClassesChanged();
			this.bgBarClassesChanged();
			this.bgProgressChanged();
		},

		/**
		* @private
		*/
		barClassesChanged: function (inOld) {
			this.$.bar.removeClass(inOld);
			this.$.bar.addClass(this.barClasses);
		},

		/**
		* @private
		*/
		bgBarClassesChanged: function (inOld) {
			this.$.bgbar.removeClass(inOld);
			this.$.bgbar.addClass(this.bgBarClasses);
		},

		/**
		* @private
		*/
		bgProgressChanged: function () {
			this.bgProgress = this.clampValue(this.min, this.max, this.bgProgress);
			var p = this.calcPercent(this.bgProgress);
			this.updateBgBarPosition(p);
		},

		/**
		* @private
		*/
		progressChanged: function () {
			this.progress = this.clampValue(this.min, this.max, this.progress);
			var p = this.calcPercent(this.progress);
			this.updateBarPosition(p);
		},

		/**
		* @private
		*/
		clampValue: function (inMin, inMax, inValue) {
			return Math.max(inMin, Math.min(inValue, inMax));
		},

		/**
		* @private
		*/
		calcRatio: function (inValue) {
			return (inValue - this.min) / (this.max - this.min);
		},

		/**
		* @private
		*/
		calcPercent: function (inValue) {
			return this.calcRatio(inValue) * 100;
		},

		/**
		* @private
		*/
		updateBarPosition: function (inPercent) {
			this.$.bar.applyStyle('width', inPercent + '%');
		},

		/**
		* @private
		*/
		updateBgBarPosition: function (inPercent) {
			this.$.bgbar.applyStyle('width', inPercent + '%');
		},

		/**
		* Animates progress to the passed-in value.
		*
		* @param {Number} inValue  The destination number
		* @public
		*/
		animateProgressTo: function (inValue) {
			this.$.progressAnimator.play({
				startValue: this.progress,
				endValue: inValue,
				node: this.hasNode()
			});
		},

		/**
		* @private
		*/
		progressAnimatorStep: function (inSender) {
			this.setProgress(inSender.value);
			return true;
		},

		/**
		* @fires moon.ProgressBar#onAnimateProgressFinish
		* @private
		*/
		progressAnimatorComplete: function (inSender) {
			this.doAnimateProgressFinish();
			return true;
		}
	});

})(enyo, this);
