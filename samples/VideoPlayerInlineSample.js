enyo.kind({
	name: "moon.sample.VideoPlayerInlineSample",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,
	components: [
		{
			name: "player",
			kind: "moon.VideoPlayer",
			src: "http://media.w3.org/2010/05/bunny/movie.mp4",
			poster: "assets/video-poster.png",
			inline:true,
			classes:"moon-8h",
			autoplay:true,
			showInfoBackground: true,
			infoComponents: [
				{kind: "moon.VideoInfoBackground", orient: "left", fit: true, components: [
					{
						kind: "moon.ChannelInfo",
						channelNo: "13",
						channelName: "AMC",
						classes: "moon-2h",
						components: [
							{content: "3D"},
							{content: "Live"},
							{content: "REC 08:22", classes: "moon-video-player-info-redicon"}
						]
					},
					{
						kind: "moon.VideoInfoHeader",
						title: "Downton Abbey",
						subTitle: "Mon June 21, 7:00 - 8:00pm",
						subSubTitle: "R - TV 14, V, L, SC",
						description: "The series, set in the Youkshire country estate of Downton Abbey, depicts the lives of the aristocratic Crawley famiry and"
					}
				]},
				{kind: "moon.VideoInfoBackground", orient: "right", components: [
					{kind:"moon.Clock"}
				]}
			],
			components: [
				{kind: "moon.VideoFullscreenToggleButton"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"}
			]
		}
	]
});
