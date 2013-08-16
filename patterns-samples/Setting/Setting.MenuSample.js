// Settings Main Menu View
enyo.kind({
	//* @public
    name: "moon.sample.setting.MenuSample",
	kind: "moon.Panel",
	//* @protected
    title: "Settings",
	components: [
        {kind: "FittableColumns", fit: true, components: [
			{name: "caterogryInfo", kind: "moon.DataList", fit: true, components: [
				{kind: "moon.Item", bindings: [
					{from: ".model.name", to: ".content"}
				]}
			]}
		]}
    ],
	bindings: [
        {from: ".controller.categories", to: ".$.caterogryInfo.controller"}
    ]
});

// Settings Main Menu Model
enyo.ready(function(){
    var menuModel = new enyo.Model({
		categories: new enyo.Collection([
			{name: "SETTINGS CATEGORY 1"},
			{name: "SETTINGS CATEGORY 2"},
			{name: "SETTINGS CATEGORY 3"},
			{name: "SETTINGS CATEGORY 4"},
			{name: "SETTINGS CATEGORY 5"}
	   ])
	});

	//  Application to render sample
	new enyo.Application({
        controllers: [
            {name: "settingMenuController", kind: "enyo.ModelController", model: menuModel}
		],
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {kind: "moon.sample.setting.MenuSample", controller: ".app.controllers.settingMenuController", classes: "enyo-fit"}
            ]
        }
    });
});
