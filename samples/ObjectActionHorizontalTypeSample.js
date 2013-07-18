enyo.kind({
	name: "moon.sample.ObjectActionsSample",
	classes: "moon enyo-unselectable enyo-fit",
	handlers: {
		ontap: "ontap"
	},
	kind: "FittableRows",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Object Action: horizontal Type Sample"},
		{kind: 'moon.Scroller', fit: true, components: [
			{kind: "Repeater", count:20, classes: "moon-objaction-repeater-sample", components: [
				{kind: "moon.ObjectActionDecorator", type: "horizontal", components: [
					{kind: "moon.Item", style: "margin-bottom:0;", components:[
						{name: 'image', kind: 'enyo.Image', src: "assets/default-music.png"}
					]}
				], actionComponents: [
					{kind: "moon.IconButton", name: "Icon1"},
					{kind: "moon.IconButton", name: "Icon2"},
					{kind: "moon.IconButton", name: "Icon3"}
				]}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{name: "result", allowHtml: true, content: "No item tapped yet."}
	],
	ontap: function (inSender, inEvent) {
		this.$.result.setContent(inEvent.originator.name + " tapped.");
	}
});


