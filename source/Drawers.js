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
		{name:"handleContainer", classes:"moon-drawers-handle-container", kind:"enyo.Drawer", resizeContainer:false, open:false, spotlightDisabled: true, onpostresize:"resizeHandleContainer", components:[
			{name:"handles", classes:"moon-neutral moon-drawers-handles"}
		]},
		{name: "drawers", classes:"moon-drawers-drawer-container"},
		{name: "client", classes:"moon-drawers-client"}
	],
	eventsToCapture: {
		ontap: "captureTapSelect", 
		onSpotlightFocus: "captureSpotFocus", 
		onSpotlightSelect: "captureTapSelect"
	},
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
		var handles = []
			, controls, index;

		// cover the case where one is not defined
		if (this.drawers) {
			for (index = 0; index < this.drawers.length; ++index) {
				handles.push(this.drawers[index].handle || {});
			}
			this.$.handles.createComponents(handles, {kind: "moon.DrawerHandle", owner:this});
			controls = this.$.handles.getControls();
			enyo.forEach(handles, function (handle, idx) {
				controls[idx].addClass('moon-drawers-handle');
				controls[idx].tap = this.bindSafely(this.handleTapped);
			}, this);
		}
	},
	activatorHandler: function(){
		if (this.drawerOpen()) {
			this.closeDrawers();
		} else {
			if (this.$.handles.getControls().length == 1) {
				this.openDrawer(this.$.handles.getControls()[0]);
			} else {
				if (this.$.handleContainer.getOpen()) {
					this.closeHandleContainer();
				} else {
					this.openHandleContainer();
				}
			}
		}
	},
	openHandleContainer: function() {
		this.$.handleContainer.spotlightDisabled = false;
		this.$.handleContainer.setOpen(true);
		enyo.Spotlight.spot(this.$.handleContainer);
		this.updateActivator(true);
		enyo.dispatcher.capture(this.$.handleContainer, this.eventsToCapture, this);
	},
	closeHandleContainer: function() {
		enyo.dispatcher.release(this.$.handleContainer);
		this.$.handleContainer.spotlightDisabled = true;
		this.$.handleContainer.setOpen(false);
		this.updateActivator(false);
	},
	handleTapped: function(inSender, inEvent) {
		this.openDrawer(inEvent.originator);
		return true;
	},
	openDrawer: function(drawer) {
		var handles = this.$.handles.getControls();
		for (var index = 0; index < handles.length; ++index)
		{
			if (handles[index] == drawer || enyo.Spotlight.Util.isChild(handles[index],drawer)) {
				drawer = this.$.drawers.getControls()[index];
				drawer.toggleDrawer();
				this.closeHandleContainer();
				enyo.dispatcher.capture(drawer, this.eventsToCapture, this);
				return;
			}
		}
	},
	drawerOpen: function() {
		var drawers = this.$.drawers.getControls();
		for (var index = 0; index < drawers.length; ++index){
			if (drawers[index].getOpen() || drawers[index].getControlsOpen()) {
				return true;
			}
		}
		return false;
	},
	closeDrawers: function() {
		var drawers = this.$.drawers.getControls();
		for (var index = 0; index < drawers.length; ++index){
			var drawer = drawers[index];
			if (drawer.getOpen() || drawer.getControlsOpen()) {
				enyo.dispatcher.release(drawer);
				drawer.setOpen(false);
				drawer.setControlsOpen(false);
			}
		}
		this.updateActivator(false);
	},
	captureSpotFocus: function(inSender, inEvent) {
		// Only close drawers on 5-way focus in the client (not pointer focus)
		if (inEvent.dir && inEvent.dispatchTarget.isDescendantOf(this.$.client)) {
			this.closeDrawers();
			this.closeHandleContainer();
		}
	},
	captureTapSelect: function(inSender, inEvent) {
		// Any tap or select in the client area closes the dresser/drawer
		if (inEvent.dispatchTarget.isDescendantOf(this.$.client)) {
			this.closeDrawers();
			this.closeHandleContainer();
		}
	},
	drawerActivated: function(inSender, inEvent) {
		if (inEvent.originator instanceof moon.Drawer) {
			this.updateActivator(true);
			// Hide client when fullscreen drawer is open so it is not focusable
			if (inEvent.originator.getOpen()) {
				this.$.client.hide();
			}
		}
	},
	drawerDeactivated: function(inSender, inEvent) {
		if (inEvent.originator instanceof moon.Drawer) {
			if (!inEvent.originator.getOpen() && !inEvent.originator.getControlsOpen()) {
				this.updateActivator(false);
			}
			// Re-show client when closing fullscreen drawer
			if (!inEvent.originator.getOpen()) {
				this.$.client.show();
			}
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
	handleAtIndex: function(inIndex) {
		return this.$.handles.getControls()[inIndex];
	},
	destroy: function() {
		enyo.dispatcher.release(this.$.handleContainer);
		for (var i=0, c$=this.$.drawers.getControls(); i<c$.length; i++) {
			enyo.dispatcher.release(c$[i]);
		}
		this.inherited(arguments);
	}
});
