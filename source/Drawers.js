/**
    _moon.Drawers_ is a container kind designed to hold a set of
    <a href="#moon.Drawer">moon.Drawer</a> objects and client content. The
    _drawers_ property accepts an array of _moon.Drawer_ controls. The
    associated <a href="#moon.DrawerHandle">drawer handles</a> are positioned in
    their own small drawer, centered at the top of the "dresser"--the region
    containing the array of Drawer controls and the activator nub.

    When a handle is selected, it opens the corresponding Drawer object's main
    drawer or control drawer, depending on how the Drawer object is configured.

    The control's child components may be of any kind.

        {
            kind: "moon.Drawers",
            drawers: [
                {
                    name: "musicDrawer",
                    kind: "moon.Drawer",
                    handle: {kind: "moon.DrawerHandle", content: "Handle"},
                    components: [
                        {content: "Drawer Content"}
                    ],
                    controlDrawerComponents: [
                        {content: "Controls"}
                    ]
                }
            ],
            components: [
                {content: "Content Area"}
            ]
        }
*/
enyo.kind({
	name: "moon.Drawers",
	kind: "enyo.Control",
	classes: "moon-drawers",
	published: {
		//* Populate with an array of _moon.Drawer_ components		
		drawers: null
	},
	handlers: {
		//* Handlers to update the activator when the state of the contained drawers changes
		onActivate: "drawerActivated",
		onDeactivate: "drawerDeactivated",		
		onSpotlightDown:"spotDown",
		onSpotlightUp:"spotUp"
	},
	components: [
		{name:"handleContainer", kind:"enyo.Drawer", spotlight:'container', open:false, onpostresize:"resizeHandleContainer", components:[
			{name:"handles", classes:"moon-drawers-handles"}
		]},
		{name:"activator", classes:"moon-drawers-activator", spotlight:true, ontap:"activatorHandler", components:[
			{classes:"moon-drawers-activator-nub", components:[
				{name:"nubArrow", classes:"nub-arrow down"}
			]}
		]},
		{name: "drawers", classes:"moon-drawers-drawer-container"},		
		{name: "client", classes:"moon-drawers-client", spotlight:'container', ontap:"clientTapped"}	
	],
	create: function() {
		this.inherited(arguments);
		this.$.drawers.createComponents(this.drawers, {kind: "moon.Drawer", owner:this.owner});
		this.setupHandles();
	},
	rendered: function() {
	    this.inherited(arguments);
		this.resizeDresser();
	    var dh = document.body.getBoundingClientRect().height;
	    var ah = this.$.activator.hasNode().getBoundingClientRect().height;
	    this.waterfall("onDrawersRendered", {drawersHeight: dh, activatorHeight: ah});
	},
	resizeDresser: function() {
		var client = this.getBounds();

		this.$.activator.applyStyle('left', -client.left+'px');
		this.$.activator.applyStyle('top',-client.top+'px');
		this.$.activator.applyStyle('width',enyo.dom.getWindowWidth() + "px");

		this.$.handleContainer.applyStyle('left', -client.left+'px');
		this.$.handleContainer.applyStyle('top',(-client.top-5)+'px');
		this.$.handleContainer.applyStyle('width',enyo.dom.getWindowWidth() + "px");
		
		this.$.drawers.applyStyle('left', -client.left+'px');
		this.$.drawers.applyStyle('top', (-client.top-10)+'px');
		this.$.drawers.applyStyle('width',enyo.dom.getWindowWidth() + "px");

		//Fix for GF-12211 
		this.$.client.applyStyle('top', -client.top +'px');
	},	
	setupHandles: function() {
		var handles = [];
		for (var index in this.drawers){
			handles.push(this.drawers[index].handle);
		}
		this.$.handles.createComponents(handles, {kind: "moon.DrawerHandle", owner:this});
		for (index in handles) {
			this.$.handles.getControls()[index].addClass('moon-drawers-handle');
			this.$.handles.getControls()[index].tap = this.bindSafely(this.handleTapped);
		}
	},
	activatorHandler: function(){
		if (this.drawerOpen()) {
			this.closeDrawers();
		} else {
			if (this.$.handles.getControls().length == 1) {
				this.openDrawer(this.$.handles.getControls()[0]);
			} else {
				this.$.handleContainer.setOpen(!this.$.handleContainer.getOpen());				
			}
			this.updateActivator(false);
		}
	},
	handleTapped: function(inSender, inEvent) {
		this.openDrawer(inEvent.originator)
		return true;
	},
	openDrawer: function(drawer) {
		var handles = this.$.handles.getControls();
		for (var index in handles)
		{
			if (handles[index] == drawer || enyo.Spotlight.Util.isChild(handles[index],drawer)) {
				var drawer = this.$.drawers.getControls()[index];
				drawer.toggleDrawer();
				this.$.handleContainer.setOpen(false);
				return;
			}
		}		
	},
	drawerOpen: function() {
		var drawers = this.$.drawers.getControls();		
		for (var index in drawers){
			if (drawers[index].getOpen() || drawers[index].getControlsOpen()) {
				return true;
			}
		}
		return false;
	},
	closeDrawers: function(inSender, inEvent) {
		var drawers = this.$.drawers.getControls();
		for (var index in drawers){
			if (drawers[index].getOpen()) {
				drawers[index].setOpen(false);
				if (drawers[index].controlDrawerComponents !== null && drawers[index].getControlsOpen()) {
					enyo.Spotlight.spot(drawers[index].$.controlDrawer);
				} else {
					enyo.Spotlight.spot(this.$.activator);
				}
			} else if (drawers[index].getControlsOpen()) {
				drawers[index].setControlsOpen(false);				
			}
		}
	},
	clientTapped: function(inSender, inEvent) {
		for (var index in this.drawers)
		{
			var drawer = this.$.drawers.getControls()[index];
			drawer.setControlsOpen(false);
		}
	},
	drawerActivated: function(inSender, inEvent) {
		var drawers = this.$.drawers.getControls();
		for (var index in drawers)
		{
			if (drawers[index] == inEvent.originator) {
				this.updateActivator(true);
				return true;
			}
		}
	},
	drawerDeactivated: function(inSender, inEvent) {
		enyo.Spotlight.spot(this.$.activator);
		if (!inEvent.originator.getOpen() && !inEvent.originator.getControlsOpen()) {
			this.updateActivator(false);
		}
	},
	updateActivator: function(up) {
		this.$.nubArrow.addRemoveClass("up",up);
		this.$.nubArrow.addRemoveClass("down",!up);
		if (!up) {
			this.$.activator.addRemoveClass("drawer-open", false);			
		}
	},
	resizeHandler: function() {
		this.inherited(arguments);
		if (this.$.handleContainer.$.animator.isAnimating()){
			return true;
		}
		this.resizeDresser();		
	    var dh = document.body.getBoundingClientRect().height;
	    var ah = this.$.activator.hasNode().getBoundingClientRect().height;
	    this.waterfall("onDrawersResized", {drawersHeight: dh, activatorHeight: ah});
		this.updateActivator(false);
	},
	//Updates the activator's style only when it is not animating so that there are no visual artifacts
	resizeHandleContainer: function(inSender, inEvent) {
		enyo.asyncMethod(inEvent.delegate.bindSafely(function(){
			if (!this.$.animator.isAnimating()) {
				this.parent.$.activator.addRemoveClass("drawer-open", this.parent.drawerOpen() ? true : false);
			}
		}));
	},
	handleAtIndex: function(inIndex) {
		return this.$.handles.getControls()[inIndex];
	},
	spotUp: function(inSender, inEvent) {
		if (inEvent.originator == this.$.activator && !this.$.handleContainer.getOpen()) {
			return true;
		}
		
		//this specifically handles an up event from moon.Panels, but it is potentially too strict
		if (inEvent.originator.kind == "moon.Panels" && enyo.Spotlight.Util.isChild(this.$.client,inEvent.originator)) {
			enyo.Spotlight.spot(this.$.activator);
			return true;
		}
		
		//if at the top of a drawer then move focus to the activator
		var drawers = this.$.drawers.getControls();
		for (var index in drawers) {
			if (drawers[index].getOpen()) {
				if (drawers[index].$.client == inEvent.originator) {
					enyo.Spotlight.spot(this.$.activator);
					return true;
				}
			} else if (drawers[index].$.controlDrawer == inEvent.originator) {
				enyo.Spotlight.spot(this.$.activator);
				return true;
			}
		}
	},
	spotDown: function(inSender, inEvent) {
		var drawers = this.$.drawers.getControls();
		var index;

		//if they hit down while on the activator & there's an open drawer, move focus to it
		if (inEvent.originator == this.$.activator) {
			for (index in drawers) {
				if (drawers[index].getOpen()) {
					enyo.Spotlight.spot(drawers[index].$.client);
					return true;
				} else if (drawers[index].getControlsOpen()) {
					enyo.Spotlight.spot(drawers[index].$.controlDrawer);
					return true;
				}
			}
			//spot the client area if no drawers are open
			enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.client));
			return true;
		}

		//if at the bottom a drawer then stop them from going further
		for (index in drawers) {
			//when the main drawer is open
			if (drawers[index].getOpen()) {
				if (drawers[index].$.client == inEvent.originator) {
					//go to the controls drawer if there is one, otherwise stop at the last control
					if (drawers[index].controlDrawerComponents !== null && drawers[index].getControlsOpen()) {
						enyo.Spotlight.spot(drawers[index].$.controlDrawer);
					} else {
						var kids = enyo.Spotlight.getChildren(drawers[index].$.client);
						enyo.Spotlight.spot(kids[kids.length-1]);
					}
					return true;
				//if from the control drawer & it was the last spottable item, respot it
				} else if (drawers[index].$.controlDrawer == inEvent.originator) {
					var kids = enyo.Spotlight.getChildren(drawers[index].$.controlDrawer);
					enyo.Spotlight.spot(kids[kids.length-1]);
					return true;
				}
			//when only the control drawer is open then spotlight our main client area
			} else if (drawers[index].$.controlDrawer == inEvent.originator && drawers[index].getControlsOpen()) {
				enyo.Spotlight.spot(this.$.client);
				return true;
			}
		}
	}
});