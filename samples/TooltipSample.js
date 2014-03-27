enyo.kind({
	name: "moon.sample.TooltipSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{name:"buttonContainer", kind:"FittableRows", classes:"enyo-fill", components:[
			//Top row of buttons
			{components:[
				{kind: "moon.TooltipDecorator", components: [
					{kind: "moon.Button", content: "Tooltip"},
					{kind: "moon.Tooltip", content: "I'm a tooltip for a button."}
				]},

				{kind: "moon.TooltipDecorator", style:"float:right", components: [
					{kind: "moon.Button", content: "Tooltip"},
					{kind: "moon.Tooltip", content: "I'm a tooltip for a button."}
				]}
			]},
			//Center row of buttons
			{fit:true, style:"padding-top:15%;padding-bottom:15%;", components:[
				{kind: "moon.TooltipDecorator", components: [
					{kind: "moon.InputDecorator", components: [
						{kind: "moon.Input", style:"width:130px;", placeholder: "Above"}
					]},
					{kind: "moon.Tooltip", content: "I'm a tooltip for an input.", position: "above"}
				]},

				{kind: "moon.TooltipDecorator", style:"float:right;", components: [
					{kind: "moon.InputDecorator", components: [
						{kind: "moon.Input", style:"width:130px;", placeholder: "Below"}
					]},
					{kind: "moon.Tooltip", content: "I'm a tooltip for an input.", position: "below"}
				]}
			]},
			//Bottom row of buttons
			{components:[
				{kind: "moon.TooltipDecorator", components: [
					{kind: "moon.IconButton", src: "assets/icon-button-enyo-logo.png"},
					{kind: "moon.Tooltip", content: "I'm a tooltip for an IconButton."}
				]},

				{kind: "moon.TooltipDecorator", style:"float:right;", components: [
					{kind: "moon.IconButton", src: "assets/icon-button-enyo-logo.png"},
					{kind: "moon.Tooltip", content: "I'm a tooltip for an IconButton."}
				]}
			]}
		]}
	]
});
