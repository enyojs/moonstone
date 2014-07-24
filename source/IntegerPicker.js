(function (enyo, scope) {
	/**
	* Fires when the currently selected value changes (i.e., when either
	* _topOverlay_ or _bottomOverlay_ is tapped).
	*
	* _event.name_ contains the name of the IntegerPicker instance.
	*
	* _event.value_ contains the current value of the picker.
	*
	* @event moon.IntegerPicker#event:onChange
	* @type {Object}
	* @property {Object} sender - The [component]{@link enyo.Component} that most recently
	*	propagated the [event]{@link external:event}.
	* @property {Object} event - An [object]{@link external:Object} containing
	*	[event]{@link external:event} information.
	* @public
	*/

	/**
	* _moon.IntegerPicker_ is a control that displays a list of integers
	* ranging from {@link moon.IntegerPicker#min} to {@link moon.IntegerPicker#max},
	* soliciting a choice from the user.
	*
	* To initialize the picker to a particular integer, set the _value_ property to
	* that integer:
	*
	* ```
	* {kind: 'moon.IntegerPicker', noneText: 'None Selected',
	* 	content: 'Choose a Number', min: 0, max: 25, value: 5}
	* ```
	*
	* The picker may be changed programmatically by modifying the published
	* properties {@link moon.IntegerPicker#value}, {@link moon.IntegerPicker#min}, or
	* {@linkmoon.IntegerPicker#max} in the normal manner, by calling {@link enyo.Object#set}.
	*
	* @ui
	* @class moon.IntegerPicker
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends moon.IntegerPicker.prototype */ {

	 	/**
	 	* @private
	 	*/
		name: 'moon.IntegerPicker',

	 	/**
	 	* @private
	 	*/
		classes: 'moon-scroll-picker-container',

	 	/**
	 	* @private
	 	*/
		published: /** @lends moon.IntegerPicker.prototype */ {

			/**
			* Current value of the picker
			*
			* @type {Number}
			* @default null
			* @public
			*/
			value: null,

			/**
			* Minimum value of the picker
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			min: 0,

			/**
			* Maximum value of the picker
			*
			* @type {Number}
			* @default 9
			* @public
			*/
			max: 9,

			/**
			* If a number is specified, the picker value is displayed as this many
			* zero-filled digits
			*
			* @type {Number}
			* @default null
			* @public
			*/
			digits: null,

			/**
			* When true, incrementing beyond {@link moon.IntegerPicker#max} will wrap to
			* {@link moon.IntegerPicker#min}, and decrementing beyond min will wrap to max
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			wrap: false
		},

	 	/**
	 	* @private
	 	*/
		handlers: {
			onSpotlightUp:'next',
			onSpotlightDown:'previous',
			onSpotlightBlur:'spotlightBlur',
			onSpotlightScrollUp:'next',
			onSpotlightScrollDown:'previous',
			onmousewheel:'mousewheel'
		},

	 	/**
	 	* @private
	 	*/
		events: {
			/**
			* {@link moon.IntegerPicker#event:onChange}
			*/
			onChange: ''
		},

	 	/**
	 	* @private
	 	*/
		spotlight: true,

	 	/**
		* Cache scroll bounds so we don't have to run {@link enyo.Scroller#stop} every time we need them
		*
	 	* @private
	 	*/
		scrollBounds: {},

	 	/**
	 	* @private
	 	*/
		components: [
			{name:'topOverlay', ondown:'downNext', onholdpulse:'next', classes:'moon-scroll-picker-overlay-container top top-image', components:[
				{classes:'moon-scroll-picker-overlay top'},
				{classes: 'moon-scroll-picker-taparea'}
			]},
			{kind: 'enyo.Scroller', thumb:false, touch:true, useMouseWheel: false, classes: 'moon-scroll-picker', components:[
				{name:'repeater', kind:'enyo.FlyweightRepeater', ondragstart: 'dragstart', onSetupItem: 'setupItem', components: [
					{name: 'item', classes:'moon-scroll-picker-item'}
				]}
			]},
			{name:'bottomOverlay', ondown:'downPrevious', onholdpulse:'previous', classes:'moon-scroll-picker-overlay-container bottom bottom-image', components:[
				{classes:'moon-scroll-picker-overlay bottom'},
				{classes: 'moon-scroll-picker-taparea'}
			]}
		],

	 	/**
		* parameter that determines scroll math simulation speed
		*
	 	* @private
	 	*/
		scrollFrame: 3,

		/**
		* Indicates direction of change from user. Necessary to support proper wrapping
		* when `range == 2`
		*
		* @private
		*/
		direction: 0,

		/**
		* Range of possible values `max - min`
		*
		* @private
		*/
		range: 0,

	 	/**
	 	* @private
	 	*/
		create: function (){
			this.inherited(arguments);
			this.verifyValue();
			this.updateOverlays();
		},

	 	/**
	 	* @private
	 	*/
		rendered: function (){
			this.inherited(arguments);
			this.rangeChanged();
			this.scrollToValue();
			this.$.scroller.getStrategy().setFixedTime(false);
			this.$.scroller.getStrategy().setFrame(this.scrollFrame);
		},

	 	/**
	 	* @private
	 	*/
		getVerifiedValue: function () {
			return this.value >= this.min && this.value <= this.max ? this.value : this.min;
		},

	 	/**
	 	* @private
	 	*/
		verifyValue: function () {
			this.value = this.getVerifiedValue();
		},

	 	/**
	 	* @private
	 	*/
		setupItem: function (inSender, inEvent) {
			var index = inEvent.index;
			var content = (index % this.range) + this.min;
			if (this.digits) {
				content = ('00000000000000000000' + content).slice(-this.digits);
			}
			this.$.item.setContent(content);
		},

	 	/**
	 	* @private
	 	*/
		rangeChanged: function () {
			this.verifyValue();
			this.range = this.max - this.min + 1;
		},

	 	/**
		* fail-safe design.
		* If out boundary value is assigned, adjust boundary.
		*
	 	* @private
	 	*/
		valueChanged: function (old) {
			if (this.value < this.min) {
				this.setMin(this.value);
			} else if (this.value > this.max) {
				this.setMax(this.value);
			}

			this.scrollToValue(old);
			this.updateOverlays();
		},

	 	/**
		* prevent scroller dragging
		*
	 	* @private
	 	*/
		dragstart: function (inSender, inEvent) {
			return true;
		},

	 	/**
	 	* @private
	 	*/
		minChanged: function () {
			this.rangeChanged();
		},

	 	/**
	 	* @private
	 	*/
		maxChanged: function () {
			this.rangeChanged();
		},

	 	/**
	 	* @private
	 	*/
		previous: function (inSender, inEvent) {
			this.direction = -1;

			if (this.value > this.min) {
				this.setValue(this.value - 1);
			} else if (this.wrap) {
				this.setValue(this.max);
			} else {
				return;
			}
			this.$.bottomOverlay.addClass('selected');
			if (inEvent.originator != this.$.upArrow) {
				this.startJob('hideBottomOverlay', 'hideBottomOverlay', 350);
			}
			this.fireChangeEvent();

			this.direction = 0;
			return true;
		},

	 	/**
	 	* @private
	 	*/
		next: function (inSender, inEvent) {
			this.direction = 1;

			if (this.value < this.max) {
				this.setValue(this.value + 1);
			} else if (this.wrap) {
				this.setValue(this.min);
			} else {
				return;
			}
			this.$.topOverlay.addClass('selected');
			if (inEvent.originator != this.$.downArrow) {
				this.startJob('hideTopOverlay', 'hideTopOverlay', 350);
			}
			this.fireChangeEvent();

			this.direction = 0;
			return true;
		},

	 	/**
	 	* @private
	 	*/
		downPrevious: function (inSender, inEvent) {
			inEvent.configureHoldPulse({endHold: 'onLeave', delay: 300});
			this.previous(inSender, inEvent);
		},

	 	/**
	 	* @private
	 	*/
		downNext: function (inSender, inEvent) {
			inEvent.configureHoldPulse({endHold: 'onLeave', delay: 300});
			this.next(inSender, inEvent);
		},

	 	/**
	 	* @private
	 	*/
		updateOverlays: function () {
			this.$.bottomOverlay.addRemoveClass('bottom-image', this.wrap || (this.value !== this.min));
			this.$.topOverlay.addRemoveClass('top-image', this.wrap || (this.value !== this.max));
		},

		/**
		* Renders the repeater
		*
		* @param {Number} index - Index of row
		* @param {Number} count - Number of rows to render
		* @private
		*/
		updateRepeater: function(index, count) {
			this.$.repeater.set('rowOffset', index);
			this.$.repeater.set('count', count || 1);
			this.$.repeater.render();
		},

		/**
		* Scrolls to the node at `index` if it exists
		*
		* @param  {Number} index    - Index of row
		* @param  {Boolean} animate - Animate the scroll if `true`
		* @private
		*/
		scrollToIndex: function(index, animate) {
			var node = this.$.repeater.fetchRowNode(index);
			if (node) {
				if(animate) {
					this.$.scroller.scrollTo(node.offsetLeft, node.offsetTop);
				} else {
					this.$.scroller.setScrollTop(node.offsetTop);
				}
			}
		},

		/**
		* Sets up the repeater to render the rows between `old` and
		* `[value]{@link moon.IntegerPicker#value}` and scrolls to reveal the current value. If `old`
		* is specified, the scroll will be animated. If `[wrap]{@link moon.IntegerPicker#wrap}` is
		* `true`, the scroll will travel the shortest distance which may wrap.
		*
		* @param  {Number} [old] - Prior value from which to scroll
		* @private
		*/
		scrollToValue: function(old) {
			var newIndex = this.value - this.min;

			if(old !== undefined) {
				var delta = this.value - old;
				var oldIndex = old - this.min;

				if(this.wrap && Math.abs(delta) >= this.range/2) {

					// when range is 2, we need special logic so scrolling matches the user's action
					// (e.g. tapping the up arrow always scrolls up). If direction (set in next()
					// and previous()) === delta (which will always be +/- 1), the natural rendering
					// is correct even though we're wrapping around the boundary so don't adjust.
					if(!(this.range === 2 && this.direction !== delta)) {
						// if wrapping and wrapping is a shorter distance, adjust the lesser index by the
						// range so the distance is the shortest possible
						if(newIndex > oldIndex) {
							oldIndex += this.range;
						} else {
							newIndex += this.range;
						}
					}
				}

				// rowOffset should be the lesser of the indices and count is the difference + 1
				var index = Math.min(oldIndex, newIndex);
				var count = Math.abs(newIndex - oldIndex) + 1;
				this.updateRepeater(index, count);

				this.scrollToIndex(oldIndex, false);
				this.startJob("valueChanged-Scroller", this.bindSafely("scrollToIndex", newIndex, true), 16);
			} else {
				// if old isn't specified, setup the repeater with only this.value and jump to it
				this.updateRepeater(newIndex);
				this.scrollToIndex(newIndex, false);
			}
		},

	 	/**
	 	* @private
	 	*/
		hideTopOverlay: function () {
			this.$.topOverlay.removeClass('selected');
		},

	 	/**
	 	* @private
	 	*/
		hideBottomOverlay: function () {
			this.$.bottomOverlay.removeClass('selected');
		},

	 	/**
		* @fires moon.IntegerPicker#event:onChange
	 	* @private
	 	*/
		fireChangeEvent: function () {
			this.doChange({
				name:this.name,
				value:this.value
			});
		},

	 	/**
	 	* @private
	 	*/
		resetOverlay: function () {
			this.hideTopOverlay();
			this.hideBottomOverlay();
		},

	 	/**
		* @fires moon.Scroller#event:onRequestScrollIntoView
	 	* @private
	 	*/
		spotlightFocus: function () {
			this.bubble('onRequestScrollIntoView');
		},

	 	/**
	 	* @private
	 	*/
		spotlightBlur: function () {
			this.hideTopOverlay();
			this.hideBottomOverlay();
		},

	 	/**
		* Cache scroll bounds in {@link moon.IntegerPicker#scrollBounds} so we don't have to call
		* {@link enyo.Scroller#stop} to retrieve them later
		*
	 	* @private
	 	*/
		updateScrollBounds: function () {
			this.scrollBounds = this.$.scroller.getStrategy()._getScrollBounds();
		},

	 	/**
		* Silently scrolls to the _inValue_ y-position without animating
		*
	 	* @private
	 	*/
		setScrollTop: function (inValue) {
			this.$.scroller.setScrollTop(inValue);
		},

	 	/**
		* Ensures scroll position is in bounds.
		*
	 	* @private
	 	*/
		stabilize: function () {
			this.$.scroller.stabilize();
		},

	 	/**
	 	* @private
	 	*/
		mousewheel: function (inSender, inEvent) {
			// Make sure scrollers that container integer pickers don't scroll
			inEvent.preventDefault();
			return true;
		}
	});

 	/**
	* For backward compatibility
	*
 	* @private
 	*/
	moon.IntegerScrollPicker = moon.IntegerPicker;

})(enyo, this);

