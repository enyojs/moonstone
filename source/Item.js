(function (enyo, scope) {
	/**
	* {@link moon.Item} is a focusable Moonstone-styled control that can display
	* simple text or a set of controls.
	*
	* @class moon.Item
	* @extends enyo.Control
	* @mixes moon.MarqueeSupport
	* @mixes moon.MarqueeItem
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.Item.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Item',

		/**
		* @private
		*/
		classes: 'moon-item',

		/**
		* @private
		*/
		mixins: ['moon.MarqueeSupport', 'moon.MarqueeItem'],

		/**
		* @private
		*/
		spotlight: true,

		/**
		* @private
		*/
		handlers: {
			onSpotlightFocused: 'spotlightFocused'
		},

		/**
		* @private
		* @lends moon.Item.prototype
		*/
		published: {

			/**
			* If `true`, the control is shown as disabled and does not generate tap events.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disabled: false
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.disabledChanged();
			if (this.children.length) {
				this.addClass('allow-wrap');
				var i,
					c = this.children;
				for (i = 0; i < c.length; i++) {
					c[i].spotlight = false;
				}
			}
		},

		/**
		* @private
		*/
		disabledChanged: function (inOld) {
			this.addRemoveClass('disabled', this.disabled);
		},

		/**
		* @fires moon.Scroller#onRequestScrollIntoView
		* @private
		*/
		spotlightFocused: function (inSender, inEvent) {
			if (inEvent.originator === this) {
				this.bubble('onRequestScrollIntoView');
			}
		}
	});

})(enyo, this);
