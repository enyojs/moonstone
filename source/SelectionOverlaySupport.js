(function (enyo, scope) {
	/**
	* _moon.SelectionOverlaySupport_ is a [mixin]{@glossary mixin} that may be applied to any
	* [_moon.DataList_]{@link moon.DataList}/[_moon.DataGridList_]{@link moon.DataGridList} item to 
	* provide an overlay that is activated when the list is in selection mode.
	* 
	* The selection overlay has three visual states: focused but not selected, focused and selected,
	* and selected but not focused.
	* 
	* The item may define a `selectionScrimIcon` URL to override the default icon.
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
	* `selectionOverlayHorizontalOffset` and `selectionOverlayVerticalOffset`. Horizontal offset is 
	* measured from the left in left-to-right locales, and from the right in right-to-left locales.
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
				this.selectionScrimIcon = this.selectionScrimIcon || '$lib/moonstone/images/icon-selection.png';
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
				{name:'selectionScrimIcon', kind: 'moon.IconButton', classes: 'moon-selection-overlay-support-checkbox', spotlight: false}
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
