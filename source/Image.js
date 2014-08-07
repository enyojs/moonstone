(function (enyo, scope) {
	/**
	* `moon.Image` is a simple control that wraps an [`enyo.Image`]{@link enyo.Image} to
	* provide proper alignment with text-based controls.
	*
	* In addition, `moon.Image` accepts optional [`moon.ImageBadge`]{@link moon.ImageBadge}
	* client components (the default component), which are placed inside a container positioned over
	* the image.  These badges are normally persistent, but may be shown or hidden based on
	* {@glossary Spotlight} focus, using the {@link moon.Image#showBadgesOnSpotlight} property.
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

	enyo.kind(
		/** @lends moon.Image.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Image',

		/**
		* @private
		*/
		kind: 'enyo.Control',

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
			* The URL of the image
			*
			* @type {String}
			* @default ''
			* @public
			*/
			src: '',

			/**
			* The URL of the alt image
			*
			* @type {String}
			* @default ''
			* @public
			*/
			alt: '',

			/**
			* When `true`, badges will only be shown when the image is within a
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
			* The image position when {@link moon.Image#sizing} is used.  See {@link enyo.Image}
			* for details.
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
		defaultKind: 'moon.ImageBadge',

		/**
		* @private
		*/
		components: [
			{name: 'image', kind: 'enyo.Image'},
			{name: 'client', kind: 'enyo.Control', canGenerate: false, classes: 'moon-image-client'}
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
		create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				if (this.getClientControls().length > 0) {
					this.$.client.canGenerate = true;
					this.addClass('has-children');
				}

				this.showBadgesOnSpotlightChanged();
			};
		}),

		/**
		* @private
		*/
		showBadgesOnSpotlightChanged: function () {
			this.addRemoveClass('show-on-spotlight', this.getShowBadgesOnSpotlight());
		}
	});

})(enyo, this);

