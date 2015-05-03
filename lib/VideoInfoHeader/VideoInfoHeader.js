require('moonstone');

var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	Control = require('enyo/Control');

var
	Marquee = require('../Marquee'),
	MarqueeSupport = Marquee.Support,
	MarqueeText = Marquee.Text;

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
module.exports = kind(
	/** @lends moon.VideoInfoHeader.prototype */ {

	/**
	* @private
	*/
	name: 'moon.VideoInfoHeader',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'moon-video-info-header',

	/**
	* @private
	*/
	mixins: [MarqueeSupport],

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
		* Formerly defaulted to `true`, now defaults to `null` and will only have
		* an effect when explicitly set (for complete backward compatibility).
		*
		* @type {Boolean}
		* @default null
		* @public
		*/
		titleUpperCase: null
	},

	/**
	* @private
	*/
	components: [
		{name: 'title', kind: MarqueeText, classes: 'moon-header-font moon-video-player-info-title'},
		{name: 'subTitle', kind: Control, classes: 'moon-video-player-info-subtitle'},
		{name: 'subSubTitle', kind: Control, classes: 'moon-video-player-info-subsubtitle'},
		{name: 'client', kind: Control, classes: 'moon-video-player-info-client'},
		{kind: Control, components: [
			{name: 'description', kind: Control, classes: 'moon-video-player-info-description'}
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
		Control.prototype.create.apply(this, arguments);

		// FIXME: Backwards-compatibility for deprecated property - can be removed when
		// the contentUpperCase property is fully deprecated and removed. The legacy
		// property takes precedence if it exists.
		if (this.titleUpperCase !== null) this.uppercase = this.titleUpperCase;

		this.titleChanged();
	},

	/**
	* @private
	*/
	titleChanged: function() {
		this.$.title.set('content', this.get('uppercase') ? util.toUpperCase(this.get('title')) : this.get('title') );
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