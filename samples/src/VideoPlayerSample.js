var
	kind = require('enyo/kind');

var
	Button = require('moonstone/Button'),
	ChannelInfo = require('moonstone/ChannelInfo'),
	Clock = require('moonstone/Clock'),
	ContextualPopup = require('moonstone/ContextualPopup'),
	ContextualPopupDecorator = require('moonstone/ContextualPopupDecorator'),
	Dialog = require('moonstone/Dialog'),
	IconButton = require('moonstone/IconButton'),
	Item = require('moonstone/Item'),
	ToggleButton = require('moonstone/ToggleButton'),
	Tooltip = require('moonstone/Tooltip'),
	TooltipDecorator = require('moonstone/TooltipDecorator'),
	VideoInfoBackground = require('moonstone/VideoInfoBackground'),
	VideoInfoHeader = require('moonstone/VideoInfoHeader'),
	VideoPlayer = require('moonstone/VideoPlayer');

module.exports = kind({
	name: 'moon.sample.VideoPlayerSample',
	classes: 'moon enyo-fit enyo-unselectable moon-video-player-sample',
	fit: true,
	components: [
		{
			name: 'player',
			kind: VideoPlayer,
			sources: [
				{src: 'http://media.w3.org/2010/05/bunny/movie.mp4', type: 'video/mp4'},
				{src: "http://media.w3.org/2010/05/bunny/movie.ogv", type: "video/ogg"},
				{src: "http://media.w3.org/2010/05/sintel/trailer.webm", type: "video/webm"}
			],
			poster: 'assets/video-poster.png',
			autoplay: true,
			onPlaybackControlsTapped: 'controlsTapped',
			infoComponents: [
				{kind: VideoInfoBackground, orient: 'left', background: true, fit: true, components: [
					{
						kind: ChannelInfo,
						channelNo: '13',
						channelName: 'AMC',
						classes: 'moon-2h',
						components: [
							{content: '3D'},
							{content: 'Live'},
							{content: 'REC 08:22', classes: 'moon-video-player-info-redicon '}
						]
					},
					{
						kind: VideoInfoHeader,
						title: 'Downton Abbey - Extra Title',
						subTitle: 'Mon June 21, 7:00 - 8:00pm',
						subSubTitle: 'R - TV 14, V, L, SC',
						description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
						components: [
							{content: 'Icon 1', classes: 'moon-video-player-info-icon'},
							{content: 'Icon 2', classes: 'moon-video-player-info-icon'},
							{content: 'Icon 3', classes: 'moon-video-player-info-icon'}
						]
					}
				]},
				{kind: VideoInfoBackground, orient: 'right', background: true, components: [
					{kind: Clock}
				]}
			],
			components: [
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
				{kind: ToggleButton, name: 'controlsToggleButton', content: 'Controls'},
				{kind: Button, content: 'Unload', ontap: 'unload'},
				{kind: Button, content: 'Reload', ontap: 'load'},
				{kind: ToggleButton, content: 'FF/Rewind', name: 'ffrewToggleButton'},
				{kind: ContextualPopupDecorator, components: [
					{kind: TooltipDecorator, components: [
						{kind: Button, content: 'Popup'},
						{kind: Tooltip, floating: true, content: 'I\'m a tooltip for a button.'}
					]},
					{
						kind: ContextualPopup,
						classes: 'moon-3h moon-6v',
						components: [
							{kind: Item, content: 'Item 1'},
							{kind: Item, content: 'Item 2'},
							{kind: Item, content: 'Item 3'}
						]
					}
				]},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'}
			]
		},
		{kind: Dialog, name: 'tapDialog', title: 'The controls were tapped.', message: 'Press OK to dismiss', components: [
			{kind: Button, content: 'OK', ontap: 'dismissTapDialog'}
		]}
	],
	bindings: [
		{from: '.$.player.disablePlaybackControls', to: '.$.controlsToggleButton.value', oneWay:false},
		{from: '.$.player.showFFRewindControls', to: '.$.ffrewToggleButton.value', oneWay:false}
	],
	controlsTapped: function () {
		this.$.tapDialog.show();
	},
	dismissTapDialog: function () {
		this.$.tapDialog.hide();
	},
	unload: function () {
		this.$.player.unload();
	},
	load: function () {
		this.$.player.unload();
		// We can set source by sources array
		this.sources = [
			{src: 'http://media.w3.org/2010/05/bunny/movie.mp4', type: 'video/mp4'},
			{src: "http://media.w3.org/2010/05/bunny/movie.ogv", type: "video/ogg"},
			{src: "http://media.w3.org/2010/05/sintel/trailer.webm", type: "video/webm"}
		];
		this.$.player.setSources(this.sources);
	}
});
