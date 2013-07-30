enyo.kind({
	name        : 'moon.sample.video.DetailNarrowSample',
	kind        : 'moon.Panel',
	classes     : 'moon-sample-video-detailnarrowsample',
	title       : 'Movie Name',
	titleAbove  : '03',
	
	headerComponents: [
		{kind: 'moon.IconButton', src: '../assets/icon-download.png'},
		{kind: 'moon.IconButton', src: '../assets/icon-favorite.png'},
		{kind: 'moon.IconButton', src: '../assets/icon-next.png'}
	],
	components: [
		{kind: 'HFlexBox', flexSpacing: 20, classes:'enyo-fit', components: [
			{kind: 'VFlexBox', classes: 'left-column', flexSpacing: 5, components: [
				{name: 'movie', kind: 'enyo.Image', classes: 'moon-7h moon-2v'},
				{kind: 'HFlexBox', components: [
					{flex: true, components: [
						{kind: 'moon.Divider', content: 'Rating'},
						{name: 'rating'}
					]},
					{flex: true, components: [
						{kind: 'moon.Divider', content: 'Release Date'},
						{name: 'releaseDate'}
					]},
					{flex: true, components: [
						{kind: 'moon.Divider', content: 'Running Time'},
						{name: 'duration'}
					]}
				]},
				{kind: 'HFlexBox', flex: true, components: [
					{flex: true, components: [
						{content: 'SD'},
						{name: 'valueSD'}
					]},
					{flex: true, components: [
						{content: 'HD'},
						{name: 'valueHD'}
					]},
					{flex: true, components: [
						{content: '3D'},
						{name: 'value3D'}
					]}
				]}
			]},
			{kind: 'VFlexBox', flex: true, classes: 'right-column', components: [
				{kind: 'moon.Divider', content: 'Synopsis'},
				{name: 'synopsisHeader', classes: 'synopsis-header', allowHtml: true},
				{kind: 'moon.Scroller', horizontal:'hidden', flex: true, components: [
					{name: 'synopsisBody'}
				]}
			]}
		]
	}],
	bindings: [
		{from: '.controller.posterUrl',      to: '$.movie.src'},
		{from: '.controller.rating',         to: '$.rating.content'},
		{from: '.controller.releaseDate',    to: '$.releaseDate.content'},
		{from: '.controller.duration',       to: '$.duration.content'},
		{from: '.controller.valueSD',        to: '$.valueSD.content'},
		{from: '.controller.valueHD',        to: '$.valueHD.content'},
		{from: '.controller.value3D',        to: '$.value3D.content'},
		{from: '.controller.synopsisHeader', to: '$.synopsisHeader.content'},
		{from: '.controller.synopsisBody',   to: '$.synopsisBody.content'}
	]
});


enyo.ready(function(){
	
	// Sample model
	
	var sampleModel = new enyo.Model({
		posterUrl      : 'http://placehold.it/550x350',
		rating         : 'PG-13',
		releaseDate    : '2013',
		duration       : '122',
		valueSD        : '$3.99',
		valueHD        : '$6.99',
		value3D        : '$7.99',
		synopsisHeader : '<b>Starring: </b>Actor Name, Actor Name, and Actor Name',
		synopsisBody   : 'Pixar genius reigns in this funny romantic comedy, which stars a robot who \
			says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears \
			himself to the audience within the first few minutes of the film. As the last robot left on earth, \
			Wall-E (voiced by Ben Burtt) is one small robot --with a big, big heart-- who holds the future of earth \
			and mankind squarely in the palm of his metal hand. He\'s outlasted all the "Waste Allocation Load Lifter Earth-Class" \
			robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth \
			while man vacationed aboard the luxury spaceship Axiom.'
	});

	//  Application to render sample

	new enyo.Application({
		view: {
			classes: 'enyo-unselectable moon',
			components: [
				{kind: 'enyo.Spotlight'},
				{
					kind       : 'moon.sample.video.DetailNarrowSample',
					controller : '.app.controllers.movieController',
					classes    : 'enyo-fit'
				}
			]
		},
		controllers: [
			{
				name  : 'movieController',
				kind  : 'enyo.ModelController',
				model : sampleModel,
			}
		]
	});
});
