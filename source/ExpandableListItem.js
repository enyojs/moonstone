enyo.kind({
	name: "moon.ExpandableListItem",
	published: {
		open: false
	},
	spotlight: true,
	classes: "moon-expandable-list-item",
	defaultKind: "moon.Item",
	handlers: {
		onSpotlightSelect: "spotSelect",
		ontap: "spotSelect"
	},
	components: [
		{name: "header", kind: "moon.Item", classes: "moon-expandable-list-item-header", spotlight: false},
		{name: "client", kind: "moon.Drawer"}
	],
	create: function() {
		this.inherited(arguments);
		this.openChanged();
	},
	contentChanged: function() {
		this.$.header.setContent(this.getContent());
	},
	openChanged: function() {
		var open = this.getOpen();
		this.$.client.setOpen(open);
		if(open) {
			this.addClass("open");
		} else {
			this.removeClass("open");
		}
	},
	spotSelect: function(inSender, inEvent) {
		//	If closed - open drawer and highlight first spottable child
		if(!this.getOpen()) {
			this.setOpen(true);
			enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.client));
			return true;
		//  If open - only close if originator of event was header or this
		} else if(inEvent.originator === this.$.header || inEvent.originator === this) {
			this.setOpen(false);
			return true
		}
	}
});
