require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Dialog~Dialog} kind.
* @module moonstone/Dialog
*/

var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	Control = require('enyo/Control');

var
	Popup = require('../Popup'),
	IconButton = require('../IconButton'),
	BodyText = require('../BodyText'),
	Divider = require('../Divider'),
	MoonHistory = require('../History'),
	HistorySupport = MoonHistory.HistorySupport,
	Marquee = require('../Marquee'),
	MarqueeText = Marquee.Text,
	MarqueeSupport = Marquee.Support;

/**
* {@link module:moonstone/Dialog~Dialog} is a {@link module:moonstone/Popup~Popup} with a title, a subtitle, a
* message, and an area for additional controls.
*
* @class Dialog
* @extends module:moonstone/Popup~Popup
* @mixes module:moonstone/MarqueeSupport~MarqueeSupport
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Dialog~Dialog.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Dialog',

	/**
	* @private
	*/
	kind: Popup,

	/**
	* @private
	*/
	classes: 'moon-dialog',

	/**
	* @private
	* @lends module:moonstone/Dialog~Dialog.prototype
	*/
	published: {

		/**
		* The title for the dialog.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		title: '',

		/**
		* The subtitle for the dialog.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		subTitle: '',

		/**
		* The message for the dialog.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		message: '',

		/**
		* When `true`, the title text will have locale-safe uppercasing applied.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		uppercase: true,

		/**
		* @deprecated Replaced by [uppercase]{@link module:moonstone/Dialog~Dialog#uppercase}.
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
	mixins: [MarqueeSupport, HistorySupport],

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
	*/
	marqueeOnRender: true,

	/**
	* @private
	*/
	marqueeOnRenderDelay: 5000,

	/**
	* @private
	*/
	tools: [
		{name: 'closeButton', kind: IconButton, icon: 'closex', classes: 'moon-popup-close', ontap: 'closePopup', showing: false},
		{kind: Control, classes: 'moon-dialog-client-wrapper', components: [
			{name: 'client', kind: Control, classes: 'moon-dialog-client'},
			{components: [
				{name: 'title', kind: MarqueeText, classes: 'moon-popup-header-text moon-dialog-title'},
				{name: 'subTitle', kind: Control, classes: 'moon-dialog-sub-title'}
			]}
		]},
		{kind: Divider, classes: 'moon-dialog-divider'},
		{name: 'message', kind: BodyText, classes: 'moon-dialog-content'},
		{name: 'spotlightDummy', kind: Control, spotlight: false}
	],

	/**
	* @private
	*/
	create: function () {
		Popup.prototype.create.apply(this, arguments);

		// FIXME: Backwards-compatibility for deprecated property - can be removed when
		// the titleUpperCase property is fully deprecated and removed. The legacy
		// property takes precedence if it exists.
		if (this.titleUpperCase !== null) this.uppercase = this.titleUpperCase;

		this.titleChanged();
		this.subTitleChanged();
		this.messageChanged();
	},

	/**
	* @private
	*/
	titleChanged: function () {
		var title = this.getTitle();
		this.$.title.setContent( this.get('uppercase') ? util.toUpperCase(title) : title );
	},

	/**
	* @private
	*/
	uppercaseChanged: function () {
		// FIXME: Backwards-compatibility for deprecated property - can be removed when
		// titleUpperCase is fully deprecated and removed.
		if (this.titleUpperCase != this.uppercase) this.titleUpperCase = this.uppercase;
		this.titleChanged();
	},

	/**
	* @private
	*/
	titleUpperCaseChanged: function () {
		if (this.uppercase != this.titleUpperCase) this.uppercase = this.titleUpperCase;
		this.uppercaseChanged();
	},

	/**
	* @private
	*/
	subTitleChanged: function () {
		this.$.subTitle.setContent(this.subTitle);
	},

	/**
	* @private
	*/
	messageChanged: function () {
		this.$.message.setContent(this.message);
	}
});
