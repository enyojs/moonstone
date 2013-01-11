enyo.kind({
	name: "moon.ExpandablePicker",
	kind: "moon.ExpandableListItem",
	published: {
		highlander: false
	},
	defaultKind: "moon.LabeledCheckbox",
	components: [
		{name: "header", kind: "moon.Item", ontap: "headerTapped", classes: "moon-expandable-picker-header", style:"-webkit-transition: all 0.1s linear"},
		{name: "group", kind: "Group", components: [
			{name: "client", kind: "moon.Drawer"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.highlanderChanged();
		this.log(this.components);
	},
	highlanderChanged: function() {
		this.$.group.setHighlander(this.highlander);
	},
	openChanged: function() {
		this.inherited(arguments);
		if(this.$.client.getOpen()) {
			this.$.header.addClass("open");
			this.$.header.spotlight = false;
			enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.client));
		} else {
			this.$.header.removeClass("open");
			this.$.header.spotlight = true;
		}
	}
});
