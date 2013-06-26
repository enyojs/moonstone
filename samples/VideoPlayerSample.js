
enyo.kind({
	name: "moon.sample.VideoPlayerSample",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{name: "player", kind: "moon.VideoPlayer",
			sourceComponents: [
				{src: "http://media.w3.org/2010/05/sintel/trailer.mp4",  type: "video/mp4"},
				{src: "http://media.w3.org/2010/05/sintel/trailer.webm", type: "video/webm"},
				{src: "http://media.w3.org/2010/05/sintel/trailer.ogv",  type: "video/ogg"}
			],
			infoComponents: [
				{classes: "moon-video-player-description-info", components: [
					{name: "videoDateTime", classes: "moon-header-font moon-video-player-info-datetime", content: new Date()},
					{name: "videoTitle", classes: "moon-header-font moon-video-player-info-showname", content: "Breaking Bad - Live Free Or Die"},
					{name: "videoChannel", classes: "moon-video-player-info-channel", content: "AMC (301) 7:00 PM - 8:00 PM"},
					{name: "videoDescription", classes: "moon-video-player-info-synopsys", 
					content: "As Walt deals with the aftermath of the Casa Tranquila explosion, Hank works to wrap up his investigation of Gus' empire."}
				]},
				{classes: "moon-video-player-settings-info", components: [
					{content: "3D", classes: "moon-video-player-info-icon"},
					{content: "Live", classes: "moon-video-player-info-icon"},					
					{content: "REC 08:22", classes: "moon-video-player-info-icon moon-video-player-info-redicon"}
				]},
				{classes: "moon-video-player-rating-info", allowHtml: true, content: "RTV-14<br>VL SC"}
			],
			components: [
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"}
			]
		}]
	}
);