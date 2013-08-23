enyo.kind({
	name: "sun.sample.TabPanelSample",
	kind: "sun.TabPanels",
	classes: "sun moon enyo-unselectable enyo-fit ",
	tabComponents: [		
		{kind: "sun.TabItem", content: "very long view1"},
		{kind: "sun.TabItem", content: "very long view2"},
		{kind: "sun.TabItem", content: "very long view3"},
		{kind: "sun.TabItem", content: "very long view4"}
	],
	panelComponents: [
		{content: "first view", style: "background-color: red;"},
		{content: "second view", style: "background-color: green;"},
		{content: "third view", style: "background-color: blue;"},
		{content: "fourth view", style: "background-color: yellow;"},
	],	
});
