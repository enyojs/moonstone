enyo.kind({
    name: "moon.MovieImageItem",
    classes: "moon-movie-list-item moon-3h moon-2v",
    spotlight: true,
    published: {
        option: {
            src: "",
            caption: ""
        }
    },
    handlers: {
        onSpotlightFocused: "focused",
        onSpotlightBlur: "released"
    },
    components: [
        {name: "caption", classes: "moon-movie-list-item-text"}
    ],
    create: function() {
        this.inherited(arguments);
        this.optionChanged();
    },
    getCaption: function() {
        return this.$.caption;
    },
    optionChanged: function(inOld) {
        this.applyStyle("background-image", 'url(' + this.option.src + ')');
        this.$.caption.setContent(this.option.caption);
    },
    focused: function() {
        this.$.caption.addClass("spotlight");
        return true;
    },
    released: function() {
        this.$.caption.removeClass("spotlight");
        return true;
    }
});

enyo.kind({
    name: "moon.ContextualLoginPopup",
    kind: "moon.ContextualPopup",
    classes: "moon-5h moon-3v",
    components: [
        {kind: "moon.Divider", content: "Log in to Service"},
        {kind: "moon.InputDecorator", spotlight: true, components: [
            {kind: "moon.Input", placeholder: "E-mail", onchange:""}
        ]},
        {kind: "moon.InputDecorator", spotlight: true, components: [
            {kind: "moon.Input", placeholder: "Password", onchange:""}
        ]},
        {content: "Log in setting Menu"},
        {kind: "moon.Button", classes: "moon-light-gray", content: "Log in"},
        {content: "or Connected with"},
        {kind: "moon.Button", classes: "moon-light-gray", content: "FACEBOOK"},
        {kind: "moon.Button", classes: "moon-light-gray", content: "TWITTER"}
    ]
});

// Sample view

enyo.kind({
    name: "moon.sample.login.ContextualPopupSample",
    kind: "moon.Panel",
    layoutKind: "FittableColumnsLayout",
    titleAbove: "01",
    title: "Main Menu",
    components: [
        {kind: "enyo.Spotlight"},
        {
            name: "menuList",
            kind: "enyo.DataList",
            style: "width: 300px;",
            components: [
                {bindFrom: "menuItem", kind: "moon.Item", ontap: "changePanel"}
            ]
        },
        {
            fit: true,
            layoutkind: "FittableRowsLayout", 
            components: [
            {
                name: "contentList",            
                kind: "enyo.DataGridList",
                fit: true,
                components: [
                    {kind: "moon.MovieImageItem", bindFrom: "itemOption", bindTo: "option"},                    
                ]
            },
            {
                name: "buttonList",
                layoutkind: "FittableRowsLayout",
                components: [
                    {kind: "moon.ContextualPopupDecorator", components: [
                        {kind: "moon.ContextualPopupButton", components: [
                            {tag: "img", attributes: {src: "assets/icon-half-like.png"}},
                            {content: "LIKE"}
                        ]},                        
                        {kind: "moon.ContextualLoginPopup"}
                    ]},
                    {kind: "moon.ContextualPopupDecorator", components: [
                        {content: "SHARE"},
                        {kind: "moon.ContextualLoginPopup"}
                    ]},
                ]
            }
        ]}
        
    ],
    bindings: [
        {from: ".controller.menus", to: "$.menuList.controller"},
        {from: ".controller.contents", to: "$.contentList.controller"}
    ]
 });

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        menus: new enyo.Collection([
            {menuItem: "Browser Movies"},
            {menuItem: "Browser TV Shows"},
            {menuItem: "Queue"},
            {menuItem: "Search"}
        ]),
        contents: new enyo.Collection([
            {itemOption: {src: "assets/default-movie-vertical.png"}},
            {itemOption: {src: "assets/default-movie-vertical.png"}},
            {itemOption: {src: "assets/default-movie-vertical.png"}},
            {itemOption: {src: "assets/default-movie-vertical.png"}}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.login.ContextualPopupSample",
                    controller: ".app.controllers.movieController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "movieController",
                kind: "enyo.ModelController",
                model: sampleModel,
                changePanel: function(inSender, inEvent) {
                    enyo.log("Item: " + inEvent.originator.parent.controller.model.get("menuItem"));
                }
            }
        ]
    });
});