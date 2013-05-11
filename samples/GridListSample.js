enyo.kind({
	name: "moon.sample.GridListSample",
	classes: "moon moon-sample enyo-fit",
	kind: "FittableRows",
	components: [
		{kind: "enyo.Spotlight"},
		{classes: "moon-subheader", content: "Moonstone GridList Sample"},
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
			fit: true
		}
	],
	url: "http://api.flickr.com/services/rest/?",
	api_key: "2a21b46e58d207e4888e1ece0cb149a5",
	create: function() {
		this.inherited(arguments);
		if (!this.api_key) {
			this._error_missing_api_key();
			return;
		}
		this.search("007", 1);
	},
	search: function(inSearchText, inPage) {
		// Capture searchText and strip any whitespace
		var searchText = inSearchText.replace(/^\s+|\s+$/g, '');
		if (!this.api_key) {
			this._error_missing_api_key();
			return;
		}
		this.searchFlickr(searchText, inPage);
	},
	searchFlickr: function(inSearchText, inPage) {
		var params = {
			method: "flickr.photos.search",
			format: "json",
			api_key: this.api_key,
			per_page: 100,
			page: inPage,
			text: inSearchText,
			sort: 'date-posted-desc',
			extras: 'url_m'
		};
		new enyo.JsonpRequest({url: this.url, callbackName: "jsoncallback"}).response(this, "processResponse").go(params);
	},
	_error_missing_api_key: function () {
		enyo.error("Missing API key. Your Flickr API key is required to use this component.");
	},
	processResponse: function(inRequest, inResponse) {
		this.results = inResponse.photos.photo;
		this.$.gridlist.show(this.results.length);
	},
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.results[i];
		if (!item.url_m) {
			return;
		}
		this.$.item.setSource(item.url_m);
		this.$.item.setCaption(item.title);
		this.$.item.setSubCaption(item.id);
		this.$.item.setSelected(this.$.gridlist.isSelected(i));
	}
});
