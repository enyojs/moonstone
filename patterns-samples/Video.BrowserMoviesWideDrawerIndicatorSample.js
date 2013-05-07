enyo.kind({
    //* @public
    name: "moon.sample.video.BrowserMoviesWideDrawerIndicatorSample",
    kind: "",
    //* @protected
    imgList: [
        {src: "assets/album.png", name: "MOVIE NAME"},
        {src: "assets/album.png", name: "MOVIE NAME"},
        {src: "assets/album.png", name: "MOVIE NAME"},
        {src: "assets/album.png", name: "MOVIE NAME"},
        {src: "assets/album.png", name: "MOVIE NAME"},
        {src: "assets/album.png", name: "MOVIE NAME"},
        {src: "assets/album.png", name: "MOVIE NAME"},
        {src: "assets/album.png", name: "MOVIE NAME"},
        {src: "assets/album.png", name: "MOVIE NAME"},
        {src: "assets/album.png", name: "MOVIE NAME"},
        {src: "assets/album.png", name: "MOVIE NAME"},
        {src: "assets/album.png", name: "MOVIE NAME"},                
    ],    
    headerComponents: [
        {classes: "moon-video-browsermovie-header-button", components: [
            {kind: "moon.IconButton", src: "assets/icon-list.png"}
        ]}
    ],
    components: [
        {kind: "enyo.Spotlight"},

        {classes: "moon-header-close-container", ontap:"activateDrawer", components: [
            {classes: "moon-header-close-box", spotlight: true, components: [
                {name: "closeText", tag: "p", content: "CLOSE", showing: false, classes: "moon-header-close-content text"},
                {name: "searchIcon", tag: "img", src:"../samples/assets/search-input-search.png", classes: "moon-header-close-content img"}
            ]}
        ]},
        {name: "drawer", kind: "enyo.Drawer", open: false, components: [
            {kind: "moon.sample.search.RecentSearchDrawerSample", style: "z-index: 5;"}
        ]},
        {name: "panel1", kind: "moon.Panel", fit: true, titleAbove: "02", title: "Browser Movies", classes: "enyo-unselectable moon moon-video-browsermovies", components: [
            {
                classes: "moon-video-browsermovies-container",
                name: "gridlist",
                kind: "moon.GridList",
                fit: true,
                count: 12,
                onSetupItem: "setupGridItem",
                touch: true,
                itemWidth: 230,
                itemHeight: 130,
                itemSpacing: 30,
                components: [
                    {name: "gridItem", kind: "moon.GridList.ImageItem"},
                    {name: "gridCaption", classes: "moon-video-browsermovies-item-label"}
                ]
            }
        ]}
    ],

    initComponent: function(){
        this.inherited(arguments);
    },
    setupGridItem: function(inSender, inEvent) {
        var i = inEvent.index;
        var gridItem = this.imgList[i];
        if (!gridItem.src) {
            return;
        }
        this.$.gridItem.setSource(gridItem.src);
        this.$.gridCaption.setContent(gridItem.name);
        this.$.gridItem.setSelected(this.$.gridlist.isSelected(i));
    },

    //* @public
    activateDrawer: function() {
        this.$.drawer.setOpen(!this.$.drawer.open);
        if(this.$.drawer.open){
            this.$.closeText.setShowing(true);
            this.$.searchIcon.setShowing(false);

        } else {
            this.$.closeText.setShowing(false);
            this.$.searchIcon.setShowing(true);
            enyo.Spotlight.spot(this.$.panel1);
        }
    },
});
