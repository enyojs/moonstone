enyo.kind({
	name: "moon.sample.ButtonSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-button-sample",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-button-sample-wrapper", components: [

				{kind: "moon.Divider", content: "Buttons:"},
				{kind: "moon.TooltipDecorator", components: [
					{name: "aButton", kind: "moon.Button", minWidth: false, content: "A", ontap: "buttonTapped"},
					{kind: "moon.Tooltip", content:"minWidth: false"}
				]},
				{kind: "moon.TooltipDecorator", components: [
					{name: "bButton", kind: "moon.Button", content: "B", ontap: "buttonTapped"},
					{kind: "moon.Tooltip", content:"minWidth: true"}
				]},
				{name: "button", kind: "moon.Button", content: "Button", ontap: "buttonTapped"},
				{name: "disabledButton", kind: "moon.Button", disabled: true, content: "Disabled Button", ontap: "buttonTapped"},
				{name: "longButton", kind: "moon.Button", content: "Looooooooooooooooong Button", ontap: "buttonTapped"},
				{name: "spacesButton", kind: "moon.Button", content: "Button   with   extra   spaces", ontap: "buttonTapped"},
				{tag: "br"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Small Buttons:"},
				{name: "smallAButton", kind: "moon.Button", small: true, minWidth: false, content: "A", ontap: "buttonTapped"},
				{name: "smallBButton", kind: "moon.Button", small: true, content: "B", ontap: "buttonTapped"},
				{name: "smallButton", kind: "moon.Button", small: true, content: "Button", ontap: "buttonTapped"},
				{name: "smallDisabledButton", kind: "moon.Button", small: true, disabled: true, content: "Disabled Button", ontap: "buttonTapped"},
				{name: "smallLongButton", kind: "moon.Button", small: true, content: "Loooooooooooooooooooooooong Button", ontap: "buttonTapped"},
				{name: "smallSpacesButton", kind: "moon.Button", small:true, content: "Button   with   extra   spaces", ontap: "buttonTapped"},
				{kind: "moon.ToggleItem", classes: "tap-area-toggle-container", content: "Show Tap Area", onActivate: "showSmallButtonTapArea"},
				{tag: "br"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Captioned Buttons:"},
				{kind: "moon.CaptionDecorator", side: "top", content: "Pow", components: [
					{name: "captionedAButton", kind: "moon.Button", content: "A", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "right", content: "Boom", components: [
					{name: "captionedBButton", kind: "moon.Button", content: "B", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "bottom", content: "Crash", components: [
					{name: "captionedCButton", kind: "moon.Button", content: "C", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "left", content: "Bang", components: [
					{name: "captionedDButton", kind: "moon.Button", content: "D", ontap: "buttonTapped"}
				]},
				{tag: "br"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Captioned Buttons with showOnFocus option:"},
				{kind: "moon.CaptionDecorator", side: "top", showOnFocus: true, content: "Pow", components: [
					{name: "showOnFocusCaptionTopButton", kind: "moon.Button", content: "Top", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "bottom", showOnFocus: true, content: "Crash", components: [
					{name: "showOnFocusCaptionBottomButton", kind: "moon.Button", content: "Bottom", ontap: "buttonTapped"}
				]},
				{style: "display:inline-block;", classes:"moon-2h"},
				{kind: "moon.CaptionDecorator", side: "left", showOnFocus: true, content: "Bang", components: [
					{name: "showOnFocusCaptionLeftButton", kind: "moon.Button", content: "Left", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "right", showOnFocus: true, content: "Boom", components: [
					{name: "showOnFocusCaptionRightButton", kind: "moon.Button", content: "Right", ontap: "buttonTapped"}
				]},
				{tag: "br"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Grouped Buttons:"},
				{kind: "enyo.Group", classes: "moon-button-sample-group", components: [
					{name: "appleButton", kind: "moon.Button", content: "Apple", ontap: "buttonTapped"},
					{name: "bananaButton", kind: "moon.Button", content: "Banana", ontap: "buttonTapped"},
					{name: "saskatoonberryButton", kind: "moon.Button", content: "Saskatoonberry", ontap: "buttonTapped"}
				]}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{kind: "moon.BodyText", name: "result", allowHtml: true, content: "No button pressed yet."}
	],
	buttonTapped: function(inSender, inEvent) {
		this.$.result.setContent("&quot;" + inSender.name + "&quot; pressed.");
	},
	showSmallButtonTapArea: function(inSender, inEvent) {
		if (inEvent.checked) {
			this.$.smallAButton.addClass("visible-tap-area");
			this.$.smallBButton.addClass("visible-tap-area");
			this.$.smallButton.addClass("visible-tap-area");
			this.$.smallDisabledButton.addClass("visible-tap-area");
			this.$.smallLongButton.addClass("visible-tap-area");
			this.$.smallSpacesButton.addClass("visible-tap-area");
		} else {
			this.$.smallAButton.removeClass("visible-tap-area");
			this.$.smallBButton.removeClass("visible-tap-area");
			this.$.smallButton.removeClass("visible-tap-area");
			this.$.smallDisabledButton.removeClass("visible-tap-area");
			this.$.smallLongButton.removeClass("visible-tap-area");
			this.$.smallSpacesButton.removeClass("visible-tap-area");
		}
	}
});