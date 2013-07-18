enyo.kind({
	name: "moon.ObjectActionDecorator",
	handlers: {
		onSpotlightFocus:"focus",
		onSpotlightBlur:"blur",
		onSpotlightFocused: "spotlightFocused"
	},
	published: {
		type: 'vertical'
	},
	components: [
		{name:"client", classes: "moon-objaction-client"},
		{name:"actions"}
	],
	typeChanged: function () {
		switch(this.getType()){
		case 'vertical':
			this.applyStyle('display', 'inline-block');
			this.$.actions.addClass("moon-objaction-action-vertical");
			break;
		case 'horizontal':
			this.$.actions.addClass("moon-objaction-action-horizontal moon-hspacing");
			break;
		}
	},
	initComponents: function() {
		this.inherited(arguments);
		if (this.actionComponents) {
		    this.$.actions.createClientComponents(this.actionComponents);
		}	
		this.typeChanged();	
	},
	focus: function(inSender, inEvent) {
		this.$.actions.applyStyle("opacity", 1);
	},
	blur: function(inSender, inEvent) {
		this.$.actions.applyStyle("opacity", 0);
	},
	spotlightFocused: function(inSender, inEvent) {
		this.bubble("onRequestScrollIntoView", {side: "top"});
	}
});