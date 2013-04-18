enyo.kind({
    name: "moon.sample.photos.AlbumListWideSample",
	kind: "moon.Panels",
	classes: "photos-album",
	title: "Albums",
	components: [
	
		{name: "Albums", title: "Albums", components: [
			{kind: "FittableColumns", components: [
				{kind: "enyo.Spotlight"},
				{
					kind: "moon.List", 
					spotlight: true,
					style: "width: 15%;",
					orient:"v", 
					count: 5, 
					onSetupItem: "setupImageItem", 
					components: [
						{
							name: "imageItem", 
							kind: "moon.ImageItem", 
							source: "assets/album.png", 
							label: "ALBUM NAME", 
							ontap: "decorateTapEvent",
						}
					]
				},
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
			]}
			
		]}
	],
	
	setupImageItem: function(inSender, inEvent) {

	},

	rendered: function() {
        this.inherited(arguments);
        this.search();
    },

	search: function() {
		var params = {
			method: "flickr.photos.search",
			format: "json",
			api_key: "2a21b46e58d207e4888e1ece0cb149a5",
			per_page: 50,
			page: 0,
			text: "korean Idol",
			sort: "date-posted-desc",
			extras: "url_m"
		};
		new enyo.JsonpRequest({url: "http://api.flickr.com/services/rest/", callbackName: "jsoncallback"}).response(this, "processFlickrResults").go(params);
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

	decorateTapEvent: function(inSender, inEvent) {
		inEvent = enyo.mixin(inEvent, {
			title: inSender.getContent(),
			url:   inSender.url
		});
	}
});
