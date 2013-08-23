// Sample view

enyo.kind({
	name: "moon.sample.music.MainMenuWideSample2",
	kind: "moon.Panels",
	pattern: "alwaysviewing",
	classes: "moon-dark-gray",  // TODO: this should be applied automatically by moon.Panels for alwaysviewing
	components: [
		{
			kind: "moon.Panel",
			titleAbove: "01",
			title: "Main Menu",
			titleBelow: "",
			classes: "livetv-background",
			components: [
				{
					kind: "FittableColumns",
					fit: true,
					components: [
						{
							kind: "moon.DataList",
							name: "menus",
							classes: "moon-5h",
							components: [
								{kind: "moon.Item", bindings: [
									{from: ".model.name", to: ".content"}
								]}

							]
						},
						{
							content: "branding",
							fit: true,
							classes: "moon-dark-gray",
							style: "text-align: center"
						}
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
			{name: "Browse video"},
			{name: "Browse photos"},
			{name: "Browse music"}
		])
	});

//  Application to render sample

	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			style: "background-image: url(../assets/livetv-background.png); background-size: 100% 100%;",
			components: [
				{kind: "enyo.Spotlight"},
				{
					kind: "moon.sample.music.MainMenuWideSample2",
					controller: ".app.controllers.menuController",
					classes: "enyo-fit"
				}
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