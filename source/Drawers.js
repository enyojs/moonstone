/**
	_moon.Drawers_ is a container kind designed to hold a set of
	[moon.Drawer](#moon.Drawer) objects and client content. The _drawers_ property
	accepts an array of _moon.Drawer_ controls. The associated [drawer
	handles](#moon.DrawerHandle) are positioned in their own small drawer,
	centered at the top of the "dresser"--the region containing the array of
	Drawer controls and the activator nub.

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
	//* @protected
	classes: "moon-drawers enyo-fit",
	//* @public
	published: {
		//* Populate with an array of _moon.Drawer_ components
		drawers: null
	},
	//* @protected
	handlers: {
		//* Handlers to update the activator when the state of the contained drawers changes
		onActivate: "drawerActivated",
		onDeactivate: "drawerDeactivated",
		onSpotlightDown:"spotDown",
		onSpotlightUp:"spotUp"
	},
	components: [
		{name:"activatorWrapper", classes:"moon-drawers-activator-wrapper", spotlight:true, ontap:"activatorHandler", components: [
			{name:"activator", classes:"moon-drawers-activator", components:[
				{classes:"moon-drawers-activator-nub", components:[
					{name:"nubArrow", classes:"nub-arrow down"}
				]}
			]}
		]},
		{name:"handleContainer", classes:"moon-drawers-handle-container", kind:"enyo.Drawer", resizeContainer:false, open:false, onpostresize:"resizeHandleContainer", components:[
			{name:"handles", classes:"moon-neutral moon-drawers-handles"}
		]},
		{name: "drawers", classes:"moon-drawers-drawer-container"},
		{name: "client", classes:"moon-drawers-client", xspotlight:'container', ontap:"clientTapped", components: [
			{name: "clientScrim", chrome: true, classes: "enyo-fit moon-scrim"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.$.drawers.createComponents(this.drawers, {kind: "moon.Drawer", owner:this.owner});
		this.setupHandles();
	},
	rendered: function() {
		this.inherited(arguments);
		var dh = document.body.getBoundingClientRect().height;
		this.waterfall("onDrawersRendered", {drawersHeight: dh});
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
				this.updateActivator(true);
			} else {
				this.updateActivator(!this.$.handleContainer.getOpen());
				this.$.handleContainer.setOpen(!this.$.handleContainer.getOpen());
				if (this.$.handleContainer.getOpen()) {
					enyo.Spotlight.spot(this.$.handleContainer);
				}
			}
		}
	},
	handleTapped: function(inSender, inEvent) {
		this.openDrawer(inEvent.originator);
		return true;
	},
	openDrawer: function(drawer) {
		var handles = this.$.handles.getControls();
		for (var index in handles)
		{
			if (handles[index] == drawer || enyo.Spotlight.Util.isChild(handles[index],drawer)) {
				drawer = this.$.drawers.getControls()[index];
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
			var drawer = drawers[index];
			if (drawer.getOpen() || drawer.getControlsOpen()) {
				drawer.setOpen(false);
				drawer.setControlsOpen(false);
				enyo.Spotlight.spot(this.$.activator);
			}
		}
	},
	clientTapped: function(inSender, inEvent) {
		for (var index in this.drawers)
		{
			var drawer = this.$.drawers.getControls()[index];
			drawer.setControlsOpen(false);
		}
		this.$.handleContainer.setOpen(false);
		this.updateActivator(false);
	},
	drawerActivated: function(inSender, inEvent) {
		if (inEvent.originator instanceof moon.Drawer) {
			this.updateActivator(true);
			enyo.Spotlight.spot(this.$.activatorWrapper);
		}
	},
	drawerDeactivated: function(inSender, inEvent) {
		if (inEvent.originator instanceof moon.Drawer) {
			enyo.Spotlight.spot(this.$.activatorWrapper);
			if (!inEvent.originator.getOpen() && !inEvent.originator.getControlsOpen()) {
				this.updateActivator(false);
			}
		}
	},
	updateActivator: function(up) {
		this.$.nubArrow.addRemoveClass("up",up);
		this.$.nubArrow.addRemoveClass("down",!up);
		this.showScrim(up);
		if (!up) {
			this.$.activator.addRemoveClass("drawer-open", false);
		}
	},
	resizeHandler: function() {
		this.inherited(arguments);
		var dh = document.body.getBoundingClientRect().height;
		this.waterfall("onDrawersResized", {drawersHeight: dh});
		this.updateActivator(false);
	},
	/**
		Updates the activator's style only when it is not animating, so that there
		are no visual artifacts.
	*/
	resizeHandleContainer: function(inSender, inEvent) {
		enyo.asyncMethod(inEvent.delegate.bindSafely(function(){
			if (!this.$.animator.isAnimating()) {
				this.parent.$.activator.addRemoveClass("drawer-open", this.parent.drawerOpen() ? true : false);
			}
		}));
	},
	//* Shows scrim if the value is true
	showScrim: function(value) {
		this.$.clientScrim.addRemoveClass("moon-scrim-transparent", value);
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
		return this.spotChecker("DOWN");
	},
	//* Check whether to allow spotlight to move to any given direction.
	spotChecker: function(inDirection) {
		var neighbor = enyo.Spotlight.NearestNeighbor.getNearestNeighbor(inDirection),
			currentSpot = enyo.Spotlight.getCurrent();
		if (!enyo.Spotlight.Util.isChild(this.$.client, currentSpot) && enyo.Spotlight.Util.isChild(this.$.client, neighbor)) {
			if(this.fullDrawerOpen()) {
				return true;
			}else {
				this.clientTapped();
				enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.client))
				return true;
			}
		}
	},
	//* returns "true" if any drawer's client is open, returns "false" no drawer's client is open
	fullDrawerOpen: function(inSender, inEvent) {
		for (var index in this.drawers)
		{
			var drawer = this.$.drawers.getControls()[index];
			if(drawer.$.client.getOpen()) {
				return true;
			}
		}
		return false;
	},
});