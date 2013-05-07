enyo.kind({
	name: "moon.sample.ListActionsSample",
	kind:"FittableRows",
	style: "margin:20px;",
	classes: "moon enyo-unselectable",
	fit: true,
	handlers: {
		onActivate: "activateHandler"
	},
	components: [
		{kind: "enyo.Spotlight"},
		{name: "header", kind:"moon.Header", title: "Header", titleAbove: "03", components: [
		    {kind: "moon.ListActions", iconSrc:"$/../images/list-actions-activator.png", listActions: [
				{
					action: "category",						
					components: [
					    {kind: "moon.Divider", content:"Category"},
					    {kind: "moon.Scroller", components: [
					        {content:"Action", kind:"moon.LabeledCheckbox", checked:true},
					        {content:"Comedy", kind:"moon.LabeledCheckbox"},
					        {content:"Drama", kind:"moon.LabeledCheckbox"},
					        {content:"Action", kind:"moon.LabeledCheckbox"},
					        {content:"Comedy", kind:"moon.LabeledCheckbox"},
					        {content:"Drama", kind:"moon.LabeledCheckbox"},
					        {content:"Action", kind:"moon.LabeledCheckbox"},
					        {content:"Comedy", kind:"moon.LabeledCheckbox"},
					        {content:"Drama", kind:"moon.LabeledCheckbox"},
					        {content:"Action", kind:"moon.LabeledCheckbox"},
					        {content:"Comedy", kind:"moon.LabeledCheckbox"},
					        {content:"Drama", kind:"moon.LabeledCheckbox"},
					        {content:"Action", kind:"moon.LabeledCheckbox"},
					        {content:"Comedy", kind:"moon.LabeledCheckbox"},
					        {content:"Drama", kind:"moon.LabeledCheckbox"},
					        {content:"Action", kind:"moon.LabeledCheckbox"},
					        {content:"Comedy", kind:"moon.LabeledCheckbox"},
					        {content:"Drama", kind:"moon.LabeledCheckbox"}
					    ]}
					]						
				},
				{
					components: [
					    {kind: "moon.Divider", content:"Category"},
					    {kind: "moon.Scroller", components: [
					        {content:"Action", kind:"moon.LabeledToggleButton"},
					        {content:"Comedy", kind:"moon.LabeledToggleButton"},
					        {content:"Drama", kind:"moon.LabeledToggleButton"}
					    ]}
					],						
				},
				{
					action: "menu-language",
					components: [
                        {kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: true, content: "Menu Langauge", defaultKind: "moon.LabeledToggleButton", classes: "moon-expandable-picker-wrapper", components: [
                            {content: "English"},
                            {content: "Spanish"},
                            {content: "French"},
                            {content: "German"},
                            {content: "Italian"},
                            {content: "Japanese"}
                        ]}						
					]
				}
			]},
			{kind: "moon.ListActions", autoCollapse:true, iconSrc:"$/../images/list-actions-activator.png", listActions: [
				{
					action: "category",						
					components: [
					    {kind: "moon.Divider", content:"Category"},
					    {kind: "moon.Scroller", components: [
					        {content:"Action", kind:"moon.LabeledCheckbox", checked:true},
					        {content:"Comedy", kind:"moon.LabeledCheckbox"},
					        {content:"Drama", kind:"moon.LabeledCheckbox"},
					        {content:"Action", kind:"moon.LabeledCheckbox"},
					        {content:"Comedy", kind:"moon.LabeledCheckbox"},
					        {content:"Drama", kind:"moon.LabeledCheckbox"},
					        {content:"Action", kind:"moon.LabeledCheckbox"},
					        {content:"Comedy", kind:"moon.LabeledCheckbox"},
					        {content:"Drama", kind:"moon.LabeledCheckbox"},
					        {content:"Action", kind:"moon.LabeledCheckbox"},
					        {content:"Comedy", kind:"moon.LabeledCheckbox"}
					    ]}
					]						
				},
				{
					components: [
					    {kind: "moon.Divider", content:"Category"},
					    {kind: "moon.Scroller", components: [
					        {content:"Action", kind:"moon.LabeledToggleButton"},
					        {content:"Comedy", kind:"moon.LabeledToggleButton"},
					        {content:"Drama", kind:"moon.LabeledToggleButton"}
					    ]}
					],						
				},
				{
					action: "menu-language",
					components: [
                        {kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: true, content: "Menu Langauge", defaultKind: "moon.LabeledToggleButton", classes: "moon-expandable-picker-wrapper", components: [
                            {content: "English"},
                            {content: "Spanish"},
                            {content: "French"},
                            {content: "German"},
                            {content: "Italian"},
                            {content: "Japanese"}
                        ]}						
					]
				}				
			]}
		]},
		{name: "list", kind: "moon.List", style:"border: 1px solid blue;margin-top:5px;", spotlight: true, orient:"v", count: 2000, multiSelect: false, fit:true, classes: "list-vertical-controls-sample-list moon-list-vertical-sample",
			onSetupItem: "setupItem", components: [
			{name: "item", classes: "list-vertical-sample-item enyo-border-box", components: [
				{name: "index", classes: "list-sample-index"},
				{name: "name"}
			]}
		]}
	],
	names: [],
	setupItem: function(inSender, inEvent) {
		/* global makeName */
		// this is the row we're setting up
		var i = inEvent.index;
		// make some mock data if we have none for this row
		if (!this.names[i]) {
			this.names[i] = makeName(5, 10, '', '');
		}
		var n = this.names[i];
		var ni = ("00000000" + i).slice(-7);
		// apply selection style if inSender (the list) indicates that this row is selected.
		this.$.item.addRemoveClass("list-sample-selected", inSender.isSelected(i));
		this.$.name.setContent(n);
		this.$.index.setContent(ni);
	},
	activateHandler: function(inSender, inEvent) {
		if (inEvent.toggledControl && inEvent.toggledControl.checked) {
			this.$.header.setTitleBelow(inEvent.toggledControl.getContent());
			
			//log the optional action property
			enyo.log("Action: " + (inEvent.action ? inEvent.action : "no action name provided"))
		}
		
		//log the active state of the ListAction drawer
		if (inEvent.originator && inEvent.originator.kind == "moon.ListActions") {
			enyo.log("ListActions drawer is now " + (inEvent.originator.active ? "open" : "closed"));
		}
	}
});