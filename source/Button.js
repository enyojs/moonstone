/**
	_moon.Button_ is an <a href="#enyo.Button">enyo.Button</a> with Moonraker
	styling applied. The color of the button may be customized by specifying a
	background color.

	For more information, see the documentation on
	<a href='https://github.com/enyojs/enyo/wiki/Buttons'>Buttons</a> in the
	Enyo Developer Guide.
*/

enyo.kind({
	name		: 'moon.Button',
	kind		: 'enyo.Button',
	classes		: 'moon-button enyo-unselectable',
	spotlight	: true,

	handlers: {
		onSpotlightSelect	: 'depress',
		onSpotlightKeyUp	: 'undepress'
	},

	depress: function() {
		this.addClass('pressed');
	},

	undepress: function() {
		this.removeClass('pressed');
	}
});