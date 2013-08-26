enyo.kind({
	name: "moon.sample.ObjectActionVerticalTypeSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	handlers: {
		ontap: "ontap"
	},
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Object Action: vertical Type Sample"},
		{kind: "moon.Scroller", fit:true, components: [
			{kind: "Repeater", count:20, classes:"moon-hspacing", components: [
				{
					kind: "moon.ObjectActionDecorator", 
					orientation: "vertical",
					components: [
						{kind: "moon.Item", components: [
							{name: 'image', kind: 'enyo.Image', src: "assets/default-music.png"}
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
		{name: "result", allowHtml: true, content: "No item tapped yet."}
	],
	ontap: function(inSender, inEvent) {
		this.$.result.setContent(inEvent.originator.name + " tapped.");
	}
});


