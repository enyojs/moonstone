//Settings Settings Menu View
enyo.kind({
	//* @public
    name: "moon.sample.setting.CategoryInlinePickerSample",
	kind: "moon.Panel",
	//* @protected
    title: "SETTINGS CATEGORY",
	titleBelow: "Description of Setting Category",
	components: [
		{
			name: "pickersInfo",
			kind: "moon.DataList",
			components: [
				{
					kind: "moon.ExpandablePicker",
					bindFrom: "name",
					bindTo: "content",
					noneText: "VALUE",	
					components: [
					    {
					    	bindFrom: "value1",
					    	bindTo: "content"
					    },
					    {
					    	bindFrom: "value2",
					    	bindTo: "content"
					    },
					    {
					    	bindFrom: "value3",
					    	bindTo: "content"
					    }
					]
				}
			]
		}
	],
	bindings: [
		{from: ".controller.pickers", to: "$.pickersInfo.controller"}
	]
});

  //Settings Settings Menu Model
enyo.ready(function(){
	var settingModel = new enyo.Model({
		pickers: new enyo.Collection([
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"}

		])
	});

//  Application to render sample
	new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                	kind: "moon.sample.setting.CategoryInlinePickerSample",
                    controller: ".app.controllers.settingCategoryController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "settingCategoryController",
                kind: "enyo.ModelController",
                model: settingModel
            }
        ]
    });
});
