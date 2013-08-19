enyo.kind({
	name: "sun.sample.InputSample",
	kind:"FittableRows",
	classes: "sun moon enyo-unselectable enyo-fit moon-input-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Divider", content: "Inputs"},
		{kind: "sun.Scroller", horizontal: "hidden", fit: true, components: [
			{kind: "sun.InputDecorator", spotlight: true, components: [
				{kind: "sun.Input", placeholder: "JUST TYPE", oninput:"inputChanged"}
			]},
			{kind: "sun.InputDecorator", components: [
				{kind: "sun.Input", placeholder: "Search term", oninput:"inputChanged"},
				{kind: "Image", src: "assets/1080x1920/search-input-search.png"}
			]},
			{kind: "sun.InputDecorator", components: [
				{kind: "sun.Input", type:"password", placeholder: "Enter password", oninput:"inputChanged"}
			]},
			{kind: "sun.InputDecorator", disabled: true, components: [
				{kind: "sun.Input", disabled: true, value: "Deactivated input"}
			]},
			{kind: "sun.Divider", content: "RichTexts"},
			{kind: "sun.InputDecorator", components: [
				{kind: "moon.RichText", placeholder: "Enter text here", oninput:"inputChanged"}
			]},
			{kind: "sun.InputDecorator", components: [
				{kind: "moon.RichText", style: "width: 480px;", placeholder: "JUST TYPE", oninput:"inputChanged"},
				{kind: "Image", src: "assets/1080x1920/search-input-search.png"}
			]},
			{kind: "sun.InputDecorator", disabled: true, components: [
				{kind: "moon.RichText", disabled: true, style: "width: 480px;", placeholder: "Deactivated input", oninput:"inputChanged"}
			]},
			{kind: "sun.Divider", content: "TextAreas"},
			{kind: "sun.InputDecorator", components: [
				{kind: "moon.TextArea", placeholder: "Enter text here", oninput:"inputChanged"}
			]},
			{kind: "sun.InputDecorator", components: [
				{kind: "moon.TextArea", placeholder: "JUST TYPE", oninput:"inputChanged"},
			]},
			{kind: "sun.InputDecorator", disabled: true, components: [
				{kind: "moon.TextArea", disabled: true, placeholder: "Deactivated input", oninput:"inputChanged"}
			]}
		]},
		{kind: "sun.Divider", content: "Result", classes: "moon-input-sample-result"},
		{name: "console", classes: "moon-input-sample-console", content: "Input: "},
		{kind: "sun.Divider", content: "Bottom-aligned inputs", classes: "moon-input-sample-result"},
		{components: [
			{kind: "sun.InputDecorator", spotlight: true, components: [
				{kind: "sun.Input", placeholder: "Bottom", oninput:"inputChanged"}
			]},
			{kind: "sun.InputDecorator", spotlight: true, components: [
				{kind: "sun.Input", placeholder: "Aligned", oninput:"inputChanged"}
			]},
			{kind: "sun.InputDecorator", spotlight: true, components: [
				{kind: "sun.Input", placeholder: "Inputs", oninput:"inputChanged"}
			]}
		]}
	],
	inputChanged: function(inSender, inEvent) {
		this.$.console.setContent("Input: " + inSender.getValue());
	}
});
