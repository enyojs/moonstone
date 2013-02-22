enyo.kind({
	name: "moon.sample.ButtonSample",
	fit: true,
	classes: "moon enyo-unselectable moon-button-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{classes: "moon-button-sample-wrapper", components: [
			{kind: "moon.Divider", content: "Focus Buttons:"},
			{kind: "moon.Button", content: "B", ontap: "buttonTapped"},
			{kind: "moon.Button", content: "Button", ontap: "buttonTapped"},
			{kind: "moon.Button", disabled: true, content: "Disabled Button", ontap: "buttonTapped"},
			{kind: "moon.Button", content: "Looooooooooooooooong Button", ontap: "buttonTapped"},
			{tag: "br"},
			{tag: "br"},
			{kind: "moon.Divider", content: "Captioned Buttons:"},
			{kind: "moon.CaptionDecorator", side: "top", content: "Pow", components: [
				{kind: "moon.Button", content: "A", ontap: "buttonTapped"},
			]},
			{kind: "moon.CaptionDecorator", side: "right", content: "Boom", components: [
				{kind: "moon.Button", content: "B", ontap: "buttonTapped"},
			]},
			{kind: "moon.CaptionDecorator", side: "bottom", content: "Crash", components: [
				{kind: "moon.Button", content: "C", ontap: "buttonTapped"},
			]},
			{kind: "moon.CaptionDecorator", side: "left", content: "Bang", components: [
				{kind: "moon.Button", content: "D", ontap: "buttonTapped"},
			]},
			{tag: "br"},
			{tag: "br"},
			{kind: "moon.Divider", content: "Tab Buttons:"},
			{kind: "enyo.Group", classes: "moon-button-sample-group", components: [
				{kind: "moon.Button", content: "Apple", ontap: "buttonTapped"},
				{kind: "moon.Button", content: "Banana", ontap: "buttonTapped"},
				{kind: "moon.Button", content: "Saskatoonberry", ontap: "buttonTapped"}
			]},
		]},
		{name: "console", classes: "moon-button-sample-console"}
	],
	buttonTapped: function(inSender, inEvent) {
		var str = '"'+inSender.content+'" ';
		str += inSender.getActive() ? 'selected' : 'unselected';
		str += '.';
		this.$.console.setContent(str);
	}
});