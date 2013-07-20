/**
	_moon.ExpandableListItem_, which extends <a href="#moon.Item">moon.Item</a>,
	displays a header while also allowing additional content to be stored in an
	<a href="#enyo.Drawer">enyo.Drawer</a>. When the header is selected, the
	drawer opens below. To close the drawer, tap on the header text or navigate
	(via 5-way) back to the top of the drawer.

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

	When multiple ExpandableListItems are used in a group, only one may be open at a given
	time.

		{kind: "Group", highlander: true, components: [
			{kind: "moon.ExpandableListItem",  active: true, content: "This is a grouped ExpandableListItem", components: [
				{content: "Item One"},
				{content: "Item Two"}
			]},
			{kind: "moon.ExpandableListItem", content: "This is another grouped ExpandableListItem", components: [
				{content: "Item Three"},
				{content: "Item Four"}
			]},
			{kind: "moon.ExpandableListItem", content: "This is yet another grouped ExpandableListItem", components: [
				{content: "Item Five"},
				{content: "Item Six"}
			]}
		]}
*/
enyo.kind({
	name: "moon.ExpandableListItem",
	kind: "moon.Item",
	published: {
		//* If true, the drawer is expanded, showing this item's contents.  Use this property
		//* to set the initial state of the item (rather than active).
		open: false,
		//* True if the item is currently selected
		active: false
	},
	//* @protected
	classes: "moon-expandable-list-item",
	spotlight: false,
	defaultKind: "moon.Item",
	handlers: {
		onSpotlightSelect: "spotlightSelect",
		onSpotlightDown: "spotlightDown"
	},
	components: [
		{name: "header", kind: "moon.Item", classes: "moon-expandable-list-item-header", spotlight: true,
			onSpotlightFocus: "headerFocus", ontap: "expandContract", onSpotlightSelect: "expandContract"
		},
		{name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep", components: [
			{name: "client", kind: "Group"}
		]}
	],
	//* Used to prevent events from firing during initialization
	isRendered: false,
	create: function() {
		this.inherited(arguments);
		this.openChanged();
	},
	initComponents: function() {
		this.inherited(arguments);
		if (this.$.marqueeText) {
			this.$.marqueeText.destroy();	// Marquee on header
		}
	},
	rendered: function() {
		this.inherited(arguments);
		this.setActive(this.open);
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
	activeChanged: function() {
		this.bubble("onActivate");
		this.setOpen(this.active);
	},
	//* Calls _expandContract()_ if _select_ event came from header.
	spotlightSelect: function(inSender, inEvent) {
		if(inSender === this) {
			this.expandContract(inSender, inEvent);
		}
	},
	//* If closed, opens drawer and highlights first spottable child.
	expandContract: function(inSender, inEvent) {
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
	//* Closes drawer if drawer is currently open,
	//* and event was sent via keypress (i.e., it has a direction).
	headerFocus: function(inSender, inEvent) {
		if(this.getOpen() && inEvent && inEvent.dir && inEvent.dir === "UP") {
			this.setActive(false);
			enyo.Spotlight.spot(this);
			this.$.header.removeClass("spotlight");	//<--- TODO - why do we need this here?
			return true;
		} else if(!this.getOpen()) {
			enyo.Spotlight.spot(this);
		}
	},
	//* Check for the last item in the client area, and prevent 5-way focus movement
	//* below it, per UX specs
	spotlightDown: function(inSender, inEvent) {
		var c = enyo.Spotlight.getChildren(this.$.client);
		if (c.length && inEvent.originator == c[c.length-1]) {
			return true;
		}
	},
	/**
		Bubbles the _requestScrollIntoView_ event every time the drawer animates.
		This makes for a smoother expansion animation when inside of a scroller, as
		the height of the scroller changes with the drawer's expansion.
	*/
	drawerAnimationStep: function() {
		this.bubble("onRequestScrollIntoView");
	},
	//*@protected
	_marqueeSpotlightFocus: function(inSender, inEvent) {
		if (inSender === this) {
			this.$.header.startMarquee();
		}
	},
	_marqueeSpotlightBlur: function(inSender, inEvent) {
		if (inSender === this) {
			this.$.header.stopMarquee();
		}
	}
});
