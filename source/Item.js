(function (enyo, scope) {
	/**
	* _moon.Item_ is a focusable Moonstone-styled control that can display simple
	* text or a set of controls.
	*
	* @ui
	* @class moon.Item
	* @extends enyo.Control
	* @mixes moon.MarqueeSupport
	* @mixes moon.MarqueeItem
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
		classes: 'moon-sub-header-text moon-item',

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
  	 	*/
		published: /** @lends moon.Item.prototype */ {

			/**
			* When true, the control is shown as disabled and does not generate tap
			* events
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
			}
		},

  	 	/**
  	 	* @private
  	 	*/
		disabledChanged: function (inOld) {
			this.addRemoveClass('disabled', this.disabled);
		},

  	 	/**
		* @fires moon.Scroller#event:onRequestScrollIntoView
  	 	* @private
  	 	*/
		spotlightFocused: function (inSender, inEvent) {
			if (inEvent.originator === this) {
				this.bubble('onRequestScrollIntoView');
			}
		}
	});

})(enyo, this);