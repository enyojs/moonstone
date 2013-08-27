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
						{kind: "moon.ExpandablePicker", bindings: [{from: ".model.name", to: ".content"}], noneText: "None Selected", components: [
							{bindings: [{from: ".model.value1", to: ".content"}]},
							{bindings: [{from: ".model.value2", to: ".content"}]},
							{bindings: [{from: ".model.value3", to: ".content"}]}
						]}
					]}
				]}
			]},
			{kind: "FittableRows", classes: "moon-settings-category", components: [
				{kind: "moon.Scroller", fit: true, components: [
					{name: "picker2Info", kind: "enyo.DataRepeater", components: [
						{kind: "moon.ExpandablePicker", bindings: [{from: ".model.name", to: ".content"}], noneText: "None Selected", components: [
							{bindings: [{from: ".model.value1", to: ".content"}]},
							{bindings: [{from: ".model.value2", to: ".content"}]},
							{bindings: [{from: ".model.value3", to: ".content"}]}
						]}
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
