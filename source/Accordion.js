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
		{name: "header", kind: "moon.Item", classes: "moon-accordion-header", spotlight: true,
			ontap: "expandContract", onSpotlightSelect: "expandContract"},
		{name:"arrow", classes:"moon-accordion-arrow"},
		{name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep", components: [
			{name: "client", kind: "Group", classes: "moon-accordion-client"}
		]}
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
			this.active = false;
			this.setOpen(false);
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