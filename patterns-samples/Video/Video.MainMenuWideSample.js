enyo.kind({
	name: "moon.sample.video.MainMenuWideSample",
	kind: "moon.Panel",
	layoutKind: "FittableColumnsLayout",
	titleAbove: "01",
	title: "Main Menu",
	components: [
		{
			name: "menuList",
			kind: "enyo.DataList",
			style: "width: 300px;",
			components: [
				{
                    bindings: [
                        {from: ".model.menuItem", to: ".$.videoItem.content"}
                    ],
                    components: [
                        {name: "videoItem", kind: "moon.Item"}
                    ],
                    ontap: "changePanel"
                }
			]
		},
		{
			fit: true,
			classes: "moon-neutral",
			content: "branding"
		}
	],
	bindings: [
		{from: ".controller.menus", to: ".$.menuList.controller"}
	],
    changePanel: function(inSender, inEvent) {
        enyo.log("Item: " + inEvent.originator.getContent());
    }
});

// Sample model

enyo.ready(function(){
	var sampleModel = new enyo.Model({
		menus: new enyo.Collection([
			{menuItem: "Browse Movies"},
			{menuItem: "Browse TV Shows"},
			{menuItem: "Queue"},
			{menuItem: "Search"}
		])
	});

//  Application to render sample

	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			components: [
				{
					kind: "moon.sample.video.MainMenuWideSample",
					controller: ".app.controllers.movieController",
					classes: "enyo-fit"
				}
			]
		},
		controllers: [
			{
				name: "movieController",
				kind: "enyo.ModelController",
				model: sampleModel
			}
		]
	});
});
