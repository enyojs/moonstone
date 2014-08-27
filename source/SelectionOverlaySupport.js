(function (enyo, scope) {
	/**
	* {@link moon.SelectionOverlaySupport} is a [mixin]{@glossary mixin} that may be applied
	* to any {@link moon.DataList} or {@link moon.DataGridList} item to provide an overlay
	* that is activated when the list is in selection mode.
	*
	* The selection overlay has three visual states: focused but not selected, focused and
	* selected, and selected but not focused.
	*
	* The item may define a
	* [selectionScrimIcon]{@link moon.SelectionOverlaySupport#selectionScrimIcon} URL to
	* override the default icon.
	*
	* ```javascript
	* {name: 'list', selection: true, kind: 'moon.DataList', components: [
	*	{mixins: ['moon.SelectionOverlaySupport'], selectionScrimIcon: 'assets/my-icon.png',
	*		kind: 'moon.ImageItem', bindings: [
	*			{from: '.model.title', to: '.label'},
	*			{from: '.model.description', to: '.text'},
	*			{from: '.model.coverSource', to: '.source'}
	*		]
	*	}
	* ]}
	* ```
	*
	* By default, the overlay icon is centered horizontally and vertically over the item, but you
	* can override the default by specifying percentage values for
	* [selectionOverlayHorizontalOffset]{@link moon.SelectionOverlaySupport#selectionOverlayHorizontalOffset}
	* and [selectionOverlayVerticalOffset]{@link moon.SelectionOverlaySupport#selectionOverlayVerticalOffset}.
	* The horizontal offset is measured from the left in left-to-right locales, and from the right
	* in right-to-left locales.
	*
	* ```javascript
	* {name: 'gridList', selection: true, kind: 'moon.DataGridList', components: [
	*	{mixins: ['moon.SelectionOverlaySupport'], kind: 'moon.GridListImageItem',
	*		selectionOverlayVerticalOffset: 35, bindings: [
	*			{from: '.model.text', to: '.caption'},
	*			{from: '.model.subText', to: '.subCaption'},
	*			{from: '.model.url', to: '.source'}
	*		]
	*	}
	* ]}
	* ```
	*
	* @mixin moon.SelectionOverlaySupport
	* @protected
	*/
	moon.SelectionOverlaySupport = {

		/**
		* @private
		*/
		name: 'moon.SelectionOverlaySupport',
		
		/**
		* @private
		*/
		classes: 'moon-selection-overlay-support',

		/**
		* URL for icon to be used in place of default icon.
		*
		* @name moon.SelectionOverlaySupport#selectionScrimIcon
		* @type {String}
		* @default undefined
		* @public
		*/

		/**
		* Vertical offset for the overlay icon, expressed as percent from the top. Will default
		* to `50` if undefined.
		*
		* @name moon.SelectionOverlaySupport#selectionOverlayVerticalOffset
		* @type {Number}
		* @default undefined
		* @public
		*/

		/**
		* Horizontal offset for the overlay icon, expressed as percent from the left or right edge.
		* The offset is measured from the left edge in left-to-right locales, and from the right in
		* right-to-left locales.
		*
		* @name moon.SelectionOverlaySupport#selectionOverlayHorizontalOffset
		* @type {Number}
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
				this.createChrome(this._selectionScrim);
				this.selectionOverlayHorizontalOffset = this.selectionOverlayHorizontalOffset === undefined ? 50 : this.selectionOverlayHorizontalOffset;
				this.selectionOverlayVerticalOffset = this.selectionOverlayVerticalOffset === undefined ? 50 : this.selectionOverlayVerticalOffset;
				this.selectionOverlayHorizontalOffsetChanged();
				this.selectionOverlayVerticalOffsetChanged();
				// Allow the icon to be modified by user
				if (this.selectionScrimIcon) {
					this.$.selectionScrimIcon.removeClass('moon-icon-' + this.$.selectionScrimIcon.icon);
				}
			};
		}),

		/**
		* @private
		*/
		bindings: [
			{from: '.selectionScrimIcon', to: '.$.selectionScrimIcon.src'}
		],

		/**
		* @private
		*/
		_selectionScrim: [
			{classes: 'enyo-fit moon-selection-overlay-support-scrim', components: [
				{name:'selectionScrimIcon', kind: 'moon.Icon', icon: "check", spotlight: false}
			]}
		],

		/**
		* @private
		*/
		selectionOverlayVerticalOffsetChanged: function () {
			this.$.selectionScrimIcon.applyStyle('top', this.selectionOverlayVerticalOffset + '%');
		},

		/**
		* @private
		*/
		selectionOverlayHorizontalOffsetChanged: function () {
			this.$.selectionScrimIcon.applyStyle((this.rtl ? 'right' : 'left'), this.selectionOverlayHorizontalOffset + '%');
		}
	};

})(enyo, this);
