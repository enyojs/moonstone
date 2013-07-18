/**
	_moon.Accordion_ is a <a href="#moon.ExpandableListItem">moon.ExpandableListItem</a>
	with an arrow button to the right of the header and additional margin space to
	the left of the item list. 

	To open or close the drawer, tap on the header text or navigate (via 5-way)
	back to the top of the drawer.

	The control's child components may be of any kind; by default, they are
	instances of <a href="#moon.Item">moon.Item</a>.

		{kind: "moon.Accordion", content: "This is an accordion", components: [
			{content: "Item One"},
			{content: "Item Two"}
		]},
		{kind: "moon.Accordion", content: "This is another accordion", components: [
			{content: "Item Three"},
			{content: "Item Four"}
		]}

	When multiple Accordions are used in a group, only one may be open at a given
	time.

		{kind: "Group", highlander: true, components: [
			{kind: "moon.Accordion",  active: true, content: "This is a grouped accordion", components: [
				{content: "Item One"},
				{content: "Item Two"}
			]},
			{kind: "moon.Accordion", content: "This is another grouped accordion", components: [
				{content: "Item Three"},
				{content: "Item Four"}
			]},
			{kind: "moon.Accordion", content: "This is yet another grouped accordion", components: [
				{content: "Item Five"},
				{content: "Item Six"}
			]}
		]}
*/
enyo.kind({
	name: "moon.Accordion",
	kind: "moon.ExpandableListItem",
	classes: "moon-accordion",
	published: {
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
		{name:"arrow", classes:"moon-accordion-arrow", spotlight: false},
		{name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep", components: [
			{name: "client", kind: "Group", classes: "moon-accordion-client"}
		]}
	],
	//* @protected
	rendered: function() {
		this.inherited(arguments);
		this.cacheWidth();	// Fixme: Need to move this to FontLoaded event to calculate exact width.
	},
	cacheWidth: function() {
		this._headerWidth = this.$.header.getBounds().width;
		this._arrowWidth = this.$.arrow.getBounds().width;
		this._marqueeWidth = this.$.header.$.marqueeText.hasNode().scrollWidth;
		this._headerPaddingWidth =  parseInt(this.$.header.getComputedStyleValue("margin-right"));
		this.resizeHandler();
	},
	openChanged: function() {
		this.setArrow(this.open);
		this.inherited(arguments);
	},
	setArrow: function(open) {
		this.$.arrow.addRemoveClass('up', open);
		this.$.arrow.addRemoveClass('down', !open);
	},
	resizeHandler: function(inSender, inEvent) {
		this.inherited(arguments);
		var computedWidth = parseInt(this.getComputedStyleValue("width"));

		if (this._marqueeWidth < computedWidth - this._headerPaddingWidth - this._arrowWidth) {
			newHeaderWidth = this._marqueeWidth;
		} else {
			newHeaderWidth = computedWidth - this._headerPaddingWidth - this._arrowWidth;
		}
		
		this.$.header.applyStyle("width", newHeaderWidth + "px");
		return true;
	},
	// Override default spotlight down behavior of ExpandableListItem which prevents
	// focusing off of the last control
	spotlightDown: enyo.nop
});