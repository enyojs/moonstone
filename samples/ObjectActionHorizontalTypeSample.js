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
			{kind: "Repeater", count:20,  xclasses:"moon-5h", components: [
				{kind: "moon.ObjectActionDecorator", orientation: "horizontal", components: [
					{kind: "moon.ImageItem", source: "assets/default-music.png", text:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
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


