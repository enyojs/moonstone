enyo.kind({
	name: "moon.pattern.MultiSelectAndFilterLarge",
	fit: true,
	kind:"FittableRows",
	classes: "multi-select-and-filter-large-pattern moon",
	published: {
		sortAction: null,
		filterAction: null
	},
	handlers: {
		onActivate: "activateHandler"
	},
	components: [
		{kind: "enyo.Spotlight"},
		{classes:"left-panel", components:[
			{classes:"left-panel-content", components:[
				{content:"01", classes:"left-panel-number"},
				{content:"MAIN MENU", classes:"left-panel-title"}
			]}
		]},
		{classes:"right-panel", components:[
			{kind:"FittableRows", components:[
				{name: "header", kind:"moon.Header", title: "Browse Movies", titleAbove: "03", components: [
				    {kind: "moon.ListActions", listActions:[
						{
							action: "sort",
							components: [
								{kind: "moon.Divider", content:"Sort"},
							    {kind: "moon.Scroller", components: [
									{kind: "Group", components: [
								        {content:"Alpha (A-Z)", kind:"moon.LabeledCheckbox"},
								        {content:"Release Date (New - Old)", kind:"moon.LabeledCheckbox"}
									]}
							    ]}
							]
						},
						{
							action: "filter",
							components: [
							    {kind: "moon.Divider", content:"Filter"},
							    {kind: "moon.Scroller", components: [
									{kind: "Group", components: [
								        {content:"New Releases", kind:"moon.LabeledCheckbox"},
								        {content:"Most Popular", kind:"moon.LabeledCheckbox"},
								        {content:"Action & Adventure", kind:"moon.LabeledCheckbox"},
								        {content:"Comedy", kind:"moon.LabeledCheckbox"},
								        {content:"Drama", kind:"moon.LabeledCheckbox"}
									]}
							    ]}
							]						
						}
					]}
				]},
				{
					name: "gridlist", kind: "moon.GridList", fit:true, classes:"grid-list", count:20,
					toggleSelected: true, itemWidth: 150, itemHeight: 200, itemSpacing: 20, onSetupItem: "setupItem",
					components: [
						{name: "item", kind: "moon.GridList.ImageItem"}
					]
				}
			]}			
		]}
	],
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		// var item = this.results[i];
		 this.$.item.setSource("../assets/movieImage.jpg");
		 this.$.item.setSelected(this.$.gridlist.isSelected(i));
	},
	activateHandler: function(inSender, inEvent) {
		if (inEvent.toggledControl && inEvent.toggledControl.checked) {
			var subtitle = "";
			switch (inEvent.action) {
				case "sort": {
					this.sortAction = inEvent.toggledControl.getContent();					
					subtitle = inEvent.toggledControl.getContent();
					if (this.filterAction) {
						subtitle += " / " + this.filterAction;
					}
					this.$.header.setTitleBelow(subtitle);
				}
				break;
				case "filter": {
					this.filterAction = inEvent.toggledControl.getContent();
					if (this.sortAction) {
						subtitle = this.sortAction + " / " + this.filterAction;
					} else {
						subtitle = this.filterAction;
					}
					this.$.header.setTitleBelow(subtitle);
				}
				break;
			}
		}

		//when the ListActions drawer closes, spotlight the gridList
		if (inEvent.originator && inEvent.originator.kind == "moon.ListActions" && !inEvent.originator.active) {
			this.$.gridlist.scrollToRow(0);
			enyo.Spotlight.spot(this.$.gridlist);
		}
	}
});