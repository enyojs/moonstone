//Settings Main Menu View
enyo.kind({
	//* @public
	name: "moon.sample.setting.MainMenuSample",
	kind: "moon.Panel",
	//* @protected
	title: "Main Menu",
	components:[
		{
			kind: "FittableColumns",
			fit: true,
			components: [
				{
					kind: "FittableRows",
					classes: "moon-setting-main-menu .menu",
					components: [
						{
							name: "itemInfo",
							kind: "moon.DataList",
							fit: true,
							components: [
								{
									kind: "moon.Item",
									ontap: "changeItemName",
									bindFrom: "name",
									bindTo: "content"
								}
							]
						},
						{
							name: "setting",
							kind: "moon.Item",
							bindFrom: "setting"
						}
					]
				},
				{
					name: "contents",
					content: "contents",
					fit: true,
					classes: "moon-setting-mainmenu-content"
				}
			]
		}
	],
	bindings: [
		{from: ".controller.items", to: "$.itemInfo.controller"},
		{from: ".controller.setting", to: "$.setting.content"},
		{from: ".controller.contents", to: "$.contents.content"}
	]
});

// Settings Main Menu Model
enyo.ready(function(){
	var menuModel = new enyo.Model({
		items: new enyo.Collection([
			{name: "MENU ITEM"},
			{name: "MENU ITEM"},
			{name: "MENU ITEM"}
		]),
		setting: "Setting",
		contents: "BRANDING"
	});

//  Application to render sample
	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			components: [
				{kind: "enyo.Spotlight"},
				{
					kind: "moon.sample.setting.MainMenuSample",
					controller: ".app.controllers.mainMenuController",
					classes: "enyo-fit"
				}
			]
		},
		controllers: [
			{
				name: "mainMenuController",
				kind: "enyo.ModelController",
				model: menuModel,
				changeItemName: function(inSender, inEvent){
					inSender.parent.controller.set("name", "Changed");
				}
			}
		]
	});
});
