(function (enyo, scope) {
	/**
	* `moon.VideoFullscreenToggleButton` is a specialized {@link moon.IconButton}; when placed 
	* inside a {@link moon.VideoPlayer}, the button may be tapped to toggle the `VideoPlayer`'s
	* fullscreen state.
	*
	* @class moon.VideoFullscreenToggleButton
	* @extends moon.IconButton
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.VideoFullscreenToggleButton */ {

		/**
		* @private
		*/
		name: 'moon.VideoFullscreenToggleButton',

		/**
		* @private
		*/
		kind: 'moon.IconButton',
		
		/**
		* @private
		*/
		icon : 'exitfullscreen',

		/**
		* @private
		*/
		classes : 'moon-icon-video-round-controls-style moon-icon-exitfullscreen-font-style',
		
		/**
		* @private
		*/
		events: {
			/**
			* {@link moon.VideoPlayer#event:onRequestToggleFullscreen}
			*/
			onRequestToggleFullscreen:''
		},
		
		/**
		* @private
		*/
		handlers: {
			/**
			* @fires moon.VideoPlayer#onRequestToggleFullscreen
			*/
			ontap: 'doRequestToggleFullscreen'
		}
	});

})(enyo, this);
