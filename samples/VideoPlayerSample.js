
enyo.kind({
	name: "moon.sample.VideoPlayerSample",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{name: "player", kind: "moon.VideoPlayer", src: "http://media.w3.org/2010/05/bunny/movie.mp4", autoplay:true,
			infoComponents: [
				{kind: "moon.BackgroundWrapper", orient: "left", background: true, fit: true, components: [
					{
						kind: "moon.ChannelInfo",
						channelNo: "13",
						channelName: "AMC",
						classes: "moon-2h", 
						components: [
							{content: "3D"},
							{content: "Live"},
							{content: "REC 08:22", classes: "moon-video-player-info-redicon "}
						]
					},
					{
						kind: "moon.VideoInfoHeader",
						rating: "R - TV 14, V, L, SC",
						title: "Downton Abbey",
						subTitle: "Mon June 21, 7:00 - 8:00pm",
						description: "The series, set in the Youkshire country estate of Downton Abbey, depicts the lives of the aristocratic Crawley famiry and"
					}
				]},
				{kind: "moon.BackgroundWrapper", orient: "right", background: true, components: [
					{kind:"moon.Clock"}
				]}
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
		}
	]
});
