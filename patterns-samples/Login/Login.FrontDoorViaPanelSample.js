// moon.sample.login.FrontDoorViaPanelSample

enyo.kind({
    //* @public
    name: "moon.sample.login.FrontDoorViaPanelSample",
    kind: "moon.Panel",
    //* @protected
    allowHtmlHeader: true,
    title: "3<sup>rd</sup> PARTY APP NAME",
    components: [
        {kind: "FittableColumns", components: [
            {
                name: "appInfo", 
                kind: "enyo.DataRepeater",                 
                components: [
                    {
                        bindings: [
                            {from: ".model.text", to: ".$.panelButton.content"}
                        ],
                        components: [
                            {
                                name: "panelButton",
                                kind: "moon.Button",
                                ontap: "selectApp",
                                style: "width: 300px; display:block;",
                                classes: "moon-neutral moon-margin-top-bottom"
                            }
                        ]
                    }
                ]
            },
            {fit: true, classes: "moon-vspacing", components:[
                {kind: "FittableColumns", components:[
                    {content: "Email", classes: "moon-4h"},
                    {kind: "moon.InputDecorator", fit: true, components: [
                        {name: "email", kind: "moon.Input", onchange: "emailChanged"}
                    ]}
                ]},
                {kind: "FittableColumns", components:[
                    {content: "Password", classes: "moon-4h"},
                    {kind: "moon.InputDecorator", fit: true, components: [
                        {name: "password", kind: "moon.Input", onchange: "passwordChanged", type: "password"}
                    ]}
                ]},
                {
                    kind: "enyo.ToolDecorator",
                    layoutKind: 'FittableColumnsLayout',
                    fit: true,
                    style: "display:block; text-align: center;",
                    components: [
                        {kind: "moon.CheckboxItem", checked: true, content: "Log in setting", style:"display:inline-block;"},
                        {kind: "moon.Button", content: "Log in", classes: "moon-neutral"},
                        {kind: "moon.Button", content: "Registration", classes: "moon-neutral"}
                    ]
                }
            ]}
        ]}
    ],
    bindings: [
        {from: ".controller.apps", to: ".$.appInfo.controller"}
    ],

    //* @public

    emailChanged: function(){
        this.log("The email was changed");
    },
    passwordChanged: function(){
        this.log("The password was changed");
    }
});

enyo.ready(function(){

// Sample model

    var sampleModel = new enyo.Model({
        apps: new enyo.Collection([
            {text: "LOG IN WITH FACEBOOK"},
            {text: "LOG IN WITH TWITTER"},
            {text: "JOIN APP"}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.login.FrontDoorViaPanelSample",
                    controller: ".app.controllers.loginFrontDoorViaPanelController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "loginFrontDoorViaPanelController",
                kind: "enyo.ModelController",
                model: sampleModel,
                selectApp: function(inSender, inEvent) {
                    inSender.parent.controller.set("text", "We are the Champions");
                }
            }
        ]
    });
});
