(function (enyo, scope) {
	/**
	* {@link moon.Item} is a focusable Moonstone-styled [control]{@link enyo.Control}
	* that can display simple text or a set of controls.
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
			* When `true`, the control is shown as disabled and does not generate tap
			* events.
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
	* {@link moon.ItemOverlay} is a supplementary control that helps to manage
	* layout within a {@link moon.Item}.
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