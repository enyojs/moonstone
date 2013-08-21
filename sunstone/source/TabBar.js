/**
	_sun.TabBar_ is a Sunstone-styled control with tab button
*/
enyo.kind({
	name: "sun.TabBar",
	kind: "sun.Scroller",	
	classes: "sun-tabBar",
	vertical: "hidden",	
	published: {
		withIcon: false,
	},
	components: [
		{name: "group", kind: "Group"}
	],
	tabComponents:[],	
	initComponents: function() {		
		this.inherited(arguments);
		for(var i=0; i<this.tabComponents.length; i++){
			if(this.tabComponents[i].src) {				
				this.addRemoveClass("icon", true);
				break;
			}
		}		
		this.$.group.createComponents(this.tabComponents);		
	}
});
