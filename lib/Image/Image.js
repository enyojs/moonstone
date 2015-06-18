require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Image~Image} kind.
* @module moonstone/Image
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	Img = require('enyo/Image');

var
	Icon = require('../Icon'),
	Overlay = require('../Overlay');

/**
* {@link module:moonstone/Image~Image} is a simple control that wraps an {@link module:enyo/Image~Image} to provide proper
* alignment with text-based controls.
*
* In addition, `moon.Image` adds {@link module:moonstone/Overay~OverlaySupport} support to show controls over the image. This
* can be used to add action icons as in the example below.
*
* ```
* {kind: 'moon.Image', src: 'assets/movie.png',
* 	overlayShowing: 'spotlight', overlayPosition: 'bottom', overlayComponents: [
* 		{kind: Icon, src: 'assets/icon-recommended.png'},
* 		{kind: Icon, icon: 'star'},
* 		{kind: Icon, src: 'assets/icon-new.png'}
* 	]
* }
* ```
*
* For backwards compatibility, component configurations specified using the `components` block
* within an `moon.Image` will be mapped to `overlayComponents` and will default the `kind` to be
* {@link moon.Icon}. This behavior is considered deprecated and will be removed in a future release.
*
* @class Image
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Image~Image.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Image',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	mixins: [Overlay.Support],

	/**
	* @private
	*/
	classes: 'moon-image',

	/**
	* @private
	* @lends module:moonstone/Image~Image.prototype
	*/
	published: {

		/**
		* The URL of the image.
		*
		* @type {String|module:enyo/resolution#selectSrc~src}
		* @default ''
		* @public
		*/
		src: '',

		/**
		* The `alt` text for the image.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		alt: '',

		/**
		* If `true`, badges will only be shown when the image is within a
		* spotlightable component that has focus.  Otherwise, any badges provided
		* will always be shown.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		showBadgesOnSpotlight: false,

		/**
		* The image sizing strategy. See {@link module:enyo/Image~Image} for details.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		sizing: '',

		/**
		* The image position when [sizing]{@link module:moonstone/Image~Image#sizing} is used.  See
		* {@link module:enyo/Image~Image} for details.
		*
		* @type {Object}
		* @default ''
		* @public
		*/
		position: ''
	},

	/**
	* @private
	*/
	components: [
		{name: 'image', kind: Img}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'src', to: '$.image.src'},
		{from: 'alt', to: '$.image.alt'},
		{from: 'sizing', to: '$.image.sizing'},
		{from: 'position', to: '$.image.position'}
	],

	/**
	* @private
	*/
	create: function () {
		this.adaptComponentsBlock();
		Control.prototype.create.apply(this, arguments);
	},

	/**
	* Adapting from the prior API. We'll assume that the presence of components but not
	* overlayComponents means the consumer is expecting the former ImageBadge-style overlay.
	*
	* @deprecated Backwards compatibility for moon.ImageBadge's within components block
	* @private
	*/
	adaptComponentsBlock: function () {
		var i, c;
		if (this.components && !this.overlayComponents) {
			this.overlayComponents = this.components;
			this.components = null;
			for (i = this.overlayComponents.length - 1; i >= 0; --i) {
				c = this.overlayComponents[i];
				c.kind = c.kind || Icon;
			}
			this.overlayPosition = this.overlayPosition || 'bottom';
			this.showBadgesOnSpotlightChanged();
		}
	},

	/**
	* @private
	*/
	showBadgesOnSpotlightChanged: function (was, is) {
		this.set('overlayShowing', this.showBadgesOnSpotlight ? 'spotlight' : true);
	}
});
