(function (enyo, scope) {
	/**
	* Fires when the currently selected value changes.
	*
	* @event moon.IntegerPicker#onChange
	* @type {Object}
	* @property {Number} value - The currently selected value.
	* @property {String} name - The name of the picker instance.
	* @public
	*/

	/**
	* {@link moon.IntegerPicker} is a control that displays a list of integers
	* ranging from [min]{@link moon.IntegerPicker#min} to [max]{@link moon.IntegerPicker#max},
	* soliciting a choice from the user.
	*
	* To initialize the picker to a particular integer, set the
	* [value]{@link moon.IntegerPicker#value} property to that integer:
	*
	* ```
	* {kind: 'moon.IntegerPicker', noneText: 'None Selected',
	* 	content: 'Choose a Number', min: 0, max: 25, value: 5}
	* ```
	*
	* The picker may be changed programmatically by modifying the `value`, `min`,
	* and `max` properties in the normal manner, by calling [set()]{@link enyo.Object#set}.
	*
	* @class moon.IntegerPicker
	* @extends enyo.Control
	* @ui
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
		kind: 'enyo.Control',

		/**
		* @private
		*/
		classes: 'moon-scroll-picker-container',

		/**
		* @private
		* @lends moon.IntegerPicker.prototype
		*/
		published: {

			/**
			* Current value of the picker.
			*
			* @type {Number}
			* @default null
			* @public
			*/
			value: null,

			/**
			* Minimum value of the picker.
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			min: 0,

			/**
			* Maximum value of the picker.
			*
			* @type {Number}
			* @default 9
			* @public
			*/
			max: 9,

			/**
			* If a number is specified, the picker value is displayed as this many
			* zero-filled digits.
			*
			* @type {Number}
			* @default null
			* @public
			*/
			digits: null,

			/**
			* When `true`, incrementing beyond [max]{@link moon.IntegerPicker#max} will wrap to
			* [min]{@link moon.IntegerPicker#min}, and decrementing beyond `min` will wrap to
			* `max`.
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
		* Cache scroll bounds so we don't have to run {@link enyo.Scroller#stop} every time we
		* need them.
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
		* Parameter that determines scroll math simulation speed.
		*
		* @private
		*/
		scrollFrame: 3,

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
			this.refreshScrollState();
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
		refreshScrollState: function () {
			this.updateScrollBounds();
			var node = this.$.repeater.fetchRowNode(this.value - this.min);
			if (node) {
				this.$.scroller.scrollToNode(node);
			}
		},

		/**
		* @private
		*/
		setupItem: function (inSender, inEvent) {
			var index = inEvent.index;
			var content = index + this.min;
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
			this.$.repeater.setCount(this.max-this.min+1);
			this.$.repeater.render();
			//asynchronously scroll to the current node, this works around a potential scrolling glitch
			enyo.asyncMethod(this.bindSafely(function (){
				var node = this.$.repeater.fetchRowNode(this.value - this.min);
				if (node) {
					this.$.scroller.scrollToNode(node);
				}
			}));
		},

		/**
		* Fail-safe design.
		* If out-of-boundary value is assigned, adjust boundary.
		*
		* @private
		*/
		valueChanged: function (inOld) {
			if (this.value < this.min) {
				this.setMin(this.value);
			} else if (this.value > this.max) {
				this.setMax(this.value);
			}

			var node = this.$.repeater.fetchRowNode(this.value - this.min);
			if (node) {
				this.$.scroller.scrollTo(node.offsetLeft, node.offsetTop);
			}
			this.updateOverlays();
		},

		/**
		* Prevent scroller dragging.
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
			return true;
		},

		/**
		* @private
		*/
		next: function (inSender, inEvent) {
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
		* @fires moon.IntegerPicker#onChange
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
		* @fires moon.Scroller#onRequestScrollIntoView
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
		* Silently scrolls to the `inValue` y-position without animating.
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

