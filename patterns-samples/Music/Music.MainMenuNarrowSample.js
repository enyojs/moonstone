// Sample view

enyo.kind({
	name: "moon.sample.music.MainMenuNarrowSample",
	kind: "moon.Panels",
	pattern: "alwaysviewing",
	useHandle: true,
	components: [
		{
			titleAbove: "01",
			title: "Main Menu",
			titleBelow: "",
			components: [
				{
					kind: "moon.DataList",
					name: "menus",
					components: [
						{kind: "moon.Item", bindings: [
							{from: ".model.name", to: ".content"}
						]}
					]
				}
			]
		}
	],
	bindings: [
		{from: ".controller.menu", to: ".$.menus.controller"}
	]
});

// Sample model

enyo.ready(function(){
	var sampleModel = new enyo.Model({
		menu: new enyo.Collection([
			{name: "Browse video", open: "enyo.BrowseVideo", options: {}},
			{name: "Browse photos", open: "enyo.BrowsePhotos", options: {}},
			{name: "Browse music", open: "enyo.BrowseMusic", options: {}}
		])
	});

//  Application to render sample

	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			components: [
				{
					kind: "moon.sample.music.MainMenuNarrowSample",
					controller: ".app.controllers.menuController",
					classes: "enyo-fit"
				},
				{kind: "enyo.Image", style: "height:100%; width:100%; z-index: -1", src: enyo.Image.placeholder}
			]
		},
		controllers: [
			{
				name: "menuController",
				kind: "enyo.ModelController",
				model: sampleModel
			}
		]
	});
});
