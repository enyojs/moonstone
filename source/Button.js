/**
	_moon.Button_ is an <a href="#enyo.Button">enyo.Button</a> with Moonstone
	styling applied. The color of the button may be customized by specifying a
	background color.

	For more information, see the documentation on
	<a href='https://github.com/enyojs/enyo/wiki/Buttons'>Buttons</a> in the
	Enyo Developer Guide.
*/

enyo.kind({
	name		: 'moon.Button',
	kind		: 'enyo.Button',
	publiched	: {
		/**
			_small_ is a parameter to indicates the size of button.
			If it has true value, diameter of this button is 60px.
			However, the tap-target for button still has 78px, so it has
			invisible DOM which wrap this small button to provide wider tap zone.

		*/
		small	: false,
	},
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
	},

	smallChanged: function() {
		this.addRemoveClass(this.small, 'small');
	}
});