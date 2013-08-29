enyo.kind({
	name: "moon.ListActions",
	classes: "moon-list-actions",
	kind: "enyo.GroupItem",
	published: {
		//* If true, the drawer is expanded, showing this item's contents
		open: false,
		/**
			If true, the drawer will automatically close when the user
			selects a menu item
		*/
		autoCollapse: false,
		/**
			List of actions to be displayed
		*/
		listActions: [],
		iconSrc: ""
	},
	handlers: {
		onActivate: "optionSelected",
		onSpotlightDown:"spotlightDown",
		onSpotlightUp:"spotlightUp",
		onSpotlightLeft:"spotlightLeft",
		onSpotlightRight:"spotlightRight"
	},
	components:[
		{name:"activator", kind: "moon.IconButton", classes:"moon-list-actions-activator", spotlight:true, ontap: "expandContract", onSpotlightSelect: "expandContract"},
		{name: "drawerPopup", kind: "enyo.Popup", classes:"moon-list-actions-drawer-popup", floating: false, autoDismiss: false, components: [
			{name: "drawer", kind: "ListActionDrawer", onStep: "drawerAnimationStep", onDrawerAnimationEnd: "drawerAnimationEnd", open:false, components: [
				{name:"closeButton", kind: "moon.Button", classes:"moon-list-actions-close moon-neutral", marquee: false, ontap:"expandContract", onSpotlightSelect: "expandContract"},
				{classes: "moon-list-actions-client-container moon-neutral", components: [
					{name:"listActions", kind: "moon.Scroller", classes:"moon-list-actions-scroller", thumb:false, components: [
						{name:"listActionsContainer", classes:"moon-list-actions-container", onRequestScrollIntoView:"scrollIntoView"}
					]}
				]}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.openChanged();
		this.listActionsChanged();
		this.$.activator.setSrc(this.iconSrc);
	},
	rendered: function() {
		/* Fixme: rendered handler is not called */
		this.inherited(arguments);
		var clientRect = this.parent.hasNode().getBoundingClientRect();
		this.$.listActions.applyStyle('height', clientRect.bottom + "px");
		this.$.listActions.resized();
	},
	listActionsChanged: function() {
		for (var option in this.listActions) {
			this.$.listActionsContainer.createComponents([
				{
					classes: "moon-list-actions-menu",
					components: this.listActions[option].components,
					action: this.listActions[option].action ? this.listActions[option].action : ""
				}
			], {owner: this.getInstanceOwner()});
		}
	},
	/**
		If drawer is closed, opens drawer and highlights first spottable child; if
		drawer is open, closes drawer and highlights the activating control.
	*/
	expandContract: function(inSender, inEvent) {
		if (inSender.name === inEvent.originator.name) {
			if (this.disabled) {
				return true;
			}
			if(!this.getOpen()) {
				this.configurePopup();
				this.setOpen(true);
				enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.listActions));
			} else {
				this.setOpen(false);
				enyo.Spotlight.spot(this.$.activator);
				this.$.closeButton.undepress(); //why is this needed?
			}
			this.resetScrollers();
			return true;
		}
		return false;

	},
	configurePopup: function() {
		var clientRect = this.parent.parent.hasNode().getBoundingClientRect();
		this.$.drawerPopup.applyStyle('width', clientRect.width + "px");
		this.$.drawerPopup.applyStyle('height', clientRect.height + "px");
		this.$.drawerPopup.setShowing(true);
		this.$.drawerPopup.applyStyle('left', (clientRect.left - this.hasNode().getBoundingClientRect().left)  + "px");
		this.$.drawerPopup.applyStyle('top', (clientRect.top - this.hasNode().getBoundingClientRect().top)  + "px");
	},
	//* Updates _this.$.drawer.open_ and redraws drawer when _this.open_ changes.
	openChanged: function() {
		this.$.drawer.setOpen(this.getOpen());
		this.refresh();
	},
	optionSelected: function(inSender, inEvent) {
		if (inEvent.toggledControl && inEvent.toggledControl.checked) {
			//decorate the event with the control's group action name
			var controls = this.$.listActionsContainer.getControls();
			for (var index in controls) {
				if (enyo.Spotlight.Util.isChild(controls[index], inEvent.toggledControl)) {
					inEvent.action = controls[index].action;
					break;
				}
			}

			if (this.autoCollapse) {
				setTimeout(enyo.bind(this, function() {
					this.setOpen(false);
					this.resetScrollers();
					enyo.Spotlight.spot(this.$.activator);
				}), 300);
			}
		}
	},
	resetScrollers: function() {
		//if stacked, scroll to the top of the main drawer scroller; otherwise, scroll to the top of the individual menu scrollers
		if (this.stacked) {
			this.$.listActions.scrollTo(0,0);
			//reset focus to the first item in the main scroller
			var child = enyo.Spotlight.getFirstChild(this.$.listActions);
			enyo.Spotlight.Decorator.Container.setLastFocusedChild(child, enyo.Spotlight.getFirstChild(child));
		} else {
			var optionGroup = this.$.listActionsContainer.getControls();
			for (var i=0;i<optionGroup.length;i++) {
				var controls = optionGroup[i].getControls();
				for (var j=0;j<controls.length;j++) {
					if (controls[j].kind == "moon.Scroller") {
						controls[j].scrollTo(0,0);
						//reset focus to the first item in each scroller
						enyo.Spotlight.Decorator.Container.setLastFocusedChild(controls[j],
							enyo.Spotlight.getFirstChild(controls[j]));
					}
				}
			}
		}
	},
	/**
		Bubbles the _requestScrollIntoView_ event each time the drawer animates.
		This makes for a smoother expansion animation when inside a scroller, as the
		height of the scroller changes with the drawer's expansion.
	*/
	drawerAnimationStep: function() {
		this.bubble("onRequestScrollIntoView");
	},
	drawerAnimationEnd: function() {
		//refresh the list option menus when the drawer opens
		if (this.$.drawer.hasNode() && this.open) {
			this.refresh();
		} else {
			this.$.drawerPopup.setShowing(false);
		}
		this.setActive(this.getOpen());
	},
	resizeHandler: function() {
		//If drawer is collapsed, do not resize popup
		if (this.getOpen()) {
			this.configurePopup();
		}
		//don't refresh while animating
		if (!this.$.drawer.$.animator.isAnimating()){
			this.refresh();
		}
	},
	refresh: function() {
		var i, j, controls;
		if (this.$.drawer.hasNode()) {
			var br = this.$.drawer.hasNode().getBoundingClientRect();
			//get the total width of all option menus
			var width = 0;
			var optionGroup = this.$.listActionsContainer.getControls();
			for (i=0;i<optionGroup.length;i++) {
				width += optionGroup[i].hasNode().getBoundingClientRect().width;
			}

			//if the option menus don't all fit horizontally, stack them & allow the main drawer scroller to scroll all of them
			if (width > br.width) {
				for (i=0;i<optionGroup.length;i++) {
					optionGroup[i].applyStyle("display","block");
					controls = optionGroup[i].getControls();
					for (j=0;j<controls.length;j++) {
						if (controls[j].kind == "moon.Scroller") {
							controls[j].applyStyle("height", "none");
						}
					}
				}
				this.stacked = true;
			} else {
				//if all the menus fit horizontally, then adjust their individual scrollers so they self scroll
				for (i=0;i<optionGroup.length;i++) {
					optionGroup[i].applyStyle("display","inline-block");
					controls = optionGroup[i].getControls();
					for (j=0;j<controls.length;j++) {
						if (controls[j].kind == "moon.Scroller") {
							//make the scroller the height of the drawer scroller - the items "heading" height - heading bottom margin height
							controls[j].applyStyle("height", (this.$.listActions.hasNode().getBoundingClientRect().height
							- controls[0].hasNode().getBoundingClientRect().height
							- parseInt(controls[0].getComputedStyleValue('margin-bottom'), 10))
							+ "px");
						}
					}
				}
				this.stacked = false;
			}
		}
	},
	/**
		When spotlight reaches bottom edge of option menu, prevents user from
		continuing further.
	*/
	spotlightDown: function(inSender, inEvent) {
		var s = enyo.Spotlight.getSiblings(inEvent.originator);
		//prevent navigation past last item, handle stacked & non-stacked cases + close button
		if (!this.stacked && s.selfPosition == (s.siblings.length-1)) {
			return true;
		} else {
			var listActionItems = this.$.listActionsContainer.getControls();
			var last = listActionItems[listActionItems.length-1];
			if (enyo.Spotlight.Util.isChild(last, inEvent.originator) && s.selfPosition == (s.siblings.length-1)) {
				return true;
			}
		}

		if (inEvent.originator == this.$.closeButton) {
			return true;
		}
	},
	/**
		When spotlight reaches top edge of option menu, prevents user from
		continuing further.
	*/
	spotlightUp: function(inSender, inEvent) {
		var s = enyo.Spotlight.getSiblings(inEvent.originator);
		//if current item is at the top of a menu OR is an expandable picker
		if (inEvent.originator.kind === "moon.ExpandablePicker" || s.selfPosition === 0) {
			//if the menus are not stacked OR the current item is the first in the stacked menu overall, close the drawer & focus the activator
			if (!this.stacked || inEvent.originator == enyo.Spotlight.getFirstChild(this.$.listActionsContainer)) {
				enyo.Spotlight.spot(this.$.closeButton);
				return true;
			}
		}

		if (inEvent.originator == this.$.closeButton) {
			return true;
		}
	},
	/**
		When spotlight reaches left edge of option menu, prevents user from
		continuing further.
	*/
	spotlightLeft: function(inSender, inEvent) {
		if (this.stacked && inEvent.originator != this.$.closeButton && inEvent.originator != this.$.activator) {
			return true;
		} else {
			//if it's coming from the left-most column, then stop the left event
			var listActionItems = this.$.listActionsContainer.getControls();
			var first = listActionItems[0];
			if (enyo.Spotlight.Util.isChild(first, inEvent.originator)) {
				return true;
			}
		}
	},
	/**
		When spotlight reaches right edge of option menu, prevents user from
		continuing further.
	*/
	spotlightRight: function(inSender, inEvent) {
		if (inEvent.originator == this.$.closeButton) {
			return true;
		} else if (this.stacked) {
			enyo.Spotlight.spot(this.$.closeButton);
		} else {
			//if it's coming from the right-most column, then focus the close button
			var listActionItems = this.$.listActionsContainer.getControls();
			var last = listActionItems[listActionItems.length-1];
			if (enyo.Spotlight.Util.isChild(last, inEvent.originator)) {
				enyo.Spotlight.spot(this.$.closeButton);
			}
		}
	},
	/**
		When menus are laid out horizontally, prevents _onRequestScrollIntoView_
		event from bubbling past the menus' container. This prevents scroll bouncing
		for nested scrollers.
	*/
	scrollIntoView: function(inSender, inEvent) {
		if (!this.stacked) {
			return true;
		}
	}
});



enyo.kind({
	name: "enyo.ListActionDrawer",
	kind: "enyo.Drawer",
	openChanged: function() {
		this.$.client.show();
		if (this.hasNode()) {
			if (this.$.animator.isAnimating()) {
				this.$.animator.reverse();
			} else {
				var v = this.orient == "v";
				var d = v ? "height" : "width";
				var p = v ? "top" : "left";
				// unfixing the height/width is needed to properly
				// measure the scrollHeight/Width DOM property, but
				// can cause a momentary flash of content on some browsers
				this.applyStyle(d, null);
				var s = this.hasNode()[v ? "scrollHeight" : "scrollWidth"];
				s = this.node.getBoundingClientRect().height;
				if (this.animated) {
					this.$.animator.play({
						startValue: this.open ? s : 0,
						endValue: this.open ? 0 : s,
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
	animatorStep: function(inSender) {
		// while the client inside the drawer adjusts its position to move out of the visible area
		var cn = this.$.client.hasNode();
		if (cn) {
			var p = inSender.position;
			var o = (this.open ? inSender.endValue : inSender.startValue);
			cn.style[p] = this.$.client.domStyles[p] = (inSender.value + o) + "px";
		}
		if (this.container) {
			this.container.resized();
		}
	}
});