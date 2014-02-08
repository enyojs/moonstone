
enyo.kind({
	name: "moon.sample.VideoPlayerSample",
	classes: "moon enyo-fit enyo-unselectable moon-video-player-sample",
	fit: true,
	components: [
		{
			name: "player",
			kind: "moon.VideoPlayer",
			src: "http://media.w3.org/2010/05/bunny/movie.mp4",
			poster: "assets/video-poster.png",
			autoplay:true,
			onPlaybackControlsTapped: "controlsTapped",
			showInfoBackground: true,
			infoComponents: [
				{kind: "moon.VideoInfoBackground", name:"leftInfo", orient: "left", background: true, fit: true, components: [
					{
						kind: "moon.ChannelInfo",
						name: "channelInfo",
						channelNo: "9999-99",
						channelName: "AMC",
						classes: "moon-2h",
						components: [
							{content: "DTV"},
							{content: "\u266B"},
							{content: "amc", classes: "moon-video-player-info-default-icon"},
							{content: "REC 08:22", classes: "moon-video-player-info-redicon "},
							{content: "Cinema"},
							{content: "Sub English"},
							{content: "\u2665"},	
							{content: "3D"},
							{content: "AD"},
							{content: "CC1"}									
						]
					},
					{
						kind: "moon.VideoInfoHeader",
						name: "videoInfo",
						title: "Downton Abbey - Extra Title",
						subTitle: "Mon June 21, 7:00 - 8:00pm",
						subtitleDivider:"|",
						subSubTitle: "R - TV 14, V, L, SC",
						description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
						components: [
							{content: "Icon 1", classes: "moon-video-player-info-icon"},
							{content: "Icon 2", classes: "moon-video-player-info-icon"},
							{content: "Icon 3", classes: "moon-video-player-info-icon"}
						]
					}
				]},
				{kind: "moon.VideoInfoBackground", name:"rightInfo", orient: "right", background: true, components: [
					{kind:"moon.Clock", name:"clock"}
				]}
			],
			components: [
				{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
				{kind: "moon.TooltipDecorator", components: [
					{kind: "moon.ContextualPopupDecorator", components: [
						{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
						{
							kind: "moon.ContextualPopup",
							classes: "moon-3h moon-6v",
							components: [
								{kind: "moon.Item", content:"Item 1"},
								{kind: "moon.Item", content:"Item 2"},
								{kind: "moon.Item", content:"Item 3"}
							]
						}
					]},
					{kind: "moon.Tooltip", floating:true, content: "Opens ContextualPopup"}
				]},
				{kind: "moon.ToggleButton", name:"controlsToggleButton", minWidth:false, content:"Controls"},
				// {kind: "moon.Button", content:"Unld", minWidth:false, ontap:"unload"},
				// {kind: "moon.Button", content:"Reld", minWidth:false, ontap:"load"},
				// {kind: "moon.ToggleButton", content:"FF/Rew", minWidth:false, name:"ffrewToggleButton"},
				// {kind: "moon.ToggleButton", content:"Left", minWidth:false, name:"leftToggleButton"},
				// {kind: "moon.ToggleButton", content:"BG", minWidth:false, name:"bgToggleButton"},
				// {kind: "moon.ToggleButton", content:"Ch", minWidth:false, name:"chToggleButton"},
				// {kind: "moon.ToggleButton", content:"Info", minWidth:false, name:"infoToggleButton"},
				// {kind: "moon.ToggleButton", content:"Right", minWidth:false, name:"rightToggleButton"}
			]
		},
		{kind:"moon.Dialog", name:"tapDialog", title:"The controls were tapped.", message:"Press OK to dismiss", components: [
			{kind:"moon.Button", content:"OK", ontap:"dismissTapDialog"}
		]}
	],
	bindings: [
		{from:".$.player.disablePlaybackControls", to:".$.controlsToggleButton.value", oneWay:false},
		{from:".$.player.showFFRewindControls", to:".$.ffrewToggleButton.value", oneWay:false},
		{from:".$.player.showInfoBackground", to:".$.bgToggleButton.value", oneWay:false},
		{from:".$.leftInfo.showing", to:".$.leftToggleButton.value", oneWay:false},
		{from:".$.channelInfo.showing", to:".$.chToggleButton.value", oneWay:false},
		{from:".$.videoInfo.showing", to:".$.infoToggleButton.value", oneWay:false},
		{from:".$.rightInfo.showing", to:".$.rightToggleButton.value", oneWay:false}
	],
	controlsTapped: function() {
		this.$.tapDialog.show();
	},
	dismissTapDialog: function() {
		this.$.tapDialog.hide();
	},
	unload: function() {
		this.$.player.unload();
	},
	load: function() {
		this.$.player.unload();
		this.$.player.setSrc("http://media.w3.org/2010/05/bunny/movie.mp4");
	}
});
