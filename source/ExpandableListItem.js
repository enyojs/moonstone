/**
	_moon.ExpandableListItem_, which extends [moon.Item](#moon.Item), displays a
	header while also allowing additional content to be stored in an
	[enyo.Drawer](#enyo.Drawer). When the header is selected, the drawer opens
	below. To close the drawer, tap on the header text or navigate (via 5-way)
	back to the top of the drawer.

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

	When multiple ExpandableListItems are used in a group, only one may be open at
	a given time.

		{kind: "enyo.Group", highlander: true, components: [
			{kind: "moon.ExpandableListItem",  open: true,
				content: "This is a grouped ExpandableListItem", components: [
					{content: "Item One"},
					{content: "Item Two"}
				]
			},
			{kind: "moon.ExpandableListItem",
				content: "This is another grouped ExpandableListItem", components: [
					{content: "Item Three"},
					{content: "Item Four"}
				]
			},
			{kind: "moon.ExpandableListItem",
				content: "This is yet another grouped ExpandableListItem", components: [
					{content: "Item Five"},
					{content: "Item Six"}
				]
			}
		]}
*/
enyo.kind({
	name: "moon.ExpandableListItem",
	//* @public
	published: {
		/**
			If true, the drawer automatically closes when the user navigates to the
			top of the control. If false (the default), the user must select/tap the
			header to close the drawer.
		*/
		autoCollapse: false,
		/**
			If true, the drawer is expanded, showing this item's contents. Use this
			property (rather than _active_) to set the item's initial state.
		*/
		open: false,
		/**
			Boolean that reflects the value of the _open_ property; it is used to
			support the _enyo.Group_ API for grouping a set of ExpandableListItems in
			which only one is expanded at a time. Note that the _open_ property (not
			the _active_ property) controls the initial state of the picker.
		*/
		active: false,
		/**
			If true, the user is prevented from moving spotlight past the bottom of
			the drawer (when open) using five-way controls
		*/
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
		onDrawerAnimationEnd: "drawerAnimationEnd"
	},
	components: [
		// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
		{name: "headerContainer", classes: "moon-expandable-picker-header", components: [
			{name: "header", kind: "moon.Item", onSpotlightFocus: "headerFocus", ontap: "expandContract"}
		]},
		{name: "drawer", kind: "enyo.Drawer", resizeContainer:false, classes: "moon-expandable-list-item-client", components: [
			{name: "client", kind: "Group", tag: null}
		]}
	],
	bindings: [
		{from: ".allowHtml", to: ".$.header.allowHtml"},
		{from: ".disabled", to: ".$.header.disabled"}
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.openChanged();
		this.setActive(this.open);
		this.disabledChanged();
	},
	//* Facade for header content
	contentChanged: function() {
		this.$.header.setContent(this.getContent());
	},
	//* Facade for drawer
	openChanged: function() {
		var open = this.getOpen();
		this.addRemoveClass("open", open);
		this.$.drawer.setOpen(open);
		this.$.drawer.spotlightDisabled = !open;
		this.setActive(open);
	},
	disabledChanged: function() {
		var disabled = this.getDisabled();

		this.addRemoveClass("disabled", disabled);
		if (disabled) {
			this.setActive(false);
		}
	},
	activeChanged: function() {
		this.bubble("onActivate", {allowHighlanderDeactivate:true});
		this.setOpen(this.active);
	},
	//* If closed, opens drawer and highlights first spottable child.
	expandContract: function(inSender, inEvent) {
		if (this.disabled) {
			return true;
		}

		this.toggleActive();

		if (this.getActive() && !enyo.Spotlight.getPointerMode()) {
			enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.drawer));
		}
	},
	toggleActive: function() {
		if (this.getOpen()) {
			this.setActive(false);
		} else {
			this.setActive(true);
		}
	},
	//* If drawer is currently open, and event was sent via keypress (i.e., it has a direction), process header focus
	headerFocus: function(inSender, inEvent) {
		var direction = inEvent && inEvent.dir;

		if (this.getOpen() && this.getAutoCollapse() && direction === "UP") {
			this.setActive(false);
		}

		if (inEvent.originator === this.$.header) {
			this.bubble("onRequestScrollIntoView");
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
		this.bubble("onRequestScrollIntoView", {scrollInPointerMode: true});
		return true;
	}
});
