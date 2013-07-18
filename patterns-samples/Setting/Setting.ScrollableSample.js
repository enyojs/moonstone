//Settings Main Menu View
enyo.kind({
	//* @public
	name: "moon.sample.setting.ScrollableSample",
	kind: "moon.Panel",
	//* @protected
	title: "SETTINGS CATEGORY",
	components: [
		{kind: "moon.Scroller", horizontal: "hidden", classes: "enyo-fill", components:[
			{kind : "FittableRows", components: [
				{
					kind: "moon.Divider",
					content: "SETTINGS CATEGORY"
				},
				{
					kind: "FittableColumns",
					components: [
						{
							kind: "FittableRows",
							classes: "moon-settings-category",
							components: [
								{
									name: "pickerInfo",
									kind: "moon.DataList",
									scrollerOptions: "false",
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
							kind: "FittableRows",
							classes: "moon-settings-category",
							components: [
								{
									name: "picker",
									kind: "moon.DataList",
									scrollerOptions: "false",
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
				},
				{
					kind: "moon.Divider",
					content: "SETTINGS CATEGORY2"
				},
				{
					kind: "FittableColumns",
					components: [
						{
							kind: "FittableRows",
							classes: "moon-settings-category",
							components: [
								{
									name: "picker2Info",
									kind: "moon.DataList",
									scrollerOptions: "false",
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
							kind: "FittableRows",
							classes: "moon-settings-category",
							components: [
								{
									name: "item",
									kind: "moon.CheckboxItem"
								},
								{
									name: "picker2",
									kind: "moon.DataList",
									scrollerOptions: "false",
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
			]}
		]}
	],
	bindings: [
		{from: ".controller.picker", to: "$.picker.controller"},
		{from: ".controller.picker2", to: "$.picker2.controller"},
		{from: ".controller.item", to: "$.item.content"},
		{from: ".controller.pickers", to: "$.pickerInfo.controller"},
		{from: ".controller.pickers2", to: "$.picker2Info.controller"}
	]
});

//Settings Settings Menu Model
enyo.ready(function(){
	var settingModel = new enyo.Model({
		picker: new enyo.Collection([
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"}
		]),
		picker2: new enyo.Collection([
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"}
		]),
		item: "ITEM",
		pickers: new enyo.Collection([
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"},
			{name: "PICKER NAME", value1: "VALUE", value2: "VALUE", value3: "VALUE"}
		]),
		pickers2: new enyo.Collection([
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
					kind: "moon.sample.setting.ScrollableSample",
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
