enyo.kind({
	name: "sun.sample.TabPanelsSample",
	kind: "sun.TabPanels",
	classes: "sun moon enyo-unselectable enyo-fit ",
	tabComponents: [		
		{kind: "sun.TabItem", content: "red"},
		{kind: "sun.TabItem", content: "green"},
		{kind: "sun.TabItem", content: "blue"},
		{kind: "sun.TabItem", content: "yellow"}
	],
	panelComponents: [
		{content: "first view", classes: "sun-tabpanels-sample", style: "background-color: red;"},
		{content: "second view", classes: "sun-tabpanels-sample", style: "background-color: green;"},
		{content: "third view", classes: "sun-tabpanels-sample", style: "background-color: blue;"},
		{content: "fourth view", classes: "sun-tabpanels-sample", style: "background-color: yellow;"},
	],	
});
