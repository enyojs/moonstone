var
	kind = require('enyo/kind');

var
	ChannelInfo = require('moonstone/ChannelInfo'),
	Clock = require('moonstone/Clock'),
	IconButton = require('moonstone/IconButton'),
	VideoFullscreenToggleButton = require('moonstone/VideoFullscreenToggleButton'),
	VideoInfoBackground = require('moonstone/VideoInfoBackground'),
	VideoInfoHeader = require('moonstone/VideoInfoHeader'),
	VideoPlayer = require('moonstone/VideoPlayer');

module.exports = kind({
	name: 'moon.sample.VideoPlayerInlineSample',
	classes: 'moon enyo-fit enyo-unselectable moon-video-player-sample',
	fit: true,
	components: [
		{
			name: 'player',
			kind: VideoPlayer,
			src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
			poster: 'assets/video-poster.png',
			inline: true,
			classes: 'moon-8h',
			autoplay: true,
			infoComponents: [
				{kind: VideoInfoBackground, orient: 'left', fit: true, components: [
					{
						kind: ChannelInfo,
						channelNo: '13',
						channelName: 'AMC',
						classes: 'moon-2h',
						components: [
							{content: '3D'},
							{content: 'Live'},
							{content: 'REC 08:22', classes: 'moon-video-player-info-redicon'}
						]
					},
					{
						kind: VideoInfoHeader,
						title: 'Downton Abbey',
						subTitle: 'Mon June 21, 7:00 - 8:00pm',
						subSubTitle: 'R - TV 14, V, L, SC',
						description: 'The series, set in the Youkshire country estate of Downton Abbey, depicts the lives of the aristocratic Crawley famiry and'
					}
				]},
				{kind: VideoInfoBackground, orient: 'right', components: [
					{kind: Clock}
				]}
			],
			components: [
				{kind: VideoFullscreenToggleButton},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'},
				{kind: IconButton, small: false, classes: 'moon-icon-video-round-controls-style'}
			]
		}
	]
});
