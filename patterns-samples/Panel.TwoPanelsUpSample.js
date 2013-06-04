enyo.kind({
	name: "musicBrowser",
	kind: "moon.Panel",
	title: "Music Browser", 
	components: [
		{kind: "moon.Item", content: "Music Item One"},
		{kind: "moon.Item", content: "Music Item Two"},
		{kind: "moon.Item", content: "Music Item Three"},
		{kind: "moon.Item", content: "Music Item Four"}
	]
});

enyo.kind({
	name: "movieBrowser",
	kind: "moon.Panel",
	title: "Movie Browser", 
	components: [
		{kind: "moon.Item", content: "Movie Item One"},
		{kind: "moon.Item", content: "Movie Item Two"},
		{kind: "moon.Item", content: "Movie Item Three"},
		{kind: "moon.Item", content: "Movie Item Four"}
	]
});

enyo.kind({
	name: "photoBrowser",
	kind: "moon.Panel",
	title: "Photo Browser", 
	components: [
		{kind: "moon.Item", content: "Photo Item One"},
		{kind: "moon.Item", content: "Photo Item Two"},
		{kind: "moon.Item", content: "Photo Item Three"},
		{kind: "moon.Item", content: "Photo Item Four"}
	]
});

enyo.kind({
	name: "moon.sample.panel.TwoPanelsUpSample",
	components: [
		{kind: "enyo.Spotlight"},
		{
			name: "panels", 
			kind: "moon.Panels", 
			arrangerKind: "moon.LeanForwardArranger", 
			classes: "enyo-fit",
			components: [
				{title: "Menu", components: [
					{kind: "moon.Item", content: "Music", joinPanel: "musicBrowser"},
					{kind: "moon.Item", content: "Movie", joinPanel: "movieBrowser"},
					{kind: "moon.Item", content: "Photo", joinPanel: "photoBrowser"}
				]},
				{kind: "musicBrowser", joinToPrev: true}
			]
		}
	]
});

