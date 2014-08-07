(function (enyo, scope) {
	/**
	* _moon.IconButton_ is an icon that acts like a button. Specify the icon image
	* by setting the {@link moon.Icon#src} property to a URL indicating the image file's location.
	*
	* ```
	* {kind: 'moon.IconButton', src: 'images/search.png'}
	* ```
	*
	* If you want to combine an icon with text inside of a button, use a
	* [moon.Icon]{@link moon.Icon} inside a [moon.Button]{@link moon.Button}.
	*
	* Moonstone supports two methods for displaying icons; in addition to using
	* traditional image assets specified in {@link moon.Icon#src}, you may use icons that are
	* stored as single characters in a special symbol font. To do this, set the
	* value of the _icon_ property to a string representing an icon name, e.g.:
	*
	* ```
	* {kind: 'moon.IconButton', icon: 'closex'}
	* ```
	*
	* The name-to-character mappings for font-based icons are stored in
	* _css/moonstone-icons.less_. Each mapping associates an icon name with the icon
	* font's corresponding character or symbol.
	*
	* See [moon.Icon]{@link moon.Icon} for more information on the available font-based
	* icons, as well as specifications for icon image assets.
	*
	* @ui
	* @class moon.IconButton
	* @extends moon.Icon
	* @public
	*/
	enyo.kind(
		/** @lends moon.IconButton.prototype */ {

		/**
		* @private
		*/
		name: 'moon.IconButton',

		/**
		* @private
		*/
		kind: 'moon.Icon',

		/**
		* @private
		*/
		published: /** @lends moon.IconButton.prototype */ {

			/**
			* Used when the IconButton is part of an [enyo.Group]{@link enyo.Group}.
			* A value of true indicates that this is the active button of the group;
			* false, that it is not the active button.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			active: false,

			/**
			* A boolean parameter affecting the size of the button.
			* If true, the button will have a diameter of 60px.
			* However, the button's tap target will still have a diameter of 78px, with
			* invisible DOM wrapping the small button to provide the larger tap zone.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			small: true,

			/**
			* When true, the button will have no rounded background color/border
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			noBackground: false
		},

		/**
		* @private
		*/
		classes: 'moon-icon-button',

		/**
		* @private
		*/
		spotlight: true,

		/**
		* @private
		*/
		handlers: {

			/**
			* onSpotlightSelect simulates mousedown
			*/
			onSpotlightKeyDown: 'depress',

			/**
			* onSpotlightKeyUp simulates mouseup
			*/
			onSpotlightKeyUp: 'undepress',

			/**
			* used to request it is in view in scrollers
			*/
			onSpotlightFocused: 'spotlightFocused',

			onSpotlightBlur: 'undepress'
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.noBackgroundChanged();
		},

		/**
		* @private
		*/
		rendered: function () {
			this.inherited(arguments);
			if (this.hasOwnProperty("active")) {
				this.activeChanged();
			}
		},

		/**
		* @private
		*/
		noBackgroundChanged: function () {
			this.addRemoveClass('no-background', this.noBackground);
		},

		/**
		* @private
		*/
		tap: function () {
			if (this.disabled) {
				return true;
			}
			this.setActive(true);
		},

		/**
		* @fires enyo.GroupItem#event:onActivate
		* @private
		*/
		activeChanged: function () {
			this.bubble('onActivate');
		},

		/**
		* Adds _pressed_ CSS class.
		* @private
		*/
		depress: function (inSender, inEvent) {
			if (inEvent.keyCode === 13) {
				this.addClass('pressed');
			}
		},

		/**
		* Removes _pressed_ CSS class.
		* @private
		*/
		undepress: function () {
			this.removeClass('pressed');
		},

		/**
		* @fires moon.Scroller#event:onRequestScrollIntoView
		* @private
		*/
		spotlightFocused: function (inSender, inEvent) {
			if (inEvent.originator === this) {
				this.bubble('onRequestScrollIntoView');
			}
		}
	});

})(enyo, this);

