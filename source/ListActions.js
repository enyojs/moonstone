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
		listActions: null,
		iconSrc: ""
	},
	handlers: {
		onSpotlightDown: "spotlightDown",
		onSpotlightUp: "spotlightUp",
		onSpotlightLeft: "spotlightLeft",
		onSpotlightRight: "spotlightRight"
	},
	components:[
		{name:"activator", kind: "moon.IconButton", classes: "moon-list-actions-activator", ontap: "expandContract"},
		{name: "drawerPopup", kind: "enyo.Control", classes: "moon-list-actions-drawer-popup", components: [
			{name: "drawer", kind: "moon.ListActionsDrawer", classes: "enyo-fit", onComplete: "drawerAnimationEnd", open: false, components: [
				{name: "closeButton", kind: "moon.IconButton", classes: "moon-list-actions-close moon-neutral", ontap: "expandContract"},
				{name: "listActionsClientContainer", classes: "enyo-fit moon-list-actions-client-container moon-neutral", components: [
					{name: "listActions", kind: "moon.Scroller", classes: "enyo-fit moon-list-actions-scroller", onActivate: "optionSelected"}
				]}
			]}
		]}
	],
	bindings: [
		{from: ".open", to: ".$.drawer.open"},
		{from: ".iconSrc", to: ".$.activator.src"}
	],
	create: function() {
		this.inherited(arguments);
		this.listActionsChanged();
	},
	listActionsChanged: function() {
		this.lastActions = this.listActions || [];
		this.rerenderListActionComponents();
	},
	rerenderListActionComponents: function() {
		this.noAutoCollapse = true;
		this.resetListActionComponents();
		this.createListActionComponents();
		this.noAutoCollapse = false;
	},
	resetListActionComponents: function() {
		this.listActionComponents = [];
		
		if (this.hasNode()) {
			this.$.listActions.destroyClientControls();
			this.$.listActions.render();
		}
	},
	createListActionComponents: function() {
		var listAction, i;
		
		for (i = 0; (listAction = this.listActions[i]); i++) {
			this.listActionComponents.push(this.createListActionComponent(listAction));
		}
		
		// Increase width to 100% if there is only one list action
		if (this.listActions.length === 1) {
			this.listActionComponents[0].addClass("full-width");
		}
		
		if (this.hasNode()) {
			this.$.listActions.render();
		}
	},
	//* Create a new list action component based on _inListAction_
	createListActionComponent: function(inListAction) {
		var listActionComponent;
		
		inListAction.mixins = this.addListActionMixin(inListAction);
		listActionComponent = this.$.listActions.createComponent(inListAction);
		listActionComponent.addClass("moon-list-actions-menu");
		
		return listActionComponent;
	},
	//* Add a mixin to each list action menu that decorates activate events with that menu's _action_ property
	addListActionMixin: function(inListAction) {
		var mixins = inListAction.mixins || [];
		if (mixins.indexOf("moon.ListActionActivationSupport") === -1) {
			mixins.push("moon.ListActionActivationSupport");
		}
		return mixins;
	},
	//* Toggle _this.open_
	expandContract: function(inSender, inEvent) {
		if (this.disabled) {
			return true;
		}
		
		// If currently open, close and spot _this.$.activator_
		if (this.getOpen()) {
			this.setOpen(false);
			enyo.Spotlight.spot(this.$.activator);
		}
		// If currently closed, resize and show _this.$.drawerPopup_
		else {
			this.configurePopup();
			this.showHidePopup(true);
			this.setOpen(true);
			this.scrollToTop();
		}
	},
	//* Position _this.$.drawerPopup_ to fill the entire header
	configurePopup: function() {
		var headerBounds = this.getHeaderBounds(),
			bounds = this.getClientBounds(),
			styleString = "";
		
		styleString += "width: "	+ Math.ceil(headerBounds.width)					+ "px; ";
		styleString += "height: "	+ Math.ceil(headerBounds.height)				+ "px; ";
		styleString += "left: "		+ Math.ceil(headerBounds.left - bounds.left)	+ "px; ";
		styleString += "top: "		+ Math.ceil(headerBounds.top - bounds.top)		+ "px; ";
		
		this.$.drawerPopup.addStyles(styleString);
	},
	showHidePopup: function(inShowing) {
		this.$.drawerPopup.setShowing(inShowing);
	},
	scrollToTop: function() {
		this.$.listActions.scrollTo(0, 0);
	},
	drawerAnimationEnd: function(inSender, inEvent) {
		if (this.getOpen()) {
			this.updateStacking();
			
			// Notify scroller of resize
			this.$.listActions.resized();
		}
		else {
			this.showHidePopup(false);
		}
	},
	updateStacking: function() {
		if (!this.$.drawer.hasNode()) {
			return;
		}
		
		this.set("stacked", this.shouldStack());
	},
	shouldStack: function() {
		var optionGroups = this.listActionComponents,
			headerWidth = this.getHeaderBounds().width,
			width = this.calcGroupWidth(optionGroups);
		
		return width > headerWidth;
	},
	stackedChanged: function() {
		this.rerenderListActionComponents();
		this.startJob("scrollToTop", "scrollToTop", 500);
		
		if (this.stacked) {
			this.addClass("stacked");
			this.stackMeUp();
		}
		else {
			this.removeClass("stacked");
			this.unStackMeUp();
		}
	},
	stackMeUp: function() {
		var optionGroup, i;
	
		for (i = 0; (optionGroup = this.listActionComponents[i]); i++) {
			optionGroup.applyStyle("display", "block");
			optionGroup.applyStyle("height", "none");
		}
	},
	unStackMeUp: function() {
		var containerHeight = this.getContainerBounds().height,
			optionGroup,
			i;
		
		for (i = 0; (optionGroup = this.listActionComponents[i]); i++) {
			optionGroup.applyStyle("display", "inline-block");
			
			if (optionGroup.layoutKind === "FittableRowsLayout") {
				optionGroup.applyStyle("height", containerHeight + "px");
			}
			
		}
	},
	//* Return the sum width of all of the _inControls_
	calcGroupWidth: function(inControls) {
		var control, width = 0, i;
		for (i = 0; (control = inControls[i]); i++) {
			width += control.getBounds().width;
		}
		return width;
	},
	resizeHandler: function() {
		this.resetCachedValues();
		
		// If drawer is collapsed, do not resize popup
		if (this.getOpen()) {
			this.configurePopup();
		}

		this.updateStacking();
	},
	optionSelected: function(inSender, inEvent) {
		if (this.getOpen() && this.autoCollapse && !this.noAutoCollapse) {
			this.startJob("expandContract", "expandContract", 300);
		}
	},
	/**
		When spotlight reaches bottom edge of option menu, prevents user from
		continuing further.
	*/
	spotlightDown: function(inSender, inEvent) {
		var s = enyo.Spotlight.getSiblings(inEvent.originator);
		//prevent navigation past last item, handle stacked & non-stacked cases + close button
		if (!this.stacked && s.selfPosition == (s.siblings.length - 1)) {
			return true;
		} else {
			var listActionItems = this.listActionComponents;
			var last = listActionItems[listActionItems.length - 1];
			if (enyo.Spotlight.Util.isChild(last, inEvent.originator) && s.selfPosition == (s.siblings.length - 1)) {
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
			var listActionItems = this.listActionComponents;
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
			var listActionItems = this.listActionComponents;
			var last = listActionItems[listActionItems.length - 1];
			if (enyo.Spotlight.Util.isChild(last, inEvent.originator)) {
				enyo.Spotlight.spot(this.$.closeButton);
			}
		}
	},
	getHeaderBounds: function() {
		this.headerBounds = this.headerBounds || this.getParentHeaderNode().getBoundingClientRect(); //this.getParentClientBound();
		return this.headerBounds;
	},
	getClientBounds: function() {
		this.clientBounds = this.clientBounds || this.hasNode().getBoundingClientRect();
		return this.clientBounds;
	},
	getContainerBounds: function() {
		this.containerBounds = this.containerBounds || this.$.listActionsClientContainer.getBounds();
		return this.containerBounds;
	},
	getParentHeaderNode: function() {
		return this.parent.parent.hasNode();
	},
	resetCachedValues: function() {
		this.headerBounds = null;
		this.clientBounds = null;
		this.containerBounds = null;
	}
});

