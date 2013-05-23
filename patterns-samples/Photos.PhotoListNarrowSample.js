enyo.kind({
	name: "moon.sample.photos.PhotoListNarrowSample",
	kind : "moon.Panel",
	//classes: "moon enyo-unselectable",
	classes : "photo-album",
	fit: true,
	title : "ALBUM",
	titleAbove : "02",
	titleBelow : "97 Photos",
	components: [
		{kind : "enyo.Spotlight"},
		{
			kind : "FittableRows",
			fit : true,
			components : [
				{
					kind : "moon.Scroller",
					style : "width:300px;height:500px;",
					touch : true,
					horizontal : "hidden",
					components : [
						{
							kind: "moon.ImageItem",
							source: "./assets/default-movie.png",
							label : ""
						},
						{
							kind: "moon.ImageItem",
							source: "./assets/default-movie.png",
							label : ""
						},
						{
							kind: "moon.ImageItem",
							source: "./assets/default-movie.png",
							label : ""
						},
						{
							kind: "moon.ImageItem",
							source: "./assets/default-movie.png",
							label : ""
						},
					]
				}
			]
		}
	]
});