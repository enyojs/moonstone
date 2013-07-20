enyo.kind({
	name: "moon.sample.ButtonSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-button-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-button-sample-wrapper", components: [

				{kind: "moon.Divider", content: "Focus Buttons:"},
				{name: "B Button", kind: "moon.Button", content: "B", ontap: "buttonTapped"},
				{name: "Button", kind: "moon.Button", content: "Button", ontap: "buttonTapped"},
				{name: "Disabled Button", kind: "moon.Button", disabled: true, content: "Deactivated Button", ontap: "buttonTapped"},
				{name: "Long Button", kind: "moon.Button", content: "Looooooooooooooooong Button", ontap: "buttonTapped"},
				{tag: "br"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Small Buttons:"},
				{name: "Small B Button", kind: "moon.Button", small: true, content: "B", ontap: "buttonTapped"},
				{name: "Small Button", kind: "moon.Button", small: true, content: "Button", ontap: "buttonTapped"},
				{name: "Small Disabled Button", kind: "moon.Button", small: true, disabled: true, content: "Deactivated Button", ontap: "buttonTapped"},
				{name: "Small Long Button", kind: "moon.Button", small: true, content: "Looooooooooooooooong Button", ontap: "buttonTapped"},
				{kind: "moon.ToggleItem", classes: "tap-area-toggle-container", content: "Show Tap Area", onActivate: "showSmallButtonTapArea"},
				{tag: "br"},
				{tag: "br"},

				{kind: "moon.Divider", content: "Themed Buttons:"},
				{name: "Dark Button", kind: "moon.Button", classes: "moon-dark-gray", content: "Dark", ontap: "buttonTapped"},
				{name: "Light Button", kind: "moon.Button", classes: "moon-light-gray", content: "Light", ontap: "buttonTapped"},
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
					{name: "showOnFocus Caption A", kind: "moon.Button", content: "A", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "right", showOnFocus: true, content: "Boom", components: [
					{name: "showOnFocus Caption B", kind: "moon.Button", content: "B", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "bottom", showOnFocus: true, content: "Crash", components: [
					{name: "showOnFocus Caption C", kind: "moon.Button", content: "C", ontap: "buttonTapped"}
				]},
				{kind: "moon.CaptionDecorator", side: "left", showOnFocus: true, content: "Bang", components: [
					{name: "showOnFocus Caption D", kind: "moon.Button", content: "D", ontap: "buttonTapped"}
				]},
				{tag: "br"},
				{tag: "br"},
				
				{kind: "moon.Divider", content: "Buttons with components:"},
				{kind: "moon.CaptionDecorator", side: "top", content: "Rent DVD", components: [
					{name: "$0.99 Button", kind: "moon.Button", ontap: "buttonTapped", components: [
						{content: "$",  classes: "moon-pre-text"},
						{content: "0",  classes: "moon-large-text"},
						{content: "99", classes: "moon-superscript"}
					]}
				]},
				{kind: "moon.CaptionDecorator", side: "top", content: "Rent Blu-Ray", components: [
					{name: "$1.99 Button", kind: "moon.Button", ontap: "buttonTapped", components: [
						{content: "$",  classes: "moon-pre-text"},
						{content: "1",  classes: "moon-large-text"},
						{content: "99", classes: "moon-superscript"}
					]}
				]},
				{kind: "moon.CaptionDecorator", side: "top", content: "Buy DVD", components: [
					{name: "$5.99 Button", kind: "moon.Button", ontap: "buttonTapped", components: [
						{content: "$",  classes: "moon-pre-text"},
						{content: "5",  classes: "moon-large-text"},
						{content: "99", classes: "moon-superscript"}
					]}
				]},
				{kind: "moon.CaptionDecorator", side: "top", content: "Buy Blu-Ray", components: [
					{name: "$9.99 Button", kind: "moon.Button", ontap: "buttonTapped", components: [
						{content: "$",  classes: "moon-pre-text"},
						{content: "9",  classes: "moon-large-text"},
						{content: "99", classes: "moon-superscript"}
					]}
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
		{name: "result", allowHtml: true, content: "No button pressed yet."}
	],
	buttonTapped: function(inSender, inEvent) {
		this.$.result.setContent("&quot;" + inSender.name + "&quot; pressed.");
	},
	showSmallButtonTapArea: function(inSender, inEvent) {
		if (inEvent.checked) {
			this.$["Small B Button"].addClass("visible-tap-area");
			this.$["Small Button"].addClass("visible-tap-area");
			this.$["Small Disabled Button"].addClass("visible-tap-area");
			this.$["Small Long Button"].addClass("visible-tap-area");
		} else {
			this.$["Small B Button"].removeClass("visible-tap-area");
			this.$["Small Button"].removeClass("visible-tap-area");
			this.$["Small Disabled Button"].removeClass("visible-tap-area");
			this.$["Small Long Button"].removeClass("visible-tap-area");
		}
	}
});