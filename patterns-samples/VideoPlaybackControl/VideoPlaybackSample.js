enyo.kind({
    name: "moon.sample.VideoPlaybackSample",
    classes: "moon enyo-fit enyo-unselectable",
    fit: true,
    components: [
        {kind: "enyo.Spotlight"},
		{
			kind: "moon.VideoPlayback", 
			width: 1280/3, 
			height: 720/3, 
			jumpIncrement: "20%",

			src: "http://www.w3schools.com/html/mov_bbb.mp4",
			components: [
				{kind: "moon.IconButton", src: "../SlideshowControl/assets/favorite_icon.png", classes: "moon-video-playback-controller-button"},
				{kind: "moon.IconButton", src: "../SlideshowControl/assets/fit-icon.png", classes: "moon-video-playback-controller-button"},
				{kind: "moon.IconButton", src: "../SlideshowControl/assets/share_icon.png", classes: "moon-video-playback-controller-button"},
			],
		    // infoComponents: [
		    // 	{
		    // 		kind: "moon.VideoPlayerInfo",
		    // 		titleAbove: "xyz",
		    // 		title: "Main title",
		    // 		titleBelow: "foo",
		    // 		components: [
		    // 			{kind: "moon.VideoPlayerBadge", content:"3D", background:"red"}
		    // 		]
		    // 	}
		    // ]
		}
    ]
});