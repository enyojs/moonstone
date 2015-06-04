require('moonstone');

/**
* Contains the declaration for the {@link moon.IconButton} kind.
* @module moonstone/IconButton
*/

var
	kind = require('enyo/kind');

var
	Icon = require('../Icon');

/**
* {@link moon.IconButton} is a {@link moon.Icon} that acts like a button. Specify
* the icon image by setting the [src]{@link moon.Icon#src} property to a URL
* indicating the image file's location.
*
* ```
* {kind: 'moon.IconButton', src: 'images/search.png'}
* ```
*
* If you want to combine an icon with text inside of a button, use a
* `moon.Icon` inside a {@link moon.Button}.
*
* Moonstone supports two methods for displaying icons; in addition to specifying
* traditional image assets in `src`, you may use icons that are stored as single
* characters in a special symbol font. To do this, set the value of the
* [icon]{@link moon.Icon#icon} property to a string representing an icon name,
* e.g.:
*
* ```
* {kind: 'moon.IconButton', icon: 'closex'}
* ```
*
* See {@link moon.Icon} for more information on the available font-based icons,
* as well as specifications for icon image assets.
*
* @namespace moon
* @class moon.IconButton
* @extends moon.Icon
* @ui
* @definedby module:moonstone/IconButton
* @public
*/
module.exports = kind(
	/** @lends moon.IconButton.prototype */ {

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
	* @lends moon.IconButton.prototype
	*/
	published: {

		/**
		* Used when the IconButton is part of an {@link enyo.Group}. A value of `true`
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
		* If `true`, the button will have no rounded background color/border.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		noBackground: false,

		/**
		* The translucent of the button; valid alues are `'opaque'`, `'translucent'`, and `'transparent'`.
		*
		* @type {String}
		* @default opaque
		* @public
		*/
		translucent: 'opaque'
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
		this.noBackgroundChanged();
		this.translucentChanged();
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
	* @fires enyo.GroupItem#onActivate
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
	* @fires moon.Scroller#onRequestScrollIntoView
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
	translucentChanged: function(inOldvalue){
		this.removeClass('translucent-' + inOldvalue);
		this.addClass('translucent-' + this.translucent);
	}	
});
