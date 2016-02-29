/**
* Contains the declaration for the {@link module:moonstone/VideoInfoHeader~VideoInfoHeader} kind.
* @module moonstone/VideoInfoHeader
*/

require('moonstone');

var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	ri = require('enyo/resolution'),
	Control = require('enyo/Control'),
	Img = require('enyo/Image');

var
	Marquee = require('moonstone/Marquee'),
	MarqueeText = Marquee.Text,
	MarqueeSupport = Marquee.Support;

/**
* {@link module:moonstone/VideoInfoHeader~VideoInfoHeader} is a [control]{@link module:enyo/Control~Control} that displays
* various information about a video. It is designed to be used within the
* [infoComponents]{@link module:moonstone/VideoPlayer~VideoPlayer#infoComponents} block of a {@link module:moonstone/VideoPlayer~VideoPlayer}.
*
* Example:
* ```javascript
* var
*	VideoInfoHeader = require('moonstone/VideoInfoHeader');
*
* {
*		kind: VideoInfoHeader,
*		title: 'Breaking Bad - Live Free Or Die',
*	description: 'As Walt deals with the aftermath of the Casa Tranquila explosion, '
*			+ 'Hank works to wrap up his investigation of Gus\' empire.',
*	components: [
*			{content: '3D'},
*			{content: 'Live'}
*	]
* }
* ```
*
* @class VideoInfoHeader
* @extends module:enyo/Control~Control
* @mixes module:moonstone/MarqueeSupport~MarqueeSupport
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/VideoInfoHeader~VideoInfoHeader.prototype */ {

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
	classes: 'moon-video-player-info-header',

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
	* @lends module:moonstone/VideoInfoHeader~VideoInfoHeader.prototype
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
		* @deprecated Replaced by [uppercase]{@link module:moonstone/VideoInfoHeader~VideoInfoHeader#uppercase}.
		*
		* Formerly defaulted to `true`, now defaults to `null` and will only have
		* an effect when explicitly set (for complete backward compatibility).
		*
		* @type {Boolean}
		* @default null
		* @public
		*/
		titleUpperCase: null,

		/**
		* URL of image file.
		*
		* @type {String}
		* @default null
		* @public
		*/
		src: null
	},

	/**
	* @private
	*/
	components: [
		{name: 'videoInfoText', classes: 'info-header-text', components :[
			{kind: MarqueeText, name: 'title', classes: 'info-header-title'},
			{name: 'description', classes: 'info-header-description'}
		]}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'description', to: '$.description.content'}
	],

	/**
	* @private
	*/
	create: function() {
		Control.prototype.create.apply(this, arguments);

		// FIXME: Backwards-compatibility for deprecated property - can be removed when
		// the contentUpperCase property is fully deprecated and removed. The legacy
		// property takes precedence if it exists.
		if (this.titleUpperCase !== null) { this.uppercase = this.titleUpperCase; }
		this.srcChanged();
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
		if (this.titleUpperCase != this.uppercase) { this.titleUpperCase = this.uppercase; }
		this.titleChanged();
	},

	/**
	* @private
	*/
	titleUpperCaseChanged: function() {
		if (this.uppercase != this.titleUpperCase) { this.uppercase = this.titleUpperCase; }
		this.uppercaseChanged();
	},

	/**
	* @private
	*/
	srcChanged: function() {
		var img = this.$.videoInfoImage;

		if (this.src) {
			if (img) {
				img.set('src', this.src);
			} else {
				img = this.createComponent({
					name: 'videoInfoImage',
					kind: Img,
					classes: 'info-header-image',
					src: this.src,
					sizing: 'contain',
					style: util.format('width: %.px; height: %.px', ri.scale(96), ri.scale(96)),
					addBefore: this.$.videoInfoText
				});
				if (this.generated) {
					img.render();
				}
			}
		} else if (img) {
			img.destroy();
		}
	}
});
