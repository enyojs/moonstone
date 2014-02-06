enyo.kind({
	name: "moon.sample.ChannelBannerSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [{
		kind: "moon.VideoInfoBackground",
		orient: "left",
		background: true,
		fit: true,
		components: [{
			kind: "moon.ChannelInfo",
			channelNo: "오후 4:20",
			channelName: "2월 4일",
			// classes: "moon-2h",
			components: [
				// {content: "3D"},
				// {content: "Live"},
				// {content: "REC 08:22", classes: "moon-video-player-info-redicon "}
			]
		}
	// 	,{
	// 		kind: "moon.VideoInfoHeader",
	// 		title: "Downton Abbey - Extra Title",
	// 		subTitle: "Mon June 21, 7:00 - 8:00pm",
	// 		subSubTitle: "R - TV 14, V, L, SC",
	// 		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	// 		components: [{
	// 			content: "Icon 1",
	// 			classes: "moon-video-player-info-icon"
	// 		}, {
	// 			content: "Icon 2",
	// 			classes: "moon-video-player-info-icon"
	// 		}, {
	// 			content: "Icon 3",
	// 			classes: "moon-video-player-info-icon"
	// 		}]
	// 	}]
	// }, {
	// 	kind: "moon.VideoInfoBackground",
	// 	orient: "right",
	// 	background: true,
	// 	components: [{
	// 		kind: "moon.Clock"
	// 	}
		]
	}]
});
