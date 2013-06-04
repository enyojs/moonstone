enyo.kind({
	name: "moon.sample.panel.TwoPanelsUpSample",
	components: [
		{kind: "enyo.Spotlight"},
		{
			name: "panels", 
			kind: "moon.Panels", 
			arrangerKind: "moon.LeanForwardArranger", 
			classes: "enyo-fit",
			components: [
				{title: "Menu", components: [
					{kind: "moon.Item", content: "Music", ontap: "onTap"},
					{kind: "moon.Item", content: "Movie", ontap: "onTap"},
					{kind: "moon.Item", content: "Photo", ontap: "onTap"}
				]}
			]
		}
	],
	menuMap: {
		"Music": {
			title: "Music Browser", 
			joinToPrev: true, 
			components: [
				{kind: "moon.Item", content: "Music Item One"},
				{kind: "moon.Item", content: "Music Item Two"},
				{kind: "moon.Item", content: "Music Item Three"},
				{kind: "moon.Item", content: "Music Item Four"}
			]
		},
		"Movie": {
			title: "Movie Browser", 
			joinToPrev: true, 
			components: [
				{kind: "moon.Item", content: "Movie Item One"},
				{kind: "moon.Item", content: "Movie Item Two"},
				{kind: "moon.Item", content: "Movie Item Three"},
				{kind: "moon.Item", content: "Movie Item Four"}
			]
		},
		"Photo": {
			title: "Photo Browser", 
			joinToPrev: true, 
			components: [
				{kind: "moon.Item", content: "Photo Item One"},
				{kind: "moon.Item", content: "Photo Item Two"},
				{kind: "moon.Item", content: "Photo Item Three"},
				{kind: "moon.Item", content: "Photo Item Four"}
			]
		},
	},
	create: function() {
		this.inherited(arguments);
		this.$.panels.replaceNextPanel(this.menuMap["Music"]);
	},
	onTap: function(inSender, inEvent) {
		var nextPanelDef = this.menuMap[inEvent.originator.content];
		if (nextPanelDef) {
			this.$.panels.replaceNextPanel(nextPanelDef);
			this.$.panels.next();
		}
	}
});