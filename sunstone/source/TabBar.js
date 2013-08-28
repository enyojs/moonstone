/**
	_sun.TabBar_ is a Sunstone-styled control with tab button
*/
enyo.kind({
	name: "sun.TabBar",
	kind: "sun.Scroller",	
	classes: "sun-tabBar",
	vertical: "hidden",	
	touchOverscroll: false,
	published: {
		withIcon: false	
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
	tabItemComponentsChanged: function() {	
		this.$.group.destroyClientControls();
		// indexing to tab items
		for(var i in this.tabItemComponents) {			
			this.tabItemComponents[i].index = i;			
		}		
		this.$.group.createComponents(this.tabItemComponents);
	},
	changeActiveItem: function(inIndex, inTrueToActive) {
		// scroll to selected item
		if(this.$.group.controls[inIndex].selected) {			
			var w = this.$.group.container.node.offsetWidth;
			var cl = this.$.group.controls[inIndex].node.getBoundingClientRect().left;
			var cr = this.$.group.controls[inIndex].node.getBoundingClientRect().right;			
			var ol = this.$.group.controls[inIndex].node.offsetLeft;
			var ow = this.$.group.controls[inIndex].node.offsetWidth;
			// left align
			if(cl < 0) {				
				this.scrollTo(ol, 0);
			}
			// right align
			else if (cr > w) {
				this.scrollTo(ol+ow-w, 0);
			}			
		}
		// tab item highlight
		this.$.group.controls[inIndex].changeActiveStatus(inTrueToActive);		
	}
});
