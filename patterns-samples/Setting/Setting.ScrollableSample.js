//Settings Main Menu View
enyo.kind({
    //* @public
    name: "moon.sample.setting.NonScrollableSample",
	kind: "moon.Panel",
	//* @protected
    title: "SETTINGS CATEGORY",
	fit: true,
	components: [
		{kind : "FittableColumns", fit: true, components: [
			{kind: "FittableRows", classes: "moon-settings-category", components: [
				{kind: "moon.Divider", content: "Settings Category"},
				{kind: "moon.Scroller", fit: true, components: [
					{name: "pickerInfo", kind: "enyo.DataRepeater", components: [
						{kind: "moon.ExpandablePicker", noneText: "None", bindings: [
								{from: ".model.name", to: ".content"}
							],
							components: [
								{bindings: [
									{from: ".model.value1", to: ".content"}
								]},
						        {bindings: [
									{from: ".model.value2", to: ".content"}
								]},
						        {bindings: [
									{from: ".model.value3", to: ".content"}
								]}
							]
						}
					]}
				]}
			]},
    		{kind: "FittableRows", classes: "moon-settings-category", components: [
				{kind: "moon.Divider", content: "Settings Category1"},
				{name: "picker", kind: "enyo.DataRepeater", components: [
					{kind: "moon.ExpandablePicker", noneText: "None", bindings: [
							{from: ".model.name", to: ".content"}
						],
						components: [
							{bindings: [
								{from: ".model.value1", to: ".content"}
							]},
							{bindings: [
								{from: ".model.value2", to: ".content"}
							]},
							{bindings: [
								{from: ".model.value3", to: ".content"}
							]}
					    ],
					}
				]},
				{kind: "moon.Divider", content: "SETTINGS CATEGORY2"},
				{kind: "moon.Scroller", fit: true, components: [
					{name: "itemInfo", kind: "enyo.DataRepeater", components: [
						{kind: "moon.CheckboxItem", bindings: [
							{from: ".model.name", to: ".content"}
						]}
					]}
				]}
			]}
		]}
    ],
	bindings: [
		{from: ".controller.picker", to: ".$.picker.controller"},
        {from: ".controller.pickers", to: ".$.pickerInfo.controller"},
        {from: ".controller.items", to: ".$.itemInfo.controller"}
    ],
	rendered: function() {
		this.inherited(arguments);
		datalist = this.$.picker;
	}
});

// Settings Settings Menu Model
enyo.ready(function(){
	var settingModel = new enyo.Model({
		picker: new enyo.Collection([
            {name: "Picker 1", value1: "VALUE 3", value2: "VALUE 3", value3: "VALUE 3"}
        ]),
		pickers: new enyo.Collection([
			{name: "PICKER NAME 1", value1: "VALUE 1", value2: "VALUE 2", value3: "VALUE 3"},
			{name: "PICKER NAME 2", value1: "VALUE 1", value2: "VALUE 2", value3: "VALUE 3"},
			{name: "PICKER NAME 3", value1: "VALUE 1", value2: "VALUE 2", value3: "VALUE 3"},
			{name: "PICKER NAME 4", value1: "VALUE 1", value2: "VALUE 2", value3: "VALUE 3"},
			{name: "PICKER NAME 5", value1: "VALUE 1", value2: "VALUE 2", value3: "VALUE 3"}
		]),
		items: new enyo.Collection([
			{name: "Item 1"},
			{name: "Item 2"},
			{name: "Item 3"},
			{name: "Item 4"},
			{name: "Item 5"}
		])
	});

	//  Application to render sample
	new enyo.Application({
        controllers: [
            {name: "settingCategoryController", kind: "enyo.ModelController", model: settingModel}
        ],
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {kind: "moon.sample.setting.NonScrollableSample", controller: ".app.controllers.settingCategoryController", classes: "enyo-fit"}
            ]
        }
    });
});
