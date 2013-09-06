//Settings Main Menu View
enyo.kind({
	//* @public
	name: "moon.sample.setting.ScrollableWithoutGroupingSample",
	kind: "moon.Panel",
	//* @protected
	title: "SETTINGS CATEGORY",
	fit: true,
	components: [
		{kind: "FittableColumns", fit: true, components: [
			{kind: "FittableRows", classes: "moon-settings-category", components: [
				{kind: "moon.Scroller", fit: true, components: [
					{name: "pickerInfo", kind: "enyo.DataRepeater", components: [
						{
							kind: "moon.ExpandablePicker",
							noneText: "None Selected",
							bindings: [
								{from: ".model.name", to: ".content"},
								{from: ".model.value1", to: ".$.item1.content"},
								{from: ".model.value2", to: ".$.item2.content"},
								{from: ".model.value3", to: ".$.item3.content"}
							],
							components: [
								{ name: "item1" },
								{ name: "item2" },
								{ name: "item3" }
							]
						}
					]}
				]}
			]},
			{kind: "FittableRows", classes: "moon-settings-category", components: [
				{kind: "moon.Scroller", fit: true, components: [
					{name: "picker2Info", kind: "enyo.DataRepeater", components: [
						{
							kind: "moon.ExpandablePicker",
							noneText: "None Selected",
							bindings: [
								{from: ".model.name", to: ".content"},
								{from: ".model.value1", to: ".$.item1.content"},
								{from: ".model.value2", to: ".$.item2.content"},
								{from: ".model.value3", to: ".$.item3.content"}
							],
							components: [
								{ name: "item1" },
								{ name: "item2" },
								{ name: "item3" }
							]
						}
					]}
				]}
			]}
		]}
	],
	bindings: [
		{from: ".controller.pickers",to: ".$.pickerInfo.controller"},
		{from: ".controller.pickers2",to: ".$.picker2Info.controller"}
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
		]),
		pickers2: new enyo.Collection([
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
