(function (enyo, scope) {
	/**
	* _moon.VideoInfoHeader_ is a [control]{@link enyo.Control} that displays various information 
	* about a video. It is designed to be used within the _infoComponents_ block of a
	* {@link moon.VideoPlayer}.
	* 
	* Example:
	* ```javascript
	* {
	*	kind: 'moon.VideoInfoHeader',
	*	aboveTitle: new Date(),
	*	title: 'Breaking Bad - Live Free Or Die',
	*	subTitle: 'AMC (301) 7:00 PM - 8:00 PM',
	*	description: 'As Walt deals with the aftermath of the Casa Tranquila explosion, '
	*		+ 'Hank works to wrap up his investigation of Gus\' empire.',
	*	components: [
	*		{content: '3D'},
	*		{content: 'Live'},
	*		{content: 'REC 08:22', classes: 'moon-video-player-info-redicon'}
	*	]
	* }
	* ```
	*
	* @class moon.VideoInfoHeader
	* @extends enyo.Control
	* @mixes moon.MarqueeSupport
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.VideoInfoHeader.prototype */ {

		/**
		* @private
		*/
		name: 'moon.VideoInfoHeader',

		/**
		* @private
		*/
		kind: 'enyo.Control',
		
		/**
		* @private
		*/
		classes: 'moon-video-info-header',

		/**
		* @private
		*/
		mixins: ['moon.MarqueeSupport'],

		/**
		* @private
		*/
		marqueeOnSpotlight: false,

		/**
		* @private
		*/
		marqueeOnRender: true,
		
		/**
		* @private
		*/
		published: 
			/** @lends moon.VideoInfoHeader.prototype */ {
			
			/** 
			* Title of the _VideoInfoHeader_.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			title: '',
			
			/** 
			* Subtitle of the _VideoInfoHeader_.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			subTitle: '',
			
			/** 
			* Text below subtitle of the _VideoInfoHeader_.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			subSubTitle: '',
			
			/** 
			* Main content of the _VideoInfoHeader_.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			description: '',
			
			/** 
			* When `true`, the title text will be converted to locale-safe uppercasing.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			titleUpperCase: true
		},
		
		/**
		* @private
		*/
		components: [
			{kind: 'moon.MarqueeText', name: 'title', classes: 'moon-header-font moon-video-player-info-title'},
			{name: 'subTitle', classes: 'moon-video-player-info-subtitle'},
			{name: 'subSubTitle', classes: 'moon-video-player-info-subsubtitle'},
			{name: 'client', classes: 'moon-video-player-info-client'},
			{components: [
				{name: 'description', classes: 'moon-video-player-info-description'}
			]}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.subTitle',		to: '.$.subTitle.content'},
			{from: '.subSubTitle',	to: '.$.subSubTitle.content'},
			{from: '.description',	to: '.$.description.content'}
		],

		/**
		* @private
		*/
		create: function() {
			this.inherited(arguments);
			this.titleChanged();
		},

		/**
		* @private
		*/
		titleChanged: function() {
			this.$.title.set('content', this.get('titleUpperCase') ? enyo.toUpperCase(this.get('title')) : this.get('title') );
		},

		/**
		* @private
		*/
		titleUpperCaseChanged: function() {
			this.titleChanged();
		}
	});

})(enyo, this);
