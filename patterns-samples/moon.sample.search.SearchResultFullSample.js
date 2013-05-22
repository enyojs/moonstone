enyo.kind({
	//* @public
	name: "moon.sample.search.SearchResultFullSample",
	kind: "FittableRows",
	//* @protected
	fit: true,
	classes: "moon enyo-unselectable",
	components: [
		{kind: "enyo.Spotlight"},
		{classes: "left-panel", components: [
			{classes: "left-panel-content", components: [
				{content: "01", classes: "left-panel-number"},
				{content: "MAIN MENU", classes: "left-panel-title"}
			]}
		]},
		{classes: "right-panel", components: [
			{
				name: "",
				kind: "moon.Panel",
				titleAbove: "02",
				title: "Search",
				classes: "moon-sample-search-RecentSearchFullSample",
				headerComponents: [
					{kind: "moon.IconButton", classes: "moon-header-delete-button", src: "assets/trash-can-icon.png"}
				],
				components: [
					{kind: "FittableColumns", classes: "moon-header-search", style: "width: 100%;", components: [
						{classes: "moon-header-search-left"},
						{kind: "moon.InputDecorator", fit: true, style: "", components: [
							{kind: "moon.Input", placeholder: "Search term", onchange: "inputChanged"},
							{kind: "Image", src: "../samples/assets/search-input-search.png"}
						]},
						{classes: "moon-header-search-right"}
					]},
					{
						name: "gridlist",
						kind: "moon.GridList",
						onSetupItem: "setupItem",
						fit:true,
						count:20,
						toggleSelected: true,
						itemWidth: 200,
						itemHeight: 130,
						itemSpacing: 20,
						classes:"grid-list",
						components: [
							{name: "item", kind: "moon.GridList.ImageItem"}
						]
					}
				]
			}
		]}
	],

	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		this.$.item.setSource("assets/default-movie.png");
		this.$.item.setCaption("RESULT");
		this.$.item.setSelected(this.$.gridlist.isSelected(i));
	}

	//* @public

	// Do something
});
