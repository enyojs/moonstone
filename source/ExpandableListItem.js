/**
	_moon.ExpandableListItem_, which extends _moon.Item_, displays a header while
	also allowing additional content to be stored in an _enyo.Drawer_.  When the
	header is selected, the drawer opens below. To close the drawer, tap on the
	header text or navigate (via 5-way) back to the top of the drawer.
	
	The control's child components may be of any kind; by default, they are
	instances of _moon.Item_.

		{kind: "moon.ExpandableListItem", content: "A Countries", components: [
			{content: "Algeria"},
			{content: "Argentina"},
			{content: "Australia"}
		]},
		{kind: "moon.ExpandableListItem", content: "B Countries", components: [
			{content: "Belgium"},
			{content: "Bolivia"},
			{content: "Brazil"}
		]}
*/
enyo.kind({
	name: "moon.ExpandableListItem",
	kind: "moon.Item",
	published: {
		//* If true, the drawer is expanded, showing this item's contents
		open: false,
		/**
			If true, the drawer automatically closes when the user navigates to the
			top of the control; if false, the user must select/tap the header to close
			the drawer.
		*/
		autoCollapse: true
	},
	//* @protected
	classes: "moon-expandable-list-item",
	spotlight: false,
	defaultKind: "moon.Item",
	handlers: {
		onSpotlightSelect: "spotlightSelect"
	},
	components: [
		{name: "header", kind: "moon.Item", classes: "moon-expandable-list-item-header", spotlight: true,
			onSpotlightFocus: "headerFocus", ontap: "expandContract", onSpotlightSelect: "expandContract"
		},
		{name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep", components: [
			{name: "client", kind: "Group"}
		]},
		{name: "bottom", spotlight: true, onSpotlightFocus: "spotlightFocusBottom"}
	],
	//* Used to prevent events from firing during initialization
	isRendered: false,
	create: function() {
		this.inherited(arguments);
		this.openChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.isRendered = true;
	},
	//* Facade for header content
	contentChanged: function() {
		this.$.header.setContent(this.getContent());
	},
	//* Facade for drawer
	openChanged: function() {
		var open = this.getOpen();

		this.$.drawer.setOpen(open);

		if(open) {
			this.addClass("open");
			this.spotlight = false;
			this.$.header.spotlight = true;
		} else {
			this.removeClass("open");
			this.spotlight = true;
			this.$.header.spotlight = false;
			if(this.isRendered) {
				enyo.Spotlight.spot(this);
			}
		}
	},
	//* Calls _expandContract()_ if _select_ event came from header. 
	spotlightSelect: function(inSender, inEvent) {
		if(inSender === this) {
			this.expandContract(inSender, inEvent);
			return true;
		}
	},
	//* If closed, opens drawer and highlights first spottable child.
	expandContract: function() {
		if (this.disabled) {
			return true;
		}
		if(!this.getOpen()) {
			this.setOpen(true);
			enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.drawer));
		} else {
			this.setOpen(false);
		}
		return true;
	},
	//* Closes drawer if drawer is currently open, autoCollapse is set to true,
	//* and event was sent via keypress (i.e., it has a direction).
	headerFocus: function(inSender, inEvent) {
		if(this.getOpen() && this.getAutoCollapse() && inEvent && inEvent.dir && inEvent.dir === "UP") {
			this.setOpen(false);
			enyo.Spotlight.spot(this);
			this.$.header.removeClass("spotlight");	//<--- TODO - why do we need this here?
			return true;
		} else if(!this.getOpen()) {
			enyo.Spotlight.spot(this);
		}
	},
	//* Prevents user from continuing downward when Spotlight reaches the bottom
	//* of the item.
	spotlightFocusBottom: function(inSender, inEvent) {
		var s = enyo.Spotlight.getSiblings(this.$.bottom);
		var nextItem = s.siblings[s.selfPosition-1];
		if(nextItem) {
			enyo.Spotlight.spot(nextItem);
			return true;
		}
		return true;
	},
	/**
		Bubbles the _requestScrollIntoView_ event every time the drawer animates.
		This makes for a smoother expansion animation when inside of a scroller, as
		the height of the scroller changes with the drawer's expansion.
	*/
	drawerAnimationStep: function() {
		this.bubble("onRequestScrollIntoView");
	}
});
