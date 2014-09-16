(function (enyo, scope) {
	/**
	* Fires when the current text changes. This passes through {@link enyo.Input#event:onChange}.
	*
	* @event moon.ExpandableInput#onChange
	* @type {Object}
	* @property {String} value - The value of the input.
	* @public
	*/

	/**
	* {@link moon.ExpandableInput}, which extends {@link moon.ExpandableListItem}, is a
	* drop-down input that prompts the user to enter text.
	*
	* @class moon.ExpandableInput
	* @extends moon.ExpandableListItem
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ExpandableInput.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ExpandableInput',

		/**
		* @private
		*/
		kind: 'moon.ExpandableListItem',

		/**
		* @private
		*/
		classes: 'moon-expandable-input',

		/**
		* @private
		*/
		events: {

			/** {@link moon.ExpandableInput#event:onChange} */
			onChange: ''
		},

		/**
		* @private
		* @lends moon.ExpandableInput.prototype
		*/
		published: {

			/**
			* Text to be displayed as the current value if no item is currently selected.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			noneText: '',

			/**
			* Text to be displayed in the input if no text has been entered.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			placeholder: '',

			/**
			* Initial value of the input.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			value: ''
		},

		/**
		* @private
		*/
		autoCollapse: true,

		/**
		* @private
		*/
		lockBottom: false,

		/**
		* @private
		*/
		components: [
			{name: 'headerWrapper', kind: 'moon.Item', classes: 'moon-expandable-picker-header-wrapper', onSpotlightFocus: 'headerFocus', ondown: 'headerDown', ontap: 'expandContract', components: [
				// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
				{name: 'headerContainer', classes: 'moon-expandable-list-item-header moon-expandable-picker-header moon-expandable-input-header', components: [
					{name: 'header', kind: 'moon.MarqueeText'}
				]},
				{name: 'currentValue', kind: 'moon.MarqueeText', classes: 'moon-expandable-picker-current-value'}
			]},
			{name: 'drawer', kind: 'enyo.Drawer', resizeContainer:false, classes:'moon-expandable-list-item-client indented', components: [
				{name: 'inputDecorator', kind: 'moon.InputDecorator', onSpotlightBlur: 'inputBlur', onSpotlightFocus: 'inputFocus', onSpotlightDown: 'inputDown', components: [
					{name: 'clientInput', kind: 'moon.Input', onchange: 'doChange', onkeyup: 'inputKeyUp'}
				]}
			]}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.value', to: '.$.clientInput.value', oneWay: false},
			{from: '.placeholder', to: '.$.clientInput.placeholder'},
			{from: '.showCurrentValue', to: '.$.currentValue.showing'},
			{from: '.currentValueText', to: '.$.currentValue.content'},
			{from: '.disabled', to: '.$.headerWrapper.disabled'}
		],

		/**
		* @private
		*/
		computed: {
			'showCurrentValue': ['open', 'value', 'noneText'],
			'currentValueText': ['value', 'noneText']
		},

		/**
		* Computed property
		*
		* @private
		*/
		showCurrentValue: function () {
			return !this.open && this.currentValueText() !== '';
		},

		/**
		* Computed property
		*
		* @private
		*/
		currentValueText: function () {
			return (this.value === '') ? this.noneText : this.value;
		},

		/**
		* @private
		*/
		expandContract: function () {
			if (this.disabled) {
				return true;
			}
			if (this.getOpen()) {
				this.closeDrawerAndHighlightHeader();
			} else {
				this.toggleActive();
			}
		},

		/**
		* @private
		*/
		toggleActive: function () {
			if (this.getOpen()) {
				this.setActive(false);
				this.$.clientInput.blur();
			} else {
				this.setActive(true);
				enyo.Spotlight.unspot();
			}
		},

		/**
		* Focuses the {@link moon.Input} when the input decorator receives focus.
		*
		* @private
		*/
		inputFocus: function (inSender, inEvent) {
			var direction = inEvent && inEvent.dir;
			if (this.getOpen() && direction) {
				this.focusInput();
			}
		},

		/**
		* Value should be submitted if user clicks outside control. We check for
		* `onSpotlightFocus` and `mouseover` to avoid contracting the input on an event
		* fired from itself.
		*
		* @private
		*/
		inputBlur: function (inSender, inEvent) {
			var eventType = enyo.Spotlight.getLastEvent().type;
			if (enyo.Spotlight.getPointerMode() && eventType === 'down') {
				this.toggleActive();
			}
		},

		/**
		* @private
		*/
		inputKeyUp: function (inSender, inEvent) {
			if (inEvent.keyCode === 13) {
				this.closeDrawerAndHighlightHeader();
			}
		},

		/**
		* @private
		*/
		headerDown: function () {
			enyo.Spotlight.unfreeze();
		},

		/**
		* Focuses the input field if navigating down from the header while the drawer is open.
		*
		* @private
		*/
		spotlightDown: function (inSender, inEvent) {
			if (inEvent.originator === this.$.headerWrapper && this.getOpen()) {
				this.focusInput();
			}
		},

		/**
		* Focuses the input field.
		*
		* @private
		*/
		focusInput: function () {
			this.$.clientInput.focus();
			// Force cursor to end of text. We were sometimes seeing the
			// cursor positioned at the start of the text, which caused
			// problems in 5-way mode (where there's no way to move the
			// cursor).
			this.$.clientInput.hasNode().selectionStart = this.value.length;
		},

		/**
		* If [lockBottom]{@link moon.ExpandableInput#lockBottom} is `true`, don't allow user
		* to navigate down from the input field; if `false`, close the drawer and return
		* `true` to keep {@glossary Spotlight} on header.
		*
		* @private
		*/
		inputDown: function (inSender, inEvent) {
			if (this.getLockBottom()) {
				this.focusInput();
			} else {
				this.closeDrawerAndHighlightHeader();
			}
			return true;
		},

		/**
		* @private
		*/
		drawerAnimationEnd: function () {
			if (this.getOpen()) {
				this.focusInput();
			}
			this.inherited(arguments);
		},

		/**
		* We manually set pointer mode to `false` as this seems to be the
		* least harmful method to re-highlight the header after the drawer
		* closes. The other options had side effects of resetting the
		* current spotted control to the root, or requiring a double-press to
		* subsequently move via 5-way.
		*
		* @private
		*/
		closeDrawerAndHighlightHeader: function () {
			var mode = enyo.Spotlight.getPointerMode();
			enyo.Spotlight.setPointerMode(false);
			enyo.Spotlight.unfreeze();
			enyo.Spotlight.spot(this.$.headerWrapper);
			enyo.Spotlight.setPointerMode(mode);
			this.toggleActive();
		}
	});

})(enyo, this);
