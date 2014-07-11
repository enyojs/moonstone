enyo.kind({
	name: "moon.sample.ListActionsSample",
	kind: "moon.Panels",
	pattern: "activity",
	classes: "moon enyo-unselectable enyo-fit",
	handlers: {
		onActivate: "activateHandler"
	},
	components: [
		{kind:"moon.Panel", headerType: "medium", title: "List Actions Sample", headerComponents: [
			{kind:"moon.TooltipDecorator", components: [
				{kind:"moon.Tooltip", position:"above", content:"Test Dynamic Lists"},
			
				//* List actions with default width
				{kind: "moon.ListActions", name:"listActions", proportionalWidth: true, icon:"drawer", listActions: [
					{action:"category3", components: [
						{kind: "moon.ListActionsMenuTitle", content: "Category 3 (DataList)"},
						{kind: "moon.DataList", name:"list", fit:true, components: [
							{kind:"moon.CheckboxItem", bindings: [{from:".model.name", to:".content"}]}
						]}
					]},
					{action:"category2", components: [
						{kind: "moon.ListActionsMenuTitle", content: "Category 2 (DataRepeater)"},
						{kind: "enyo.DataRepeater", containerOptions:{kind:"moon.Scroller", classes:"enyo-fill"}, name:"repeater", fit:true, components: [
							{kind:"moon.ToggleItem", bindings: [{from:".model.name", to:".content"}]}
						]}
					]},
					{action:"category1", components: [
						{kind: "moon.ListActionsMenuTitle", content:"Category 1 (Static)"},
						{kind: "moon.Scroller", fit: true, components: [
							{kind: "enyo.Group", name:"group", highlander: true, defaultKind: "moon.SelectableItem", components: [
								{content:"Just Released"},
								{content:"Recommended"},
								{content:"Top Rated"}
							]}
						]}
					]}
				]}
			]},
			{kind:"moon.TooltipDecorator", components: [
				{kind:"moon.Tooltip", position: "above", content: "Dummy List Actions"},
			
				//* List actions with proportional width
				{kind: "moon.ListActions", proportionalWidth: true, iconSrc: "./assets/icon-list.png", listActions: [
					{action: "Cost", components: [
						{kind: "moon.ListActionsMenuTitle", content:"Cost"},
						{kind: "moon.Scroller", defaultKind: "moon.ToggleItem", fit: true, components: [
							{content:"$"},
							{content:"$$"},
							{content:"$$$"}
						]}
					]},
					{action: "Flavor", components: [
						{kind: "moon.ListActionsMenuTitle", content:"Flavor"},
						{kind: "moon.Scroller", defaultKind: "moon.CheckboxItem", fit: true, components: [
							{content:"Spicy"},
							{content:"Sweet"},
							{content:"Sour"},
							{content:"Salty", checked: true},
							{content:"Savory"},
							{content:"Bland"},
							{content:"Umami"},
							{content:"Bitter"}
						]}
					]}
				]}
			]},
			{kind:"moon.TooltipDecorator", components: [
				{kind:"moon.Tooltip", position: "above", content: "Test Auto Collapse"},
			
				//* List actions with auto-collapsing
				{kind: "moon.ListActions", proportionalWidth: true, autoCollapse: true, iconSrc: "./assets/icon-list.png", listActions: [
					{action: "AutoCollapseTest", components: [
						{kind: "moon.ListActionsMenuTitle", content:"Try Auto-collapse"},
						{kind: "moon.Scroller", fit: true, components: [
							{kind: "enyo.Group", highlander: true, defaultKind: "moon.CheckboxItem", components: [
								{content:"Select"},
								{content:"One"},
								{content:"To"},
								{content:"Auto"},
								{content:"Collapse"},
								{content:"This"},
								{content:"List"},
								{content:"Actions"},
								{content:"Menu"}
							]}
						]}
					]}
				]}
			]}
		], components: [
			{components: [
				{kind:"moon.Button", small:true, content:"Add Option to Category 1", ontap:"addToStatic"},
				{kind:"moon.Button", small:true, content:"Add Option to Category 2", ontap:"addToRepeater"},
				{kind:"moon.Button", small:true, content:"Add Option to Category 3", ontap:"addToList"},
				{classes:"moon-1v"},
				{kind:"moon.Button", small:true, content:"Breadcrumb Panel", ontap:"toggleBreadcrumb"},
				{kind: "moon.ToggleButton", small: true, toggleOnLabel: "Header Type: Small", toggleOffLabel: "Header Type: Medium", ontap: "toggleHeaderSize"}
			]},
			{fit: true},
			{kind: "moon.ListActionsMenuTitle", content: "List Action Event"},
			{kind: "moon.BodyText", name: "console", content: "Event"}
		]},
		{kind:"moon.Panel", title: "Header", components: [
			{kind:"moon.Button", small:true, content:"Go Back", ontap:"toggleBreadcrumb"}
		]}
	],
	activateHandler: function(inSender, inEvent) {
		if (inEvent && inEvent.action) {
			if (inEvent.originator instanceof moon.SelectableItem) {
				this.$.console.setContent(
					inEvent.action + ": " + 
					inEvent.originator.getContent() + " was " + 
					(inEvent.originator.getSelected() ? "selected" : "unselected")
				);
			} else {	// moon.CheckboxItem or moon.ToggleItem
				this.$.console.setContent(
					inEvent.action + ": " + 
					inEvent.toggledControl.getContent() + " was " + 
					(inEvent.originator.getChecked() ? "selected" : "unselected")
				);
			}
		}
		
		// Log the active state of the ListAction drawer
		if (inEvent.originator instanceof moon.ListActions) {
			this.$.console.setContent(inEvent.originator.name + " is now " + (inEvent.originator.getOpen() ? "open" : "closed"));
		}
	},
	addToStatic: function() {
		this.optionNumber = (this.optionNumber || 0) + 1;
		this.$.group.createComponent({content:"Option " + this.optionNumber}).render();
	},
	addToList: function() {
		this.optionNumber = (this.optionNumber || 0) + 1;
		this.$.list.collection.add({name: "Option " + this.optionNumber});
	},
	addToRepeater: function() {
		this.optionNumber = (this.optionNumber || 0) + 1;
		this.$.repeater.collection.add({name: "Option " + this.optionNumber});
	},
	toggleBreadcrumb: function() {
		this.setIndex(this.getIndex() > 0 ? 0 : 1);
	},
	toggleHeaderSize: function() {
		this.getActive().setHeaderType(this.getActive().getHeaderType() == "small" ? "medium": "small");
	},
	create: function() {
		this.inherited(arguments);
		this.$.list.set("collection", new enyo.Collection([
			{name: "SAT 1"},
			{name: "SAT 2"},
			{name: "SAT 3"},
			{name: "OTHER S1"},
			{name: "OTHER S2"}
		]));
		this.$.repeater.set("collection", new enyo.Collection([
			{name: "Comedy"},
			{name: "Action"},
			{name: "Drama"},
			{name: "Family"},
			{name: "Fantasy"},
			{name: "Science Fiction"}
		]));
	}
});