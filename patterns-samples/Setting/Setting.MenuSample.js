//Settings Main Menu View
enyo.kind({
	//* @public
    name: "moon.sample.setting.MenuSample",
	kind: "moon.Panel",
	//* @protected
    title: "SETTINGS",
	components: [
        {
		  	kind: "FittableColumns",
		  	fit: true,
		  	components: [
				{
					name: "caterogryInfo",
			    	kind: "moon.DataList",
					components: [
						{
						    kind: "moon.Item",
						    ontap: "changeItemName",
                            bindings: [
                                {from: ".model.name", to: ".content"}
                            ]
						}
					]
				}
            ]
        }
    ],
	bindings: [
        {from: ".controller.categories", to: ".$.caterogryInfo.controller"}
    ]
});

//Settings Main Menu Model
enyo.ready(function(){
    var menuModel = new enyo.Model({
		categories: new enyo.Collection([
			{name: "SETTINGS CATEGORY"},
			{name: "SETTINGS CATEGORY"},
			{name: "SETTINGS CATEGORY"},
			{name: "SETTINGS CATEGORY"},
			{name: "SETTINGS CATEGORY"}
	   ])
	});

//  Application to render sample
	new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                	kind: "moon.sample.setting.MenuSample",
                    controller: ".app.controllers.settingMenuController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "settingMenuController",
                kind: "enyo.ModelController",
                model: menuModel,
                changeItemName: function(inSender, inEvent){
                    inSender.parent.controller.set("name", "Changed");
                }
            }
        ]
    });
});
