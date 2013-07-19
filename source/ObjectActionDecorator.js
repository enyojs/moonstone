/**
	_moon.ObjectActionDecorator is a decorator that wraps a spotlight-able component, and when
	focused, will reveal additional components allowing the user to take an action on the focused
	object.

	The Decorator supports two orientations: vertical, with object actions placed below the wrapped 
	components, and horizontal, with object actions placed next to the components.

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
		//* Orientation of object actions in relation to components.  _vertical_ places object actions
		//* below the components and _horizontal_ places object action components next to the components.
		orientation: 'vertical',
		//* Only in _orientation: 'vertical'_ mode, _noStretch: true_ causes object actions to be stretched
		//* to the width of the components above.
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