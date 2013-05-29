//Account Settings Menu View
enyo.kind({
	//* @public
    name: "moon.sample.setting.AccountSettingSample",
    kind: "moon.Panel",
    //* @protected
    title: "ACCOUNT SETTINGS",
    titleBelow: "Description of Settings Category",
    components: [
        {
            kind: "FittableColumns",
 
            components: [
                {
                    name: "eMail",
                    classes: "moon-cetner-item"
                },
                {
                    name: "signOutButton",
                    kind: "moon.Button",
                    bindFrom: "signOutButton",
                    classes: "moon-light-gray"
                }
            ]
        },
    	{
    		kind: "FittableColumns",
    		components: [
    			{
    				name: "autoSign",
                    kind: "moon.LabeledToggleButton"
    			}
    		]
    	},
    	{name: "help", classes: "moon-settings-content"},
    	{
    		name: "createAccountButton",
    		kind: "moon.Button",
    		bindFrom: "createAccountButton",
    		classes: "moon-light-gray"
    	}
    ],
    bindings: [
        {from: ".controller.eMail", to: "$.eMail.content"},
        {from: ".controller.signOutButton", to: "$.signOutButton.content"},
        {from: ".controller.autoSign", to: "$.autoSign.content"},     
        {from: ".controller.help", to: "$.help.content"},
        {from: ".controller.createAccountButton", to: "$.createAccountButton.content"}
    ]
});

//Account Settings Menu Model
enyo.ready(function(){
	var accountModel = new enyo.Model({
		eMail: "hancuna@naver.com",
		signOutButton: "Sign out",
		autoSign: "Auto Sign in",		
		help: "Create your account to: " +
			  "Keep up with your favorite channels" +
			  "Save videos  to watch later, watch recommendations just for you, or" +
			  "subscribe to get updates from your favorite channels",
		createAccountButton: "Create New Account"
	});

//  Application to render sample
	new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                	kind: "moon.sample.setting.AccountSettingSample",
                    controller: ".app.controllers.settingAccountController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "settingAccountController",
                kind: "enyo.ModelController",
                model: accountModel
            }
        ]
    });
});
