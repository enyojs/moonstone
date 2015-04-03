(function (enyo, scope) {
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
			position: '',
			
			/**
			* This property sets the background color of the [image]{@link enyo.Image}.
			* Additionally, you can clear background color on load event by adding onload handler.
			* Note that onload handler will work only when no sizing value is set.
			* Because, background image can not handle onload event. 
			*
			* @type {String}
			* @default ''
			* @public
			*/
			backgroundColor: ''			
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
			{from: '.position', to: '.$.image.position'},
			{from: '.backgroundColor', to: '.$.image.backgroundColor'}
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

