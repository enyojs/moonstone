enyo.kind({
    name: "moon.sample.VideoPlaybackSample",
    classes: "enyo-fit moon",
    fit: true,
    components: [
        {kind: "enyo.Spotlight"},
        {name: "panels", kind: "moon.Panels", arrangerKind: "moon.LeanForwardArranger", classes: "enyo-fit", components: [
            {title: "First", components: [
				{kind: "moon.Item", style: "margin-top:20px;", content: "Item One"},
				{kind: "moon.Item", content: "Item Two"},
				{kind: "moon.Item", content: "Item Three"},
				{kind: "moon.Item", content: "Item Four"},
				{kind: "moon.Item", content: "Item Five"}
			]},
            {title: "Third", components: [
				{
					kind: "moon.VideoPlayback", 
					width: 1280/3, 
					height: 720/3, 
					src: "http://www.w3schools.com/html/mov_bbb.mp4",
					components: [
						{kind: "moon.Button", content: "child button"},
						{kind: "moon.Button", content: "child button"},
						{kind: "moon.Button", content: "child button"}
					]
				}
			]},

        ]}
    ]
});