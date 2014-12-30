(function (enyo, scope) {
	/**
	* {@link moon.Button} is an {@link enyo.Button} with Moonstone styling applied.
	* The color of the button may be customized by specifying a background color.
	*
	* For more information, see the documentation on
	* [Buttons]{@linkplain $dev-guide/building-apps/controls/buttons.html} in the
	* Enyo Developer Guide.
	*
	* @class moon.Button
	* @extends enyo.Button
	* @mixes moon.MarqueeSupport
	* @ui
	* @public
	*/

	enyo.kind(
		/** @lends moon.Button.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Button',

		/**
		* @private
		*/
		kind: 'enyo.Button',

		/**
		* @private
		*/
		mixins: ['moon.MarqueeSupport'],

		/**
		* @private
		* @lends moon.Button.prototype
		*/
		published: {

			/**
			* A boolean parameter affecting the size of the button. If `true`, the
			* button's diameter will be set to 60px. However, the button's tap target
			* will still have a diameter of 78px, with an invisible DOM element
			* wrapping the small button to provide the larger tap zone.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			small: false,

			/**
			* A boolean parameter affecting the minimum width of the button. When `true`,
			* the minimum width will be set to 180px (or 130px if [small]{@link moon.Button#small}
			* is `true`). If `false`, the minimum width will be set to the current value of
			* `@moon-button-height` (thus forcing the button to be no smaller than a circle with
			* diameter `@moon-button-height`).
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			minWidth: true,

			/**
			* When `true`, the content will have locale-safe uppercasing applied.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			uppercase: true,

			/**
			* @deprecated Replaced by [uppercase]{@link moon.Button#uppercase}.
			*
			* Formerly defaulted to `true`, now defaults to `null` and will only have
			* an effect when explicitly set (for complete backward compatibility).
			*
			* @type {Boolean}
			* @default null
			* @public
			*/
			contentUpperCase: null
		},

		/**
		* @private
		*/
		classes: 'moon-large-button-text moon-button enyo-unselectable',

		/**
		* @private
		*/
		spotlight: true,

		/**
		* @private
		*/
		handlers: {

			/**
			* `onSpotlightSelect` simulates `mousedown`.
			*
			* @private
			*/
			onSpotlightKeyDown	: 'depress',

			/**
			* `onSpotlightKeyUp` simulates `mouseup`.
			*
			* @private
			*/
			onSpotlightKeyUp	: 'undepress',

			/**
			* Also make sure we remove the pressed class if focus is removed from
			* this item before it receives a keyup.
			*
			* @private
			*/
			onSpotlightBlur		: 'undepress',

			/**
			* The handler for `onSpotlightFocused` bubbles a `requestScrollIntoView` event.
			*
			* @private
			*/
			onSpotlightFocused	: 'spotFocused'
		},

		/**
		* On creation, updates based on value of `this.small`.
		*
		* @private
		*/
		initComponents: function () {
			if (!(this.components && this.components.length > 0)) {
				this.createComponent({name: 'client', kind:'moon.MarqueeText', isChrome: true});
				this.createComponent({name: 'tapArea', classes: 'button-tap-area', isChrome: true});
			}
			if (this.small) this.smallChanged();
			if (this.minWidth) this.minWidthChanged();
			
			// FIXME: Backwards-compatibility for deprecated property - can be removed when
			// the contentUpperCase property is fully deprecated and removed. The legacy
			// property takes precedence if it exists.
			if (this.contentUpperCase !== null) this.uppercase = this.contentUpperCase;

			this.contentChanged();
			this.inherited(arguments);
		},

		/**
		* Adds `pressed` CSS class.
		*
		* @private
		*/
		depress: function (inSender, inEvent) {
			if (inEvent.keyCode === 13) {
				this.addClass('pressed');
			}
		},

		/**
		* Bubbles `requestScrollIntoView` event.
		*
		* @fires moon.Scroller#onRequestScrollIntoView
		* @private
		*/
		spotFocused: function (inSender, inEvent) {
			if (inEvent.originator === this) {
				this.bubble('onRequestScrollIntoView');
			}
		},

		/**
		* Removes `pressed` CSS class.
		*
		* @private
		*/
		undepress: function () {
			this.removeClass('pressed');
		},

		/**
		* If `this.small` is `true`, `taparea` dimensions are increased.
		*
		* @private
		*/
		smallChanged: function () {
			if (this.small) {
				this.addClass('small');
				this.addClass('moon-small-button-text');
			} else {
				this.removeClass('small');
				this.removeClass('moon-small-button-text');
			}
		},

		/**
		* Override to handle potential child components.
		*
		* @private
		*/
		contentChanged: function () {
			var content = this.getContent();
			if (this.$.client) {
				this.$.client.setContent( this.get('uppercase') ? enyo.toUpperCase(content) : content );
			} else {
				this.inherited(arguments);
			}
		},

		/**
		* @private
		*/
		uppercaseChanged: function () {
			// FIXME: Backwards-compatibility for deprecated property - can be removed when
			// contentUpperCase is fully deprecated and removed.
			if (this.contentUpperCase != this.uppercase) this.contentUpperCase = this.uppercase;
			this.contentChanged();
		},

		/**
		* @private
		*/
		contentUpperCaseChanged: function () {
			if (this.uppercase != this.contentUpperCase) this.uppercase = this.contentUpperCase;
			this.uppercaseChanged();
		},

		/**
		* @private
		*/
		minWidthChanged: function () {
			if (this.minWidth) {
				this.addClass('min-width');
			} else {
				this.removeClass('min-width');
			}
		},

		/**
		* @private
		*/
		showingChanged: function () {
			this.inherited(arguments);
			if (!this.showing && this.hasClass('pressed')) {
				this.undepress();
			}
		}
	});

})(enyo, this);
