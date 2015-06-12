/**
* Exports the {@link module:moonstone/SelectionOverlaySupport~SelectionOverlaySupport} mixin.
* @module moonstone/SelectionOverlaySupport
*/

require('moonstone');

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var
	Icon = require('../Icon');

/**
* {@link module:moonstone/SelectionOverlaySupport~SelectionOverlaySupport} is a [mixin]{@glossary mixin} that may be applied
* to any {@link module:moonstone/DataList~DataList} or {@link module:moonstone/DataGridList~DataGridList} item to provide an overlay
* that is activated when the list is in selection mode.
*
* The selection overlay has three visual states: focused but not selected, focused and
* selected, and selected but not focused.
*
* The item may define a
* [selectionScrimIcon]{@link module:moonstone/SelectionOverlaySupport~SelectionOverlaySupport#selectionScrimIcon} URL to
* override the default icon.
*
* ```javascript
* var SelectionOverlaySupport = require('moonstone/SelectionOverlaySupport');
* ...
* {name: 'list', selection: true, kind: DataList, components: [
*	{mixins: [SelectionOverlaySupport], selectionScrimIcon: 'assets/my-icon.png',
*		kind: ImageItem, bindings: [
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
* [selectionOverlayHorizontalOffset]{@link module:moonstone/SelectionOverlaySupport~SelectionOverlaySupport#selectionOverlayHorizontalOffset}
* and [selectionOverlayVerticalOffset]{@link module:moonstone/SelectionOverlaySupport~SelectionOverlaySupport#selectionOverlayVerticalOffset}.
* The horizontal offset is measured from the left in left-to-right locales, and from the right
* in right-to-left locales.
*
* ```javascript
* var SelectionOverlaySupport = require('moonstone/SelectionOverlaySupport'),
*     DataGridList = require('moonstone/DataGridList'),
*     GridListImageItem = require('moonstone/GridListImageItem');
* ...
* {name: 'gridList', selection: true, kind: DataGridList, components: [
*	{mixins: [SelectionOverlaySupport], kind: GridListImageItem,
*		selectionOverlayVerticalOffset: 35, bindings: [
*			{from: '.model.text', to: '.caption'},
*			{from: '.model.subText', to: '.subCaption'},
*			{from: '.model.url', to: '.source'}
*		]
*	}
* ]}
* ```
*
* @mixin
* @protected
*/
SelectionOverlaySupport = {

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
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.createChrome(this._selectionScrim);
			this.selectionOverlayHorizontalOffset = this.selectionOverlayHorizontalOffset === undefined ? 50 : this.selectionOverlayHorizontalOffset;
			this.selectionOverlayVerticalOffset = this.selectionOverlayVerticalOffset === undefined ? 50 : this.selectionOverlayVerticalOffset;
			this.selectionOverlayHorizontalOffsetChanged();
			this.selectionOverlayVerticalOffsetChanged();
			// Allow the icon to be modified by user
			if (this.selectionScrimIcon) {
				this.$.selectionScrimIcon.set('icon','');
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
		{classes: 'enyo-fit moon-selection-overlay-support-scrim', kind: Control, components: [
			{name:'selectionScrimIcon', kind: Icon, small: false, icon: 'check', spotlight: false}
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
		this.$.selectionScrimIcon.applyStyle('left', this.selectionOverlayHorizontalOffset + '%');
	}
};

module.exports = SelectionOverlaySupport;
