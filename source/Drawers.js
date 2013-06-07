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
	kind:"enyo.Control",
	classes: "moon-drawers",
	published: {
		drawers: null
	},
	handlers: {
		onActivate: "drawerActivated",
		onSpotlightDown:"spotDown",
		onSpotlightUp:"spotUp"
	},
	components: [
		{name:"closeContainer", classes: "moon-drawers-close-container", spotlight:true, ontap: "closeDrawer", showing: false, components: [
			{classes: "moon-drawers-close-handle", components: [
				{name: "closeText", tag: "p", content: "CLOSE", classes: "moon-drawers-close-handle-text"}
			]}
		]},
		{name:"handleContainer", spotlight:'container', classes:"moon-drawers-handle-container"},
		{name:"drawers", classes:"moon-drawers-drawer-container"},
		{name: "client", classes:"moon-drawers-client", spotlight:'container', ontap:"clientTapped"}
	],
	create: function() {
		this.inherited(arguments);
		this.$.drawers.createComponents(this.drawers, {owner:this.owner});
		this.setupHandles();
		enyo.Spotlight.spot(this.$.client);
	},
	setupHandles: function() {
		var handles = [];
		for (index in this.drawers){
			handles.push(this.drawers[index].handle);
		}
		this.$.handleContainer.createComponents(handles, {owner:this});
		for (index in handles) {
			this.$.handleContainer.getControls()[index].addClass('moon-drawers-handle');
			this.$.handleContainer.getControls()[index].tap = this.bindSafely(this.handleTapped);
		}
	},
	spotlightFocused: function(inSender, inEvent) {
	},
	handleTapped: function(inSender, inEvent) {
		var handles = this.$.handleContainer.getControls();
		for (index in handles)
		{
			if (handles[index] == inEvent.originator ||
				enyo.Spotlight.Util.isChild(handles[index],inEvent.originator)) {
				var drawer = this.$.drawers.getControls()[index];
				drawer.toggleDrawer();
				return true;
			}
		}
	},
	closeDrawer: function(inSender, inEvent) {
		var drawers = this.$.drawers.getControls();
		for (index in drawers){
			if (drawers[index].getOpen()) {
				drawers[index].setOpen(false);
				if (drawers[index].controlDrawerComponents !== null && drawers[index].getControlsOpen()) {
					enyo.Spotlight.spot(drawers[index].$.controlDrawer);
				} else {
					enyo.Spotlight.spot(this.$.handleContainer);
				}
			}
		}
		this.$.closeContainer.hide();
		return true;
	},
	clientTapped: function(inSender, inEvent) {
		for (index in this.drawers)
		{
			var drawer = this.$.drawers.getControls()[index];
			drawer.setControlsOpen(false);
		}
	},
	drawerActivated: function(inSender, inEvent) {
		var drawers = this.$.drawers.getControls();
		for (index in drawers)
		{
			if (drawers[index] == inEvent.originator) {
				this.$.closeContainer.show();
				return true;
			}
		}
	},
	resizeHandler: function() {
		this.inherited(arguments);
		var drawers = this.$.drawers.getControls();
		for (index in drawers){
			drawers[index].resizeDrawers();
		}
		this.$.closeContainer.hide();
	},
	spotUp: function(inSender, inEvent) {
		if (inEvent.originator == this.$.closeContainer) {
			return true;
		}
		//if at the top of a drawer then move focus to the close handle
		var drawers = this.$.drawers.getControls();
		for (index in drawers) {
			if (drawers[index].getOpen()) {
				if (drawers[index].$.client == inEvent.originator) {
					enyo.Spotlight.spot(this.$.closeContainer);
					return true;
				}
			} else if (drawers[index].$.controlDrawer == inEvent.originator) {
				enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(drawers[index].$.controlDrawer));
				return true;
			}
		}
	},
	spotDown: function(inSender, inEvent) {
		//if they hit down while on the close handle
		if (inEvent.originator == this.$.closeContainer) {
			var drawers = this.$.drawers.getControls();
			for (index in drawers) {
				if (drawers[index].getOpen()) {
					enyo.Spotlight.spot(drawers[index].$.client);
					return true;
				}
			}
		}

		//if they hit down while on one of the drawer handles
		if (enyo.Spotlight.Util.isChild(this.$.handleContainer,inEvent.originator)) {
			enyo.Spotlight.spot(this.$.client);
		}

		//if at the bottom a drawer then stop them from going further
		var drawers = this.$.drawers.getControls();
		for (index in drawers) {
			//when the main drawer is open
			if (drawers[index].getOpen()) {
				if (drawers[index].$.client == inEvent.originator) {
					//go to the controls drawer if there is one
					if (drawers[index].controlDrawerComponents !== null && drawers[index].getControlsOpen()) {
						enyo.Spotlight.spot(drawers[index].$.controlDrawer);
					}
					return true;
				//if from the control drawer & it was the last spottable item, respot it
				} else if (drawers[index].$.controlDrawer == inEvent.originator) {
					var kids = enyo.Spotlight.getChildren(drawers[index].$.controlDrawer);
					enyo.Spotlight.spot(kids[kids.length-1]);
					return true;
				}
			//when the only the control drawer is open then spotlight our main client area
			} else if (drawers[index].$.controlDrawer == inEvent.originator && drawers[index].getControlsOpen()) {
				enyo.Spotlight.spot(this.$.client);
				return true;
			}
		}
	}
});