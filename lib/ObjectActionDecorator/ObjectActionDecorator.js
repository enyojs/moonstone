require('moonstone');

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

/**
* {@link moon.ObjectActionDecorator} is a decorator that wraps a spotlightable object.
* When the object is focused, additional controls are displayed, allowing the user to
* act on the object.
*
* The decorator supports two orientations: `'vertical'`, with object actions placed
* below the wrapped components, and `'horizontal'`, with object actions placed next to
* the components.
*
* The following is a vertical example:
* ```javascript
* {
* 	kind: 'moon.ObjectActionDecorator',
* 	orientation: 'vertical',
* 	components: [
* 		{kind: 'moon.Item', components: [
* 			{name: 'image', kind: 'enyo.Image', src: 'assets/default-music.png'}
* 		]}
* 	],
* 	actionComponents: [
* 		{kind: 'moon.Button', name: 'Play', small: true, content: 'PLAY'},
* 		{kind: 'moon.Button', name: 'Favorite', small: true, content: 'FAVORITE'},
* 		{kind: 'moon.Button', name: 'Share', small: true, content: 'SHARE'}
* 	]
* }
* ```
*
* @class moon.ObjectActionDecorator
* @extends enyo.Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.ObjectActionDecorator.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ObjectActionDecorator',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'moon-objaction',

	/**
	* @private
	*/
	handlers: {
		onSpotlightFocused: 'spotFocused',
		onSpotlightBlur: 'spotBlur',
		onenter: 'enter',
		onleave: 'leave'
	},

	/**
	* @private
	* @lends moon.ObjectActionDecorator.prototype
	*/
	published: {

		/**
		* Orientation of object actions in relation to focused components; `'vertical'` places
		* the object actions below the components, while `'horizontal'` places them next to the
		* components.
		*
		* @type {String}
		* @default 'vertical'
		* @public
		*/
		orientation: 'vertical',

		/**
		* When [orientation]{@link moon.ObjectActionDecorator} is `'vertical'`, setting
		* `noStretch: false` causes the object actions to be stretched to fit the width of the
		* components above.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		noStretch: false
	},

	/**
	* @private
	*/
	components: [
		{name:'client', kind: Control, classes: 'moon-objaction-client'},
		{name:'actions', kind: Control, classes: 'moon-objaction-actions'}
	],

	/**
	* @private
	*/
	orientationChanged: function () {
		var vertical = this.getOrientation() == 'vertical';
		this.addRemoveClass('vertical', vertical);
		this.addRemoveClass('horizontal', !vertical);
		this.$.actions.addRemoveClass('moon-vspacing', vertical);
		this.$.actions.addRemoveClass('moon-hspacing', !vertical);
	},

	/**
	* @private
	*/
	noStretchChanged: function() {
		this.$.actions.addRemoveClass('stretch', !this.noStretch);
	},

	/**
	* @private
	*/
	initComponents: function() {
		Control.prototype.initComponents.apply(this, arguments);
		if (this.actionComponents) {
			var owner = this.hasOwnProperty('actionComponents') ? this.getInstanceOwner() : this;
			this.$.actions.createComponents(this.actionComponents, {owner: owner});
		}
		this.orientationChanged();
		this.noStretchChanged();
	},

	/**
	* @private
	*/
	spotFocused: function(inSender, inEvent) {
		this.focused = true;
		this.updateActionsVisibility();
	},

	/**
	* @private
	*/
	spotBlur: function(inSender, inEvent) {
		this.focused = false;
		this.entered = false;
		this.updateActionsVisibility();
	},

	/**
	* @private
	*/
	enter: function(inSender, inEvent) {
		this.entered = true;
		this.updateActionsVisibility();
	},

	/**
	* @private
	*/
	leave: function(inSender, inEvent) {
		this.entered = false;
		this.updateActionsVisibility();
	},

	/**
	* @private
	*/
	updateActionsVisibility: function() {
		this.$.actions.applyStyle('opacity', (this.focused || this.entered) ? 1 : 0);
	}
});