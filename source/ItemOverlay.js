(function (enyo, scope) {
	/**
	* {@link moon.ItemOverlay} is a supplemental control that helps to manage
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

	/**
	* Provides overlay layout support to {@link moon.Item}.
	*
	* ```
	* {kind: "moon.Item", mixins: ["moon.ItemOverlaySupport"], beginningComponents: [
	* 	{kind: "moon.Icon", icon: "arrowlargeup", small: true},
	* 	{kind: "moon.Icon", icon: "arrowlargedown", small: true}
	* ],
	* components: [
	* 	{kind: "moon.MarqueeText", content: "Item   with   icons   auto   hides"}
	* ]}
	* ```
	*
	* @mixin moon.ItemOverlaySupport
	* @public
	*/
	moon.ItemOverlaySupport = {
		/**
		* @private
		*/
		name: 'moon.ItemOverlaySupport',

		/**
		* The components block to create the left overlay. Only used at creation time.
		*
		* @type {Object}
		* @default null
		* @public
		*/
		beginningComponents: null,

		/**
		* The components block to create the right overlay. Only used at creation time.
		*
		* @type {Object}
		* @default null
		* @public
		*/
		endingComponents: null,

		/**
		* When `true`, the controls in the overlay are only shown on focus; in
		* other words, if the overlay is not focused, the controls will be hidden.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		autoHide: false,

		initComponents: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.createComponent({name: 'beginning', kind: 'moon.ItemOverlay', right: false, addBefore: this.controlParentName, components: this.beginningComponents});
				this.createComponent({name: 'ending', kind: 'moon.ItemOverlay', right: true, addBefore: this.controlParentName, components: this.endingComponents});
				if (this.autoHide) this.autoHideChanged();
			};
		}),

		/**
		* Updates `auto-hide` class on left and right overlay.
		*
		* @private
		*/
		autoHideChanged: function() {
			if (this.$.beginning) {
				this.$.beginning.addRemoveClass('auto-hide', this.autoHide);
			}
			if (this.$.ending) {
				this.$.ending.addRemoveClass('auto-hide', this.autoHide);
			}
		}
	};




})(enyo, this);
