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

	//* @protected
	tabItemComponents: [],
	components: [
		{name: "group", kind: "Group"}
	],

	create: function() {
		this.inherited(arguments);
		this.tabItemComponentsChanged();
	},
	initComponents: function() {		
		this.inherited(arguments);
		for(var i=0; i<this.tabItemComponents.length; i++){
			if(this.tabItemComponents[i].src) {				
				this.addRemoveClass("icon", true);
				break;
			}
		}		
	},
	setTabItemComponents: function(inItems) {
		this.set("tabItemComponents", inItems);		
	},
	getTabItemComponents: function() {
		return this.get("tabItemComponents");		
	},
	tabItemComponentsChanged: function() {		
		this.$.group.destroyClientControls();
		this.$.group.createComponents(this.get("tabItemComponents"));
	},
	changeActiveItem: function(inIndex, inTrueToActive) {		
		this.$.group.controls[inIndex].changeActiveStatus(inTrueToActive);
	}
});
