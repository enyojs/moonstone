/**
	_moon.ObjectActionDecorator_ is a decorator that wraps a spotlightable object.
	When the object is focused, additional controls are displayed, allowing the
	user to act on the object.

	The decorator supports two orientations: vertical, with object actions placed
	below the wrapped	components, and horizontal, with object actions placed next
	to the components.

	Vertical example:

			{
				kind: "moon.ObjectActionDecorator", 
				orientation: "vertical",
				components: [
					{kind: "moon.Item", spotlightPosition: "bottom", components: [
						{name: 'image', kind: 'enyo.Image', src: "assets/default-music.png"}
					]}
				],
				actionComponents: [
					{kind: "moon.Button", name: "Play", small: true, content: "PLAY"},
					{kind: "moon.Button", name: "Favorite", small: true, content: "FAVORITE"},
					{kind: "moon.Button", name: "Share", small: true, content: "SHARE"}
				]
			}

*/
enyo.kind({
	name: "moon.ObjectActionDecorator",
	handlers: {
		onSpotlightFocus:"focus",
		onSpotlightBlur:"blur",
		onenter: "enter",
		onleave: "leave"
	},
	published: {
		/**
			Orientation of object actions in relation to focused components.
			_vertical_ places the object actions below the components, while
			_horizontal_ places them next to the components.
		*/
		orientation: 'vertical',
		/**
			When _orientation_ is _vertical_, setting _noStretch: true_ causes the
			object actions to be stretched to fit the width of the components above.
		*/
		noStretch: false
	},
	components: [
		{name:"client", classes: "moon-objaction-client"},
		{name:"actions"}
	],
	//*@protected
	orientationChanged: function () {
		switch(this.getOrientation()){
		case 'vertical':
			this.applyStyle('display', 'inline-block');
			this.$.actions.addClass("moon-objaction-action-vertical moon-vspacing");
			break;
		case 'horizontal':
			this.$.actions.addClass("moon-objaction-action-horizontal moon-hspacing");
			break;
		}
	},
	noStretchChanged: function() {
		this.$.actions.addRemoveClass("moon-objectaction-stretch", !this.noStretch);
	},
	initComponents: function() {
		this.inherited(arguments);
		if (this.actionComponents) {
			this.$.actions.createClientComponents(this.actionComponents);
		}	
		this.orientationChanged();	
		this.noStretchChanged();	
	},
	focus: function(inSender, inEvent) {
		this.focused = true;
		this.updateActionsVisibility();
	},
	blur: function(inSender, inEvent) {
		this.focused = false;
		this.entered = false;
		this.updateActionsVisibility();
	},
	enter: function(inSender, inEvent) {
		this.entered = true;
		this.updateActionsVisibility();
	},
	leave: function(inSender, inEvent) {
		this.entered = false;
		this.updateActionsVisibility();
	},
	updateActionsVisibility: function() {
		this.$.actions.applyStyle("opacity", (this.focused || this.entered) ? 1 : 0);
	}
});