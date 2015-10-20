require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ItemOverlay~ItemOverlay}
* kind and the {@link module:moonstone/ItemOverlay~ItemOverlaySupport} mixin.
* @module moonstone/ItemOverlay
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

/**
* {@link module:moonstone/ItemOverlay~ItemOverlay} is a supplementary control that helps to manage
* layout within a {@link module:moonstone/Item~Item}.
*
* ```
* var
* 	kind = require('enyo/kind'),
* 	Icon = require('moonstone/Icon'),
* 	Item = require('moonstone/Item'),
* 	ItemOverlay = require('moonstone/ItemOverlay'),
* 	MarqueeText = require('moonstone/Marquee').Text;
*
* {kind: Item, components: [
* 	{kind: ItemOverlay, autoHide: false, right: true, components:[
* 		{kind: Icon, icon: 'arrowlargeup', small: true},
* 		{kind: Icon, icon: 'arrowlargedown', small: true}
* 	]},
* 	{kind: MarqueeText, content: 'Item   with   icons   auto   hides'}
* ]}
* ```
*
* @class ItemOverlay
* @extends module:enyo/Control~Control
* @ui
* @public
*/
var ItemOverlay = module.exports = kind(
	/** @lends module:moonstone/ItemOverlay~ItemOverlay.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ItemOverlay',

	/**
	* @private
	*/
	kind: Control,

	/**
 	* @private
 	*/
	classes: 'moon-item-overlay',

	/**
	* @private
	*/
	published: /** @lends module:moonstone/ItemOverlay~ItemOverlay.prototype */ {

		/**
		* When `true`, the controls in the overlay are only shown on focus; in
		* other words, if the overlay is not focused, the controls will be hidden.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		autoHide: false,

		/**
		* When `true`, the controls in the overlay are right-aligned.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		right: false

	},

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.autoHideChanged();
		this.rightChanged();
	},

	/**
	* @private
	*/
	autoHideChanged: function() {
		this.addRemoveClass('auto-hide', this.get('autoHide'));
	},


	/**
	* @private
	*/
	rightChanged: function() {
		this.addRemoveClass('right', this.get('right'));
	}

});

/**
* The {@link module:moonstone/ItemOverlay~ItemOverlaySupport} {@glossary mixin}
* provides overlay layout support to {@link module:moonstone/Item~Item}.
*
* ```
* var
* 	kind = require('enyo/kind'),
* 	Icon = require('moonstone/Icon'),
* 	Item = require('moonstone/Item'),
* 	ItemOverlaySupport = require('moonstone/ItemOverlay').ItemOverlaySupport,
* 	MarqueeText = require('moonstone/Marquee').Text;
*
* {kind: Item, mixins: [ItemOverlaySupport], beginningComponents: [
* 	{kind: Icon, icon: 'arrowlargeup', small: true},
* 	{kind: Icon, icon: 'arrowlargedown', small: true}
* ],
* components: [
* 	{kind: MarqueeText, content: "Item   with   icons   auto   hides"}
* ]}
* ```
*
* @mixin ItemOverlaySupport
* @public
*/
ItemOverlay.ItemOverlaySupport = {

	/**
	* @private
	*/
	name: 'moon.ItemOverlaySupport',

	/**
	* The components block to create left overlay. Only created in creation time.
	*
	* @type {Object}
	* @default null
	* @public
	*/
	beginningComponents: undefined,

	/**
	* The components block to create right overlay. Only created in creation time.
	*
	* @type {Object}
	* @default null
	* @public
	*/
	endingComponents: undefined,

	/**
	* When `true`, the beginning controls in the overlay are only shown on focus; in
	* other words, if the overlay is not focused, the controls will be hidden.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	autoHideBeginning: undefined,

	/**
	* When `true`, the ending controls in the overlay are only shown on focus; in
	* other words, if the overlay is not focused, the controls will be hidden.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	autoHideEnding: undefined,

	bindings: [
		{from: 'autoHideBeginning', to: '$.beginning.autoHide'},
		{from: 'autoHideEnding', to: '$.ending.autoHide'}
	],

	/**
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			this.beginningComponents = (this.beginningComponents === undefined) ? null : this.beginningComponents;
			this.endingComponents = (this.endingComponents === undefined) ? null : this.endingComponents;
			this.autoHideBeginning = (this.autoHideBeginning === undefined) ? false : this.autoHideBeginning;
			this.autoHideEnding = (this.autoHideEnding === undefined) ? false : this.autoHideEnding;
			sup.apply(this, arguments);
		};
	}),

	/**
	* @private
	*/
	initComponents: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.createComponents([{
				name: 'beginning', kind: ItemOverlay,
				classes: 'beginning', right: false, addBefore: this.controlParentName,
				components: this.beginningComponents
			},{
				name: 'ending', kind: ItemOverlay,
				classes: 'ending', right: true, addBefore: this.controlParentName,
				components: this.endingComponents
			}]);
		};
	})
};
