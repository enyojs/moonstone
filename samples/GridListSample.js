enyo.kind({
	name: "moon.sample.GridListSample",
	classes: "moon moon-sample enyo-fit",
	kind: "FittableRows",
	components: [
		{kind: "enyo.Spotlight"},
		{classes: "moon-subheader", content: "MoonRaker GridList Sample"},
		{
			name: "gridlist",
			kind: "moon.GridList",
			onSetupItem: "setupItem",
			toggleSelected: true,
			itemWidth: 140,
			itemHeight: 140,
			itemSpacing: 100,
			components: [
				{name: "item", kind: "moon.GridList.ImageItem"}
			],
			fit:true
		}
	],
	url: "http://odata.netflix.com/Catalog",
	api_key: "n7565824mb3yuv2hrgpdhvff",
	create: function() {
		this.inherited(arguments);
		if (!this.api_key) {
			this._error_missing_api_key();
		}
		this.search("007");
	},
	search: function(inSearchText, inPage) {
		if (!this.api_key) {
			this._error_missing_api_key();
			return;
		}
		this.searchText = inSearchText || this.searchText;
		// Build OData query
        var query = this.url + "/Titles?$filter=substringof('" + window.escape(this.searchText) + "',Name)" +  // filter by movie name
            "&$format=json"; // json request
        var params = {
			oauth_consumer_key: this.api_key
		};
		return new enyo.JsonpRequest({url: query, callbackName: "$callback"}) .response(this, "processResponse") .go(params);
	},
	processResponse: function(inSender, inResponse) {
		this.results = [];
		var movies = inResponse ? inResponse["d"]["results"] || [] : [];
		if (movies.length === 0) {
			return [];
		}
		var results = [];
		for (var i = 0; i < movies.length; i++) {
			this.results.push(movies[i]);
        }
		this.$.gridlist.show(this.results.length);
		return results;
	},
	_error_missing_api_key: function () {
		enyo.error("Missing API key. Your Netflix API key is required to use this component.");
	},
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.results[i];
		this.$.item.setSource(item.BoxArt.LargeUrl);
		this.$.item.setCaption(item.Name);
		this.$.item.setSubCaption(item.Name);
		this.$.item.setSelected(this.$.gridlist.isSelected(i));
	}
});