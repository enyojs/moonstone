enyo.kind({
	name: "moon.sample.ToggleButtonSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-toggle-button-sample-wrapper", components: [
				{kind: "moon.Divider", content: "Toggle Buttons:"},
				{kind: "moon.ToggleButton", content: "B", value: true, ontap: "buttonTapped"},
				{name: "button", kind: "moon.ToggleButton", contentUpperCase : false, content: "Button", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", disabled: true, content: "Disabled Button", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", content: "Looooooooooooooooong Button", ontap: "buttonTapped"},
				{classes: "moon-1v"},
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
				{classes: "moon-1v"},
				{kind: "moon.Divider", content: "Grouped Buttons:"},
				{kind: "enyo.Group", classes: "moon-toggle-button-sample-group", components: [
					{kind: "moon.ToggleButton", content: "Apple", ontap: "buttonTapped"},
					{kind: "moon.ToggleButton", content: "Banana", value: true, ontap: "buttonTapped"},
					{kind: "moon.ToggleButton", content: "Saskatoonberry", ontap: "buttonTapped"}
				]}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{kind: "moon.BodyText", name: "console", content: "No action yet."}
	],
	buttonTapped: function(inSender, inEvent) {
		var str = '"'+inSender.content+'" ';
		str += inSender.getActive() ? 'selected' : 'unselected';
		str += '.';
		this.$.console.setContent(str);
	}
});