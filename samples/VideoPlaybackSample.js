
enyo.kind({
    name: "moon.sample.VideoPlaybackSample",
    classes: "enyo-fit enyo-unselectable",
    fit: true,
    components: [
        {kind: "enyo.Spotlight"},
		{
			kind: "moon.VideoPlayback",	
			/* Needs long video file for testing */
			src: "http://media.w3.org/2010/05/video/movie_300.mp4",
			xsrc: "http://media.w3.org/2010/05/sintel/trailer.mp4",
			xsrc: "http://www.w3schools.com/html/mov_bbb.mp4",
			xsrc: "../../video.mp4",
			xsrc: "../../voice-E15.mp4",
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
					datetime: "June 13 & 2:15", 
					showname: "Voice of Korea", 
					channel: "Mnet - AIR DATE & TIME SLOT", 
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