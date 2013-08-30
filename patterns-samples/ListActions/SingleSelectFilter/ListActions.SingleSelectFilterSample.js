enyo.kind({
	name: "moon.sample.listactions.SingleSelectFilterSample",
	fit: true,
	kind:"FittableRows",
	classes: "single-select-filter-pattern moon",
	handlers: {
		onActivate: "activateHandler"
	},
	components: [
<<<<<<< HEAD

		{kind: "moon.Panels", classes:"enyo-fit", pattern:"alwaysviewing", components: [
			{kind:"moon.Panel", title:"Browse Movies", headerComponents: [
=======
		{kind: "enyo.Spotlight"},
		{classes:"left-panel", components:[
			{classes:"left-panel-content", components:[
				{content:"01", classes:"left-panel-number"},
				{content:"MAIN MENU", classes:"left-panel-title"}
			]}
		]},
		{classes:"right-panel", components:[
			{name: "header", kind:"moon.Header", title: "Browse Movies", titleAbove: "03", components: [
>>>>>>> 525a7b72baf6c627c700b606b168b1117f6d51d4
				{kind: "moon.ListActions", iconSrc:"../../../images/list-actions-activator.png", autoCollapse:true, listActions:[
					{components: [
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
					]}
				]}
			], components: [
				{
					name: "gridlist",
					kind: "moon.GridList",
					classes: "grid-list",
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
			this.$.header.setTitleBelow(inEvent.toggledControl.getContent());
		}
	}
});