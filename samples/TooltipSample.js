enyo.kind({
	name: "moon.sample.TooltipSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{name:"buttonContainer", kind:"FittableRows", classes:"enyo-fill", components:[
			//Top row of buttons
			{classes: "moon-5v", components:[
				{kind: "moon.TooltipDecorator", components: [
					{kind: "moon.Button", disabled: true, centered: true, content: "Left Tooltip"},
					{kind: "moon.Tooltip", content: "I'm a left tooltip.", position: "above"}
				]},

				{kind: "moon.TooltipDecorator", style:"float:right", components: [
					{kind: "moon.Button", content: "Right Tooltip"},
					{name: "toolTip", kind: "moon.Tooltip", contentUpperCase: false, content: "I'm a right tooltip."}
				]}
			]},
			//Second row of buttons
			{classes: "moon-5v", components:[
				{kind: "moon.TooltipDecorator", components: [
					{kind: "moon.Button", small: true, content: "Item with Left Floating Tooltip"},
					{kind: "moon.Tooltip", floating: true, content: "I'm a left floating tooltip."}
				]},

				{kind: "moon.TooltipDecorator", style: "float: right", components: [
					{kind: "moon.Button", disabled: true, small: true, content: "Item with Right Floating Tooltip"},
					{name: "toolTipFloating", floating: true, kind: "moon.Tooltip", content: "I'm a right floating text tooltip", position: "above"}
				]}
			]},
			// third row of buttons
			{fit: true, components:[
				{kind: "moon.TooltipDecorator", components: [
					{kind: "moon.InputDecorator", components: [
						{kind: "moon.Input", style: "width: 130px;", placeholder: "Above"}
					]},
					{kind: "moon.Tooltip", floating: true, content: "I'm a tooltip for an input.", position: "above"}
				]},

				{kind: "moon.TooltipDecorator", style:"float:right;", components: [
					{kind: "moon.InputDecorator", components: [
						{kind: "moon.Input", style: "width: 130px;", placeholder: "Below"}
					]},
					{kind: "moon.Tooltip", content: "I'm a tooltip for an input.", position: "below"}
				]}
			]},
			//Bottom row of buttons
			{components:[
				{kind: "moon.TooltipDecorator", components: [
					{kind: "moon.IconButton", src: "assets/icon-button-enyo-logo.png", style: "top: -40px; left: 100px"},
					{kind: "moon.Tooltip", floating: true, content: "Floating tooltip for an IconButton."}
				]},

				{kind: "moon.TooltipDecorator", style: "float:right;", components: [
					{kind: "moon.IconButton", src: "assets/icon-button-enyo-logo.png", style: "right: 50px"},
					{kind: "moon.Tooltip", floating: false, content: "I'm a tooltip for an IconButton."}
				]}
			]}
		]}
	]
});
