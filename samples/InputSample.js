enyo.kind({
	name: "moon.sample.InputSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-input-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Inputs"},
		{kind: 'moon.Scroller', horizontal: "hidden", fit: true, components: [
			{kind: "moon.InputDecorator", spotlight: true, components: [
				{kind: "moon.Input", placeholder: "JUST TYPE", oninput:"inputChanged"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "Search term", oninput:"inputChanged"},
				{kind: "Image", src: "assets/search-input-search.png"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", type:"password", placeholder: "Enter password", oninput:"inputChanged"}
			]},
			{kind: "moon.InputDecorator", disabled: true, components: [
				{kind: "moon.Input", disabled: true, value: "Deactivated input"}
			]},
			{kind: "moon.Divider", content: "RichTexts"},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.RichText", placeholder: "Enter text here", oninput:"inputChanged"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.RichText", style: "width: 240px;", placeholder: "JUST TYPE", oninput:"inputChanged"},
				{kind: "Image", src: "assets/search-input-search.png"}
			]},
			{kind: "moon.InputDecorator", disabled: true, components: [
				{kind: "moon.RichText", disabled: true, style: "width: 240px;", placeholder: "Deactivated input", oninput:"inputChanged"}
			]},
			{kind: "moon.Divider", content: "TextAreas"},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.TextArea", placeholder: "Enter text here", oninput:"inputChanged"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.TextArea", placeholder: "JUST TYPE", oninput:"inputChanged"}
			]},
			{kind: "moon.InputDecorator", disabled: true, components: [
				{kind: "moon.TextArea", disabled: true, placeholder: "Deactivated input", oninput:"inputChanged"}
			]}
		]},
		{kind: "moon.Divider", content: "Result", classes: "moon-input-sample-result"},
		{name: "console", classes: "moon-input-sample-console", content: "Input: "},
		{kind: "moon.Divider", content: "Bottom-aligned inputs", classes: "moon-input-sample-result"},
		{components: [
			{kind: "moon.InputDecorator", spotlight: true, components: [
				{kind: "moon.Input", placeholder: "Bottom", oninput:"inputChanged"}
			]},
			{kind: "moon.InputDecorator", spotlight: true, components: [
				{kind: "moon.Input", placeholder: "Aligned", oninput:"inputChanged"}
			]},
			{kind: "moon.InputDecorator", spotlight: true, components: [
				{kind: "moon.Input", placeholder: "Inputs", oninput:"inputChanged"}
			]}
		]}
	],
	inputChanged: function(inSender, inEvent) {
		this.$.console.setContent("Input: " + inSender.getValue());
	}
});
