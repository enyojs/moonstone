//Settings Menu View
enyo.kind({
	//* @public
	name: "moon.sample.setting.HelpDescriptionSample",
	kind: "moon.Panel",
	//* @protected
	title: "SETTINGS CATEGORY",
	components: [
		{
			name: "picker1",
			kind: "moon.ExpandablePicker",
			helpText: "Lorem ipsum dolor sit amet, consec tetur adipisc ing elit." +
					"Sed tortor est, vulpuate non adipisc ing eget, semper a nisl. Pellentesque nunc lacus.",
			components: [
				{
					name: "p1Value1",
					bindFrom: "p1Value1"
				},
				{
					name: "p1Value2",
					bindFrom: "p1Value2"
				},
				{
					name: "p1Value3",
					bindFrom: "p1Value3"
				}
			]
		},
		{
			name: "picker2",
			kind: "moon.ExpandablePicker",
			helpText: "Lorem ipsum dolor sit amet, consec tetur adipisc ing elit." +
					"Sed tortor est, vulpuate non adipisc ing eget, semper a nisl. Pellentesque nunc lacus.",
			components: [
				{
					name: "p2Value1",
					bindFrom: "p2Value1"
				},
				{
					name: "p2Value2",
					bindFrom: "p2Value2"
				},
				{
					name: "p2Value3",
					bindFrom: "p2Value3"
				}
			]
		},
		{
			name: "picker3",
			kind: "moon.ExpandablePicker",
			components: [
				{
					name: "p3Value1",
					bindFrom: "p3Value1"
				},
				{
					name: "p3Value2",
					bindFrom: "p3Value2"
				},
				{
					name: "p3Value3",
					bindFrom: "p3Value3"
				}
			]
		}
	],
	bindings: [
		{from: ".controller.picker1", to: "$.picker1.content"},
		{from: ".controller.p1Value1", to: "$.p1Value1.content"},
		{from: ".controller.p1Value2", to: "$.p1Value2.content"},
		{from: ".controller.p1Value3", to: "$.p1Value3.content"},
		{from: ".controller.picker2", to: "$.picker2.content"},
		{from: ".controller.p2Value1", to: "$.p2Value1.content"},
		{from: ".controller.p2Value2", to: "$.p2Value2.content"},
		{from: ".controller.p2Value3", to: "$.p2Value3.content"},
		{from: ".controller.picker3", to: "$.picker3.content"},
		{from: ".controller.p3Value1", to: "$.p3Value1.content"},
		{from: ".controller.p3Value2", to: "$.p3Value2.content"},
		{from: ".controller.p3Value3", to: "$.p3Value3.content"}
	]
});

//Settings Menu Model
enyo.ready(function(){
	var settingModel = new enyo.Model({
		picker1: "PICKER NAME",
		p1Value1: "VALUE",
		p1Value2: "VALUE",
		p1Value3: "VALUE",
		picker2: "PICKER NAME",
		p2Value1: "VALUE",
		p2Value2: "VALUE",
		p2Value3: "VALUE",
		picker3: "PICKER NAME",
		p3Value1: "VALUE",
		p3Value2: "VALUE",
		p3Value3: "VALUE"
	});

//  Application to render sample
	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			components: [
				{kind: "enyo.Spotlight"},
				{
					kind: "moon.sample.setting.HelpDescriptionSample",
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