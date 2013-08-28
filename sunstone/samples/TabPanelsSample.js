enyo.kind({
	name: "sun.sample.TabPanelsSample",
	kind: "sun.TabPanels",
	classes: "sun moon enyo-unselectable enyo-fit",
	handlers: {
		onActivate: "activate"
	},
	tabComponents: [		
		{kind: "sun.TabItem", content: "MediumPurple"},
		{kind: "sun.TabItem", content: "SeaGreen"},
		{kind: "sun.TabItem", content: "RoyalBlue"},
		{kind: "sun.TabItem", content: "GoldenRod"}
	],
	panelComponents: [
		{content: "FIRST VIEW<br/>MediumPurple", allowHtml: true, classes: "sun-tabpanels-sample", style: "background-color: MediumPurple ;"},		
		{content: "SECOND VIEW<br/>SeaGreen", allowHtml: true, classes: "sun-tabpanels-sample", style: "background-color: SeaGreen;"},
		{content: "THIRD VIEW<br/>RoyalBlue", allowHtml: true, classes: "sun-tabpanels-sample", style: "background-color: RoyalBlue;"},
		{content: "FOURTH VIEW<br/>GoldenRod", allowHtml: true, classes: "sun-tabpanels-sample", style: "background-color: GoldenRod;"}
	],
	activate: function(inSender, inEvent) {		
		// Do something tab changed
	}
});
