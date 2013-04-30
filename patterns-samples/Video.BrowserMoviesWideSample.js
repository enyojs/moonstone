enyo.kind({
    name: "moon.sample.video.BrowserMoviesWideSample",
    kind: "moon.Panel",
    classes: "enyo-unselectable moon moon-video-browsermovies",
    titleAbove: "02",
    title: "Browser Movies",

    imgList: [
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"},
        {src: "$lib/moonraker/patterns-samples/assets/album.png", name: "MOVIE NAME"}
    ],    

    headerComponents: [
        {classes: "moon-video-browsermovie-header-button", components: [
            {kind: "moon.IconButton", src: "$lib/moonraker/patterns-samples/assets/icon-list.png"}
        ]}
    ],    
    
    components: [
/** If you want to use this template alone with spotlight, remove this comment out.
        {kind: "enyo.Spotlight"},
*/        
        {
            classes: "moon-video-browsermovies-container",
            name: "gridlist",
            kind: "moon.GridList",
            fit: true,
            count: 15,
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
    ],

    setupGridItem: function(inSender, inEvent) {
        var i = inEvent.index;
        var gridItem = this.imgList[i];
        if (!gridItem.src) {
            return;
        }
        var src = enyo.path.rewrite(gridItem.src)
        this.$.gridItem.setSource(src);
        this.$.gridCaption.setContent(gridItem.name);
        this.$.gridItem.setSelected(this.$.gridlist.isSelected(i));
    },
});