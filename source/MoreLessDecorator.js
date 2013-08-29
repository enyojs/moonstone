enyo.kind({
    name: "moon.MoreLessDecorator",
    classes: "moon-more-less-decorator",
    published: {
        collapsed: true,
        moreContent: $L("more"),
        lessContent: $L("less"),
        lineClamp: 3
    },
    events: {
        onChange: ""
    },
    handlers: {
        onTap: "tap",
        onSpotlightFocus : "spotFocus",
        onSpotlightBlur : "spotBlur",
        onenter: "enter",
        onleave: "leave"
    },
    components:[
        {name: "client", kind: "enyo.Control", classes: "moon-more-less-decorator-client"},
        {name: "moreButton", kind: "moon.Button", small: true, classes: "moon-more-less-decorator-button"}
    ],
    create: function() {
        this.inherited(arguments);
        this.updateButtonContent();
        this.updateCollapsed();
    },
    collapsedChanged: function() {
        this.updateButtonContent();
        this.updateCollapsed();
        this.doChange({collapsed: this.collapsed});
    },
    moreContentChanged: function() {
        this.updateButtonContent();
    },
    lessContentChanged: function() {
        this.updateButtonContent();
    },
    lineClampChanged: function() {
        this.updateCollapsed();
    },
    updateButtonContent: function() {
        this.$.moreButton.setContent((this.collapsed) ? this.moreContent : this.lessContent);
    },    
    updateCollapsed: function() {
        this.addRemoveClass('collapse', this.collapsed);
        this.$.client.applyStyle("-webkit-line-clamp", this.lineClamp);
    },
    tap: function() {
        this.setCollapsed(!this.collapsed);
    },
    enter: function(inSender, inEvent) {
        console.log("enter");
    },
    leave: function(inSender, inEvent) {
        console.log("leave");
    },
    spotFocus: function(inSender, inEvent) {
        console.log("spotFocus");
    },
    spotBlur: function(inSender, inEvent) {
        console.log("spotBlur");
    },
});
