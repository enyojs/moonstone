(function (enyo, scope) {
	/**
	* Fires when the button is tapped, sending request to toggle fullscreen state.
	*
	* @event moon.VideoFullscreenToggleButton#event:onRequestToggleFullscreen
	* @type {Object}
	* @property {Object} sender - The [component]{@link enyo.Component} that most recently 
	*	propagated the [event]{@glossary event}.
	* @property {Object} event - An [object]{@glossary Object} containing 
	*	[event]{@glossary event} information. 
	* @public
	*/

	/**
	* _moon.VideoFullscreenToggleButton_ is a specialized {@link moon.IconButton}; when placed 
	* inside a {@link moon.VideoPlayer}, the button may be tapped to toggle the _VideoPlayer's_ 
	* fullscreen state.
	*
	* @class moon.VideoFullscreenToggleButton
	* @extends moon.IconButton
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