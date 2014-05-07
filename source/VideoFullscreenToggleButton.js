/**
	_moon.VideoFullscreenToggleButton_ is a specialized
	[moon.IconButton](#moon.IconButton); when placed inside a
	[moon.VideoPlayer](#moon.VideoPlayer), the button may be tapped to toggle the
	VideoPlayer's fullscreen state.
*/
enyo.kind({
	name: "moon.VideoFullscreenToggleButton",
	kind: "moon.IconButton",
	//* @protected
	icon : "exitfullscreen",
	classes : "moon-icon-video-round-controls-style moon-icon-exitfullscreen-font-style",
	//* @public
	events: {
		/**
			Fires when the button is tapped, sending request to toggle fullscreen
			state.
		*/
		onRequestToggleFullscreen:""
	},
	//* @protected
	handlers: {
		ontap: "doRequestToggleFullscreen"
	}
});