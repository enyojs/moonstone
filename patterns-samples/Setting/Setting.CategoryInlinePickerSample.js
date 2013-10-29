//Settings Settings Menu View
enyo.kind({
	//* @public
	name: "moon.sample.setting.CategoryInlinePickerSample",
	kind: "moon.Panel",
	//* @protected
	title: "SETTINGS CATEGORY",
	titleBelow: "Description of Setting Category",
	components: [
		{kind: "moon.Scroller", classes: "enyo-fill", components: [
			{
				name: "pickersInfo",
				kind: "enyo.DataRepeater",
				selection: false,
				fit: true,
				components: [
					{
						kind: "moon.ExpandablePicker",
						bindings: [
							{from: ".model.name", to: ".content"},
							{from: ".model.value1", to: ".$.item1.content"},
							{from: ".model.value2", to: ".$.item2.content"},
							{from: ".model.value3", to: ".$.item3.content"}
						],
						noneText: "None Selected",
						components: [
							{ name: "item1" },
							{ name: "item2" },
							{ name: "item3" }
						]
					}
				]
			}
		]}
	],
	bindings: [
		{from: ".controller.pickers", to: ".$.pickersInfo.controller"}
	]
});

//Settings Settings Menu Model
enyo.ready(function(){
	var settingModel = new enyo.Model({
		pickers: new enyo.Collection([
			{name: "PICKER NAME 1", value1: "VALUE1-1", value2: "VALUE1-2", value3: "VALUE1-3"},
			{name: "PICKER NAME 2", value1: "VALUE2-1", value2: "VALUE2-2", value3: "VALUE2-3"},
			{name: "PICKER NAME 3", value1: "VALUE3-1", value2: "VALUE3-2", value3: "VALUE3-3"},
			{name: "PICKER NAME 4", value1: "VALUE4-1", value2: "VALUE4-2", value3: "VALUE4-3"},
			{name: "PICKER NAME 5", value1: "VALUE5-1", value2: "VALUE5-2", value3: "VALUE5-3"}
		])
	});

//  Application to render sample
	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			components: [
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
