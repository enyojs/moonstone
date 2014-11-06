enyo.kind({
	name: "moon.sample.InputSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-input-sample",
	components: [
		{kind: "moon.Divider", content: "Inputs"},
		{kind: 'moon.Scroller', horizontal: "hidden", fit: true, components: [
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "JUST TYPE", oninput:"handleInput", onchange:"handleChange"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "Search term", oninput:"handleInput", onchange:"handleChange"},
				{kind: "moon.Icon", icon: "search"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", type:"password", placeholder: "Enter password", oninput:"handleInput", onchange:"handleChange"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", type:"number", placeholder: "Enter number", oninput:"handleInput", onchange:"handleChange"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "Placeholder for initial value", value: "This is the initial value", onput: "handleInput", onchange: "handleChange"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "Placeholder for value with ellipsis", value: "This is the initial value that is of a certain length to display an ellipsis.", oninput:"handleInput", onchange:"handleChange"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "Dismiss on Enter", dismissOnEnter:true, oninput:"handleInput", onchange:"handleChange"}
			]},
			{kind: "moon.InputDecorator", disabled: true, components: [
				{kind: "moon.Input", disabled: true, placeholder: "Disabled input"}
			]},

			{kind: "moon.Divider", content: "TextAreas"},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.TextArea", placeholder: "Enter text here", oninput:"handleInput", onchange:"handleChange"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.TextArea", placeholder: "JUST TYPE", oninput:"handleInput", onchange:"handleChange"}
			]},
			{kind: "moon.InputDecorator", disabled: true, components: [
				{kind: "moon.TextArea", disabled: true, placeholder: "Deactivated TextArea", oninput:"handleInput", onchange:"handleChange"}
			]},

			{kind: "moon.Divider", content: "RichTexts"},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.RichText", oninput:"handleInput", onchange:"handleChange"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.RichText", style: "width: 240px;", oninput:"handleInput", onchange:"handleChange"},
				{kind: "moon.Icon", icon: "search"}
			]},
			{kind: "moon.InputDecorator", disabled: true, components: [
				{kind: "moon.RichText", disabled: true, style: "width: 240px;"}
			]}
		]},
		{kind: "moon.Divider", content: "Result", classes: "moon-input-sample-result"},
		{kind: "moon.BodyText", name: "console", allowHtml: false, content: "Input: "},
		{kind: "moon.Divider", content: "Bottom-aligned inputs", classes: "moon-input-sample-result"},
		{components: [
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "Bottom", oninput:"handleInput", onchange:"handleChange"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "Aligned", oninput:"handleInput", onchange:"handleChange"}
			]},
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "Inputs", oninput:"handleInput", onchange:"handleChange"}
			]}
		]}
	],
	handleInput: function(inSender, inEvent) {
		this.$.console.setContent("Input: " + inSender.getValue());
	},
	handleChange: function(inSender, inEvent) {
		this.$.console.setContent("Changed: " + inSender.getValue());
	}
});
