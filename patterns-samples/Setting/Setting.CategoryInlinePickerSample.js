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
			scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" },
			fit: true,
			components: [
				{
					kind: "moon.ExpandablePicker",
					bindings: [
                        {from: ".model.name", to: ".content"}
                    ],
					noneText: "VALUE",	
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
					]
				}
			]
		}
	],
	bindings: [
		{from: ".controller.pickers", to: ".$.pickersInfo.controller"}
	]
});

//Settings Settings Menu Model
enyo.ready(function(){
	var settingModel = new enyo.Model({
		pickers: new enyo.Collection([
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE2", value3: "VALUE3"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE2", value3: "VALUE3"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE2", value3: "VALUE3"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE2", value3: "VALUE3"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE2", value3: "VALUE3"}

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
