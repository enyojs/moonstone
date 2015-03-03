(function (enyo, scope) {
	/**
	* {@link moon.BadgeOverlaySupport} is a [mixin]{@glossary mixin} that may be applied
	* to any {@link moon.DataList} or {@link moon.DataGridList} item to provide an overlay
	* that is activated when the list contains items of type Video/Audio/Image.
	*
	* The BadgeOverlaySupport purpose is to show an icon badge on top of item to indicate 
	* the type of item. Like for Video/Audio it will show a default play icon and for Image
	* there is nothing by default.
	*
	* The item has to define a
	* [type]{@link moon.BadgeOverlaySupport#type} MIME type of this 
	* item. Possible values are 'video', 'audio' , 'image'. Defaulted as 'image'.
	*
	* ```javascript
	* {name: 'list', kind: 'moon.DataList', components: [
	*	{mixins: ['moon.BadgeOverlaySupport'], type: 'video',
	*		kind: 'moon.ImageItem', bindings: [
	*			{from: '.model.title', to: '.label'},
	*			{from: '.model.description', to: '.text'},
	*			{from: '.model.coverSource', to: '.source'}
	*		]
	*	}
	* ]}
	* ```
	*
	* The item may define a
	* [badgeScrimIcon]{@link moon.BadgeOverlaySupport#badgeScrimIcon} URL to
	* override the default icon.
	*
	* ```javascript
	* {name: 'list', kind: 'moon.DataList', components: [
	*	{mixins: ['moon.BadgeOverlaySupport'], type: 'video', badgeScrimIcon: 'assets/my-icon.png',
	*		kind: 'moon.ImageItem', bindings: [
	*			{from: '.model.title', to: '.label'},
	*			{from: '.model.description', to: '.text'},
	*			{from: '.model.coverSource', to: '.source'}
	*		]
	*	}
	* ]}
	* ```
	*
	* The item may define a
	* [align]{@link moon.BadgeOverlaySupport#align} to
	* specify position of badge. Possible values are 'top' or 'bottom'. Defaulted as 'bottom'.
	* ```javascript
	* {name: 'list', kind: 'moon.DataList', components: [
	*	{mixins: ['moon.BadgeOverlaySupport'], type: 'video', align: 'top',
	*		kind: 'moon.ImageItem', bindings: [
	*			{from: '.model.title', to: '.label'},
	*			{from: '.model.description', to: '.text'},
	*			{from: '.model.coverSource', to: '.source'}
	*		]
	*	}
	* ]}
	*
	* @mixin moon.BadgeOverlaySupport
	* @protected
	*/
	moon.BadgeOverlaySupport = {

		/**
		* @private
		*/
		name: 'moon.BadgeOverlaySupport',

		/**
		* @private
		*/
		classes: 'moon-badge-overlay-support',

		/**
		* Identifies the MIME type of badge. 
		* Possible values are "image", "audio" or "video".
		* Defaulted as 'image'.
		*
		* @name moon.BadgeOverlaySupport#type
		* @type {String}
		* @default undefined
		* @public
		*/

		/**
		* URL for icon to be used in place of default icon.
		*
		* @name moon.BadgeOverlaySupport#badgeScrimIcon
		* @type {String}
		* @default undefined
		* @public
		*/

		/**
		* Sepcifies the alignment position of badge.
		* Possible values are 'top' or 'bottom'.
		* Defaulted as 'bottom'.
		*
		* @name moon.BadgeOverlaySupport#badgeScrimIcon
		* @type {String}
		* @default undefined
		* @public
		*/
		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				if(this.type && this.type != "image") {
					this.createChrome(this._badgeScrim);
					// Allow the icon to be modified by user
					if (this.badgeScrimIcon) {
						this.$.badgeScrimIcon.set('icon','');
					}
					this.alignChanged();
				}
			};
		}),

		/**
		* @private
		*/
		bindings: [
			{from: '.badgeScrimIcon', to: '.$.badgeScrimIcon.src'}
		],

		/**
		* @private
		*/
		_badgeScrim: [
			{name:'badgeScrim', classes: 'enyo-fit moon-badge-overlay-support-scrim', components: [
				{name:'badgeScrimIcon', kind: 'moon.Icon', small: false, icon: 'play', spotlight: false}
			]}
		],

		alignChanged: function() {
			if(this.$.badgeScrim) {
				// TODO: identify the proper value based on height of image.
				this.$.badgeScrim.applyStyle("top", this.align=='top'?0:'125px'); 
			}
		},
	};

})(enyo, this);
