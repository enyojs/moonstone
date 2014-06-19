/**
    _moon.Drawer_, a control designed for use with [moon.Drawers](#moon.Drawers),
    consists of two drawers and a [moon.DrawerHandle](#moon.DrawerHandle).
    The main drawer is populated with any child components that are specified in
    the constructor; the optional second drawer (_controlDrawer_) is populated
    with components passed into the _controlDrawerComponents_ property.

    If the second drawer has no components, the main drawer will take up the full
    height of the containing view; otherwise, its height will be equal to the
    height of the containing view minus the height of the _controlDrawerComponents_.

    A call to _toggleDrawer()_ will open the _controlDrawer_ if
    _controlDrawerComponents_ is non-empty; otherwise, it will open the main
    drawer.

    The control's child components may be of any kind.

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
*/
enyo.kind({
	name: "moon.Drawer",
	kind:"enyo.Control",
	//* @protected
	classes: "moon-drawer moon-neutral",
	//* @public
	published: {
		//* Components that are to be placed in the control drawer
		controlDrawerComponents: null,
		//* Typically set to an instance of _moon.DrawerHandle_
		handle: null,
		//* Visibility state of the main drawer
		open: false,
		//* Visibility state of the control drawer
		controlsOpen: false
	},
	events: {
		//* Fires when either the main drawer or the control drawer is activated.
		onActivate: "",
		//* Fires when either the main drawer or the control drawer is deactivated.
		onDeactivate: ""
	},
	//* @protected
	handlers: {
		//* Handler for initial rendering event
		onDrawersRendered: "drawersRendered",
		//* Handler for initial resizing event to size drawers to full screen
		onDrawersResized: "drawersResized"
	},
	components: [
		{name: "client", kind: "moon.FullScreenDrawer", spotlightDisabled: true, resizeContainer:false},
		{name: "controlDrawer", kind: "enyo.Drawer", spotlightDisabled: true, resizeContainer:false}
	],
	create: function() {
		this.inherited(arguments);
		this.$.controlDrawer.createComponents(this.controlDrawerComponents, {owner:this.owner});
		//* Todo: remove padding on client
		this.$.client.$.client.addClass('moon-drawer-client');
		this.$.controlDrawer.$.client.addClass('moon-drawer-partial-client');
	},
	drawersRendered: function(inSender, inEvent) {
		this.$.client.setDrawerProps({height: this.calcDrawerHeight(inEvent.drawersHeight)});
		this.openChanged();
		if (!this.controlsOpen) {
			this.$.controlDrawer.setAnimated(false);
			this.$.controlDrawer.setOpen(this.controlsOpen);
			this.$.controlDrawer.setAnimated(true);
		} else {
			this.controlsOpenChanged();
		}
	},
	calcDrawerHeight: function(drawersHeight) {
		var clientHeight = drawersHeight;
		if (this.controlDrawerComponents == null) {
			return clientHeight;
		} else {
			this.controlDrawerHeight = (this.controlDrawerHeight) ? this.controlDrawerHeight : this.$.controlDrawer.hasNode().getBoundingClientRect().height;
			return (clientHeight - this.controlDrawerHeight);
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
			this.$.client.spotlightDisabled = false;
			enyo.Spotlight.spot(this.$.client);
		} else {
			this.$.client.spotlightDisabled = true;
			this.doDeactivate();
		}
	},
	controlsOpenChanged: function() {
		this.$.controlDrawer.setOpen(this.controlsOpen);
		if (this.controlsOpen) {
			this.doActivate();
			this.$.controlDrawer.spotlightDisabled = false;
			enyo.Spotlight.spot(this.$.controlDrawer);
		} else {
			if (this.$.client.getOpen()) {
				this.$.client.setOpen(false);
			}
			this.$.controlDrawer.spotlightDisabled = true;
			this.doDeactivate();
		}
	},
	drawersResized: function(inSender, inEvent) {
		this.$.client.setDrawerProps({height: this.calcDrawerHeight(inEvent.drawersHeight)});
		this.setOpen(false);
		this.setControlsOpen(false);
	}
});

//* @protected

/**
    _moon.FullScreenDrawer_ is a content-free drawer that fills the client's
    full screen area.  It is only intended for use inside of `moon.Drawer`.
    Users should not instantiate _moon.FullScreenDrawer_ directly.
*/
enyo.kind({
	name: "moon.FullScreenDrawer",
	kind: "enyo.Drawer",
	//* @protected
	handlers: {
		onResizeDrawer: "resizeDrawer"
	},
	open: false,
	//* @public
	published: {
		/** 
			An object that holds the client dimensions for the fullscreen drawer,
			e.g.: _drawer.setDrawerProps({height:100px});_.  This property is only
			intended to be used internally by _moon.Drawer_.
		*/
		drawerProps: null
	},
	//* @protected
	initComponents: function() {
		this.inherited(arguments);
		this.$.client.setShowing(true);
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
		}
	},
	animatorEnd: function() {
		if (!this.open) {
			this.$.client.hide();
		}
		if (this.container) {
			this.container.resize();
		}
	},
	resizeDrawer: function(inSender, inProps) {
		this.drawerProps = inProps;
		if ((this.open) && (!this.$.animator.isAnimating())) {
			this.applyStyle("height", inProps.height + "px");
		}
		return true;
	},
	drawerPropsChanged: function(){
		this.$.client.applyStyle("height", this.drawerProps.height + "px");
		this.$.client.resize();
		this.$.client.setShowing(this.open);
	}
});
