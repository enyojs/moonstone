enyo.kind({
	name: "moon.ExpandableListItem",
	published: {
		open: false,
		autoCollapse: true
	},
	spotlight: false,
	classes: "moon-expandable-list-item",
	defaultKind: "moon.Item",
	handlers: {
		onSpotlightSelect: "spotlightSelect"
	},
	components: [
		{name: "header", kind: "moon.Item", classes: "moon-expandable-list-item-header", spotlight: true,
			onSpotlightFocus: "headerFocus", ontap: "expandContract", onSpotlightSelect: "expandContract"
		},
		{name: "drawer", kind: "moon.Drawer", components: [
			{name: "client", kind: "Group"}
		]},
		{name: "bottom", spotlight: true, onSpotlightFocus: "spotlightFocusBottom"}
	],
	//* This is used to prevent events from firing during initialization
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
	//* If select event came from header, call _expandContract()_
	spotlightSelect: function(inSender, inEvent) {
		if(inSender === this) {
			this.expandContract(inSender, inEvent);
			return true;
		}
	},
	//* If closed, open drawer and highlight first spottable child
	expandContract: function() {
		if(!this.getOpen()) {
			this.setOpen(true);
			enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.drawer));
		} else {
			this.setOpen(false);
		}
		return true;
	},
	//* Close drawer if drawer is currently open, autoCollapse is set to true, and event was sent via keypress (i.e. has a direction)
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
	//* When spotlight reaches the bottom of the expandable list item, prevent user from continuing downward.
	spotlightFocusBottom: function(inSender, inEvent) {
		var s = enyo.Spotlight.getSiblings(this.$.bottom);
		var nextItem = s.siblings[s.selfPosition-1];
		if(nextItem) {
			enyo.Spotlight.spot(nextItem);
			return true;
		}
		return true;
	}
});
