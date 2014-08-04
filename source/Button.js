(function (enyo, scope) {
	/**
	* `moon.Button` is an {@link enyo.Button} with Moonstone styling applied. The color of the
	* button may be customized by specifying a background color.
	*
	* For more information, see the documentation on
	* [Buttons](building-apps/controls/buttons.html) in the Enyo Developer Guide.
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
			*
			* A boolean parameter affecting the size of the button. If `true`, the
			* button's diameter will be set to 60px. However, the button's tap target
			* will still have a diameter of 78px, with an invisible DOM element wrapping the small
			* button to provide the larger tap zone.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			small: false,

			/**
			* A boolean parameter affecting the minimum width of the button. If `true`,
			* the minimum width will be set to 180px (or 130px if [`small`]{@link moon.Button#small}
			* is true). If `false`, the minimum width will be set to the current
			* `@moon-button-height` (thus forcing the button to be no smaller than a circle with
			* diameter `@moon-button-height`).
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			minWidth: true,

			/**
			* When `true`, the content will be converted to locale-safe uppercasing
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			contentUpperCase: true
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
			* @private
			*/
			onSpotlightKeyDown	: 'depress',

			/**
			* `onSpotlightKeyUp` simulates `mouseup`.
			* @private
			*/
			onSpotlightKeyUp	: 'undepress',

			/**
			* Also make sure we remove the pressed class if focus is removed from
			* this item before it receives a keyup.
			* @private
			*/
			onSpotlightBlur		: 'undepress',

			/**
			* `onSpotlightFocus` bubble `requestScrollIntoView` event
			* @private
			*/
			onSpotlightFocused	: 'spotFocused'
		},

		/**
		* On creation, updates based on value of `this.small`.
		* @private
		*/
		initComponents: function () {
			if (!(this.components && this.components.length > 0)) {
				this.createComponent({name: 'client', kind:'moon.MarqueeText', isChrome: true});
			}
			this.smallChanged();
			this.minWidthChanged();
			this.inherited(arguments);
		},

		/**
		* Adds `pressed` CSS class.
		* @private
		*/
		depress: function (inSender, inEvent) {
			if (inEvent.keyCode === 13) {
				this.addClass('pressed');
			}
		},

		/**
		* Bubble `requestScrollIntoView` event
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
		* @private
		*/
		undepress: function () {
			this.removeClass('pressed');
		},

		/**
		* If `this.small` is true, adds a child that increases the tap area.
		* @private
		*/
		smallChanged: function () {
			if (this.$.tapArea) {
				this.$.tapArea.destroy();
			}

			if (this.small) {
				this.addClass('small');
				this.addClass('moon-small-button-text');
				var ta = this.createComponent({name: 'tapArea', classes: 'small-button-tap-area', isChrome: true});
				if (this.generated) {
					ta.render();
				}
			} else {
				this.removeClass('small');
				this.removeClass('moon-small-button-text');
			}
			this.contentChanged();
		},

		/**
		* Override to handle potential child components.
		* @private
		*/
		contentChanged: function () {
			var content = this.getContent();
			if (this.$.client) {
				this.$.client.setContent( this.getContentUpperCase() ? enyo.toUpperCase(content) : content );
			} else {
				this.inherited(arguments);
			}
		},

		/**
		* @private
		*/
		contentUpperCaseChanged: function () {
			this.contentChanged();
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
