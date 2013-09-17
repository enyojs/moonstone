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
	published: {
		/**
			If true, the drawer automatically closes when the user navigates to the
			top of the control. If false, the user must select/tap the header to close
			the drawer.
		*/
		autoCollapse: false,
		/**
			If true, the drawer is expanded, showing this item's contents. Use this property
			to set the initial state of the item (rather than active).
		*/
		open: false,
		//* True if the item is currently selected
		active: false,
		//* If true, the user is prevented from spotting off the bottom of the drawer (when open) using five-way controls
		lockBottom: false,
		//* When true, item is shown as disabled and does not generate tap events
		disabled: false
	},
	//* @protected
	classes: "moon-expandable-list-item",
	spotlight: false,
	defaultKind: "moon.Item",
	handlers: {
		onSpotlightDown: "spotlightDown",
		onSpotlightFocused: "spotlightFocused",
		onDrawerAnimationEnd: "drawerAnimationEnd"
	},
	components: [
		{name: "headerWrapper", kind: "enyo.Control", spotlight: true, classes: "moon-expandable-list-item-header-wrapper",
			onSpotlightFocus: "headerFocus", ontap: "expandContract", components: [
			{name: "header", kind: "moon.Item", spotlight: false, classes: "moon-expandable-list-item-header"}
		]},
		{name: "drawer", kind: "enyo.Drawer", components: [
			{name: "client", kind: "Group", classes: "moon-expandable-list-item-client"}
		]}
	],
	bindings: [
		{from: ".disabled", to: ".$.headerWrapper.disabled"}
	],

	//* @protected

	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			enyo.dom.accelerate(this, "auto");
			this.openChanged();
			this.setActive(this.open);
			this.disabledChanged();
		};
	}),
	//* Facade for header content
	contentChanged: function() {
		this.$.header.setContent(this.getContent());
	},
	//* Facade for drawer
	openChanged: function() {
		var open = this.getOpen();
		this.$.drawer.setOpen(open);
		this.addRemoveClass("open", open);
	},
	disabledChanged: function() {
		var disabled = this.getDisabled();

		this.addRemoveClass("disabled", disabled);
		if (disabled) {
			this.setOpen(false);
		}
	},
	activeChanged: function() {
		this.bubble("onActivate");
		this.setOpen(this.active);
	},
	//* If closed, opens drawer and highlights first spottable child.
	expandContract: function(inSender, inEvent) {
		if (this.disabled) {
			return true;
		}

		this.toggleActive();
		
		if (this.getActive()) {
			enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.drawer));
		}
	},
	toggleActive: function() {
		if (this.getOpen()) {
			this.setActive(false);
		} else {
			this.setActive(true);
			enyo.Spotlight.unspot();
		}
	},
	//* If drawer is currently open, and event was sent via keypress (i.e., it has a direction), process header focus
	headerFocus: function(inSender, inEvent) {
		var direction = inEvent && inEvent.dir;
		if (this.getOpen() && this.getAutoCollapse() && direction === "UP") {
			this.setActive(false);
		}
	},
	//* Check for the last item in the client area, and prevent 5-way focus movement below it, per UX specs
	spotlightDown: function(inSender, inEvent) {
		var children = enyo.Spotlight.getChildren(this.$.client);
		if (this.getLockBottom() && this.getOpen() && children.length && inEvent.originator == children[children.length - 1]) {
			return true;
		}
	},
	drawerAnimationEnd: function() {
		this.bubble("onRequestScrollIntoView", {side: "top"});
		return true;
	},
	spotlightFocused: function(inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble("onRequestScrollIntoView", {side: "top"});
		}
	},
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

