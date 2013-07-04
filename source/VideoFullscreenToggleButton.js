/**
	_moon.VideoFullscreenToggleButton is a _moon.IconButton_ which can be placed inside of a _moon.VideoPlayer_ to
	toggle fullscreen state of the video player when the user taps or selects the icon button.
*/
enyo.kind({
	name: "moon.VideoFullscreenToggleButton",
	kind: "moon.IconButton",
	src: "$lib/moonstone/images/icon-fullscreenbutton.png",
	events: {
		//* Requests the parent video to toggle its fullscreen state
		onRequestToggleFullscreen:""
	},
	//*@protected
	handlers: {
		ontap: "doRequestToggleFullscreen"
	}
});