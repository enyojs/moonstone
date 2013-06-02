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
	targetLayer	: "",
	classes		: 'moon-button enyo-unselectable',
	spotlight	: true,

	handlers: {
		onSpotlightSelect	: 'depress',
		onSpotlightKeyUp	: 'undepress'
	},

	create: function() {
		this.inherited(arguments);
		this.smallChanged();
	},

	depress: function() {
		this.addClass('pressed');
	},

	undepress: function() {
		this.removeClass('pressed');
	},

	smallChanged: function() {
		this.addRemoveClass('small', this.small);
		if(this.small) {
			this.targetLayer = new moon.TargetLayer({addBefore: this, owner: this.owner});			
		}
	},

	rendered: function() {
		if(this.small) {
			if (!this.targetLayer.hasNode()) {
				this.targetLayer.render(this.parent.node);
			}
			this.appendNodeToParent(this.targetLayer.node);
			/**
				for event propagation from button to target Tap
			*/
			this.setContainer(this.targetLayer);
		}	
		this.inherited(arguments);
	},
});

enyo.kind({
	name: "moon.TargetLayer",
	classes: "small-decorator",
	spotlight	: true,

	handlers: {
		onenter	: 'enter',
		onleave	: 'leave'
	},

	render: function(node) {
		if (node) {
			this.parentNode = node;	
		}		
		return this.inherited(arguments);
	},

	enter: function(inSender, inEvent) {
		this.controls[0].addClass("spotlight");
		return true;
	},

	leave: function(inSender, inEvent) {
		this.controls[0].removeClass("spotlight");
		return true;
	}
})