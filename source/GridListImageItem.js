(function (enyo, scope) {
	/**
	* _moon.GridListImageItem_ extends
	* {@link #enyo.GridListImageItem}, adding Moonstone-specific
	* configuration, styling, decorators, and Spotlight/focus-state management.
	*
	* You may create an image grid by adding instances of this kind as components of
	* a {@link moon.DataGridList}. See the latter kind for an example of how
	* this may be done.
	*
	* @ui
	* @class moon.GridListImageItem
	* @extends enyo.GridListImageItem
	* @mixes moon.MarqueeSupport
	* @public
	*/

	enyo.kind(
		/** @lends moon.GridListImageItem.prototype */ {

		/**
		* @private
		*/
		name: 'moon.GridListImageItem',

		/**
		* @private
		*/
		kind: 'enyo.GridListImageItem',

		/**
		* @private
		*/
		mixins: ['moon.MarqueeSupport'],

		/**
		* @private
		*/
		spotlight: true,

		/**
		* @private
		*/
		centered: true,

		/**
		* @private
		*/
		classes: 'moon-gridlist-imageitem',

		/**
		* @private
		*/
		componentOverrides: {
			caption: {kind:'moon.MarqueeText', classes: 'moon-sub-header-text'},
			subCaption: {kind:'moon.MarqueeText', classes: 'moon-body-text'}
		},

		/**
		* @private
		*/
		bindings: [
			{from: '.allowHtml', to: '.$.caption.allowHtml'},
			{from: '.allowHtml', to: '.$.subCaption.allowHtml'}
		],

		/**
		* @private
		*/
		handlers: {
			onSpotlightFocus: 'focused'
		},

		/**
		* @fires moon.Scroller#event:onRequestScrollIntoView
		* @private
		*/
		focused: function (inSender, inEvent) {
			if (inEvent.originator === this) {
				this.bubble('onRequestScrollIntoView');
			}
		}
	});

})(enyo, this);
