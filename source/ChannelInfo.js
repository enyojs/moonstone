(function (enyo, scope) {
	/**
	* {@link moon.ChannelInfo} is a control that displays channel information.  It is
	* designed to be used within the [infoComponents]{@link moon.VideoPlayer#infoComponents}
	* block of a {@link moon.VideoPlayer}.
	*
	* Example:
	* ```
	* 	{
	* 		kind: 'moon.ChannelInfo',
	* 		no: 36,
	* 		name: 'AMC',
	* 		components: [
	* 			{content: '3D'},
	* 			{content: 'Live'},
	* 			{content: 'REC 08:22', classes: 'moon-video-player-info-redicon'}
	* 		]
	* 	}
	* ```
	*
	* @class moon.ChannelInfo
	* @extends enyo.Control
	* @mixes moon.MarqueeSupport
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ChannelInfo.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ChannelInfo',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		*/
		classes: 'moon-channelinfo',

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
		marqueeOnHover: true,

		/**
		* @private
		* @lends moon.ChannelInfo.prototype
		*/
		published: {

			/**
			* The channel number.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			channelNo: '',

			/**
			* The name of the channel.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			channelName: '',

			/**
			* When true, [channelNo]{@link moon.ChannelInfo#channelNo} will have locale-safe
			* uppercasing applied.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			channelNoUpperCase: true
		},

		/**
		* @private
		*/
		defaultKind: 'moon.ChannelInfoBadge',

		/**
		* @private
		*/
		components: [
			{kind: 'moon.MarqueeText', name: 'channelNo', classes: 'moon-header-font moon-video-player-channel-info-no'},
			{kind: 'moon.MarqueeText', name: 'channelName', classes: 'moon-video-player-channel-info-name'},
			{kind: 'enyo.Control', name: 'client', classes: 'moon-video-player-channel-info-badges'}
		],

		/**
		* @private
		*/
		bindings: [
			{from: '.channelName', to: '.$.channelName.content'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.channelNoChanged();
		},

		/**
		* @private
		*/
		channelNoChanged: function () {
			var channelNo = this.getChannelNo();
			this.$.channelNo.setContent(this.getChannelNoUpperCase() ? enyo.toUpperCase(channelNo) : channelNo);
		},

		/**
		* @private
		*/
		channelNoUpperCaseChanged: function () {
			this.channelNoChanged();
		}
	});

	/**
	* {@link moon.ChannelInfoBadge} is a simple kind used to display a badge
	* containing channel info. It is the default kind for components added to
	* {@link moon.ChannelInfo}.
	*
	* @class moon.ChannelInfoBadge
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ChannelInfoBadge.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ChannelInfoBadge',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		*/
		classes: 'moon-video-badge-text moon-video-player-info-icon'
	});

})(enyo, this);