enyo.kind({
	name: "moon.ListActionsDrawer",
	published: {
		open: false
	},
	classes: "moon-list-actions-drawer",
	components: [
		{name: "client", classes: "moon-list-actions-drawer-client moon-neutral"},
		{name: "animator", kind: "StyleAnimator", onStep: "step", onComplete: "animationComplete"}
	],
	rendered: function() {
		this.inherited(arguments);
		this.accel = enyo.dom.canAccelerate();
		this.resetClientPosition();
		this.openChanged();
	},
	openChanged: function() {
		if (!this.getShowing()) {
			this.setShowing(true);
		}
		
		if (this.open) {
			this.playOpenAnimation();
		} else {
			this.playCloseAnimation();
		}
	},
	animationComplete: function() {
		if (!this.open) {
			this.setShowing(false);
			this.resetClientPosition(0);
		}
	},
	resetClientPosition: function(inHeight) {
		inHeight = inHeight || this.getBounds().height;
		var matrix = this.generateMatrix(inHeight);
		this.$.client.applyStyle("-webkit-transform", matrix);
	},
	playOpenAnimation: function() {
		var openAnimation = this.createOpenAnimation();
		this.resetClientPosition();
		this.$.animator.play(openAnimation.name);
	},
	createOpenAnimation: function() {
		var matrix = this.generateMatrix(0);
		return this.$.animator.newAnimation({
			name: "open",
			duration: 225,
			timingFunction: "linear",
			keyframes: {
				0: [{
					control: this.$.client,
					properties: {
						"-webkit-transform"  : "current"
					}
				}],
				100: [{
					control: this.$.client,
					properties: {
						"-webkit-transform" : matrix
					}
				}]
			}
		});
	},
	playCloseAnimation: function() {
		var closeAnimation = this.createCloseAnimation(this.getBounds().height);
		this.$.animator.play(closeAnimation.name);
	},
	createCloseAnimation: function(inHeight) {
		var matrix = this.generateMatrix(inHeight);
		return this.$.animator.newAnimation({
			name: "close",
			duration: 225,
			timingFunction: "linear",
			keyframes: {
				0: [{
					control: this.$.client,
					properties: {
						"-webkit-transform"  : "current"
					}
				}],
				100: [{
					control: this.$.client,
					properties: {
						"-webkit-transform" : matrix
					}
				}]
			}
		});
	},
	generateMatrix: function(inYPosition) {
		return (this.accel) ? this.assemble3dMatrix(0, inYPosition, 1, 1) : this.assemle2dMatrix(0, inYPosition, 1, 1);
	},
	assemle2dMatrix: function(inX, inY, inWidth, inHeight) {
		return "matrix(" + inWidth + ", 0, 0, " + inHeight + ", " + inX + ", " + inY + ")";
	},
	assemble3dMatrix: function(inX, inY, inWidth, inHeight) {
		return "matrix3d(" + inWidth + ", 0, 0, 0, 0, " + inHeight + ", 0, 0, 0, 0, 1, 0, " + inX + ", " + inY + ", 1, 1)";
	}
});

moon.ListActionActivationSupport = {
	name: "ListActionActivationSupport",
	handlers: {
		onActivate: "activate"
	},
	activate: function(inSender, inEvent) {
		inEvent.action = this.action;
	}
};
