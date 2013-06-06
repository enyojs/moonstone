enyo.kind({
	name: "moon.sample.VideoPlaybackSample",
	fit: true,
	kind:"FittableRows",
	classes: "enyo-unselectable moon",
	components: [
		{kind: "enyo.Spotlight"},
		{
			kind: "moon.VideoPlayback", 
			width: 1280/2, 
			height: 720/2, 
			src: "http://www.w3schools.com/html/mov_bbb.mp4",
			components: [
				{kind: "moon.Button", content: "child button"}
			]
		}
	]
});