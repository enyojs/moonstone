(function (enyo, scope) {
	/**
	* Fires when the button is tapped, sending request to toggle fullscreen state. No event-
	* specific information is sent with this event.
	*
	* @event moon.VideoFullscreenToggleButton#event:onRequestToggleFullscreen
	* @type {Object}
	* @public
	*/

	/**
	* _moon.VideoFullscreenToggleButton_ is a specialized {@link moon.IconButton}; when placed 
	* inside a {@link moon.VideoPlayer}, the button may be tapped to toggle the _VideoPlayer's_ 
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
			onRequestToggleFullscreen:''
		},
		
		/**
		* @private
		*/
		handlers: {
			ontap: 'doRequestToggleFullscreen'
		}
	});

})(enyo, this);
