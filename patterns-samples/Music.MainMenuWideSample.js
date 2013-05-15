// Sample view

enyo.kind({
    name: "enyo.VCenter",
    kind: "enyo.Control",
    create: function() {
        this.inherited(arguments);
        this.contentChanged();
    },
    components: [{
        classes: "vertical-align-center-wrapper",
        components: [{
            name: "client",
            classes: "vertical-align-center-content"
        }]
    }],
    create: function() {
        this.inherited(arguments);
        // Fix See http://caniuse.com/#search=table-cell
        if (enyo.platform.ie < 8) {
            this.$.client.applyStyle("display", "inline-block");
        }
    },
    contentChanged: function() {
        this.$.client.setContent(this.content);
    }
});

enyo.kind({
    name: "moon.sample.music.MainMenuWideSample",
    kind: "moon.Panel",
    titleAbove: "01",
    title: "Main Menu",
    titleBelow: "",
    components: [
        {
            kind: "FittableColumns",
            fit: true,
            components: [
                {
                    kind: "moon.DataList",
                    name: "menus",
                    classes: "moon-music-mainmenu-menu",
                    components: [
                        {kind: "moon.Item", ontap: "onTap", bindFrom: "name"}
                    ]
                },
                {
                    fit: true,
                    kind: "enyo.VCenter",
                    allowHtml: true,
                    classes: "moon-music-mainmenu-branding",
                    components: [
                        {content: "branding"},
                        {content: "branding"},
                        {content: "branding"},
                        {content: "branding"},
                    ]
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.menu", to: "$.menus.controller"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel0 = new enyo.Model({
        menu: new enyo.Collection([
            {name: "Browser video"},
            {name: "Browser photos"},
            {name: "Browser music"}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.MainMenuWideSample",
                    controller: ".app.controllers.menuController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "menuController", 
                kind: "enyo.ModelController",
                model: sampleModel0,
                onTap: function(inSender, inEvent) {
                    console.log("on Menu Tap: " + inEvent.originator.name);
                }
            }
        ]
    });
});