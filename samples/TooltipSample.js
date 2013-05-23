enyo.kind({
	name: "moon.sample.TooltipSample",
	fit: true,
	kind: "FittableRows",
	classes: "moon moon-tooltip-sample enyo-unselectable",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Tooltips on items"},
		{tag: "br"},
		{style: "width: 300px;", components:[
			{kind: "moon.TooltipDecorator", components: [
				{kind: "moon.Button", content: "Tooltip"},
				{kind: "moon.Tooltip", content: "I'm a tooltip for a button."}
			]},
			{tag: "br"},
			{tag: "br"},
			{kind: "moon.TooltipDecorator", components: [
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.Input", style:"width:130px;", placholder: "Just an input..."}
				]},
				{kind: "moon.Tooltip", content: "I'm a tooltip for an input."}
			]},
			{tag: "br"},
			{tag: "br"},
			{kind: "moon.TooltipDecorator", components: [
				{kind: "moon.IconButton", src: "assets/icon-button-enyo-logo.png"},
				{kind: "moon.Tooltip", content: "I'm a tooltip for an icon button."}
			]}
		]}
	]
});
