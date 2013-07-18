enyo.kind({
	name: "moon.sample.ObjectActionsSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	handlers: {
		ontap: "ontap"
	},
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Object Action: vertical Type Sample"},
		{kind: "Repeater", fit: true, count:10, components: [
			{
				kind: "moon.ObjectActionDecorator", 
				classes: "moon-objaction-v-sample",
				type: "vertical",
				components: [
					{kind: "moon.Item", spotlightPosition: "bottom", components: [
						{name: 'image', kind: 'enyo.Image', src: "assets/default-music.png"}
					]}
				],
				actionComponents: [
					{kind: "moon.Button", name: "Play", small: true, content: "PLAY", classes: "moon-objaction-v-button-sample"},
					{kind: "moon.Button", name: "Favorite", small: true, content: "FAVORITE", classes: "moon-objaction-v-button-sample"},
					{kind: "moon.Button", name: "Share", small: true, content: "SHARE", classes: "moon-objaction-v-button-sample"}
				]
			}
		]},
		{kind: "moon.Divider", content: "Result"},
		{name: "result", allowHtml: true, content: "No item tapped yet."}
	],
	ontap: function(inSender, inEvent) {
		this.$.result.setContent(inEvent.originator.name + " tapped.");
	}
});


