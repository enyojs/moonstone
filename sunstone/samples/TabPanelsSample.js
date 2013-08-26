enyo.kind({
	name: "sun.sample.TabPanelsSample",
	kind: "sun.TabPanels",
	classes: "sun moon enyo-unselectable enyo-fit ",
	tabComponents: [		
		{kind: "sun.TabItem", content: "MediumPurple"},
		{kind: "sun.TabItem", content: "SeaGreen"},
		{kind: "sun.TabItem", content: "RoyalBlue"},
		{kind: "sun.TabItem", content: "GoldenRod"}
	],
	panelComponents: [
		{content: "FIRST VIEW", classes: "sun-tabpanels-sample", style: "background-color: MediumPurple ;"},
		{content: "SECOND VIEW", classes: "sun-tabpanels-sample", style: "background-color: SeaGreen;"},
		{content: "THIRD VIEW", classes: "sun-tabpanels-sample", style: "background-color: RoyalBlue;"},
		{content: "FOURTH VIEW", classes: "sun-tabpanels-sample", style: "background-color: GoldenRod;"},
	],	
});
