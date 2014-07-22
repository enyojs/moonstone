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

	/**
	* _moon.ItemOverlay_ is a supplementary control that helps control layout inside of item.
	* 
	* ```
	* {kind: "moon.Item", components: [
	* 	{kind: "moon.ItemOverlay", autoHide: false, right: true, components:[
	* 		{kind: "moon.Icon", icon: "arrowlargeup", small: true},
	* 		{kind: "moon.Icon", icon: "arrowlargedown", small: true}
	* 	]},
	* 	{kind: "moon.MarqueeText", content: "Item   with   icons   auto   hides"}
	* ]}
	* ```
	* 
	* @ui
	* @class moon.ItemOverlay
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends moon.ItemOverlay.prototype */ {

		 /**
		 * @private
		 */
		name: 'moon.ItemOverlay',

		/**
	 	* @private
	 	*/
		classes: 'moon-item-overlay',

		/**
		* @private
		*/
		published: /** @lends moon.ItemOverlay.prototype */ {

			/**
			* When true, the controls are hidden but only shown on focus
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			autoHide: false,

			/**
			* When true, the controls are right aligned
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
			this.inherited(arguments);
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

})(enyo, this);