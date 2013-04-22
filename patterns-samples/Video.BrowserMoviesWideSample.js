enyo.kind({
    name: "moon.sample.video.BrowserMoviesWideSample",
    layoutKind: "enyo.FittableRowsLayout",
	classes: "enyo-unselectable moon moon-video-browsermovies",
    fit: true,
    title: "Browser Movies",
    titleAbove: "02",
    components: [
        {kind: "enyo.Spotlight"},
        {
            name: "header",
            kind: "moon.Header",
            content: "Browser Movies",
            titleAbove: "02",
        	components: [
                {
                    classes: "moon-video-browsermovie-header-button",
                    components: [
                        {kind: "moon.IconButton", src: "assets/icon-list.png"}
                    ]
                }
            ]
        },
        {
            name: "container",
            classes: "moon-video-browsermovies-container",
            fit: true,
            spotlight: "container",
            components: [
                {
                    name: "list",
                    kind: "moon.List",
                    spotlight: true,
                    orient:"v",
                    count: 0,
                    multiSelect: false,
                    showing: false,
                    classes: "enyo-fit moon-video-browsermovies-list",
            		onSetupItem: "setupItem",
                    components: [
            			{
                            name: "item",
                            kind: "enyo.FittableColumns",
                            classes: "moon-video-browsermovies-item",
                            components: [
                                {name: "image", tag: "img", classes: "moon-video-browsermovies-item-image"},
                                {kind: "enyo.FittableRows", classes: "moon-video-browsermovies-item-label", components: [{name: "name"}, {name: "id"}]}
                            ]
                        }
            		]
                }
            ]
        }
    ],
    
    rendered: function() {
        this.inherited(arguments);
        this.resizeList();
        this.search();
    },
    
    resizeList: function() {
        var rect = this.$.container.getBounds();
        this.$.list.setBounds({top: rect.top});
    },
    
    search: function() {
		var params = {
			method: "flickr.photos.search",
			format: "json",
			api_key: "2a21b46e58d207e4888e1ece0cb149a5",
			per_page: 50,
			page: 0,
			text: "korean sushi",
			sort: "date-posted-desc",
			extras: "url_m"
		};
		new enyo.JsonpRequest({url: "http://api.flickr.com/services/rest/", callbackName: "jsoncallback"}).response(this, "processFlickrResults").go(params);
	},
    
	processFlickrResults: function(inRequest, inResponse) {
		this.results = inResponse.photos.photo;
        this.$.header.set("titleBelow", this.results.length + " Movies");
        this.$.list.setCount(this.results.length);
        this.$.list.setShowing(true);
        this.$.list.render();
	},
    
    setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
        var item = this.results[i];
		this.$.item.addRemoveClass("list-sample-selected", inSender.isSelected(i));
		this.$.image.set("src", item.url_m);
		this.$.name.setContent(item.title);
		this.$.id.setContent(item.id);
	}
});
