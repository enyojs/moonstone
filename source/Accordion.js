/**
	_moon.Accordion_ is an <a href="#moon.ExpandableListItem">moon.ExpandableListItem</a> with 
	arrow button on the right side of header and additional margin on the left of item list. 

	To open/close drawer, tap on the header text or navigate (via 5-way) back to the top of the drawer.

	The control's child components may be of any kind; by default, they are
	instances of _moon.Item_.

        {kind: "moon.Accordion", content: "This is an accordion", components: [
            {content: "Item One"},
            {content: "Item Two"}
        ]},
        {kind: "moon.Accordion", content: "This is another accordion", components: [
            {content: "Item Three"},
            {content: "Item Four"}
        ]}

	In case of accordion is used in group, then only one accordion can be opened at the same time.

		{kind:"Group", highlander:true, components: [
			{kind: "moon.Accordion",  active: true, content: "This is a grouped accordion", components: [
				{content: "Item One"},
				{content: "Item Two"}
			]},
			{kind: "moon.Accordion", content: "This is another grouped accordion", components: [
				{content: "Item Three"},
				{content: "Item Four"}
			]},
			{kind: "moon.Accordion", content: "This is another grouped accordion", components: [
				{content: "Item Five"},
				{content: "Item Six"}
			]},
		]}
*/
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