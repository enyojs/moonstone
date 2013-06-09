/**
	_moon.Drawer_ is meant to be used with <a href="#moon.Drawers">moon.Drawers</a> and consists of
	two drawers, plus a <a href="#moon.DrawerHandle">moon.DrawerHandle</a>. The main drawer
	is populated with any child components it is constructed with, the second (optional)
	drawer is populated with components passed into the controlDrawerComponents property. If no
	controlDrawerComponents are given then the main drawer will take up the full containing view, otherwise
	it will take up the amount of space left by the containing view minus the controlDrawerComponents height.
	When the toggleDrawer function is called it will open the controlDrawer if controlDrawerComponents exist,
	otherwise it will open the main drawer.

	The control's child components may be of any kind.

	{name:"musicDrawer", kind: "moon.Drawer",
		handle: {kind:"moon.DrawerHandle", content:"Handle"},
		components: [
			{content:"Drawer Content"}
		],
		controlDrawerComponents: [
			{content:"Controls"}
		]}
	}
*/
enyo.kind({
	name: "moon.Drawer",
	kind:"enyo.Control",
	classes: "moon-drawer moon-dark-gray",
	published: {
		controlDrawerComponents: null,
		handle: null,
		open: false,
		controlsOpen: false
	},
	events: {
		onActivate: "",
		onDeactivate: ""
	},
	components: [
		{name: "client", kind: "moon.FullScreenDrawer", spotlight: 'container', classes: "moon-light-gray"},
		{name: "controlDrawer", kind: "enyo.Drawer", spotlight: 'container'}
	],
	create: function() {
		this.inherited(arguments);
		this.$.controlDrawer.createComponents(this.controlDrawerComponents, {owner:this.owner});
	},
	rendered: function() {
		this.inherited(arguments);
		this.$.client.setDrawerProps({height:this.calcDrawerHeight()});
		this.openChanged();
		//Since the controlDrawer was showing initially (which we need to be able to get the height)
		//we now force it to hide (if it is set to not be open) so that there isn't an animation on startup
		if (!this.controlsOpen) {
			this.$.controlDrawer.open = this.controlsOpen;
			this.$.controlDrawer.$.client.setShowing(this.controlsOpen);
		}
	},
	calcDrawerHeight: function() {
		var parentClientRect = this.parent.parent.hasNode().getBoundingClientRect();
		if (this.controlDrawerComponents == null) {
			return parentClientRect.height;
		} else {
			var controlDrawerRect = this.$.controlDrawer.hasNode().getBoundingClientRect();
			return (parentClientRect.height - controlDrawerRect.height);
		}
	},
	toggleDrawer: function() {
		if (this.controlDrawerComponents == null) {
			this.setOpen(!this.open);
		} else {
			this.setControlsOpen(!this.controlsOpen);
		}
		return true;
	},
	openChanged: function() {
		this.$.client.setOpen(this.open);
		if (this.open) {
			this.doActivate();
			enyo.Spotlight.spot(this.$.client);
		}
	},
	controlsOpenChanged: function() {
		this.$.controlDrawer.setOpen(this.controlsOpen);
		if (this.controlsOpen) {
			enyo.Spotlight.spot(this.$.controlDrawer);
		} else {
			this.doDeactivate();
		}
	},
	resizeDrawers: function() {
		this.$.controlDrawer.$.client.setShowing(true);
		this.$.client.setDrawerProps({height:this.calcDrawerHeight()});
		this.$.controlDrawer.$.client.setShowing(false);
		this.$.client.render();
		this.$.controlDrawer.render();
		this.setOpen(false);
		this.setControlsOpen(false);
	}
});

//Allows for a full screen drawer w/out content that fill the client area full screen
enyo.kind({
	name: "moon.FullScreenDrawer",
	kind: "enyo.Drawer",
	handlers: {
		onResizeDrawer: "resizeDrawer"
	},
	open: false,
	published: {
		drawerProps: null
	},
	openChanged: function() {
		this.$.client.show();
		if (this.hasNode()) {
			if (this.$.animator.isAnimating()) {
				this.$.animator.reverse();
			} else {
				var v = this.orient == "v";
				var d = v ? "height" : "width";
				var p = v ? "top" : "left";
				var s = this.drawerProps.height;
				// unfixing the height/width is needed to properly
				// measure the scrollHeight/Width DOM property, but
				// can cause a momentary flash of content on some browsers
				this.applyStyle(d, null);

				if (this.animated) {
					this.$.animator.play({
						startValue: this.open ? 0 : s,
						endValue: this.open ? s : 0,
						dimension: d,
						position: p
					});
				} else {
					// directly run last frame if not animating
					this.animatorEnd();
				}
			}
		} else {
			this.$.client.setShowing(this.open);
		}
	},
	animatorEnd: function() {
		if (!this.open) {
			this.$.client.hide();
		} else {
			// save changes to this.domCssText --> see ENYO-1561
			this.$.client.domCssText = enyo.Control.domStylesToCssText(this.$.client.domStyles);
		}
		if (this.container) {
			this.container.resized();
		}
	},
	resizeDrawer: function(inSender, inProps) {
		this.drawerProps = inProps;
		if ((this.open) && (!this.$.animator.isAnimating())) {
			this.applyStyle("height", inProps.height + "px");
		}
		return true;
	}
});