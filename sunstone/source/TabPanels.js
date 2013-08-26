//* @public
/**
	sun.TabPanel_ is the default kind for controls created inside a
	<a href="#moon.Panels">moon.Panels</a> container.  Typically, a sun.Panels_
	will contain several instances of sun.Panel_.

	The built-in features of sun.Panel_ include a header and a FittableRows
	layout for the main body content.
*/

enyo.kind({
	name : "sun.TabPanels",

	//* @protected
	spotlight: "container",
	fit : true,
	classes: "sun-tabPanels",
	layoutKind: "FittableRowsLayout",	
	panelTools : [		
		//{name: "panelBody", fit: true, classes: "sun-panel-body"},
		{name: "panels", fit: true, kind: "enyo.Panels", arrangerKind: "CardArranger", onTransitionFinish: "transitionFinish"},
		{name: "tabbar", kind: "sun.TabBar", onActivate: "tabSelect"}
	],	
	tabComponents: [],
	panelComponents: [],

	create: function() {			
		this.inherited(arguments);			
		this.$.panels.createComponents(this.panelComponents);		
		this.tabComponentsChanged();		
	},
	initComponents: function() {		
		this.createTools();
		this.controlParentName = "panelBody";
		this.discoverControlParent();
		this.inherited(arguments);		
	},
	createTools: function() {				
		this.createComponents(this.panelTools);
	},	
	tabComponentsChanged: function() {
		for(var i in this.tabComponents) {			
			this.tabComponents[i].index = i;			
		}
		this.$.tabbar.setTabItemComponents(this.tabComponents);	
	},
	tabSelect: function(inSender, inEvent) {		
		if (inEvent.originator.getActive()) {
			// goto selected panel
			var selected = inEvent.originator.getIndex();			
			this.$.panels.setIndex(inEvent.originator.getIndex());
		}		
	},
	transitionFinish: function(inSender, inEvent) {		
		this.$.tabbar.changeActiveItem(this.$.panels.index, true);		
	},
});
