require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ChannelInfo~ChannelInfo} kind.
* @module moonstone/ChannelInfo
*/

var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	Control = require('enyo/Control');

var
	Marquee = require('../Marquee'),
	MarqueeText = Marquee.Text,
	MarqueeSupport = Marquee.Support;


/**
* {@link module:moonstone/ChannelInfo~ChannelInfoBadge} is a simple kind used to display a badge
* containing channel information. It is the default kind for components added
* to {@link module:moonstone/ChannelInfo~ChannelInfo}.
*
* @class ChannelInfoBadge
* @extends module:enyo/Control~Control
* @ui
* @public
*/
var ChannelInfoBadge = kind(
	/** @lends module:moonstone/ChannelInfo~ChannelInfoBadge.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ChannelInfoBadge',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'moon-video-badge-text moon-video-player-info-icon'
});

/**
* {@link module:moonstone/ChannelInfo~ChannelInfo} is a control that displays channel information.  It is
* designed to be used within the [infoComponents]{@link module:moonstone/VideoPlayer~VideoPlayer#infoComponents}
* block of a {@link module:moonstone/VideoPlayer~VideoPlayer}.
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
* @class ChannelInfo
* @extends module:enyo/Control~Control
* @mixes module:moonstone/MarqueeSupport~MarqueeSupport
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/ChannelInfo~ChannelInfo.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ChannelInfo',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'moon-channelinfo',

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
	marqueeOnHover: true,

	/**
	* @private
	* @lends module:moonstone/ChannelInfo~ChannelInfo.prototype
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
		* When `true`, [channelNo]{@link module:moonstone/ChannelInfo~ChannelInfo#channelNo} will have locale-safe
		* uppercasing applied.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		uppercaseChannelNo: true,

		/**
		* @deprecated Replaced by [uppercaseChannelNo]{@link module:moonstone/ChannelInfo~ChannelInfo#uppercaseChannelNo}.
		*
		* Formerly defaulted to `true`, now defaults to `null` and will only have
		* an effect when explicitly set (for complete backward compatibility).
		*
		* @type {Boolean}
		* @default null
		* @public
		*/
		channelNoUpperCase: null
	},

	/**
	* @private
	*/
	defaultKind: ChannelInfoBadge,

	/**
	* @private
	*/
	components: [
		{kind: MarqueeText, name: 'channelNo', classes: 'moon-header-font moon-video-player-channel-info-no'},
		{kind: MarqueeText, name: 'channelName', classes: 'moon-video-player-channel-info-name'},
		{kind: Control, name: 'client', classes: 'moon-video-player-channel-info-badges'}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'channelName', to: '$.channelName.content'}
	],

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);

		// FIXME: Backwards-compatibility for deprecated property - can be removed when
		// the channelNoUpperCase property is fully deprecated and removed. The legacy
		// property takes precedence if it exists.
		if (this.channelNoUpperCase !== null) this.uppercaseChannelNo = this.channelNoUpperCase;

		this.channelNoChanged();
	},

	/**
	* @private
	*/
	channelNoChanged: function () {
		var channelNo = this.getChannelNo();
		this.$.channelNo.setContent(this.get('uppercaseChannelNo') ? util.toUpperCase(channelNo) : channelNo);
	},

	/**
	* @private
	*/
	uppercaseChannelNoChanged: function () {
		// FIXME: Backwards-compatibility for deprecated property - can be removed when
		// channelNoUpperCase is fully deprecated and removed.
		if (this.channelNoUpperCase != this.uppercaseChannelNo) this.channelNoUpperCase = this.uppercaseChannelNo;
		this.channelNoChanged();
	},

	/**
	* @private
	*/
	channelNoUpperCaseChanged: function () {
		if (this.uppercaseChannelNo != this.channelNoUpperCase) this.uppercaseChannelNo = this.channelNoUpperCase;
		this.uppercaseChannelNoChanged();
	}
});

/**
* The kind definition for {@link module:moonstone/ChannelInfo~ChannelInfoBadge}
*/
module.exports.ChannelInfoBadge = ChannelInfoBadge;
