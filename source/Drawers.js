/**
	_moon.Drawers_ is a container kind for a set of <a href="#moon.Drawer">moon.Drawers</a> and
	client content. It accepts an array of a href="#moon.Drawer">moon.Drawers</a> and will
	position the drawer's <a href="#moon.DrawerHandle">moon.DrawerHandles</a>
	at the top right of the view. When they are selected they will open their corresponding
	<a href="#moon.Drawer">moon.Drawer's</a> main drawer or control drawer depending on it's
	configuration.

	The control's child components may be of any kind.

	{kind:"moon.Drawers", drawers:[
		{name:"musicDrawer", kind: "moon.Drawer",
			handle: {kind:"moon.DrawerHandle", content:"Handle"},
			components: [
				{content:"Drawer Content"}
			],
			controlDrawerComponents: [
				{content:"Controls"}
			]}
		]},
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
		drawers: null
	},
	handlers: {
		onActivate: "drawerActivated",
		onDeactivate: "drawerDeactivated",
		onSpotlightDown:"spotDown",
		onSpotlightUp:"spotUp"
	},
	components: [
		{name:"handleContainer", kind:"enyo.Drawer", spotlight:'container', open:false, components:[
			{name:"handles", classes:"moon-drawers-handles"}
		]},
		{name:"activator", classes:"moon-drawers-activator", spotlight:true, ontap:"activatorHandler", components:[
			{classes:"moon-drawers-activator-nub", components:[
				{name:"nubArrow", classes:"down"}
			]}
		]},
		{name: "drawers", classes:"moon-drawers-drawer-container"},		
		{name: "client", classes:"moon-drawers-client", spotlight:'container', ontap:"clientTapped"}
	],
	create: function() {
		this.inherited(arguments);
		this.$.drawers.createComponents(this.drawers, {kind: "moon.Drawer", owner:this.owner});
		this.setupHandles();
		enyo.Spotlight.spot(this.$.client);
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
			this.setNubArrowUp(false);
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
				this.setNubArrowUp(true);
				return true;
			}
		}
	},
	drawerDeactivated: function(inSender, inEvent) {
		enyo.Spotlight.spot(this.$.activator);
		if (!inEvent.originator.getOpen() && !inEvent.originator.getControlsOpen()) {
			this.setNubArrowUp(false);
		}
	},
	setNubArrowUp: function(up) {
		this.$.nubArrow.addRemoveClass("up",up);
		this.$.nubArrow.addRemoveClass("down",!up);
	},
	resizeHandler: function() {
		this.inherited(arguments);
		if (this.$.handleContainer.$.animator.isAnimating()){
			return true;
		}
		var drawers = this.$.drawers.getControls();
		for (var index in drawers){
			drawers[index].resizeDrawers();
		}
		this.setNubArrowUp(false);
	},
	spotUp: function(inSender, inEvent) {
		if (inEvent.originator == this.$.activator && !this.$.handleContainer.getOpen()) {
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
			enyo.Spotlight.spot(this.$.client);
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