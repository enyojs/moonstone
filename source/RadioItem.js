(function (enyo, scope) {
	/**
	* `moon.RadioItem` is a modified [`moon.Item`]{@link moon.Item} control designed for use inside
	* a [`moon.RadioItemGroup`]{@link moon.RadioItemGroup}.
	*
	* For more information, see the documentation on
	* [Radio Items]{@link building-apps/controls/radio-items.html} in the Enyo Developer Guide.
	*
	* @class moon.RadioItem
	* @extends moon.SelectableItem
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.RadioItem.prototype */ {

		/**
		* @private
		*/
		name: 'moon.RadioItem',

		/**
		* @private
		*/
		kind: 'moon.SelectableItem',

		/**
		* @private
		*/
		create: function() {
			this.inherited(arguments);
			this.removeClass('moon-selectable-item');
			this.addClass('moon-radio-item');
		}
	});

})(enyo, this);
