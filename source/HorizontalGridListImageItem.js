(function (enyo, scope) {
	/**
	* {@link moon.HorizontalGridListImageItem} extends {@link moon.GridListImageItem}, adding
	* Horizontal specified configuration and styling
	*
	* You may create an image grid by adding instances of this kind as components of a
	* {@link moon.DataGridList}.
	*
	* @class moon.HorizontalGridListImageItem
	* @extends moon.GridListImageItem
	* @mixes moon.SelectionOverlaySupport
	* @ui
	* @public
	*/

	enyo.kind(
		/** @lends moon.HorizontalGridListImageItem.prototype */ {

		/**
		* @private
		*/
		name: 'moon.HorizontalGridListImageItem',

		/**
		* @private
		*/
		kind: 'moon.GridListImageItem',

		/**
		* @private
		*/
		mixins: ["moon.SelectionOverlaySupport"],

		selectionOverlayVerticalOffset: 50,
		selectionOverlayHorizontalOffset: 90,

		/**
		* @private
		*/
		centered: false,

		/**
		* @private
		*/
		selection: true,

		events: {
			onSelectionEnable: ''
		},

		/**
		* @private
		*/
		classes: 'moon-gridlist-imageitem horizontal',

		/**
		* @private
		*/
		handlers: {
			onSpotlightFocus: 'focused'
		},

		/**
		* @private
		*/
		create: function() {
			this.inherited(arguments);

			this.createComponent({name: 'captionArea', classes: 'captionArea'});
			this.$.caption.setContainer(this.$.captionArea);
			this.$.subCaption.setContainer(this.$.captionArea);
		}
	});

})(enyo, this);
