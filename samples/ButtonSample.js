enyo.kind({
	name: "moon.sample.ButtonSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-button-sample",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-button-sample-wrapper", components: [

				{kind: "moon.Divider", content: "Buttons:"},
				{kind: "moon.TooltipDecorator", components: [
					{name: "A Button", kind: "moon.Button", minWidth: false, content: "A", ontap: "buttonTapped"},
					{kind: "moon.Tooltip", content:"minWidth: false"}
				]},
				{kind: "moon.TooltipDecorator", components: [
					{name: "B Button", kind: "moon.Button", content: "B", ontap: "buttonTapped"},
					{kind: "moon.Tooltip", content:"minWidth: true"}
				]},
				{name: "Button", kind: "moon.Button", content: "Button", ontap: "buttonTapped"},
				{name: "Disabled Button", kind: "moon.Button", disabled: true, content: "Disabled Button", ontap: "buttonTapped"},
				{name: "Long Button", kind: "moon.Button", content: "Looooooooooooooooong Button", ontap: "buttonTapped"},
				{tag: "br"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Small Buttons:"},
				{name: "Small A Button", kind: "moon.Button", small: true, minWidth: false, content: "A", ontap: "buttonTapped"},
				{name: "Small B Button", kind: "moon.Button", small: true, content: "B", ontap: "buttonTapped"},
				{name: "Small Button", kind: "moon.Button", small: true, content: "Button", ontap: "buttonTapped"},
				{name: "Small Disabled Button", kind: "moon.Button", small: true, disabled: true, content: "Disabled Button", ontap: "buttonTapped"},
				{name: "Small Long Button", kind: "moon.Button", small: true, content: "Loooooooooooooooooooooooong Button", ontap: "buttonTapped"},
				{kind: "moon.ToggleItem", classes: "tap-area-toggle-container", content: "Show Tap Area", onActivate: "showSmallButtonTapArea"},
				{tag: "br"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Captioned Buttons:"},
				{kind: "moon.CaptionDecorator", side: "top", content: "Pow", components: [
					{name: "Captioned Button A", kind: "moon.Button", content: "A", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "right", content: "Boom", components: [
					{name: "Captioned Button B", kind: "moon.Button", content: "B", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "bottom", content: "Crash", components: [
					{name: "Captioned Button C", kind: "moon.Button", content: "C", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "left", content: "Bang", components: [
					{name: "Captioned Button D", kind: "moon.Button", content: "D", ontap: "buttonTapped"}
				]},
				{tag: "br"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Captioned Buttons with showOnFocus option:"},
				{kind: "moon.CaptionDecorator", side: "top", showOnFocus: true, content: "Pow", components: [
					{name: "showOnFocus Caption Top", kind: "moon.Button", content: "Top", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "bottom", showOnFocus: true, content: "Crash", components: [
					{name: "showOnFocus Caption Bottom", kind: "moon.Button", content: "Bottom", ontap: "buttonTapped"}
				]},
				{style: "display:inline-block;", classes:"moon-2h"},
				{kind: "moon.CaptionDecorator", side: "left", showOnFocus: true, content: "Bang", components: [
					{name: "showOnFocus Caption Left", kind: "moon.Button", content: "Left", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "right", showOnFocus: true, content: "Boom", components: [
					{name: "showOnFocus Caption Right", kind: "moon.Button", content: "Right", ontap: "buttonTapped"}
				]},
				{tag: "br"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Grouped Buttons:"},
				{kind: "enyo.Group", classes: "moon-button-sample-group", components: [
					{name: "Apple Button", kind: "moon.Button", content: "Apple", ontap: "buttonTapped"},
					{name: "Banana Button", kind: "moon.Button", content: "Banana", ontap: "buttonTapped"},
					{name: "Saskatoonberry Button", kind: "moon.Button", content: "Saskatoonberry", ontap: "buttonTapped"}
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
			this.$["Small A Button"].addClass("visible-tap-area");
			this.$["Small B Button"].addClass("visible-tap-area");
			this.$["Small Button"].addClass("visible-tap-area");
			this.$["Small Disabled Button"].addClass("visible-tap-area");
			this.$["Small Long Button"].addClass("visible-tap-area");
		} else {
			this.$["Small A Button"].removeClass("visible-tap-area");
			this.$["Small B Button"].removeClass("visible-tap-area");
			this.$["Small Button"].removeClass("visible-tap-area");
			this.$["Small Disabled Button"].removeClass("visible-tap-area");
			this.$["Small Long Button"].removeClass("visible-tap-area");
		}
	}
});