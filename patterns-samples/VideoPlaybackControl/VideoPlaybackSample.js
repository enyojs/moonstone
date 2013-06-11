enyo.kind({
    name: "moon.sample.VideoPlaybackSample",
    classes: "enyo-fit moon",
    fit: true,
    components: [
        {kind: "enyo.Spotlight"},
		{
			kind: "moon.VideoPlayback", 
			width: 1280/3, 
			height: 720/3, 
			src: "http://www.w3schools.com/html/mov_bbb.mp4",
			components: [
				{kind: "moon.IconButton", src: "assets/favorite_icon.png", classes: "moon-video-playback-controller-button"},
				{kind: "moon.IconButton", src: "assets/fit-icon.png", classes: "moon-video-playback-controller-button"},
				{kind: "moon.IconButton", src: "assets/share_icon.png", classes: "moon-video-playback-controller-button"},
			]
		}
    ]
});