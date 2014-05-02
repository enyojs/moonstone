enyo.kind({
	name: "moon.sample.ToggleButtonSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-toggle-button-sample-wrapper", components: [
				{kind: "moon.Divider", content: "Toggle Buttons:"},
				{kind: "moon.ToggleButton", onLabel: "wifi is On", offLabel: "wifi is off", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", contentUpperCase : false, onLabel: "Internet connected", offLabel: "Internet disconnected", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", disabled: true, onLabel: "Disabled Button Activated Value", offLabel:"Disabled Button Deactivated Value", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", onLabel: "You have set-top box", offLabel: "You do not have set-top box", ontap: "buttonTapped"},
				{classes: "moon-1v"},
				{kind: "moon.Divider", content: "Toggle Buttons are set on programmically by default:"},
				{kind: "moon.ToggleButton", value:true, onLabel: "English", offLabel: "Spanish", ontap: "buttonTapped"},
				{kind: "moon.ToggleButton", value:true, onLabel: "Display Notifications", offLabel: "No Notifications", ontap: "buttonTapped"},
				{classes: "moon-1v"},
				{kind: "moon.Divider", content: "Captioned Buttons:"},
				{kind: "moon.CaptionDecorator", side: "top", content: "Pow", components: [
					{kind: "moon.ToggleButton", onLabel: "is A", offLabel: "not A", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "right", content: "Boom", components: [
					{kind: "moon.ToggleButton", onLabel: "is B", offLabel: "not B", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "bottom", content: "Crash", components: [
					{kind: "moon.ToggleButton", onLabel: "is C", offLabel: "not C", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "left", content: "Bang", components: [
					{kind: "moon.ToggleButton", onLabel: "is D", offLabel: "not D", ontap: "buttonTapped"}
				]},
				{classes: "moon-1v"},
				{kind: "moon.Divider", content: "Grouped Buttons:"},
				{kind: "enyo.Group", classes: "moon-toggle-button-sample-group", components: [
					{kind: "moon.ToggleButton", onLabel: "Apple Good", offLabel: "Apple Bad", ontap: "buttonTapped"},
					{kind: "moon.ToggleButton", onLabel: "Banana Ripen", offLabel: "Banana Green", ontap: "buttonTapped"},
					{kind: "moon.ToggleButton", onLabel: "Saskatoonberry Sweet", offLabel: "Saskatoonberry Bitter", ontap: "buttonTapped"}
				]}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{kind: "moon.BodyText", name: "notice", content: "No action yet."}
	],
	buttonTapped: function(inSender, inEvent) {
		var labeltext=inSender.contentUpperCase?enyo.toUpperCase(inSender.getContent()):inSender.getContent();
		labeltext='"'+labeltext+'" selected.';
		this.$.notice.setContent(labeltext);
	}
});
