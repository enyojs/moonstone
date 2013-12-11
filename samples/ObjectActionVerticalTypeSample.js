enyo.kind({
	name: "moon.sample.ObjectActionVerticalTypeSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	handlers: {
		ontap: "ontap"
	},
	components: [
		{kind: "moon.Divider", content: "Object Action: vertical Type Sample"},
		{kind: "moon.Scroller", fit:true, components: [
			{kind: "Repeater", count:20, classes:"moon-hspacing", onSetupItem:"setupItem", components: [
				{
					kind: "moon.ObjectActionDecorator", 
					orientation: "vertical",
					components: [
						{kind: "moon.Item", components: [
							{name: 'image', kind: 'enyo.Image'}
						]}
					],
					actionComponents: [
						{kind: "moon.Button", name: "Play", small: true, content: "PLAY"},
						{kind: "moon.Button", name: "Favorite", small: true, content: "FAVORITE"},
						{kind: "moon.Button", name: "Share", small: true, content: "SHARE"}
					]
				}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{kind: "moon.BodyText", name: "result", content: "No item tapped yet."}
	],
	setupItem: function(inSender, inEvent) {
		inEvent.item.$.image.setSrc("http://placehold.it/200x200/" + Math.floor(Math.random()*0x1000000).toString(16) + "/ffffff&text=Image " + inEvent.index);
	},
	ontap: function(inSender, inEvent) {
		this.$.result.setContent(inEvent.originator.name + " tapped.");
	}
});


