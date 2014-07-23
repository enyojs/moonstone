(function (enyo, scope) {
	/**
	* _moon.Dialog_ is a {@link moon.Popup} with a title, a subtitle, a
	* message, and an area for additional controls.
	*
	* @ui
	* @class moon.Dialog
	* @extends moon.Popup
	* @mixes moon.MarqueeSupport
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
		kind: moon.Popup,

		/**
		* @private
		*/
		classes: 'moon-dialog',

		/**
		* @private
		*/
		published: /** @lends moon.Dialog.prototype */ {

			/**
			* The title string for the dialog
			*
			* @type {String}
			* @default ''
			* @public
			*/
			title: '',

			/**
			* The subtitle string for the dialog
			*
			* @type {String}
			* @default ''
			* @public
			*/
			subTitle: '',

			/**
			* The message for the dialog
			*
			* @type {String}
			* @default ''
			* @public
			*/
			message: '',

			/**
			* When true, the title text will be converted to locale-safe uppercasing
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
			{
				layoutKind: 'FittableColumnsLayout',
				components: [
					{fit: true, components: [
						{name: 'title', kind: 'moon.MarqueeText', classes: 'moon-header-font moon-popup-header-text moon-dialog-title'},
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
			this.titleChanged();
			this.subTitleChanged();
			this.messageChanged();
		},

		/**
		* @private
		*/
		titleChanged: function () {
			var title = this.getTitle();
			this.$.title.setContent( this.getTitleUpperCase() ? enyo.toUpperCase(title) : title );
		},

		/**
		* @private
		*/
		titleUpperCaseChanged: function () {
			this.titleChanged();
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
