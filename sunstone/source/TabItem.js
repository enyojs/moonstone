/**
	_sun.TabItem_ is a <a href="#moon.Item">moon.Item</a> with a flag to
	track selection state.  It is especially useful within the context of the
	<a href="#enyo.Group">Enyo Group API</a>. 

	When selected, the item appears as underlined.

	If multiple SelectableItems are used in a group, only one of them may be in
	the selected state at a given time.
*/

enyo.kind({
	name: "sun.TabItem",
	kind: "moon.SelectableItem",
	classes: "sun-tabItem",	
	spotlightPosition: "none",
	//spotlightOverlay: true,
	handlers: {
		ondown: "touchDown",
		onup: "touchUp",		
		onleave: "touchUp"
	},
	published: {
		index: null,
		src: null
	},	
	initComponents: function() {				
		this.inherited(arguments);
		if(this.src) {						
			this.addRemoveClass("icon", true);		
			this.createComponent({kind: "Image", src: this.src});
		}
		this.$.marqueeText.disabled = true;
	},
	changeActiveStatus: function(inTrueToActive) {		
		if(this.selected != inTrueToActive) {				
			this.setSelected(inTrueToActive);
			// add or remove highlight
			this.$.client.addRemoveClass("moon-overlay", this.getActive());
		}		
	},
	touchDown: function(inSender, inEvent) {
		inSender.parent.addRemoveClass("touch-down", true);
	},	
	touchUp: function(inSender, inEvent) {
		inSender.parent.addRemoveClass("touch-down", false);
	}
});
