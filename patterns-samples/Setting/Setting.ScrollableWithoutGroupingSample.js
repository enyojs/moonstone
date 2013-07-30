//Settings Main Menu View
enyo.kind({
	//* @public
	name: "moon.sample.setting.ScrollableWithoutGroupingSample",
	kind: "moon.Panel",
	//* @protected
	title: "SETTINGS CATEGORY",
	components: [
		{ 
			kind: "HFlexBox",
			components: [
				{
					kind: "VFlexBox",
					classes: "moon-settings-category",
					components: [
						{
							name: "pickerInfo",
							kind: "moon.DataList",
							components: [
								{
									kind: "moon.ExpandablePicker",
									bindFrom: "name",
									bindTo: "content",
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
									],
									noneText: "VALUE"
								}
							]
						}
					]
				},
				{
					kind: "VFlexBox",
					classes: "moon-settings-category",
					components: [
						{
							name: "picker2Info",
							kind: "moon.DataList",
							components: [
								{
									kind: "moon.ExpandablePicker",
									bindFrom: "name",
									bindTo: "content",
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
									],
									noneText: "VALUE"
								}
							]
						}
					]
				}  
			]  
		}
	],
	bindings: [
		{from: ".controller.pickers",to: "$.pickerInfo.controller"},
		{from: ".controller.pickers2",to: "$.picker2Info.controller"}
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
		]),
		pickers2: new enyo.Collection([
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
					kind: "moon.sample.setting.ScrollableWithoutGroupingSample",
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
