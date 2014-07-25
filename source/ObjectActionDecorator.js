(function (enyo, scope) {
	/**
	* _moon.ObjectActionDecorator_ is a decorator that wraps a spotlightable object. When the object
	* is focused, additional controls are displayed, allowing the user to act on the object.
	*
	* The decorator supports two orientations: vertical, with object actions placed below the
	* wrapped components, and horizontal, with object actions placed next to the components.
	*
	* **Here's a vertical example:**
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
	* @public
	*/
	enyo.kind(
		/** @lends moon.ObjectActionDecorator.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ObjectActionDecorator',

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
		*/
		published: /** @lends moon.ObjectActionDecorator.prototype */ {
			/**
			* Orientation of object actions in relation to focused components; _vertical_ places the
			* object actions below the components, while _horizontal_ places them next to the
			* components.
			*
			* @type {String}
			* @default 'vertical'
			* @public
			*/
			orientation: 'vertical',
			/**
			* When _orientation_ is _vertical_, setting _noStretch: false_ causes the object actions
			* to be stretched to fit the width of the components above
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
			{name:'client', classes: 'moon-objaction-client'},
			{name:'actions', classes: 'moon-objaction-actions'}
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
			this.inherited(arguments);
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

})(enyo, this);