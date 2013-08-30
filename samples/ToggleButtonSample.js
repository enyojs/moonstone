enyo.kind({
	name: "moon.sample.ToggleButtonSample",
	kind: enyo.FittableRows,
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, classes: "enyo-fill", components: [
			{classes: "moon-toggle-button-sample-wrapper", components: [
				{kind: "moon.Divider", content: "Focus Buttons:"},
				{kind: "moon.ToggleButton", content: "B", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", content: "Button", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", disabled: true, content: "Disabled Button", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", content: "Looooooooooooooooong Button", ontap: "buttonTapped"},
				{tag: "br"},
				{tag: "br"},
				{kind: "moon.Divider", content: "Themed Buttons:"},
				{kind: "moon.ToggleButton", classes: "moon-dark-gray", content: "Dark", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", classes: "moon-light-gray", content: "Light", ontap: "buttonTapped"},
				{tag: "br"},
				{tag: "br"},
				{kind: "moon.Divider", content: "Captioned Buttons:"},
				{kind: "moon.CaptionDecorator", side: "top", content: "Pow", components: [
					{kind: "moon.ToggleButton", content: "A", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "right", content: "Boom", components: [
					{kind: "moon.ToggleButton", content: "B", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "bottom", content: "Crash", components: [
					{kind: "moon.ToggleButton", content: "C", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "left", content: "Bang", components: [
					{kind: "moon.ToggleButton", content: "D", ontap: "buttonTapped"}
				]},
				{tag: "br"},
				{tag: "br"},
				{kind: "moon.Divider", content: "Grouped Buttons:"},
				{kind: "enyo.Group", classes: "moon-toggle-button-sample-group", components: [
					{kind: "moon.ToggleButton", content: "Apple", ontap: "buttonTapped"},
					{kind: "moon.ToggleButton", content: "Banana", ontap: "buttonTapped"},
					{kind: "moon.ToggleButton", content: "Saskatoonberry", ontap: "buttonTapped"}
				]}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{name: "console", classes: "moon-toggle-button-sample-console"}
	],
	buttonTapped: function(inSender, inEvent) {
		var str = '"'+inSender.content+'" ';
		str += inSender.getActive() ? 'selected' : 'unselected';
		str += '.';
		this.$.console.setContent(str);
	}
});