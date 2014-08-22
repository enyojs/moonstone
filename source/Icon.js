(function (enyo, scope) {
	/**
	* {@link moon.Icon} is a control that displays an icon image. You may specify the
	* image by setting the [src]{@link moon.Icon#src} property to a URL indicating the
	* image file's location.
	*
	* ```
	* {kind: 'moon.Icon', src: 'images/search.png'}
	* ```
	*
	* Moonstone also supports a second method for displaying icons; in addition to
	* using traditional image assets specified in `src`, you may use icons that are
	* stored as single characters in a special symbol font. To do this, set the
	* value of the [icon]{@link moon.Icon#icon} property to a string representing an
	* icon name, e.g.:
	*
	* ```
	* {kind: 'moon.Icon', icon: 'closex'}
	* ```
	*
	* The name-to-character mappings for font-based icons are stored in
	* `css/moonstone-icons.less`. Each mapping in the file associates an icon name
	* with the icon font's corresponding character or symbol.
	*
	* For image-based icons, two sizes are supported: large (45x45 pixels) and small
	* (32x32 pixels). Icons are small by default. To specify a large icon, set the
	* [small]{@link moon.Icon#small} property to `false`:
	*
	* ```
	* {kind: 'moon.Icon', src: 'images/search.png', small: false}
	*
	* {kind: 'moon.Icon', icon: 'closex', small: false}
	* ```
	*
	* In addition, both icon sizes support two states: a default (resting) state,
	* and a pressed (active) state. Both states need to be included in the icon's
	* associated image asset, with the resting state on top and the active state on
	* the bottom.
	*
	* Image assets for large icons should be 75px wide and 150px high. This allows
	* room for the two states, along with 15 pixels of transparent padding on all
	* four sides of each 45x45 icon.
	*
	* Assets for small icons should be 50px wide and 100px high. This allows room
	* for the two states, along with 9 pixels of transparent padding on all four
	* sides of each 32x32 icon.
	*
	* Since asset-based icon images are applied as CSS backgrounds, the height and
	* width of an icon must be set if an image of a non-standard size is used.
	*
	* For situations in which an icon should act like a button, use
	* {@link moon.IconButton}.
	*
	* @class moon.Icon
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.Icon.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Icon',

		/**
		* @private
		* @lends moon.Icon.prototype
		*/
		published: {

			/**
			* When using a font-based icon, the name of the icon to be used.
			* The following icon names are valid:
			*
			* `'drawer'`
			* `'arrowlargeup'`
			* `'arrowlargedown'`
			* `'arrowlargeleft'`
			* `'arrowlargeright'`
			* `'arrowsmallup'`
			* `'arrowsmalldown'`
			* `'arrowsmallleft'`
			* `'arrowsmallright'`
			* `'closex'`
			* `'check'`
			* `'search'`
			*
			* @type {String}
			* @default ''
			* @public
			*/
			icon: '',

			/**
			* URL specifying path to icon image.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			src: '',

			/**
			* If `true`, icon is shown as disabled.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disabled: false,

			/**
			* A boolean parameter affecting the size of the icon.
			* If `true`, the icon will be 32px by 32px. If `false`, the icon will be 45px
			* by 45px. When `small` is `true`, a larger, invisible tap area will be applied
			* around the icon.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			small: true
		},

		/**
		* @returns {String} The value of the [src]{@link moon.Icon#src} property.
		* @public
		*/
		getSrc: function () {
			return this.src;
		},

		/**
		* @private
		*/
		classes: 'moon-icon',

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			if (this.src) {
				this.srcChanged();
			}
			if (this.icon) {
				this.iconChanged();
			}
			this.smallChanged();
			this.disabledChanged();
		},

		/**
		* @private
		*/
		getIconClass: function (inIconName) {
			return 'moon-icon-' + (inIconName || this.icon);
		},

		/**
		* @private
		*/
		disabledChanged: function () {
			this.addRemoveClass('disabled', this.disabled);
		},

		/**
		* @private
		*/
		srcChanged: function () {
			var src = this.src || null;
			if (src) {
				if (src != 'none' && src != 'inherit' && src != 'initial') {
					src = 'url(' + enyo.path.rewrite(this.src) + ')';
				}
			}
			this.applyStyle('background-image', src);
		},

		/**
		* @private
		*/
		iconChanged: function (inOld) {
			if (inOld) {
				this.removeClass(this.getIconClass(inOld));
			}
			if (this.get('icon')) {
				this.addClass(this.getIconClass());
			}
		},

		/**
		* @private
		*/
		smallChanged: function () {
			if (this.$.tapArea) {
				this.$.tapArea.destroy();
			}

			if (this.small) {
				var ta = this.createComponent({name: 'tapArea', classes: 'small-icon-tap-area', isChrome: true});
				if (this.generated) {
					ta.render();
				}
			}
			this.addRemoveClass('small', this.small);
		}
	});

})(enyo, this);
