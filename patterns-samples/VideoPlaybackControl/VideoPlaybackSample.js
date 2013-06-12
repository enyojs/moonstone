
enyo.kind({
    name: "moon.sample.VideoPlaybackSample",
    classes: "moon enyo-fit enyo-unselectable",
    fit: true,
    components: [
        {kind: "enyo.Spotlight"},
		{
			kind: "moon.VideoPlayback", 			
			jumpIncrement: "20%",
			xsrc: "http://www.w3schools.com/html/mov_bbb.mp4",
			src: "../../../video.mp4",
			components: [
				{kind: "moon.BoxIconButton", src: "assets/icon-Premium-Placeholder.png", ontap: "onTap"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"},
				{kind: "moon.BoxIconButton", src: "assets/icon-placeholder.png"}
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