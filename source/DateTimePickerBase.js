(function (enyo, scope) {
	/**
	* Fires when the picker's value changes.
	*
	* @event moon.DateTimePickerBase#onChange
	* @type {Object}
	* @property {String} name - The name of this control.
	* @property {Date} value - A standard JavaScript {@glossary Date} object representing
	* the picker's current value.
	* @public
	*/

	/**
	* {@link moon.DateTimePickerBase} is a base kind implementing fuctionality shared by
	* {@link moon.DatePicker} and {@link moon.TimePicker}. It is not intended to be used
	* directly.
	*
	* @class moon.DateTimePickerBase
	* @extends moon.ExpandableListItem
	* @ui
	* @protected
	*/

	enyo.kind(
		/** @lends moon.DateTimePickerBase.prototype */ {

		/**
		* @private
		*/
		name: 'moon.DateTimePickerBase',

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
		classes: 'moon-expandable-picker moon-date-picker',

		/**
		* @private
		*/
		events: {

			/**
			* {@link moon.DateTimePickerBase#onChange}
			*/
			onChange: ''
		},

		/**
		* @private
		*/
		handlers: {
			//* Handler for _onChange_ events coming from constituent controls
			onChange: 'handleChangeEvent'
		},

		/**
		* @private
		* @lends moon.DateTimePickerBase.prototype
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
			* The locale (in IETF format) used for picker formatting.
			*
			* This setting only applies when the [iLib]{@glossary ilib} library is loaded.
			*
			* When `iLib` is not present, U.S. English `(en-US)` formatting is applied.
			*
			* When `iLib` is present and `locale` is set to the default value `(null)`,
			* the picker uses `iLib`'s current locale (which `iLib` tries to determine
			* from the system).
			*
			* When `iLib` is present and an explicit `locale` is provided, that locale
			* will be used (regardless of `iLib`'s current locale).
			*
			* The `locale` value may be changed after the picker is created; if this happens,
			* the picker will be reformatted to reflect the new setting.
			*
			* @type {Object}
			* @default null
			* @public
			*/
			locale: null,

			/**
			* The value of the picker, expressed as a standard JavaScript {@glossary Date}
			* object.
			*
			* @type {Date}
			* @default null
			* @public
			*/
			value: null,

			/**
			* If `true`, the picker will use a 12-hour clock (this value is ignored when
			* `iLib` is loaded, since the meridiem will be set by the current locale).
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			meridiemEnable: false
		},

		/**
		* Set in subkind.
		*
		* @private
		*/
		iLibFormatType: null,

		/**
		* Set in subkind.
		*
		* @private
		*/
		defaultOrdering: null,

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
			{name: 'drawer', kind: 'enyo.Drawer', resizeContainer:false, classes:'moon-expandable-list-item-client indented', components: [
				{name: 'client', kind: 'enyo.Control', classes: 'enyo-tool-decorator moon-date-picker-client', onSpotlightLeft:'closePicker', onSpotlightSelect: 'closePicker'}
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
			this.createComponent({kind: 'enyo.Signals', onlocalechange: 'handleLocaleChangeEvent'});
			this.initDefaults();
		},

		/**
		* @private
		*/
		initILib: function () {
			var fmtParams = {
				type: this.iLibFormatType,
				timezone: 'local',
				length: 'full',
				date: 'dmwy'
			};
			if (this.locale) {
				fmtParams.locale = this.locale;
				this.iLibLocale = null;
				ilib.setLocale(this.locale);
			} else {
				this.iLibLocale = ilib.getLocale();
			}
			this._tf = new ilib.DateFmt(fmtParams);
		},

		/**
		* @private
		*/
		initDefaults: function () {
			var ordering;
			//Attempt to use the ilib lib (assuming that it is loaded)
			if (typeof ilib !== 'undefined') {
				this.initILib();
				ordering = this._tf.getTemplate();
			} else {
				ordering = this.defaultOrdering;
			}
			this.setupPickers(ordering);
			this.noneTextChanged();
		},

		/**
		* @private
		*/
		setupPickers: function (ordering) {
			// implement in subkind, calling this.inherited() at the end
			this.pickers = this.getClientControls();
		},

		/**
		* @private
		*/
		formatValue: function () {
			// implement in subkind
		},

		/**
		* @private
		*/
		handleChangeEvent: function (inSender, inEvent) {
			if (inEvent && inEvent.originator === this) {
				// Don't handle our own change events
				return;
			} else {
				this.updateValue(inSender, inEvent);
				return true;
			}
		},

		/**
		* @private
		*/
		updateValue: function (inSender, inEvent) {
			// implement in subkind
		},

		/**
		* @fires moon.DateTimePickerBase#onChange
		* @private
		*/
		valueChanged: function (inOld) {
			this.setChildPickers(inOld);
			if (this.value) {
				this.doChange({name:this.name, value:this.value});
			} else {
				this.noneTextChanged();
			}
		},

		/**
		* @private
		*/
		setChildPickers: function (inOld) {
			// implement in subkind
		},

		/**
		* If no item is selected, sets [noneText]{@link moon.DateTimePickerBase#noneText}
		* as current value.
		*
		* @private
		*/
		noneTextChanged: function () {
			if(!this.value) {
				this.$.currentValue.setContent(this.getNoneText());
			} else {
				this.$.currentValue.setContent(this.formatValue());
			}
		},

		/**
		* When [open]{@link moon.ExpandableListItem#open} changes, shows/hides the current value.
		*
		* @private
		*/
		openChanged: function () {
			this.inherited(arguments);
			var pickers = this.pickers,
				i, p;
			if (pickers) {
				for (i = 0; i < pickers.length; i++) {
					p = pickers[i];
					if (p.getClientControls().length > 0) {
						p = p.getClientControls()[0];
					}
					p.reflow();
				}
			}
		},

		/**
		* @private
		*/
		toggleActive: function () {
			if (this.getOpen()) {
				this.setActive(false);
				if (!enyo.Spotlight.getPointerMode()) {
					enyo.Spotlight.spot(this.$.headerWrapper);
				}
			} else {
				if (!this.value) {
					this.setValue(new Date());
				}
				this.setActive(true);
			}
		},

		/**
		* @private
		*/
		closePicker: function (inSender, inEvent) {
			/**
			* If select/enter is pressed on any date picker item or the left key is pressed on the
			* first item, close the drawer
			*/
			if (inEvent.type == 'onSpotlightSelect' ||
				this.$.client.children[0].id == inEvent.originator.id) {
				this.expandContract();
				this.noneTextChanged();
				return true;
			}
		},

		/**
		* @private
		*/
		localeChanged: function () {
			// Our own locale property has changed, so we need to rebuild our child pickers
			if (typeof ilib !== 'undefined') {
				ilib.setLocale(this.locale);
			}
			this.refresh();
		},

		/**
		* @private
		*/
		handleLocaleChangeEvent: function () {
			// We've received a localechange event from the system, which means either the system
			// locale or the timezone may have changed.
			if (typeof ilib !== 'undefined' && ilib.getLocale() !== this.iLibLocale) {
				// We're using iLib locale, and it has changed, so we'll rebuild the child pickers
				// entirely
				this.refresh();
			} else {
				// We don't care about the iLib locale or it hasn't changed, but timezone might have
				// changed, so we'll just update the child pickers
				this.setChildPickers();
			}
		},

		/**
		* @private
		*/
		refresh: function (){
			this.destroyClientControls();
			this.pickers = null;
			if (this._tf) {
				delete this._tf;
			}
			if (this.value && typeof ilib !== 'undefined'){
				this.localeValue = ilib.Date.newInstance({unixtime: this.value.getTime(), timezone: "local"});
			}
			this.initDefaults();
			this.render();
		}
	});

})(enyo, this);
