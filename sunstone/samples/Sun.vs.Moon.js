enyo.kind({
	name: "sun.sample.Sun.vs.Moon",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-button-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Scroller", fit: true, components: [
			{kind: "enyo.Table", components:[
				{components:[
					{components:[
						{content: "Divider"}
					]},
					{classes: "sun", components:[
						{kind: "sun.Divider", content: "Sunstone"},
						{content: "(1080x1920)"}
					]},
					{components:[
						{kind: "sun.Divider", content: "Moonstone"},
						{content: "(1920x1080)"}
					]}
				]},
				{components:[
					{components:[
						{content: "Accordion"}
					]},
					{classes: "sun", components:[
						{kind: "sun.Accordion", content: "This is an accordion", components: [
							{kind: "sun.CheckboxItem", content: "Item One"},
							{kind: "sun.CheckboxItem", content: "Item Two"}
						]}
					]},
					{components:[
						{kind: "moon.Accordion", content: "This is an accordion", components: [
							{kind: "moon.CheckboxItem", content: "Item One"},
							{kind: "moon.CheckboxItem", content: "Item Two"}
						]}
					]}
				]},
				{components:[
					{components:[
						{content: "Button"}
					]},
					{classes: "sun", components:[
						{name: "Button", kind: "sun.Button", content: "Button"}
					]},
					{components:[
						{name: "Button", kind: "moon.Button", content: "Button"}
					]}
				]},
				{components:[
					{components:[
						{content: "CheckboxItem"}
					]},
					{classes: "sun", components:[
						{kind: "moon.CheckboxItem", content: "Check"}
					]},
					{components:[
						{kind: "moon.CheckboxItem", content: "Check"}
					]}
				]},
				{components:[
					{components:[
						{content: "IconButton"}
					]},
					{classes: "sun", components:[
						{kind: "sun.IconButton", src: "assets/1080x1920/icon-close-button.png"}
					]},
					{components:[
						{kind: "moon.IconButton", src: "assets/1080x1920/icon-list.png", style: "width: 42px; height: 42px;"}
					]}
				]},
				{components:[
					{components:[
						{content: "Input"}
					]},
					{classes: "sun", components:[
						{kind: "sun.Input", placeholder: "JUST TYPE"}
					]},
					{components:[
						{kind: "moon.Input", placeholder: "JUST TYPE"}
					]}
				]},
				{components:[
					{components:[
						{content: "ProgressBar"}
					]},
					{classes: "sun", components:[
						{kind: "sun.ProgressBar", progress: 25, bgProgress: 75}
					]},
					{components:[
						{kind: "moon.ProgressBar", progress: 25, bgProgress: 75}
					]}
				]},
				{components:[
					{components:[
						{content: "Slider"}
					]},
					{classes: "sun", components:[
						{name: "slider1", kind: "sun.Slider", value: 25, bgProgress: 35}
					]},
					{components:[
						{name: "slider1", kind: "moon.Slider", value: 25, bgProgress: 35}
					]}
				]},
				{components:[
					{components:[
						{content: "Spinner"}
					]},
					{classes: "sun", components:[
						{kind: "sun.Spinner"}
					]},
					{components:[
						{kind: "moon.Spinner", classes: "moon-light"}
					]}
				]},
				{components:[
					{components:[
						{content: "Text"}
					]},
					{classes: "sun", components:[
						{content: "Text"}
					]},
					{components:[
						{content: "Text"}
					]}
				]},
				{components:[
					{components:[
						{content: "ToggleButton"}
					]},
					{classes: "sun", components:[
						{kind:"sun.ToggleButton"}
					]},
					{components:[
						{kind:"moon.ToggleButton"}
					]}
				]},
				{components:[
					{components:[
						{content: "Tooltip"}
					]},
					{classes: "sun", components:[
						{kind: "sun.TooltipDecorator", style: "display: inline-block;", components: [
							{kind: "moon.Button", content: "Tooltip"},
							{kind: "sun.Tooltip", content: "I'm a tooltip for a button."}
						]}
					]},
					{components:[
						{kind: "moon.TooltipDecorator", style: "display: inline-block;", components: [
							{kind: "moon.Button", content: "Tooltip"},
							{kind: "moon.Tooltip", content: "I'm a tooltip for a button."}
						]}
					]}
				]}
			]}			
		]}
	]
});