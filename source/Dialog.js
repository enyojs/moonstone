(function (enyo, scope) {
	/**
	* {@link moon.Dialog} is a {@link moon.Popup} with a title, a subtitle, a
	* message, and an area for additional controls.
	*
	* @class moon.Dialog
	* @extends moon.Popup
	* @mixes moon.MarqueeSupport
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.Dialog.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Dialog',

		/**
		* @private
		*/
		kind: 'moon.Popup',

		/**
		* @private
		*/
		classes: 'moon-dialog',

		/**
		* @private
		* @lends moon.Dialog.prototype
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
			* @deprecated Replaced by [uppercase]{@link moon.Dialog#uppercase}.
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
			{name: 'closeButton', kind: 'moon.IconButton', icon: 'closex', classes: 'moon-popup-close', ontap: 'closePopup', showing:false},

			{
				layoutKind: 'FittableColumnsLayout',
				components: [
					{fit: true, components: [
						{name: 'title', kind: 'moon.MarqueeText', classes: 'moon-popup-header-text moon-dialog-title'},
						{name: 'subTitle', classes: 'moon-dialog-sub-title'}
					]},
					{name: 'client', classes: 'moon-dialog-client'}
				]
			},
			{kind: 'moon.Divider', classes: 'moon-dialog-divider'},
			{name: 'message', kind:'moon.BodyText', classes: 'moon-dialog-content'},
			{name: 'spotlightDummy', spotlight:false}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);

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
			this.$.title.setContent( this.get('uppercase') ? enyo.toUpperCase(title) : title );
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

})(enyo, this);
