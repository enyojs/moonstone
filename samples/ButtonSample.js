enyo.kind({
	name: "moon.sample.ButtonSample",
	fit: true,
	kind:"FittableRows",
	classes: "moon enyo-unselectable moon-button-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{name: 'scroller', kind: 'moon.Scroller', fit: true, touch: true, components: [
			{classes: "moon-button-sample-wrapper", components: [
				{kind: "moon.Divider", content: "Focus Buttons:"},
				{kind: "moon.Button", content: "B", ontap: "buttonTapped"},
				{kind: "moon.Button", content: "Button", ontap: "buttonTapped"},
				{kind: "moon.Button", disabled: true, content: "Disabled Button", ontap: "buttonTapped"},
				{kind: "moon.Button", content: "Looooooooooooooooong Button", ontap: "buttonTapped"},
				{tag: "br"},
				{tag: "br"},
				
				{kind: "moon.Divider", content: "Small Buttons:"},
				{name: "smallButtonOne", kind: "moon.Button", small: true, content: "B", ontap: "buttonTapped"},
				{name: "smallButtonTwo", kind: "moon.Button", small: true, content: "Button", ontap: "buttonTapped"},
				{name: "smallButtonThree", kind: "moon.Button", small: true, disabled: true, content: "Disabled Button", ontap: "buttonTapped"},
				{name: "smallButtonFour", kind: "moon.Button", small: true, content: "Looooooooooooooooong Button", ontap: "buttonTapped"},
				{classes: "tap-area-check-container", components: [
					{kind: "moon.LabeledToggleButton", content: "Show Tap Area", onActivate: "test"}
				]},
				{tag: "br"},
				
				{kind: "moon.Divider", content: "Themed Buttons:"},
				{kind: "moon.Button", classes: "moon-dark-gray", content: "Dark", ontap: "buttonTapped"},
				{kind: "moon.Button", classes: "moon-light-gray", content: "Light", ontap: "buttonTapped"},
				{tag: "br"},
				{tag: "br"},
				
				{kind: "moon.Divider", content: "Captioned Buttons:"},
				{kind: "moon.CaptionDecorator", side: "top", content: "Pow", components: [
					{kind: "moon.Button", content: "A", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "right", content: "Boom", components: [
					{kind: "moon.Button", content: "B", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "bottom", content: "Crash", components: [
					{kind: "moon.Button", content: "C", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "left", content: "Bang", components: [
					{kind: "moon.Button", content: "D", ontap: "buttonTapped"}
				]},
				{tag: "br"},
				{tag: "br"},
				
				{kind: "moon.Divider", content: "Buttons with components:"},
				{kind: "moon.CaptionDecorator", side: "top", content: "Rent DVD", components: [
					{
						kind: "moon.Button",
						ontap: "buttonTapped",
						components: [
							{content: "$", classes: "moon-pre-text"},
							{content: "0", classes: "moon-large-text"},
							{content: "99", classes: "moon-superscript"}
						]
					}
				]},
				{kind: "moon.CaptionDecorator", side: "top", content: "Rent Blu-Ray", components: [
					{
						kind: "moon.Button",
						content: "B",
						ontap: "buttonTapped",
						components: [
							{content: "$", classes: "moon-pre-text"},
							{content: "1", classes: "moon-large-text"},
							{content: "99", classes: "moon-superscript"}
						]
					}
				]},
				{kind: "moon.CaptionDecorator", side: "top", content: "Buy DVD", components: [
					{
						kind: "moon.Button",
						content: "C",
						ontap: "buttonTapped",
						components: [
							{content: "$", classes: "moon-pre-text"},
							{content: "5", classes: "moon-large-text"},
							{content: "99", classes: "moon-superscript"}
						]
					}
				]},
				{kind: "moon.CaptionDecorator", side: "top", content: "Buy Blu-Ray", components: [
					{
						kind: "moon.Button",
						content: "D",
						ontap: "buttonTapped",
						components: [
							{content: "$", classes: "moon-pre-text"},
							{content: "9", classes: "moon-large-text"},
							{content: "99", classes: "moon-superscript"}
						]
					}
				]},
				{tag: "br"},
				{tag: "br"},
				{kind: "moon.Divider", content: "Grouped Buttons:"},
				{kind: "enyo.Group", classes: "moon-button-sample-group", components: [
					{kind: "moon.Button", content: "Apple", ontap: "buttonTapped"},
					{kind: "moon.Button", content: "Banana", ontap: "buttonTapped"},
					{kind: "moon.Button", content: "Saskatoonberry", ontap: "buttonTapped"}
				]}
			]}
		]},
		{name: "console", classes: "moon-button-sample-console"}
	],
	buttonTapped: function(inSender, inEvent) {
		var str = '"'+inSender.content+'" ';
		str += inSender.getActive() ? 'selected' : 'unselected';
		str += '.';
		this.$.console.setContent(str);
	},
	test: function(inSender, inEvent) {
		if (inEvent.checked) {
			this.$.smallButtonOne.addClass("visible-tap-area");
			this.$.smallButtonTwo.addClass("visible-tap-area");
			this.$.smallButtonThree.addClass("visible-tap-area");
			this.$.smallButtonFour.addClass("visible-tap-area");
		} else {
			this.$.smallButtonOne.removeClass("visible-tap-area");
			this.$.smallButtonTwo.removeClass("visible-tap-area");
			this.$.smallButtonThree.removeClass("visible-tap-area");
			this.$.smallButtonFour.removeClass("visible-tap-area");
		}
	}
});