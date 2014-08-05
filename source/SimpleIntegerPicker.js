(function (enyo, scope) {
	/**
	* Fires when the currently selected item changes.
	*
	* @event moon.SimpleIntegerPicker#event:onChange
	* @type {Object}
	* @property {Number} value - The value of the currently selected item.
	* @property {String} content - The content of the currently selected item.
	* @public
	*/

	/**
	* Fires in response to "Return" keypress while the picker has focus in 
	* [Spotlight]{@link enyo.Spotlight} 5-way mode.
	*
	* @event moon.SimpleIntegerPicker#event:onSelect
	* @type {Object}
	* @property {Number} value - The value of the currently selected item.
	* @property {String} content - The content of the currently selected item.
	* @public
	*/

	/**
	* Fires when the picker is rebuilt, allowing other controls the opportunity to reflow the picker
	* as necessary, i.e. as a child of 
	* [_moon.ExpandableIntegerPicker_]{@link moon.ExpandableIntegerPicker} needing to be reflowed 
	* when opened as it may currently not be visible. No event-specific data is sent with this
	* event.
	*
	* @event moon.SimpleIntegerPicker#event:onRebuilt
	* @type {Object}
	* @public
	*/

	/**
	* _moon.SimpleIntegerPicker_ is a [control]{@link enyo.Control} that prompts the user to make a
	* selection from a range of integer-based options.
	* 
	* The picker may be changed programmatically by calling 
	* [_previous()_]{@link moon.SimpleIntegerPicker#previous} or 
	* [_next()_]{@link moon.SimpleIntegerPicker#next}, or by modifying the published property 
	* [_value_]{@link moon.SimpleIntegerPicker#value}.
	*
	* @class moon.SimpleIntegerPicker
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.SimpleIntegerPicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.SimpleIntegerPicker',

		/**
		* @private
		*/
		kind: 'enyo.Control',
		
		/**
		* @private
		*/
		classes: 'moon-simple-integer-picker',

		/**
		* @private
		*/
		spotlight:true,
		
		/**
		* @private
		*/
		events: {
			onChange: '',
			onSelect: '',
			onRebuilt: ''
		},
		
		/**
		* @private
		*/
		handlers: {
			onSpotlightSelect      : 'fireSelectEvent',
			onSpotlightRight       : 'next',
			onSpotlightLeft        : 'previous',
			onSpotlightScrollUp    : 'next',
			onSpotlightScrollDown  : 'previous',
			
			onSpotlightBlur        : 'spotlightBlur',
			onSpotlightFocus       : 'spotlightFocus',
			onSpotlightFocused     : 'spotlightFocus',

			onmousewheel           : 'mousewheel'
		},
		
		/**
		* @private
		*/
		published: 
			/** @lends moon.SimpleIntegerPicker.prototype */ {

			/** 
			* When `true`, picker transitions animate left/right.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			animate:true,
			
			/** 
			* When `true`, button is shown as disabled and does not generate tap events.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disabled: false,
			
			/** 
			* Initial picker value.
			*
			* @type {Number}
			* @default -1
			* @public
			*/
			value: -1,
			
			/** 
			* Minimum picker value.
			*
			* @type {Number}
			* @default 1
			* @public
			*/
			min: 1,
			
			/** 
			* Maximum picker value.
			*
			* @type {Number}
			* @default 9
			* @public
			*/
			max: 9,
			
			/** 
			* Amount to increment/decrement by when moving picker between 
			* [_min_]{@link moon.SimpleIntegerPicker#min} and 
			* [_max_]{@link moon.SimpleIntegerPicker#max}.
			*
			* @type {Number}
			* @default 1
			* @public
			*/
			step: 1,
			
			/** 
			* Unit label to be appended to the value for display.
			*
			* @type {String}
			* @default 'sec'
			* @public
			*/
			unit: 'sec'
		},

		/**
		* @private
		*/
		deferInitialization: false,

		/**
		* @private
		*/
		indices: null,

		/**
		* @private
		*/
		values: null,

		/**
		* @private
		*/
		components: [
			{name: 'buttonLeft', classes: 'moon-simple-integer-picker-button left', ondown: 'downPrevious', onholdpulse:'previous', components: [
				{classes: 'moon-simple-integer-picker-button-tap-area'}
			]},
			{name: 'client', kind: 'enyo.Panels', classes: 'moon-simple-integer-picker-client', controlClasses: 'moon-simple-integer-picker-item', draggable: false, arrangerKind: 'CarouselArranger',
				onTransitionStart: 'transitionStart', onTransitionFinish:'transitionFinished'
			},
			{name: 'buttonRight', classes: 'moon-simple-integer-picker-button right', ondown: 'downNext', onholdpulse:'next', components: [
				{classes: 'moon-simple-integer-picker-button-tap-area'}
			]}
		],

		/**
		* @private
		*/
		observers: {
			triggerRebuild: ['step', 'min', 'max', 'unit'],
			handleValueChange: ['value']
		},

		/**
		* @private
		*/
		bindings: [
			{from: '.animate',  to: '.$.client.animate'},
			{from: '.disabled', to: '.$.buttonLeft.disabled'},
			{from: '.disabled', to: '.$.buttonRight.disabled'},
			{from: '.value',   to: '.$.client.index', oneWay: false, transform: 'sync'}
		],

		/**
		* @private
		*/
		sync: function(val, origin, binding) {
			if (this.values) {
				return (origin === enyo.Binding.DIRTY_FROM) ? this.indices[val] : this.values[val];
			}
		},

		/** 
		* Cycles the selected item to the one before the currently selected item.
		*
		* @returns {Boolean} Returns `true` indicating event has been handled.
		* @public
		*/
		previous: function() {
			this.$.client.previous();
			return true;
		},
		
		/** 
		* Cycles the selected item to the one after the currently selected item.
		*
		* @returns {Boolean} Returns `true` indicating event has been handled.
		* @public
		*/
		next: function() {
			this.$.client.next();
			return true;
		},

		/**
		* @private
		*/
		downPrevious: function(sender, e) {
			e.configureHoldPulse({endHold: 'onLeave', delay: 300});
			this.previous();
		},

		/**
		* @private
		*/
		downNext: function(sender, e) {
			e.configureHoldPulse({endHold: 'onLeave', delay: 300});
			this.next();
		},
		
		/** 
		* Facades the currently active panel.
		*
		* @private
		*/
		getContent: function() {
			return (this.$.client && this.$.client.hasNode() && this.$.client.getActive()) ? this.$.client.getActive().getContent() : '';
		},

		/**
		* @private
		*/
		create: function() {
			this.inherited(arguments);
			if (!this.deferInitialization) {
				this.build();
				this.validate();
			}
			this.disabledChanged();
			this.reflow();
		},

		/**
		* @private
		*/
		build: function() {
			var indices = this.indices = {},
				values = this.values = [];

			for (var i = 0, v = this.min; v <= this.max; i++, v += this.step) {
				this.createComponent({content: v + ' ' + this.unit, value: v});
				values[i] = v;
				indices[v] = i;
				if (this.step <= 0) {
					// if step value is 0 or negative, should create only 'min' value and then break this loop. 
					break;
				}
			}
		},

		/**
		* @private
		*/
		validate: function() {
			var index = this.indices[this.value];
			if (index !== undefined) {
				this.$.client.set('index', index);
				this.setButtonVisibility(null, this.value);
			}
			else
			{
				this.set('value', this.min);
			}
		},

		/**
		* @fires moon.SimpleIntegerPicker#event:onRebuilt
		* @private
		*/
		rebuild: function() {
			this.destroyClientControls();
			this.build();
			this.$.client.render();
			this.reflow();
			this.validate();
			this.doRebuilt();
		},

		/**
		* @private
		*/
		triggerRebuild: function() {
			// We use a job here to avoid rebuilding the picker multiple
			// times in succession when more than one of the properties it
			// depends on (min, max, step, unit) change at once. This case
			// occurs when SimpleIntegerPicker is used inside
			// ExpandableIntegerPicker, since ExpandableIntegerPicker
			// facades these properties and therefore sets them all upon
			// creation.
			this.startJob('rebuild', this.rebuild, 10);
		},

		/**
		* @private
		*/
		disabledChanged: function() {
			this.addRemoveClass('disabled', this.getDisabled());
		},

		//* On reflow, updates the bounds of _this.$.client_.
		reflow: function() {
			this.inherited(arguments);

			// Find max width of all children
			if (this.getAbsoluteShowing()) {
				var i,
					maxWidth = 0,
					c = this.$.client.getPanels();
				for (i = 0; i < c.length; i++) {
					maxWidth = Math.max(maxWidth, c[i].getBounds().width);
				}
				this.$.client.setBounds({width: maxWidth});
				for (i = 0; i < c.length; i++) {
					c[i].setBounds({width: maxWidth});
				}
				this.$.client.reflow();
			}
		},

		/**
		* @private
		*/
		transitionStart: function(sender, e) {
			if (e.fromIndex > e.toIndex) {
				this.$.buttonLeft.addClass('pressed');
			} else if (e.fromIndex < e.toIndex) {
				this.$.buttonRight.addClass('pressed');
			}
			return true;
		},

		/**
		* @private
		*/
		transitionFinished: function(sender, e) {
			this.hideOverlays();
			return true;
		},

		/**
		* @private
		*/
		spotlightBlur: function() {
			this.hideOverlays();
		},

		/**
		* @private
		*/
		hideOverlays: function() {
			this.$.buttonLeft.removeClass('pressed');
			this.$.buttonRight.removeClass('pressed');
		},

		/**
		* @private
		*/
		setButtonVisibility: function(was, is) {
			if (this.values) {
				var min = this.values[0],
					max = this.values[this.values.length - 1];
				if (is === min) {
					this.$.buttonLeft.applyStyle('visibility', 'hidden');
				}
				else if (was === min) {
					this.$.buttonLeft.applyStyle('visibility', 'visible');
				}
				if (is === max) {
					this.$.buttonRight.applyStyle('visibility', 'hidden');
				}
				else if (was === max) {
					this.$.buttonRight.applyStyle('visibility', 'visible');
				}
			}
		},

		/**
		* @fires moon.SimpleIntegerPicker#event:onSelect
		* @private
		*/
		fireSelectEvent: function () {
			if (this.hasNode()) {
				this.doSelect({content: this.getContent(), value: this.value});
			}
		},

		/**
		* @fires moon.SimpleIntegerPicker#event:onChange
		* @private
		*/
		fireChangeEvent: function() {
			if (this.hasNode()) {
				this.doChange({content: this.getContent(), value: this.value});
			}
		},

		/**
		* @private
		*/
		handleValueChange: function(was, is) {
			this.setButtonVisibility(was, is);
			this.fireChangeEvent();
		},

		/**
		* @private
		*/
		mousewheel: function(sender, e) {
			// Make sure scrollers that container integer pickers don't scroll
			e.preventDefault();
			return true;
		}
	});

})(enyo, this);
