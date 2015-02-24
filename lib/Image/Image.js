require('moonstone');

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	Image = require('enyo/Image');

var
	ImageBadge = require('../ImageBadge');

/**
* {@link moon.Image} is a simple control that wraps an {@link enyo.Image} to provide proper
* alignment with text-based controls.
*
* In addition, `moon.Image` accepts optional {@link moon.ImageBadge} client components
* (ImageBadge being the default kind of Image), which are placed inside a container positioned
* over the image.  These badges are normally persistent, but may be shown or hidden based on
* {@glossary Spotlight} focus, using the
* [showBadgesOnSpotlight]{@link moon.Image#showBadgesOnSpotlight} property.
*
* ```
* {kind: 'moon.Image', src: 'assets/movie.png', showBadgesOnSpotlight: true, components: [
* 	{src: 'assets/icon-recommended.png'},
* 	{src: 'assets/icon-favorite.png'},
* 	{src: 'assets/icon-new/png', classes: 'float-right'}
* ]}
* ```
*
* @class moon.Image
* @extends enyo.Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.Image.prototype */ {

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
	classes: 'moon-image',

	/**
	* @private
	* @lends moon.Image.prototype
	*/
	published: {

		/**
		* The URL of the image.
		*
		* @type {String|moon.ri.selectSrc~src}
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
		* The image sizing strategy. See {@link enyo.Image} for details.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		sizing: '',

		/**
		* The image position when [sizing]{@link moon.Image#sizing} is used.  See
		* {@link enyo.Image} for details.
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
	defaultKind: ImageBadge,

	/**
	* @private
	*/
	components: [
		{name: 'image', kind: Image},
		{name: 'client', kind: Control, canGenerate: false, classes: 'moon-image-client'}
	],

	/**
	* @private
	*/
	bindings: [
		{from: '.src', to: '.$.image.src'},
		{from: '.alt', to: '.$.image.alt'},
		{from: '.sizing', to: '.$.image.sizing'},
		{from: '.position', to: '.$.image.position'}
	],

	/**
	* Only generate `this.$.client` if the instance has components.
	*
	* @method
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		if (this.getClientControls().length > 0) {
			this.$.client.canGenerate = true;
			this.addClass('has-children');
		}

		this.showBadgesOnSpotlightChanged();
	},

	/**
	* @private
	*/
	showBadgesOnSpotlightChanged: function () {
		this.addRemoveClass('show-on-spotlight', this.getShowBadgesOnSpotlight());
	}
});