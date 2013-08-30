enyo.kind({
	name: "moon.sample.listactions.MultiSelectAndFilterLargeSample",
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

		{kind: "moon.Panels", classes:"enyo-fit", pattern:"activity", components: [
			{kind:"moon.Panel", title:"Browse Movies", headerComponents: [
				{kind: "moon.ListActions", iconSrc:"../../../images/list-actions-activator.png", listActions:[
					{
						action: "sort",
						components: [
							{kind: "moon.Divider", content:"Sort"},
							{kind: "moon.Scroller", fit:true, components: [
								{kind: "Group", components: [
									{content:"Alpha (A-Z)", kind:"moon.CheckboxItem"},
									{content:"Release Date (New - Old)", kind:"moon.CheckboxItem"}
								]}
							]}
						]
					},
					{
						action: "filter",
						components: [
							{kind: "moon.Divider", content:"Filter"},
							{kind: "moon.Scroller", fit:true, components: [
								{kind: "Group", components: [
									{content:"New Releases", kind:"moon.CheckboxItem"},
									{content:"Most Popular", kind:"moon.CheckboxItem"},
									{content:"Action & Adventure", kind:"moon.CheckboxItem"},
									{content:"Comedy", kind:"moon.CheckboxItem"},
									{content:"Drama", kind:"moon.CheckboxItem"}
								]}
							]}
						]
					}
				]}
			], components: [
				{
					name: "gridlist",
					kind: "moon.GridList",
					fit:true,
					count:20,
					toggleSelected: true,
					itemWidth: 150,
					itemHeight: 200,
					itemSpacing: 20,
					onSetupItem: "setupItem",
					components: [
						{name: "item", kind: "moon.GridListImageItem"}
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
			case "sort":
				this.sortAction = inEvent.toggledControl.getContent();
				subtitle = inEvent.toggledControl.getContent();
				if (this.filterAction) {
					subtitle += " / " + this.filterAction;
				}
				this.$.header.setTitleBelow(subtitle);
				break;
			case "filter":
				this.filterAction = inEvent.toggledControl.getContent();
				if (this.sortAction) {
					subtitle = this.sortAction + " / " + this.filterAction;
				} else {
					subtitle = this.filterAction;
				}
				this.$.header.setTitleBelow(subtitle);
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