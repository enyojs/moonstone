enyo.kind({
	name: "moon.Accordion",
	kind: "moon.ExpandableListItem",
	classes: "moon-accordion",
	published: {
		//* True if the item is currently selected				
	    active: false,
		/**
			If true, the drawer automatically closes when the user navigates to the
			top of the control; if false, the user must select/tap the header to close
			the drawer
		*/
		autoCollapse: false
	},
	components: [
	    {name: "header", kind: "moon.Item", classes: "moon-accordian-header", spotlight: true,
		    onSpotlightFocus: "headerFocus", ontap: "expandContract", onSpotlightSelect: "expandContract"},
		{name:"arrow", classes:"moon-accordian-arrow"},
		{name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep", components: [
			{name: "client", kind: "Group", classes: "moon-accordion-client"}
		]},
		{name: "bottom", spotlight: true, classes: "moon-accordian-bottom", onSpotlightFocus: "spotlightFocusBottom"}
	],
	//* @protected
	rendered: function() {
		this.inherited(arguments);
		this.setActive(this.open);
	},
	activeChanged: function() {
	    this.bubble("onActivate");
        this.setOpen(this.active);
	},
	expandContract: function() {
		if (this.disabled) {
			return true;
		}
		if(!this.getOpen()) {
			this.setActive(true);
			enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.drawer));
		} else {
			this.setActive(false);
		}
		return true;
	},
	openChanged: function() {
	    this.setArrow(this.open);
	    this.inherited(arguments);
	},
	setArrow: function(open) {
	    this.$.arrow.addRemoveClass('up', open);
	    this.$.arrow.addRemoveClass('down', !open);
	}
});