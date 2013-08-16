//Settings Main Menu View
enyo.kind({
    //* @public
    name: "moon.sample.setting.NonScrollableSample",
	kind: "moon.Panel",
	//* @protected
    title: "SETTINGS CATEGORY",
	components: [
        { 
        	kind : "FittableColumns",
        	components: [
        		{
        			kind: "FittableRows",
        			classes: "moon-settings-category",
        			components: [
        				{kind: "moon.Divider", content: "SETTINGS CATEGORY"},
        				{
        					name: "pickerInfo",
        					kind: "moon.DataList",
        					scrollerOptions: "false",
        					components: [
	        					{
	        						kind: "moon.ExpandablePicker",
                                    bindings: [
                                        {from: ".model.name", to: ".content"}
                                    ],
									components: [
									    {
                                            bindings: [
                                                {from: ".model.value1", to: ".content"}
                                            ]
                                        },
                                        {
                                            bindings: [
                                                {from: ".model.value2", to: ".content"}
                                            ]
                                        },
                                        {
                                            bindings: [
                                                {from: ".model.value3", to: ".content"}
                                            ]
                                        }
									],
									noneText: "VALUE"
								}
        					]
        				}
        			]
        		},
        		{
        			kind: "FittableRows",
        			classes: "moon-settings-category",
        			components: [
        				{kind: "moon.Divider", content: "SETTINGS CATEGORY1"},
        				{
        					name: "picker",
        					kind: "moon.DataList",
                            scrollerOptions: "false",
                            components: [
                                {
                                    kind: "moon.ExpandablePicker",
                                    bindings: [
                                        {from: ".model.name", to: ".content"}
                                    ],
                                    components: [
                                        {
                                            bindings: [
                                                {from: ".model.value1", to: ".content"}
                                            ]
                                        },
                                        {
                                            bindings: [
                                                {from: ".model.value2", to: ".content"}
                                            ]
                                        },
                                        {
                                            bindings: [
                                                {from: ".model.value3", to: ".content"}
                                            ]
                                        }
                                    ],
                                    noneText: "VALUE"
                                }
                            ]
        				},
						{
							name: "item",
							kind: "moon.CheckboxItem"
						},
        				{kind: "moon.Divider", content: "SETTINGS CATEGORY2"},
        				{
        					name: "itemInfo",
        					kind: "moon.DataList",
        					scrollerOptions: "false",
        					components: [
	        					{
	        						kind: "moon.CheckboxItem",
									bindings: [
                                        {from: ".model.name", to: ".content"}
                                    ]
								}
        					]
        				}
        			]
        		}
        	]
   	 	}
    ],
	bindings: [
		{from: ".controller.picker", to: ".$.picker.controller"},
		{from: ".controller.item", to: ".$.item.content"},
        {from: ".controller.pickers", to: ".$.pickerInfo.controller"},
        {from: ".controller.items", to: ".$.itemInfo.controller"}
    ]
});

//Settings Settings Menu Model
enyo.ready(function(){
	var settingModel = new enyo.Model({
		picker: new enyo.Collection([
            {name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"}            
        ]),
		item: "ITEM",
		pickers: new enyo.Collection([
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"}
		]),
		items: new enyo.Collection([
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
                	kind: "moon.sample.setting.NonScrollableSample",
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
