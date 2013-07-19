/**
	_moon.VideoFullscreenToggleButton_ is a specialized
	<a href="#moon.IconButton">moon.IconButton</a>; when placed inside a
	<a href="#moon.VideoPlayer">moon.VideoPlayer</a>, the button may be tapped to
	toggle the VideoPlayer's fullscreen state.
*/
enyo.kind({
	name: "moon.VideoFullscreenToggleButton",
	kind: "moon.IconButton",
	src: "$lib/moonstone/images/icon-fullscreenbutton.png",
	events: {
		/**
			Fires when the button is tapped, sending request to toggle fullscreen
			state.
		*/
		onRequestToggleFullscreen:""
	},
	//*@protected
	handlers: {
		ontap: "doRequestToggleFullscreen"
	}
});