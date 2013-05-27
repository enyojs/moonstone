enyo.kind({
    name: "moon.sample.LeanForwardPanelsSample",
    classes: "enyo-fit moon",
    fit: true,
    components: [
        {kind: "enyo.Spotlight"},
        {name: "panels", kind: "moon.Panels", arrangerKind: "moon.BreadcrumbArranger", classes: "enyo-fit", components: [
            {title: "First", components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {title: "Second", joinToPrev: true, components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {title: "Third", components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {title: "Fourth", joinToPrev: true, components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {title: "Fifth", joinToPrev: true, components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {title: "Sixth", components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {title: "Seventh", joinToPrev: true, components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
        ]},
    ]
});