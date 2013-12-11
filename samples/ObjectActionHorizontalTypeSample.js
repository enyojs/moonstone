enyo.kind({
	name: "moon.sample.ObjectActionHorizontalTypeSample",
	classes: "moon enyo-unselectable enyo-fit",
	handlers: {
		ontap: "ontap"
	},
	kind: "FittableRows",
	components: [
		{kind: "moon.Divider", content: "Object Action: horizontal Type Sample"},
		{kind: 'moon.Scroller', fit: true, components: [
			{kind: "Repeater", count:20, onSetupItem:"setupItem", components: [
				{kind: "moon.ObjectActionDecorator", orientation: "horizontal", components: [
					{kind: "moon.ImageItem", source: "assets/default-music.png"}
				], actionComponents: [
					{kind: "moon.IconButton", name: "Icon1"},
					{kind: "moon.IconButton", name: "Icon2"},
					{kind: "moon.IconButton", name: "Icon3"}
				]}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{kind: "moon.BodyText", name: "result", content: "No item tapped yet."}
	],
	setupItem: function(inSender, inEvent) {
		inEvent.item.$.imageItem.setSource("http://placehold.it/200x300/" + Math.floor(Math.random()*0x1000000).toString(16) + "/ffffff&text=Image " + inEvent.index);
		inEvent.item.$.imageItem.setText("Item " + inEvent.index + ": Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
	},
	ontap: function (inSender, inEvent) {
		this.$.result.setContent(inEvent.originator.name + " tapped.");
	}
});


