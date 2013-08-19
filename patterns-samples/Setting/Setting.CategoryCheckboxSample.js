//Settings Settings Menu View
enyo.kind({
	//* @public
    name: "moon.sample.setting.CategoryCheckboxSample",
	kind: "moon.Panel",
	//* @protected
    title: "SETTINGS CATEGORY",
	titleBelow: "Description of Setting Category",
	components: [
		{
			name: "caterogryInfo",
			kind: "moon.DataList",
			components: [
				{
					kind: "moon.CheckboxItem",
					ontap: "changeItemName",
					bindings: [
                        {from: ".model.name", to: ".content"}
                    ]
				}
			]
		}
	],
	bindings:[
		{from: ".controller.categories", to: ".$.caterogryInfo.controller"}
	]
});

//Settings Settings Menu Model
enyo.ready(function(){
	var settingModel = new enyo.Model({
		categories: new enyo.Collection([
			{name: "ITEM"},
			{name: "ITEM"},
			{name: "ITEM"},
			{name: "ITEM"},
			{name: "ITEM"},
			{name: "ITEM"},
			{name: "ITEM"}
		])
	});

//  Application to render sample
	new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                	kind: "moon.sample.setting.CategoryCheckboxSample",
                    controller: ".app.controllers.settingCategoryController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "settingCategoryController",
                kind: "enyo.ModelController",
                model: settingModel,
                changeItemName: function(inSender, inEvent){
                    inSender.parent.controller.set("name", "Changed");
                }
            }
        ]
    });
});
