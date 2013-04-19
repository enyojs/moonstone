enyo.kind({
    name: "moon.sample.photos.PhotoGridSample",
	kind: "moon.Panels",
	classes: "photos-album",
	params: {
		method: "flickr.photos.search",
		format: "json",
		api_key: "2a21b46e58d207e4888e1ece0cb149a5",
		per_page: 50,
		page: 0,
		text: "korean Idol",
		sort: "date-posted-desc",
		extras: "url_m"
	},
	components: [	
		{name: "Albums", title: "Albums", titleBelow: "97 Photos", components: [
			{kind: "FittableColumns", components: [
				{kind: "enyo.Spotlight"},
				{
					name: "gridlist",
					kind: "moon.GridList",
					fit: true,
					onSetupItem: "setupGridItem",
					touch: true,
					itemWidth: 270,
					itemHeight: 202,
					itemSpacing: 20,
					components: [
						{name: "gridItem", kind: "moon.GridList.ImageItem"}
					]
				}
			]},			
		],
		headerComponents: [
			{kind: "moon.IconButton", src: "assets/icon-round-extend.png"},
			{kind: "moon.IconButton", src: "assets/icon-round-share.png"},
			{kind: "moon.IconButton", src: "assets/icon-round-download.png"},
			{kind: "moon.IconButton", src: "assets/icon-round-delete.png"}
		]}
	],
	
	rendered: function() {
        this.inherited(arguments);
        this.search();
    },

	search: function() {
		new enyo.JsonpRequest({url: "http://api.flickr.com/services/rest/", callbackName: "jsoncallback"}).response(this, "processFlickrResults").go(this.params);
	},

	processFlickrResults: function(inRequest, inResponse) {
		this.results = inResponse.photos.photo;
		this.$.gridlist.show(this.results.length);
	},

	setupGridItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var gridItem = this.results[i];
		if (!gridItem.url_m) {
			return;
		}
		this.$.gridItem.setSource(gridItem.url_m);
		//this.$.gridItem.setCaption(gridItem.title);
		this.$.gridItem.setSelected(this.$.gridlist.isSelected(i));
	},
});
