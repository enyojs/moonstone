(function (enyo, scope) {
	/**
	* {@link moon.VideoInfoHeader} is a [control]{@link enyo.Control} that displays
	* various information about a video. It is designed to be used within the
	* [infoComponents]{@link moon.VideoPlayer#infoComponents} block of a {@link moon.VideoPlayer}.
	*
	* Example:
	* ```javascript
	* {
	*	kind: 'moon.VideoInfoHeader',
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
		* @lends moon.VideoInfoHeader.prototype
		*/
		published: {

			/**
			* Title of the `VideoInfoHeader`.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			title: '',

			/**
			* Subtitle of the `VideoInfoHeader`.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			subTitle: '',

			/**
			* Text below subtitle of the `VideoInfoHeader`.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			subSubTitle: '',

			/**
			* Main content of the `VideoInfoHeader`.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			description: '',

			/**
			* When `true`, the title text will have locale-safe uppercasing applied.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			uppercase: true,

			/**
			* @deprecated Replaced by [uppercase]{@link moon.VideoInfoHeader#uppercase}.
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

			// FIXME: Backwards-compatibility for deprecated property - can be removed when
			// the titleUpperCase property is fully deprecated and removed. We give the uppercase
			// property precedence and assign its value to the titleUpperCase property if it has
			// changed from the default value, otherwise if the value of the titleUpperCase property
			// has changed from the default value, we assign its value to the uppercase property.
			if (!this.uppercase) this.titleUpperCase = this.uppercase;
			else if (!this.titleUpperCase) this.uppercase = this.titleUpperCase;
			this.titleChanged();
		},

		/**
		* @private
		*/
		titleChanged: function() {
			this.$.title.set('content', this.get('uppercase') ? enyo.toUpperCase(this.get('title')) : this.get('title') );
		},

		/**
		* @private
		*/
		uppercaseChanged: function() {
			// FIXME: Backwards-compatibility for deprecated property - can be removed when
			// titleUpperCase is fully deprecated and removed.
			if (this.titleUpperCase != this.uppercase) this.titleUpperCase = this.uppercase;
			this.titleChanged();
		},

		/**
		* @private
		*/
		titleUpperCaseChanged: function() {
			if (this.uppercase != this.titleUpperCase) this.uppercase = this.titleUpperCase;
			this.uppercaseChanged();
		}
	});

})(enyo, this);
