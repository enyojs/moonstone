enyo.kind({
	name: "moon.sample.ToggleButtonSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-toggle-button-sample-wrapper", components: [
				{kind: "moon.Divider", content: "Toggle Buttons:"},
				{kind: "moon.ToggleButton", toggleOnLabel: "wifi is on", toggleOffLabel: "wifi is off", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", contentUpperCase : false, toggleOnLabel: "Internet connected", toggleOffLabel: "Internet disconnected", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", disabled: true, toggleOnLabel: "Disabled Active Button", toggleOffLabel: "Disabled Inactive Button", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", disabled: true, value: true, content: "Disabled Active Button", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", content: "Set-top box", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", small: true, content: "Small Toggle", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", small: true, disabled: true, toggleOnLabel: "Small Disabled Active Button", toggleOffLabel: "Small Disabled Inactive Button", ontap: "buttonTapped"},
				{classes: "moon-1v"},
				{kind: "moon.Divider", content: "Toggle Buttons are set on programmically by default:"},
				{kind: "moon.ToggleButton", value: true, toggleOnLabel: "English", toggleOffLabel: "Spanish", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", value: true, content: "Notifications", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", small: true, value: true, content: "Small Button", ontap: "buttonTapped"},
				{classes: "moon-1v"},
				{kind: "moon.Divider", content: "Captioned Buttons:"},
				{kind: "moon.CaptionDecorator", side: "top", content: "Pow", components: [
					{kind: "moon.ToggleButton", toggleOnLabel: "is A", toggleOffLabel: "not A", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "right", content: "Boom", components: [
					{kind: "moon.ToggleButton", toggleOnLabel: "is B", toggleOffLabel: "not B", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "bottom", content: "Crash", components: [
					{kind: "moon.ToggleButton", toggleOnLabel: "is C", toggleOffLabel: "not C", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "left", content: "Bang", components: [
					{kind: "moon.ToggleButton", toggleOnLabel: "is D", toggleOffLabel: "not D", ontap: "buttonTapped"}
				]},
				{classes: "moon-1v"},
				{kind: "moon.Divider", content: "Grouped Buttons:"},
				{kind: "enyo.Group", classes: "moon-toggle-button-sample-group", components: [
					{kind: "moon.ToggleButton", content: "Apple", ontap: "buttonTapped"},
					{kind: "moon.ToggleButton", toggleOnLabel: "Ripened Banana", toggleOffLabel: "Raw Banana", value: true, ontap: "buttonTapped"},
					{kind: "moon.ToggleButton", toggleOnLabel: "Sweet Saskatoonberry", toggleOffLabel: "Bitter Saskatoonberry", ontap: "buttonTapped"},
					{kind: "moon.ToggleButton", small: true, toggleOnLabel: "Blue Blueberry", toggleOffLabel: "Red Raspberry", ontap: "buttonTapped"}
				]}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{kind: "moon.BodyText", name: "notice", content: "No action yet."}
	],
	buttonTapped: function(inSender, inEvent) {
		var labeltext = inSender.contentUpperCase ? enyo.toUpperCase(inSender.getContent()) : inSender.getContent();
		var postString = inSender.value ? ' is selected' : ' is unselected';
		if (!inSender.toggleOnLabel || !inSender.toggleOffLabel) {
			labeltext='"'+labeltext+'"' + postString;
		} else {
			labeltext='"'+labeltext+'" selected.';
		}
		this.$.notice.setContent(labeltext);
	}
});
