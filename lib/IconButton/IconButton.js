require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/IconButton~IconButton} kind.
* @module moonstone/IconButton
*/

var
	kind = require('enyo/kind');

var
	Icon = require('../Icon');

/**
* {@link module:moonstone/IconButton~IconButton} is a {@link module:moonstone/Icon~Icon} that acts like a button. Specify
* the icon image by setting the [src]{@link module:moonstone/Icon~Icon#src} property to a URL
* indicating the image file's location.
*
* ```
* {kind: 'moon.IconButton', src: 'images/search.png'}
* ```
*
* If you want to combine an icon with text inside of a button, use a
* `moon.Icon` inside a {@link module:moonstone/Button~Button}.
*
* Moonstone supports two methods for displaying icons; in addition to specifying
* traditional image assets in `src`, you may use icons that are stored as single
* characters in a special symbol font. To do this, set the value of the
* [icon]{@link module:moonstone/Icon~Icon#icon} property to a string representing an icon name,
* e.g.:
*
* ```
* {kind: 'moon.IconButton', icon: 'closex'}
* ```
*
* See {@link module:moonstone/Icon~Icon} for more information on the available font-based icons,
* as well as specifications for icon image assets.
*
* @class IconButton
* @extends module:moonstone/Icon~Icon
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/IconButton~IconButton.prototype */ {

	/**
	* @private
	*/
	name: 'moon.IconButton',

	/**
	* @private
	*/
	kind: Icon,

	/**
	* @private
	* @lends module:moonstone/IconButton~IconButton.prototype
	*/
	published: {

		/**
		* Used when the IconButton is part of an {@link module:enyo/Group~Group}. A value of `true`
		* indicates that this is the active button of the group; `false`, that it is not
		* the active button.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		active: false,

		/**
		* A boolean parameter affecting the size of the button.
		* If `true`, the button will have a diameter of 60px.
		* However, the button's tap target will still have a diameter of 78px, with
		* invisible DOM wrapping the small button to provide the larger tap zone.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		small: true,

		/**
		* @deprecated Replaced by [backgroundOpacity]{@link moon.IconButton#backgroundOpacity}.
		*
		* If `true`, the button will have no rounded background color/border.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		noBackground: false,

		/**
		* The background-color opacity of this button; valid alues are `'opaque'`, `'translucent'`,
		* and `'transparent'`.
		*
		* @type {String}
		* @default opaque
		* @public
		*/
		backgroundOpacity: 'opaque'
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
		* Simulates mousedown.
		*/
		onSpotlightKeyDown: 'depress',

		/**
		* Simulates mouseup.
		*/
		onSpotlightKeyUp: 'undepress',

		/**
		* Used to request it is in view in scrollers.
		*/
		onSpotlightFocused: 'spotlightFocused',

		onSpotlightBlur: 'undepress'
	},

	/**
	* @private
	*/
	create: function () {
		Icon.prototype.create.apply(this, arguments);
		if (this.noBackground) {
			this.noBackgroundChanged();
		}
		this.backgroundOpacityChanged();
	},

	/**
	* @private
	*/
	rendered: function () {
		Icon.prototype.rendered.apply(this, arguments);
		this.activeChanged();
	},

	/**
	* @private
	*/
	noBackgroundChanged: function () {
		this.set('backgroundOpacity', this.noBackground ? 'transparent' : 'opaque');
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
	* @fires module:enyo/GroupItem~GroupItem#onActivate
	* @private
	*/
	activeChanged: function () {
		this.bubble('onActivate');
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
	* Removes `pressed` CSS class.
	* @private
	*/
	undepress: function () {
		this.removeClass('pressed');
	},

	/**
	* @fires module:moonstone/Scroller~Scroller#onRequestScrollIntoView
	* @private
	*/
	spotlightFocused: function (inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble('onRequestScrollIntoView');
		}
	},

	/**
	* @private
	*/
	backgroundOpacityChanged: function (old) {
		var opacity = this.backgroundOpacity;
		if (old) this.removeClass(old);
		if (opacity == 'translucent' || opacity == 'transparent') {
			this.addClass(opacity);
		}
	}
});
