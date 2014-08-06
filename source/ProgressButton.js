(function (enyo, scope) {
	/**
	* Fires when progress button finishes animating to a position. No event-specific data is sent with
	* this event.
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
	enyo.kind(
		/** @lends moon.ProgressButton.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ProgressButton',

		/**
		* @private
		*/
		kind: 'moon.Button',

		/**
		* @private
		*/
		classes: 'moon-progress-button',

		/**
		* @private
		*/
		spotlight: false,

		/**
		* @private
		* @lends moon.ProgressButton.prototype
		*/
		published: {

			/**
			* Current position of progress button
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
			* CSS classes to apply to progress button bar
			*
			* @type {String}
			* @default 'moon-progress-button-bgcolor'
			* @public
			*/
			barClasses: 'moon-progress-button-bgcolor'
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
			{name: 'progressAnimator', kind: 'Animator', onStep: 'progressAnimatorStep', onEnd: 'progressAnimatorComplete'},
			{name: 'bar', classes: 'moon-progress-button-bar'},
			{name: 'progressPercent', classes: 'moon-progress-button-progresspercent'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.preContent = this.content;
			this.addRemoveClass('moon-progress-button-rtl', this.rtl);
			this.progressChanged();
			this.barClassesChanged();
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
		progressChanged: function () {
			this.$.bar.removeClass('moon-progress-button-remove-bar');
			this.progress = this.clampValue(this.min, this.max, this.progress);
			var percent = this.calcPercent(this.progress);
			if(percent === 0){
				this.$.bar.applyStyle('transform', 'translateX(-100%)');
				this.set('content', this.preContent);
				this.$.progressPercent.set('content', '');
			} else if(percent>0 && percent<5){
				this.updateProgressPercent(percent);
				this.$.bar.applyStyle('transform', 'translateX(-100%)');
			} else if(percent>=5 && percent<25){
				this.updateProgressPercent(percent);
				this.$.bar.applyStyle('transform', 'translateX(-95%)');
			} else if(percent>=25 && percent<50){
				this.updateProgressPercent(percent);
				this.$.bar.applyStyle('transform', 'translateX(-75%)');
			} else if(percent>=50 && percent<75){
				this.updateProgressPercent(percent);
				this.$.bar.applyStyle('transform', 'translateX(-50%)');
			} else if(percent>=75 && percent<100){
				this.updateProgressPercent(percent);
				this.$.bar.applyStyle('transform', 'translateX(-25%)');
			} else if(percent == 100){
				this.$.bar.applyStyle('transform', 'translateX(0%)');
				this.setPostContent();
			}
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
		updateProgressPercent: function(inPercent) {
			this.set('content', '');
			this.$.progressPercent.set('content', Math.round(inPercent) + '%');
			this.$.bar.addClass(this.barClasses);
		},

		/**
		* @private
		*/
		setPostContent: function(){
			var _this = this;
			setTimeout(function(){
				_this.$.progressPercent.set('content', '');
				_this.$.bar.addClass('moon-progress-button-remove-bar');
				_this.set('content', _this.postContent);
			},1000);
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
		* @fires moon.ProgressBar#onButtonProgressFinish
		* @private
		*/
		progressAnimatorComplete: function (inSender) {
			this.doButtonProgressFinish();
			return true;
		}
	});

})(enyo, this);
