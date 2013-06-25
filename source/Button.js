/**
	_moon.Button_ is an <a href="#enyo.Button">enyo.Button</a> with Moonstone
	styling applied. The color of the button may be customized by specifying a
	background color.

	For more information, see the documentation on
	<a href='https://github.com/enyojs/enyo/wiki/Buttons'>Buttons</a> in the
	Enyo Developer Guide.
*/

enyo.kind({
	name: 'moon.Button',
	kind: 'enyo.Button',
	published: {
		/**
			_small_ is a parameter which indicates the size of button.
			If it has true value, diameter of this button is 60px.
			However, the tap-target for button still has 78px, so it has
			invisible DOM which wrap this small button to provide wider tap zone.
		*/
		small: false,
	},
	classes: 'moon-button moon-header-font enyo-unselectable',
	spotlight: true,
	handlers: {
		//* onSpotlightSelect, simulate mousedown
		onSpotlightSelect	: 'depress',
		//* onSpotlightKeyUp, simulate mouseup
		onSpotlightKeyUp	: 'undepress'
	},
	//* On create, update based on _this.small_
	create: function() {
		this.inherited(arguments);
		this.updateSmall();
	},
	//* Add _pressed_ css class
	depress: function() {
		this.addClass('pressed');
	},
	//* Remove _pressed_ css class
	undepress: function() {
		this.removeClass('pressed');
	},
	//* If _this.small_ is true, add a child that increases the tap area
	updateSmall: function() {
		if (this.$.tapArea) {
			this.$.tapArea.destroy();
			this.$.client.destroy();
		}
		
		if (this.small) {
			this.addClass('small');
			this.createComponent({name: "tapArea", classes: "small-button-tap-area", isChrome: true});
			this.createComponent({name: "client", classes: "small-button-client"});
		} else {
			this.removeClass('small');
		}
		
		this.contentChanged();
	},
	//* When _this.small_ changes, update and rerender
	smallChanged: function() {
		this.updateSmall();
		this.render();
	},
	//* Override content changed to handle potential child components
	contentChanged: function() {
		if (this.$.client) {
			this.$.client.setContent(this.getContent());
		} else {
			this.inherited(arguments);
		}
	}
});