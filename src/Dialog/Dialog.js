require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Dialog~Dialog} kind.
* @module moonstone/Dialog
*/

var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	ContentAreaSupport = require('enyo/ContentAreaSupport'),
	Control = require('enyo/Control');

var
	$L = require('../i18n'),
	Popup = require('../Popup'),
	IconButton = require('../IconButton'),
	BodyText = require('../BodyText'),
	HistorySupport = require('../HistorySupport'),
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
		* Should the dialog use a divider line to separate the titles from the dialog body?
		*
		* @type {String}
		* @default false
		* @public
		*/
		useDivider: false,

		/**
		* The message for the dialog. May either be a string or component configuration block.
		*
		* @type {String|Object[]}
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
	mixins: [MarqueeSupport, HistorySupport, ContentAreaSupport],

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
	* When {@link module:moonstone/Dialog~Dialog#message} is a string, it will be set as content
	* within a component configured by this member.
	*
	* @type {Object}
	* @protected
	*/
	bodyConfig: {name: 'messageBody', kind: BodyText, classes: 'moon-dialog-content'},

	/**
	* @private
	*/
	tools: [
		{name: 'closeButton', kind: IconButton, icon: 'closex', classes: 'moon-popup-close', ontap: 'closePopup', accessibilityLabel: $L('Close'), backgroundOpacity: 'transparent', showing: false},
		{name: 'titleWrapper', classes: 'moon-dialog-title-wrapper', components: [
			{name: 'title', kind: MarqueeText, classes: 'moon-popup-header-text moon-dialog-title'},
			{name: 'subTitle', kind: Control, classes: 'moon-dialog-sub-title'}
		]},
		{name: 'message'},
		{name: 'client', kind: Control, classes: 'moon-hspacing moon-dialog-client'},
		{name: 'spotlightDummy', kind: Control, spotlight: false}
	],

	/**
	* @private
	*/
	contentAreas: [
		{target: 'message', content: '_messageBody'}
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
		this.useDividerChanged();
		this.messageChanged();
	},

	/**
	* @private
	*/
	titleChanged: function () {
		var title = this.get('title');
		// Logic so we don't show the divider and an empty title
		if (!title) {
			this.$.title.hide();
			this.$.titleWrapper.removeClass('use-divider');
		} else {
			this.$.title.show();
			this.useDividerChanged();
			this.$.title.set('content', this.get('uppercase') ? util.toUpperCase(title) : title );
		}
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
		// Technically we shouldn't show the subtitle if there's no title, but this is an edge case for the app developer
		this.$.subTitle.set('showing', !!this.subTitle);
		if (!this.subTitle) return;
		this.$.subTitle.set('content', this.subTitle);
	},

	/**
	* @private
	*/
	useDividerChanged: function () {
		this.$.titleWrapper.addRemoveClass('use-divider', this.get('useDivider'));
	},

	/**
	* If `message` is a string, we want it to be BodyText. Otherwise, it can pass through with the
	* user-defined kinds.
	*
	* @private
	*/
	messageChanged: function () {
		var body = this.message;
		if (this.message && util.isString(this.message)) {
			// optimization - it's a string and the previous value was a string too. no need to
			// rerender, just update the content and return.
			if (this.$.messageBody) {
				this.$.messageBody.set('content', this.message);
				return;
			}
			// it's a string and wasn't before or we haven't set it up yet, set up the BodyText
			else {
				body = util.clone(this.bodyConfig);
				body.content = this.message;
				body.owner = this;
			}
		}
		this.set('_messageBody', body);
	},

	ariaObservers: [
		{from: 'generated', method: function () {
			if (!this.generated) return;

			this.setAriaAttribute('aria-labelledBy',
				this.$.title.id + ' ' +
				this.$.subTitle.id + ' ' +
				this.$.message.id + ' ' +
				this.$.client.id
			);
		}}
	]
});
