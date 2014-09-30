(function (enyo, scope) {
	/**
	* Fires when the value changes.
	*
	* @event moon.DurationPickerBase#onChange
	* @type {Object}
	* @property {String} name - contains the name of this control.
	* @public
	*/

	/**
	* `moon.DurationPickerBase` is a base kind implementing fuctionality
	* not intended to be used directly by  {@link moon.DurationPicker}
	*
	* @class moon.DurationPickerBase
	* @extends moon.ExpandableListItem
	* @protected
	*/

	enyo.kind(
		/** @lends moon.DurationPickerBase.prototype */ {

		/**
		* @private
		*/
		name: 'moon.DurationPickerBase',

		/**
		* @private
		*/
		kind: 'moon.ExpandableListItem',

		/**
		* @private
		*/
		defaultKind: 'enyo.Control',

		/**
		* @private
		*/
		classes: 'moon-expandable-picker',

		/**
		* @private
		*/
		handlers: {
			//* Handler for _onChange_ events coming from constituent controls
			onChange: 'handleChangeEvent'
		},

		/**
		* @private
		* @lends moon.DurationPickerBase.prototype
		*/
		published: {

			/**
			* Text to be displayed as the current value if no item is currently selected
			*
			* @type {String}
			* @default ''
			* @public
			*/
			noneText: ''
		},

		/**
		* @private
		*/
		components: [
			{name: 'headerWrapper', kind: 'moon.Item', classes: 'moon-date-picker-header-wrapper', onSpotlightFocus: 'headerFocus', ontap: 'expandContract', components: [
				// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
				{name: 'headerContainer', classes: 'moon-expandable-list-item-header moon-expandable-picker-header moon-expandable-datetime-header', components: [
					{name: 'header', kind: 'moon.MarqueeText'}
				]},
				{name: 'currentValue', kind: 'moon.MarqueeText', classes: 'moon-expandable-picker-current-value'}
			]},
			{name: 'drawer', kind: 'enyo.Drawer', resizeContainer: false, classes: 'moon-expandable-list-item-client indented', components: [
				{name: 'client', kind: 'enyo.Control', classes: 'enyo-tool-decorator moon-date-picker-client', onSpotlightLeft: 'closePicker', onSpotlightSelect: 'closePicker'}
			]}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.disabled', to: '.$.headerWrapper.disabled'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.initDefaults();
		},

		/**
		* @private
		*/
		initDefaults: function () {
			this.setupPickers();
			this.noneTextChanged();
		},

		/**
		* @private
		*/
		setupPickers: function () {
			// implement in subkind, calling this.inherited() at the end
			this.pickers = this.getClientControls();
		},

		/**
		* @private
		*/
		handleChangeEvent: function (sender, ev) {
			if (ev && ev.originator === this) {
				// Don't handle our own change events
				return;
			} else {
				this.updateValue(sender, ev);
				return true;
			}
		},

		/**
		* @private
		*/
		// updateValue: function (sender, ev) {
			// implement in subkind
		// },

		/**
		* If no item is selected, uses [`noneText`]{@link moon.DurationPickerBase#noneText}
		* as current value and if nonoText value is not provided, use 'Pick Duration'
		* as default.
		*
		* @private
		*/
		noneTextChanged: function () {
			this.$.currentValue.set('content', this.noneText || 'Pick Duration');
		},

		/**
		* When [`open`]{@link moon.ExpandableListItem#open} changes, shows/hides the current value
		*
		* @private
		*/
		openChanged: function () {
			this.inherited(arguments);
			var open = this.$.drawer.get('open'),
				pickers = this.pickers,
				i, p;
			if (pickers) {
				for (i = 0; i < pickers.length; i++) {
					p = pickers[i];
					if (p.getClientControls().length > 0) {
						p = p.getClientControls()[0];
					}
					if (open) {
						// Force the pickers to update their scroll positions (they don't update
						// while the drawer is closed)
						p.refreshScrollState();
					} else {
						// If one of the pickers is animating when the drawer closes, it won't
						// display properly when the drawer reopens, unless we stabilize here
						p.stabilize();
					}
				}
			}
		},

		/**
		* @private
		*/
		toggleActive: function () {
			if (this.get('open')) {
				this.set('active', false);
				if (!enyo.Spotlight.getPointerMode()) {
					enyo.Spotlight.spot(this.$.headerWrapper);
				}
			} else {
				this.set('active', true);
			}
		},

		/**
		* @private
		*/
		closePicker: function (sender, ev) {
			/**
			* If select/enter is pressed on any date picker item or the left key is pressed on the
			* first item, close the drawer
			*/
			if (ev.type == 'onSpotlightSelect' ||
				this.$.client.children[0].id == ev.originator.id) {
				this.expandContract();
				this.noneTextChanged();
				return true;
			}
		}
	});
})(enyo, this);
