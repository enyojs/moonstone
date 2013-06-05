enyo.kind({
    name: "moon.sample.PanelsWithCarouselArrangerSample",
    classes: "enyo-fit moon",
    fit: true,
    components: [
        {kind: "enyo.Spotlight"},
        {name: "panels", kind: "moon.Panels", arrangerKind: "CarouselArranger", classes: "enyo-fit full", components: [
            {title: "First", components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {title: "Second", components: [
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
            {title: "Fourth", components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {title: "Fifth", components: [
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
            {title: "Seventh", components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
        ]},
    ]
});