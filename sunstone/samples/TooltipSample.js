enyo.kind({
	name: "sun.sample.TooltipSample",
	kind: "FittableRows",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{name: "buttonContainer", kind: "FittableRows", classes: "enyo-fit", components: [
			//Top row of buttons
			{components: [
				{
					kind: "FittableColumns",
					components: [
						{kind: "sun.TooltipDecorator", style: "display: inline-block;", components: [
							{kind: "moon.Button", content: "Tooltip"},
							{kind: "sun.Tooltip", content: "I'm a tooltip for a button."}
						]},
						{kind: "sun.TooltipDecorator", style: "display: inline-block; float: right;", components: [
							{kind: "moon.Button", content: "Tooltip"},
							{kind: "sun.Tooltip", content: "I'm a tooltip for a button."}					
						]}
					]
				}

			]},
			//Center row of buttons
			{fit: true, style: "padding-top: 15%; padding-bottom: 15%;", components: [
				{kind: "sun.TooltipDecorator", style: "display: inline-block;", components: [
					{kind: "moon.InputDecorator", components: [
						{kind: "moon.Input", style: "width: 130px;", placholder: "Just an input..."}
					]},
					{
						kind: "sun.Tooltip", 							
						position: {vertical: "below", horizontal: "left"},
						content: "custom position - below/left"
					}
				]},
				{kind: "sun.TooltipDecorator", style: "display: inline-block; float: right;", components: [
					{kind: "moon.InputDecorator", components: [
						{kind: "moon.Input", style: "width: 130px;", placholder: "Just an input..."}
					]},
					{
						kind: "sun.Tooltip", 							
						position: {vertical: "above", horizontal: "right"},
						content: "custom position - above/right"
					}
				]}
			]},
			//Bottom row of buttons
			{components: [
				{kind: "sun.TooltipDecorator", style: "display: inline-block;", components: [
					{kind: "moon.IconButton", src: "assets/1080x1920/icon-button-enyo-logo.png"},
					{kind: "sun.Tooltip", content: "I'm a tooltip for an IconButton."}
				]},
				{kind: "sun.TooltipDecorator", style: "display: inline-block; float: right;", components: [
					{kind: "moon.IconButton", src: "assets/1080x1920/icon-button-enyo-logo.png"},
					{kind: "sun.Tooltip", content: "I'm a tooltip for an IconButton."}
				]}
			]}
		]}
	]
});
