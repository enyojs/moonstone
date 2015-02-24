var
	kind = require('enyo/kind')
	Group = require('enyo/Group');

var
	FittableLayout = require('layout/FittableLayout'),
	FittableColumnsLayout = FittableLayout.Columns;

var
	Button = require('moonstone/Button'),
	ChannelInfo = require('moonstone/ChannelInfo'),
	Clock = require('moonstone/Clock'),
	Divider = require('moonstone/Divider'),
	IconButton = require('moonstone/IconButton'),
	Panel = require('moonstone/Panel'),
	Panels = require('moonstone/Panels'),
	SelectableItem = require('moonstone/SelectableItem'),
	ToggleButton = require('moonstone/ToggleButton'),
	VideoFullscreenToggleButton = require('moonstone/VideoFullscreenToggleButton'),
	VideoInfoBackground = require('moonstone/VideoInfoBackground'),
	VideoInfoHeader = require('moonstone/VideoInfoHeader'),
	VideoPlayer = require('moonstone/VideoPlayer');

module.exports = kind({
	name: 'moon.sample.PanelsVideoPlayerSample',
	classes: 'moon enyo-fit enyo-unselectable',
	components: [
		{name: 'panels', kind: Panels, pattern: 'activity', classes: 'enyo-fit', components: [
			{kind: Panel, title: 'Video', classes: 'moon-4h', components: [
				{kind: Divider, content: 'Select video content'},
				{name: 'vidContents', kind: Group, style: 'margin-top: 20px;', components: [
					{kind: SelectableItem, content: 'Counter', onActivate: 'webMovieCounter'},
					{kind: SelectableItem, selected: true, content: 'Bunny', onActivate: 'webMovieBunny'},
					{kind: SelectableItem, content: 'Sintel', onActivate: 'webMovieSintel'},
					{kind: SelectableItem, content: 'Error URL', onActivate: 'error'}
				]},
				{classes: 'moon-vspacing-m', components: [
					{kind: Button, content: 'Unload', ontap: 'unload'},
					{kind: Button, content: 'Reload', ontap: 'load'},
					{kind: ToggleButton, name: 'autoplayToggle', content: 'AutoPlay'}
				]}
			]},
			{kind: Panel, joinToPrev: true, title: 'Player', layoutKind: FittableColumnsLayout, classes: 'moon-7h', components: [
				{
					fit: true,
					components: [{
						name: 'player',
						kind: VideoPlayer,
						inline:true,
						classes: 'moon-8h',
						poster: '$lib/moonstone/samples/assets/video-poster.png',
						infoComponents: [{
							kind: VideoInfoBackground,
							orient: 'left',
							fit: true,
							components: [
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
							]
						}, {
							kind: VideoInfoBackground,
							orient: 'right',
							components: [
								{kind: Clock}
							]
						}],
						components: [
							{kind: VideoFullscreenToggleButton},
							{kind: IconButton, src: 'images/video-player/icon-placeholder.png'},
							{kind: IconButton, src: 'images/video-player/icon-placeholder.png'},
							{kind: IconButton, src: 'images/video-player/icon-placeholder.png'},
							{kind: IconButton, src: 'images/video-player/icon-placeholder.png'},
							{kind: IconButton, src: 'images/video-player/icon-placeholder.png'},
							{kind: IconButton, src: 'images/video-player/icon-placeholder.png'},
							{kind: IconButton, src: 'images/video-player/icon-placeholder.png'},
							{kind: IconButton, src: 'images/video-player/icon-placeholder.png'},
							{kind: IconButton, src: 'images/video-player/icon-placeholder.png'}
						]
					}]
				}
			]}
		]}
	],
	bindings: [
		{from: '.$.autoplayToggle.value', to: '.$.player.autoplay'}
	],
	unload: function () {
		this.$.player.unload();
	},
	load: function () {
		this.$.player.unload();
		this.$.player.setSources(this.sources);
	},
	webMovieCounter: function (sender, event) {
		if (!event.originator.active) {
			return;
		}
		// Set source by sources array
		this.sources = [
			{src: "http://media.w3.org/2010/05/video/movie_300.mp4", type: "video/mp4"},
			{src: 'http://media.w3.org/2010/05/video/movie_300.ogv', type: 'video/ogg'},
			{src: 'http://media.w3.org/2010/05/video/movie_300.webm', type: 'video/webm'}
		];
		this.$.player.setSources(this.sources);
		this.$.videoInfoHeader.setTitle('Ticking Counter Video');
	},
	webMovieBunny: function (sender, event) {
		if (!event.originator.active) {
			return;
		}
		// Set source by sources array
		this.sources = [
			{src: "http://media.w3.org/2010/05/bunny/movie.mp4", type: "video/mp4"},
			{src: "http://media.w3.org/2010/05/bunny/movie.ogv", type: "video/ogg"}
		];
		this.$.player.setSources(this.sources);
		this.$.videoInfoHeader.setTitle('Bunny Video');
	},
	webMovieSintel: function (sender, event) {
		if (!event.originator.active) {
			return;
		}
		// Set source by sources array
		this.sources = [
			{src: 'http://media.w3.org/2010/05/sintel/trailer.mp4', type: 'video/mp4'},
			{src: 'http://media.w3.org/2010/05/sintel/trailer.ogv', type: 'video/ogg'},
			{src: 'http://media.w3.org/2010/05/sintel/trailer.webm', type: 'video/webm'}
		];
		this.$.player.setSources(this.sources);
		this.$.videoInfoHeader.setTitle('The Sintel Video');
	},
	error: function (sender, event) {
		if (!event.originator.active) {
			return;
		}
		this.src = 'http://foo.bar';
		this.$.player.setSrc(this.src);
		this.$.videoInfoHeader.setTitle('Error video');
	}
});
