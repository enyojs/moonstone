enyo.kind({
	name: "moon.ExpandableListItem",
	published: {
		open: false
	},
	defaultKind: "moon.Item",
	components: [
		{name: "header", kind: "moon.Item", ontap: "headerTapped"},
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
		this.log(this.open);
		this.$.client.setOpen(this.getOpen());
	},
	headerTapped: function(inSender, inEvent) {
		this.setOpen(!this.getOpen());
	}
});
