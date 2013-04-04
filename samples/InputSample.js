enyo.kind({
	name: "moon.sample.InputSample",
	kind:"FittableRows",
	classes: "moon moon-sample moon-input-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{classes: "moon-input-sample-wrapper", components: [
			{kind: "moon.Divider", content: "Inputs"},
			{name: 'scroller', kind: 'moon.Scroller', fit: true, touch: true, classes:"moon-input-sample-scroller", components: [
				{kind: "moon.InputDecorator", spotlight: true, components: [
					{kind: "moon.Input", placeholder: "JUST TYPE", onchange:"inputChanged"}
				]},
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.Input", placeholder: "Search term", onchange:"inputChanged"},
					{kind: "Image", src: "assets/search-input-search.png"}
				]},
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.Input", type:"password", placeholder: "Enter password", onchange:"inputChanged"}
				]},
				{kind: "moon.InputDecorator", disabled: true, components: [
					{kind: "moon.Input", disabled: true, value: "Disabled input"}
				]},
				{kind: "moon.Divider", content: "RichTexts"},
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.RichText", placeholder: "Enter text here", onchange:"inputChanged"}
				]},
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.RichText", style: "width: 240px;", placeholder: "JUST TYPE", onchange:"inputChanged"},
					{kind: "Image", src: "assets/search-input-search.png"}
				]},
				{kind: "moon.InputDecorator", disabled: true, components: [
					{kind: "moon.RichText", disabled: true, style: "width: 240px;", placeholder: "Disabled input", onchange:"inputChanged"}
				]},
				{kind: "moon.Divider", content: "TextAreas"},
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.TextArea", placeholder: "Enter text here", onchange:"inputChanged"}
				]},
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.TextArea", placeholder: "JUST TYPE", onchange:"inputChanged"},
					{kind: "Image", src: "assets/search-input-search.png"}
				]},
				{kind: "moon.InputDecorator", disabled: true, components: [
					{kind: "moon.TextArea", disabled: true, placeholder: "Disabled input", onchange:"inputChanged"}
				]}
			]},
			{kind: "moon.Divider", content: "Result", classes: "moon-input-sample-result"},
			{name: "console", classes: "moon-input-sample-console", content: "Input: "}
		]}
	],
	inputChanged: function(inSender, inEvent) {
		this.$.console.setContent("Input: " + inSender.getValue());
	}
});
