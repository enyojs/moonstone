require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ItemOverlay~ItemOverlay} kind.
* @module moonstone/ItemOverlay
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var
	Marquee = require('../Marquee'),
	MarqueeItem = Marquee.Item;

/**
* {@link module:moonstone/ItemOverlay~ItemOverlay} is a supplementary control that helps to manage
* layout within a {@link module:moonstone/Item~Item}.
*
* ```
* var
*     ItemOverlay = require('moonstone/ItemOverlay'),
*     Icon = require('moonstone/Icon');
*
* {kind: "moon.Item", components: [
* 	{kind: "moon.ItemOverlay", autoHide: false, right: true, components:[
* 		{kind: "moon.Icon", icon: "arrowlargeup", small: true},
* 		{kind: "moon.Icon", icon: "arrowlargedown", small: true}
* 	]},
* 	{kind: "moon.MarqueeText", content: "Item   with   icons   auto   hides"}
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
* Provides a overlay layout support to moon.Item {@link module:moonstone/Item~Item}.
*
* ```
 * var
 *     Item = require('moonstone/Item'),
 *     Icon = require('moonstone/Icon'),
 *     MarqueeText = require('moonstone/MarqueeText');
 *
* {kind: Item, mixins: ["moon.ItemOverlaySupport"], beginningComponents: [
* 	{kind: Icon, icon: "arrowlargeup", small: true},
* 	{kind: Icon, icon: "arrowlargedown", small: true}
* ],
* components: [
* 	{kind: MarqueeText, content: "Item   with   icons   auto   hides"}
* ]}
* ```
*
* @mixin moon.ItemOverlaySupport
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
	beginningComponents: null,

	/**
	* The components block to create right overlay. Only created in creation time.
	*
	* @type {Object}
	* @default null
	* @public
	*/
	endingComponents: null,

	/**
	* When `true`, the beginning controls in the overlay are only shown on focus; in
	* other words, if the overlay is not focused, the controls will be hidden.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	autoHideBeginning: false,

	/**
	* When `true`, the ending controls in the overlay are only shown on focus; in
	* other words, if the overlay is not focused, the controls will be hidden.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	autoHideEnding: false,

	bindings: [
		{from: 'autoHideBeginning', to: '$.beginning.autoHide'},
		{from: 'autoHideEnding', to: '$.ending.autoHide'}
	],

	initComponents: kind.inherit(function (sup) {
		return function () {
			if (!this.components || this.components.length === 0) {
				this.components = [{name: 'client', content: this.content}];
				if (this._mixins && this._mixins.indexOf('moon.MarqueeItem')) {
					this.components[0].mixins = [MarqueeItem];
				}
			}
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
