//Settings Settings Menu View
enyo.kind({
	//* @public
    name: "moon.sample.setting.CategoryTextSample",
	kind: "moon.Panel",
	//* @protected
    title: "SETTINGS CATEGORY",
	titleBelow: "Description of Setting Category",
	components: [
		{name: "description"}
	],
	bindings: [
		{from: ".controller.Descriptions", to: ".$.description.content"}
	]
});

//Settings Settings Menu Model
enyo.ready(function(){
	var settingModel = new enyo.Model({
		Descriptions: "Lorem ipsum dolor sit amet, consec tetur adipiscing elit." +
		              "Sed tortor est, vulpuate non adipiscing eget, semper a nisl.Pellentesque nunc lac us," +
		              "venenatis at tempus id, elementum sit amet massa.Integer tempus risus ut arc u fac ilisis posuere." +
		              "Integer condimentum metus sed velit malesuada rhonc us."
	});

//  Application to render sample
	new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                	kind: "moon.sample.setting.CategoryTextSample",
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
