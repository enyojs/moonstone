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
		    infoComponents: [
		    	{
					kind: "moon.VideoPlayerInfo", 
					datetime: "CURRENT DATE & TIME", 
					showname: "SHOW NAME", 
					channel: "CHANNEL - AIR DATE & TIME SLOT", 
					synopsys: "SHORT SYNOPSYS ABOUT THE CURRENT SHOW",
					components: [
						{content: "SUB ENGLISH", classes: "moon-videoplayer-info-icon"},
						{content: "CINEMA", classes: "moon-videoplayer-info-icon"},
						{content: "3D", classes: "moon-videoplayer-info-icon"},
						{content: "REC 00:00", classes: "moon-videoplayer-info-icon moon-videoplayer-info-redicon"}
					]
		    	}
		    ]
		}
    ]
});